import { getPool } from '../config/db.js';

export async function storeRefreshToken(userId, token, expiresAt) {
  const pool = getPool();
  await pool.execute(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );
}

export async function findRefreshToken(token) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, user_id, token, expires_at FROM refresh_tokens WHERE token = ?',
    [token]
  );
  return rows[0] || null;
}

export async function deleteRefreshToken(token) {
  const pool = getPool();
  await pool.execute(
    'DELETE FROM refresh_tokens WHERE token = ?',
    [token]
  );
}

export async function deleteAllUserRefreshTokens(userId) {
  const pool = getPool();
  await pool.execute(
    'DELETE FROM refresh_tokens WHERE user_id = ?',
    [userId]
  );
}
