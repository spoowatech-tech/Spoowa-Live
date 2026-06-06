/**
 * Pricing utilities for product cards.
 * Normalises snake_case (from DB) and camelCase (from older code) field names.
 */

/**
 * Format a number as INR — drops trailing ".00" for whole numbers.
 * e.g. 199.5 → "199.50",  500 → "500"
 */
export function formatPriceINR(value) {
  const num = Number(value) || 0;
  // If it's a whole number, show without decimals
  if (num === Math.floor(num)) return num.toLocaleString('en-IN');
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Derives normalised pricing fields from a product object.
 * Returns:
 *   finalPrice   – the selling/current price
 *   mrp          – original / maximum retail price
 *   hasDiscount  – true when mrp > finalPrice
 *   discountLabel– integer discount percentage string (e.g. "25")
 *   savings      – absolute savings amount
 */
export function getProductPricing(product) {
  const finalPrice = Number(product.price) || 0;
  // Support both camelCase and snake_case field names
  const mrp = Number(product.originalPrice ?? product.original_price ?? product.mrp ?? finalPrice);

  const hasDiscount = mrp > finalPrice && finalPrice > 0;
  const savings = hasDiscount ? parseFloat((mrp - finalPrice).toFixed(2)) : 0;
  const discountLabel = hasDiscount ? String(Math.round((savings / mrp) * 100)) : '0';

  return { finalPrice, mrp, hasDiscount, savings, discountLabel };
}
