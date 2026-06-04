import { createOrder, findOrdersByUserId, findOrderById } from '../models/Order.js';

/**
 * POST /api/orders
 * Body: { addressId, couponCode, discountAmount }
 */
export async function placeOrder(req, res) {
  const { addressId, couponCode, discountAmount } = req.body;

  const order = await createOrder(req.user.id, addressId, couponCode, discountAmount);

  res.status(201).json({
    message: 'Order placed successfully!',
    order,
  });
}

/**
 * GET /api/orders
 */
export async function getOrders(req, res) {
  const orders = await findOrdersByUserId(req.user.id);
  res.json({ orders });
}

/**
 * GET /api/orders/:id
 */
export async function getOrderById(req, res) {
  const order = await findOrderById(req.params.id, req.user.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json({ order });
}
