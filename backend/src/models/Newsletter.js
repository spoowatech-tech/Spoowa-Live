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
