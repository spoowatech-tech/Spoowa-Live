import { getCartByUserId, addCartItem, updateCartItemQuantity, removeCartItem, clearCart as clearCartModel } from '../models/Cart.js';

/**
 * GET /api/cart
 */
export async function getCart(req, res) {
  const items = await getCartByUserId(req.user.id);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalMrp = items.reduce((sum, item) => sum + (item.original_price * item.quantity), 0);
  const discount = totalMrp - subtotal;
  const shipping = subtotal >= 499 ? 0 : 49;

  res.json({
    items,
    summary: {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalMrp: Math.round(totalMrp * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      shipping,
      total: Math.round((subtotal + shipping) * 100) / 100,
    },
  });
}

/**
 * POST /api/cart
 * Body: { productId, quantity }
 */
export async function addToCart(req, res) {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required.' });
  }

  const items = await addCartItem(req.user.id, productId, quantity || 1);
  res.status(201).json({ message: 'Item added to cart.', items });
}

/**
 * PUT /api/cart/:productId
 * Body: { quantity }
 */
export async function updateCartItem(req, res) {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || quantity === null) {
    return res.status(400).json({ error: 'quantity is required.' });
  }

  const items = await updateCartItemQuantity(req.user.id, Number(productId), Number(quantity));
  res.json({ message: 'Cart updated.', items });
}

/**
 * DELETE /api/cart/:productId
 */
export async function removeFromCart(req, res) {
  const items = await removeCartItem(req.user.id, Number(req.params.productId));
  res.json({ message: 'Item removed from cart.', items });
}

/**
 * DELETE /api/cart
 */
export async function clearCart(req, res) {
  await clearCartModel(req.user.id);
  res.json({ message: 'Cart cleared.', items: [] });
}
