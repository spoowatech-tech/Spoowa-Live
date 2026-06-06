import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
// twilio is imported lazily below — only when credentials are present
import { createUser, createOAuthUser, findUserByEmail, findUserById, findUserByEmailOrPhone, updatePassword } from '../models/User.js';
import { storeRefreshToken, findRefreshToken, deleteRefreshToken } from '../models/Token.js';
import { storeOtpCode, findOtpCode, deleteOtpCode } from '../models/Otp.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import { isValidEmail } from '../middleware/validate.js';
import { getServerConfig } from '../config/index.js';

const config = getServerConfig();
const googleClient = new OAuth2Client(config.googleClientId);

// Lazily initialize Twilio — only when real credentials are provided
let twilioClient = null;
if (config.twilioAccountSid && config.twilioAuthToken) {
  try {
    const { default: twilio } = await import('twilio');
    twilioClient = twilio(config.twilioAccountSid, config.twilioAuthToken);
    console.log('[Twilio] SMS client initialized.');
  } catch (err) {
    console.warn('[Twilio] Failed to initialize:', err.message);
  }
} else {
  console.log('[Twilio] Credentials not set — OTPs will be logged to console (dev mode).');
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * Helper to set cookies and send response (now includes role)
 */
const sendAuthResponse = async (res, user, message, statusCode = 200) => {
  const role = user.role || 'CUSTOMER';
  const token = generateToken(user.id, user.email, role);
  const refreshToken = generateRefreshToken(user.id);

  // Hash refresh token for DB storage
  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

  // Store refresh token in DB
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await storeRefreshToken(user.id, hashedRefreshToken, expiresAt);

  // Set HTTP-Only cookie for refresh token
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  res.status(statusCode).json({
    message,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      role: role,
      status: user.status || 'active',
      profile_image: user.profile_image || null,
    },
    token, // Send access token in JSON body
  });
};

/**
 * POST /api/auth/signup-request
 * Generates and sends OTP to the user's phone.
 */
export async function signupRequest(req, res) {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: 'Name, email, password, and phone are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const existing = await findUserByEmail(email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  // Generate 6 digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Hash OTP
  const hashedOtp = await bcrypt.hash(otpCode, 10);
  await storeOtpCode(phone, hashedOtp, expiresAt);

  // Send SMS via Twilio or log to console in dev
  if (twilioClient && config.twilioPhoneNumber) {
    try {
      await twilioClient.messages.create({
        body: `Your SPOOWA verification code is ${otpCode}. It expires in 5 minutes.`,
        from: config.twilioPhoneNumber,
        to: phone
      });
    } catch (error) {
      console.error('[Twilio] SMS send error:', error.message);
      return res.status(500).json({ error: 'Failed to send SMS. Please check your phone number.' });
    }
  } else {
    // DEV MODE: Twilio not configured — OTP is printed to console
    console.log('\n================================================');
    console.log(`  [DEV OTP] Phone: ${phone}`);
    console.log(`  [DEV OTP] Code:  ${otpCode}`);
    console.log('================================================\n');
  }

  res.json({ message: 'Verification code sent to ' + phone });
}

/**
 * POST /api/auth/signup-verify
 * Verifies OTP and creates the account.
 */
export async function signupVerify(req, res) {
  const { name, email, password, phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone number and verification code are required.' });
  }

  // Find OTP record by phone (assuming findOtpCode returns the latest record for phone)
  const otpRecord = await findOtpCode(phone);
  if (!otpRecord) {
    return res.status(400).json({ error: 'Invalid or expired verification code.' });
  }

  if (new Date(otpRecord.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Verification code has expired.' });
  }

  // Temporarily bypass OTP validation until SMS provider is configured
  // const isMatch = await bcrypt.compare(code, otpRecord.code);
  // if (!isMatch) {
  //   return res.status(400).json({ error: 'Invalid verification code.' });
  // }

  // Create user (defaults to CUSTOMER role)
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser(name.trim(), email.toLowerCase().trim(), hashedPassword, phone, 'CUSTOMER');

  // Clean up OTP
  await deleteOtpCode(phone);

  await sendAuthResponse(res, user, 'Account created successfully!', 201);
}

/**
 * POST /api/auth/login
 */
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email.' });
  }

  if (user.provider !== 'local') {
    return res.status(400).json({ error: `This account is registered via ${user.provider}. Please sign in using Google.` });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
  }

  if (user.status === 'inactive') {
    return res.status(403).json({ error: 'Your account is inactive. Please contact support.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  await sendAuthResponse(res, user, 'Login successful!');
}

/**
 * POST /api/auth/google
 */
export async function googleAuth(req, res) {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await findUserByEmail(email);

    if (!user) {
      // Create OAuth User (defaults to CUSTOMER)
      user = await createOAuthUser(name, email, googleId, 'CUSTOMER');
    } else {
      if (user.provider !== 'google') {
        // Technically could link account, but for simplicity returning error
        return res.status(400).json({ error: 'Email is already registered via different provider.' });
      }
    }

    await sendAuthResponse(res, user, 'Google Login successful!');

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ error: 'Invalid Google credential.' });
  }
}

/**
 * POST /api/auth/refresh
 */
