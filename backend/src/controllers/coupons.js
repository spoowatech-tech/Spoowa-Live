import { validateCoupon } from '../models/Coupon.js';

/**
 * POST /api/coupons/apply
 * Body: { code, orderTotal }
 */
export async function applyCoupon(req, res) {
  const { code, orderTotal } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required.' });
  }

  if (!orderTotal || orderTotal <= 0) {
    return res.status(400).json({ error: 'A valid order total is required.' });
  }

  const result = await validateCoupon(code, Number(orderTotal));

  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  res.json({
    message: `Coupon ${code.toUpperCase()} applied!`,
    coupon: result.coupon,
    discountAmount: result.discountAmount,
  });
}
