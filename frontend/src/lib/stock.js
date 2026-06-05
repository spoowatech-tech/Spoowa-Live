/**
 * Stock utilities for product cards.
 */

/**
 * Returns the numeric stock quantity for a product.
 * Falls back to `fallback` (default 999) when stock info is not present.
 */
export function getEntityStock(product, fallback = 999) {
  const raw = product?.stock ?? product?.stock_quantity ?? product?.inventory;
  // If no stock field exists on the product, use the fallback as-is (don't Number(null) it)
  if (raw === undefined || raw === null) return fallback;
  return Number(raw);
}

/**
 * Returns true when a product is definitively out of stock.
 * Only marks OOS when the field is explicitly 0 or less —
 * missing stock info is treated as "in stock" to avoid false negatives.
 */
export function isOutOfStock(product) {
  const raw = product?.stock ?? product?.stock_quantity ?? product?.inventory;
  // No stock field at all → assume in stock
  if (raw === undefined || raw === null) return false;
  return Number(raw) <= 0;
}
