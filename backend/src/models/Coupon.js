import { getPool } from '../config/db.js';

/**
 * Find a coupon by code.
 */
export async function findCouponByCode(code) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE',
    [code.toUpperCase()]
  );
  return rows[0] || null;
}

/**
 * Validate and calculate coupon discount.
 */
export async function validateCoupon(code, orderTotal) {
  const coupon = await findCouponByCode(code);

  if (!coupon) {
    return { valid: false, error: 'Invalid or expired coupon code.' };
  }

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, error: 'This coupon has expired.' };
  }

  // Check minimum order
  if (orderTotal < coupon.min_order) {
    return { valid: false, error: `Minimum order of ₹${coupon.min_order} required for this coupon.` };
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discount_type === 'percentage') {
    discountAmount = (orderTotal * coupon.discount_value) / 100;
    if (coupon.max_discount && discountAmount > coupon.max_discount) {
      discountAmount = coupon.max_discount;
    }
  } else {
    discountAmount = coupon.discount_value;
  }

  // Ensure discount doesn't exceed order total
  discountAmount = Math.min(discountAmount, orderTotal);

  return {
    valid: true,
    coupon: {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
    },
    discountAmount: Math.round(discountAmount * 100) / 100,
  };
}
