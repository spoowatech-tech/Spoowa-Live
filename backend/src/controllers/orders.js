import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createOrder, findOrdersByUserId, findOrderById } from '../models/Order.js';
import { resolveOrderHierarchy } from '../models/Referral.js';
import { createCommissionsForOrder } from '../models/Commission.js';
import { incrementCustomerOrderStats } from '../models/Customer.js';
import { getPool } from '../config/db.js';

let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/**
 * POST /api/orders
 * Body: { addressId, couponCode, discountAmount, paymentMethodOverride, paymentStatus, paymentId, razorpayOrderId, donation, gifting }
 */
export async function placeOrder(req, res) {
  const { 
    addressId, couponCode, discountAmount, 
    paymentMethodOverride, paymentStatus, paymentId, razorpayOrderId,
    donation, gifting
  } = req.body;

  const donationAmount = donation?.enabled ? donation.amount : 0;
  const giftingAmount = gifting?.enabled ? gifting.amount : 0;
  const giftingMessage = gifting?.enabled ? gifting.message : null;

  const order = await createOrder(
    req.user.id, 
    addressId, 
    couponCode, 
    discountAmount,
    paymentMethodOverride || 'cod',
    (paymentStatus || 'pending').toLowerCase(),
    paymentId,
    razorpayOrderId,
    donationAmount,
    giftingAmount,
    giftingMessage
  );

  // --- RBAC: Resolve referral hierarchy and create commissions ---
  try {
    const hierarchy = await resolveOrderHierarchy(req.user.id);
    const pool = getPool();

    // Update order with hierarchy IDs
    if (hierarchy.trainer_id || hierarchy.gym_distributor_id || hierarchy.city_distributor_id) {
      await pool.execute(
        `UPDATE orders SET trainer_id = ?, gym_distributor_id = ?, city_distributor_id = ? WHERE id = ?`,
        [hierarchy.trainer_id, hierarchy.gym_distributor_id, hierarchy.city_distributor_id, order.orderId]
      );

      // Create commission entries
      await createCommissionsForOrder(order.orderId, order.total, hierarchy);
    }

    // Update customer order stats
    await incrementCustomerOrderStats(req.user.id, order.total).catch(() => {});
  } catch (err) {
    console.error('[RBAC] Error resolving order hierarchy:', err.message);
    // Non-blocking — order is already placed
  }

  res.status(201).json({
    message: 'Order placed successfully!',
    order,
  });
}

/**
 * POST /api/orders/razorpay/create
 */
export async function createRazorpayOrder(req, res) {
  if (!razorpayInstance) {
    return res.status(500).json({ error: 'Razorpay is not configured on the server.' });
  }

  const { amount } = req.body;
  
  try {
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };
    
    const order = await razorpayInstance.orders.create(options);
    res.json({ order });
  } catch (err) {
    console.error('Razorpay Error:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order.' });
  }
}

/**
 * POST /api/orders/razorpay/verify
 */
export async function verifyRazorpayPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
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
