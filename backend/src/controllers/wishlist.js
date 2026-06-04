import { getWishlistByUserId, toggleWishlistItem } from '../models/Wishlist.js';

/**
 * GET /api/wishlist
 */
export async function getWishlist(req, res) {
  const items = await getWishlistByUserId(req.user.id);
  res.json({ items });
}

/**
 * POST /api/wishlist/toggle
 * Body: { productId }
 */
export async function toggleWishlist(req, res) {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'productId is required.' });
  }

  const result = await toggleWishlistItem(req.user.id, Number(productId));
  res.json({ message: result.added ? 'Added to wishlist' : 'Removed from wishlist', ...result });
}
