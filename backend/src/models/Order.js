import { getPool } from '../config/db.js';

/**
 * Create an order from the user's cart.
 * Uses a transaction to ensure atomicity.
 */
export async function createOrder(userId, addressId, couponCode, discountAmount) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Get cart items
    const [cartItems] = await connection.execute(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      throw Object.assign(new Error('Cart is empty'), { status: 400 });
    }

    // 2. Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = discountAmount || 0;
    const shipping = subtotal >= 499 ? 0 : 49;
    const total = subtotal - discount + shipping;

    // 3. Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, address_id, coupon_code, subtotal, discount_amount, shipping, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, addressId || null, couponCode || null, subtotal, discount, shipping, total]
    );
    const orderId = orderResult.insertId;

    // 4. Create order items
    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // 5. Clear cart
    await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await connection.commit();

    return { orderId, subtotal, discount, shipping, total, itemCount: cartItems.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Get all orders for a user.
 */
export async function findOrdersByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT id, coupon_code, subtotal, discount_amount, shipping, total, status, created_at
     FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * Get a single order by ID with its items.
 */
export async function findOrderById(orderId, userId) {
  const pool = getPool();

  const [orders] = await pool.execute(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [orderId, userId]
  );
  if (orders.length === 0) return null;

  const order = orders[0];

  const [items] = await pool.execute(
    `SELECT oi.*, p.name, p.image, p.gradient
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId]
  );
  order.items = items;

  return order;
}
