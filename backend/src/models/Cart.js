import { getPool } from '../config/db.js';

/**
 * Get all cart items for a user with product details.
 */
export async function getCartByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT 
      ci.id, ci.product_id, ci.quantity, ci.created_at,
      p.name, p.description, p.price, p.original_price, p.badge, p.discount,
      p.image, p.gradient, p.type
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
    ORDER BY ci.created_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * Add an item to cart or update quantity if already exists.
 */
export async function addCartItem(userId, productId, quantity = 1) {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [userId, productId, quantity]
  );
  return getCartByUserId(userId);
}

/**
 * Update cart item quantity.
 */
export async function updateCartItemQuantity(userId, productId, quantity) {
  const pool = getPool();
  if (quantity <= 0) {
    return removeCartItem(userId, productId);
  }
  await pool.execute(
    'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
    [quantity, userId, productId]
  );
  return getCartByUserId(userId);
}

/**
 * Remove an item from cart.
 */
export async function removeCartItem(userId, productId) {
  const pool = getPool();
  await pool.execute(
    'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return getCartByUserId(userId);
}

/**
 * Clear all items in a user's cart.
 */
export async function clearCart(userId) {
  const pool = getPool();
  await pool.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  return [];
}
