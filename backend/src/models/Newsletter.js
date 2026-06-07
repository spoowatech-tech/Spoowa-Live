import { getPool } from '../config/db.js';

/**
 * Subscribe an email to the newsletter.
 * Uses INSERT IGNORE to silently skip duplicates.
 */
export async function subscribe(email) {
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)',
    [email.toLowerCase().trim()]
  );
  return { subscribed: result.affectedRows > 0, email: email.toLowerCase().trim() };
}

/**
 * Get all newsletter subscribers (for Super Admin).
 */
export async function findAllSubscribers(limit = 100, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
  );
  const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM newsletter_subscribers');
  return { subscribers: rows, total: countResult[0].total };
}