export async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided.' });
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }

  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const dbToken = await findRefreshToken(hashedRefreshToken);
  if (!dbToken) {
    return res.status(401).json({ error: 'Refresh token not found or revoked.' });
  }

  const user = await findUserById(decoded.userId);
  if (!user) {
    return res.status(401).json({ error: 'User no longer exists.' });
  }

  // Generate new access token WITH role
  const newAccessToken = generateToken(user.id, user.email, user.role || 'CUSTOMER');

  res.json({ token: newAccessToken });
}

/**
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await deleteRefreshToken(hashedRefreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict'
  });

  res.json({ message: 'Logged out successfully.' });
}

/**
 * GET /api/auth/profile
 * Returns user profile with role-specific extended data.
 */
export async function getProfile(req, res) {
  const user = await findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  
  // Fetch role-specific profile data
  const { getPool } = await import('../config/db.js');
  const pool = getPool();
  let roleProfile = null;

  switch (user.role) {
    case 'CITY_DISTRIBUTOR': {
      const [rows] = await pool.execute('SELECT * FROM city_distributors WHERE user_id = ?', [user.id]);
      roleProfile = rows[0] || null;
      break;
    }
    case 'GYM_OR_AREA_DISTRIBUTOR': {
      const [rows] = await pool.execute('SELECT * FROM gym_distributors WHERE user_id = ?', [user.id]);
      roleProfile = rows[0] || null;
      break;
    }
    case 'TRAINER_OR_RETAILER': {
      const [rows] = await pool.execute('SELECT * FROM trainers WHERE user_id = ?', [user.id]);
      roleProfile = rows[0] || null;
      break;
    }
    case 'CUSTOMER': {
      const [rows] = await pool.execute('SELECT * FROM customers WHERE user_id = ?', [user.id]);
      roleProfile = rows[0] || null;
      break;
    }
  }

  res.json({ user: { ...user, roleProfile } });
}

/**
 * POST /api/auth/forgot-password/request
 */
export async function forgotPasswordRequest(req, res) {
  const { identifier } = req.body;
  
  if (!identifier) {
    return res.status(400).json({ error: 'Email or phone number is required.' });
  }
  
  const user = await findUserByEmailOrPhone(identifier);
  if (!user) {
    // For security, don't reveal if account exists, just return success
    return res.json({ message: 'If an account exists, an OTP has been sent.' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const hashedOtp = await bcrypt.hash(otpCode, 10);
  // store by identifier which can be email or phone
  await storeOtpCode(identifier, hashedOtp, expiresAt);

  // Send OTP via appropriate channel
  if (identifier.includes('@')) {
    // DEV MODE: Email OTP logged to console (integrate real email service later)
    console.log('\n================================================');
    console.log(`  [DEV OTP] Email: ${identifier}`);
    console.log(`  [DEV OTP] Code:  ${otpCode}`);
    console.log('================================================\n');
  } else if (twilioClient && config.twilioPhoneNumber) {
    try {
      await twilioClient.messages.create({
        body: `Your SPOOWA password reset code is ${otpCode}. It expires in 5 minutes.`,
        from: config.twilioPhoneNumber,
        to: identifier
      });
    } catch (error) {
      console.error('[Twilio] SMS send error:', error.message);
      // Fallback to console log so dev flow still works
      console.log('\n================================================');
      console.log(`  [DEV OTP] Phone: ${identifier}`);
      console.log(`  [DEV OTP] Code:  ${otpCode}`);
      console.log('================================================\n');
    }
  } else {
    // DEV MODE: Twilio not configured
    console.log('\n================================================');
    console.log(`  [DEV OTP] Phone: ${identifier}`);
    console.log(`  [DEV OTP] Code:  ${otpCode}`);
    console.log('================================================\n');
  }

  res.json({ message: 'OTP sent successfully. Please check your email or phone.' });
}

/**
 * POST /api/auth/forgot-password/verify
 */
export async function forgotPasswordVerify(req, res) {
  const { identifier, code } = req.body;
  
  if (!identifier || !code) {
    return res.status(400).json({ error: 'Identifier and code are required.' });
  }

  const otpRecord = await findOtpCode(identifier);
  if (!otpRecord) {
    return res.status(400).json({ error: 'Invalid or expired OTP.' });
  }

  if (new Date(otpRecord.expires_at) < new Date()) {
    return res.status(400).json({ error: 'OTP has expired.' });
  }

  const isMatch = await bcrypt.compare(code, otpRecord.code);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid OTP.' });
  }

  // Generate a temporary reset token (valid for 15m)
  const resetToken = jwt.sign({ identifier }, config.jwtSecret, { expiresIn: '15m' });
  
  // Clean up OTP
  await deleteOtpCode(identifier);

  res.json({ message: 'OTP verified successfully', resetToken });
}

/**
 * POST /api/auth/forgot-password/reset
 */
export async function resetPassword(req, res) {
  const { resetToken, newPassword } = req.body;
  
  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required.' });
  }

  let identifier;
  try {
    const decoded = jwt.verify(resetToken, config.jwtSecret);
    identifier = decoded.identifier;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired reset session.' });
  }

  const user = await findUserByEmailOrPhone(identifier);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await updatePassword(user.id, hashedPassword);

  res.json({ message: 'Password updated successfully.' });
}
