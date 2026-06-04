import jwt from 'jsonwebtoken';
import { getServerConfig } from '../config/index.js';

/**
 * JWT authentication middleware.
 * Extracts and verifies the token from the Authorization header.
 * Attaches the decoded user info to req.user.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const config = getServerConfig();
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please refresh token.' });
    }
    return res.status(401).json({ error: 'Invalid token. Please log in again.' });
  }
}

/**
 * Generate an Access JWT token for a user.
 */
export function generateToken(userId, email) {
  const config = getServerConfig();
  return jwt.sign(
    { userId, email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

/**
 * Generate a Refresh JWT token for a user.
 */
export function generateRefreshToken(userId) {
  const config = getServerConfig();
  return jwt.sign(
    { userId },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn }
  );
}

/**
 * Verify a Refresh token.
 */
export function verifyRefreshToken(token) {
  const config = getServerConfig();
  try {
    return jwt.verify(token, config.jwtRefreshSecret);
  } catch (error) {
    return null;
  }
}
