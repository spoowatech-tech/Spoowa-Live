import { getPool } from '../config/db.js';

/**
 * Create a new address.
 */
export async function createAddress(userId, { label, fullName, phone, addressLine, city, state, pinCode, isDefault }) {
  const pool = getPool();

  // If setting as default, unset other defaults
  if (isDefault) {
    await pool.execute('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
  }

  const [result] = await pool.execute(
    `INSERT INTO addresses (user_id, label, full_name, phone, address_line, city, state, pin_code, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, label || 'Home', fullName, phone || null, addressLine, city, state, pinCode, isDefault || false]
  );

  return { id: result.insertId, label, fullName, phone, addressLine, city, state, pinCode, isDefault };
}

/**
 * Get all addresses for a user.
 */
export async function findAddressesByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
    [userId]
  );
  return rows;
}

/**
 * Delete an address (only if owned by user).
 */
export async function deleteAddress(addressId, userId) {
  const pool = getPool();
  const [result] = await pool.execute(
    'DELETE FROM addresses WHERE id = ? AND user_id = ?',
    [addressId, userId]
  );
  return result.affectedRows > 0;
}
