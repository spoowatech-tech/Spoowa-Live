import { getPool } from '../config/db.js';

export async function getWishlistByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT 
      wi.id, wi.product_id, wi.created_at,
      p.name, p.price, p.original_price, p.badge, p.discount, p.image, p.gradient, p.rating, p.reviews
    FROM wishlist_items wi
    JOIN products p ON wi.product_id = p.id
    WHERE wi.user_id = ?
    ORDER BY wi.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function toggleWishlistItem(userId, productId) {
  const pool = getPool();
  // Check if exists
  const [existing] = await pool.execute(
    'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  if (existing.length > 0) {
    // Remove
    await pool.execute('DELETE FROM wishlist_items WHERE id = ?', [existing[0].id]);
    return { added: false, productId };
  } else {
    // Add
    await pool.execute('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)', [userId, productId]);
    return { added: true, productId };
  }
}
