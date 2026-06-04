import { getPool } from '../config/db.js';

/**
 * Create a new user.
 */
export async function createUser(name, email, hashedPassword) {
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return { id: result.insertId, name, email };
}

/**
 * Find a user by email.
 */
export async function findUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, password, created_at FROM users WHERE email = ?',
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
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}
