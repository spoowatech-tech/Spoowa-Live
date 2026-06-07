import { getPool } from '../config/db.js';

/**
 * Create a new contact message.
 */
export async function createContactMessage({ name, email, subject, message }) {
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject || null, message]
  );
  return { id: result.insertId, name, email, subject, message };
}

/**
 * Get all contact messages (for Super Admin).
 */
export async function findAllContactMessages(limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
  );
  const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM contact_messages');
  return { messages: rows, total: countResult[0].total };
}

/**
 * Get unread message count.
 */
export async function countUnreadMessages() {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = FALSE');
  return rows[0].count;
}

/**
 * Mark a message as read.
 */
export async function markMessageAsRead(id) {
  const pool = getPool();
  await pool.execute('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [id]);
}
