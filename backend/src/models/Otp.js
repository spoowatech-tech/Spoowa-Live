import { getPool } from '../config/db.js';

export async function storeOtpCode(identifier, code, expiresAt) {
  const pool = getPool();
  
  // Clean up any old OTPs for this identifier first
  await pool.execute('DELETE FROM otp_codes WHERE identifier = ?', [identifier]);
  
  await pool.execute(
    'INSERT INTO otp_codes (identifier, code, expires_at) VALUES (?, ?, ?)',
    [identifier, code, expiresAt]
  );
}

export async function findOtpCode(identifier) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, identifier, code, expires_at FROM otp_codes WHERE identifier = ? ORDER BY created_at DESC LIMIT 1',
    [identifier]
  );
  return rows[0] || null;
}

export async function deleteOtpCode(identifier) {
  const pool = getPool();
  await pool.execute(
    'DELETE FROM otp_codes WHERE identifier = ?',
    [identifier]
  );
}
