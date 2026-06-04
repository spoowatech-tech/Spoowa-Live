import { getPool } from '../config/db.js';

/**
 * Create a new user.
 */
export async function createUser(name, email, hashedPassword, phone) {
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, phone, provider, phone_verified) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, hashedPassword, phone || null, 'local', !!phone]
  );
  return { id: result.insertId, name, email, phone };
}

/**
 * Create a new user from Google OAuth.
 */
export async function createOAuthUser(name, email, googleId) {
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, provider, google_id) VALUES (?, ?, ?, ?)',
    [name, email, 'google', googleId]
  );
  return { id: result.insertId, name, email, provider: 'google' };
}

/**
 * Find a user by email.
 */
export async function findUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, password, phone, provider, google_id, created_at FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

/**
 * Find a user by ID (excludes password).
 */
export async function findUserById(id) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, provider, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * Find a user by email or phone.
 */
export async function findUserByEmailOrPhone(identifier) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, password, phone, provider, google_id, created_at FROM users WHERE email = ? OR phone = ?',
    [identifier, identifier]
  );
  return rows[0] || null;
}

/**
 * Update a user's password.
 */
export async function updatePassword(id, hashedPassword) {
  const pool = getPool();
  await pool.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, id]
  );
}
