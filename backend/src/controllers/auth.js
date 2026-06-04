import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail, findUserById } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { isValidEmail } from '../middleware/validate.js';

/**
 * POST /api/auth/register
 */
export async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  // Validate
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  // Check if user exists
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser(name.trim(), email.toLowerCase().trim(), hashedPassword);

  // Generate token
  const token = generateToken(user.id, user.email);

  res.status(201).json({
    message: 'Account created successfully!',
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
}

/**
 * POST /api/auth/login
 */
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Find user
  const user = await findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Generate token
  const token = generateToken(user.id, user.email);

  res.json({
    message: 'Login successful!',
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
}

/**
 * GET /api/auth/profile
 */
export async function getProfile(req, res) {
  const user = await findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user });
}
