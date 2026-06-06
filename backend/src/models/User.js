import { getPool } from '../config/db.js';

/**
 * Create a new user.
 */
export async function createUser(name, email, hashedPassword, phone, role = 'CUSTOMER') {
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, phone, provider, phone_verified, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, hashedPassword, phone || null, 'local', !!phone, role]
  );
  return { id: result.insertId, name, email, phone, role };
}

/**
 * Create a new user from Google OAuth.
 */
export async function createOAuthUser(name, email, googleId, role = 'CUSTOMER') {
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, provider, google_id, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, 'google', googleId, role]
  );
  return { id: result.insertId, name, email, provider: 'google', role };
}

/**
 * Find a user by email.
 */
export async function findUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, password, phone, mobile, provider, google_id, role, status, profile_image, created_at FROM users WHERE email = ?',
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
    'SELECT id, name, email, phone, mobile, provider, role, status, profile_image, created_at FROM users WHERE id = ?',
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
    'SELECT id, name, email, password, phone, mobile, provider, google_id, role, status, created_at FROM users WHERE email = ? OR phone = ?',
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

/**
 * Update a user's role.
 */
export async function updateUserRole(id, role) {
  const pool = getPool();
  await pool.execute(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id]
  );
}

/**
 * Update a user's status.
 */
export async function updateUserStatus(id, status) {
  const pool = getPool();
  await pool.execute(
    'UPDATE users SET status = ? WHERE id = ?',
    [status, id]
  );
}

/**
 * Update a user's profile.
 */
export async function updateUserProfile(id, updates) {
  const pool = getPool();
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(updates)) {
    if (['name', 'mobile', 'profile_image'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (fields.length === 0) return;
  values.push(id);
  await pool.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

/**
 * Find users by role.
 */
export async function findUsersByRole(role, limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, name, email, phone, mobile, role, status, profile_image, created_at 
     FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    [role]
  );
  return rows;
}

/**
 * Count users by role.
 */
export async function countUsersByRole(role) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM users WHERE role = ?',
    [role]
  );
  return rows[0].count;
}

/**
 * Find all users with pagination.
 */
export async function findAllUsers(limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, name, email, phone, mobile, role, status, profile_image, created_at 
     FROM users ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
  );
  return rows;
}

/**
 * Count all users.
 */
export async function countAllUsers() {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
  return rows[0].count;
}
