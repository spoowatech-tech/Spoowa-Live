import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';

// Controllers
import { signupRequest, signupVerify, login, googleAuth, refresh, logout, getProfile, forgotPasswordRequest, forgotPasswordVerify, resetPassword } from '../controllers/auth.js';
import { getProducts, getProductById, getBestsellers } from '../controllers/products.js';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.js';
import { applyCoupon } from '../controllers/coupons.js';
import { placeOrder, getOrders, getOrderById } from '../controllers/orders.js';
import { getAddresses, addAddress, deleteAddress } from '../controllers/addresses.js';
import { subscribe } from '../controllers/newsletter.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlist.js';

export const apiRouter = Router();

// ============================================================
// Health Check
// ============================================================
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================
// Auth Routes (public)
// ============================================================
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 signup requests per windowMs
  message: { error: 'Too many signup requests from this IP, please try again after 15 minutes' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

const googleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many Google login attempts from this IP, please try again after 15 minutes' }
});

apiRouter.post('/auth/signup-request', signupLimiter, asyncHandler(signupRequest));
apiRouter.post('/auth/signup-verify', asyncHandler(signupVerify));
apiRouter.post('/auth/login', loginLimiter, asyncHandler(login));
apiRouter.post('/auth/google', googleLimiter, asyncHandler(googleAuth));
apiRouter.post('/auth/refresh', asyncHandler(refresh));
apiRouter.post('/auth/logout', asyncHandler(logout));
apiRouter.get('/auth/profile', authenticate, asyncHandler(getProfile));

// Forgot Password Routes
apiRouter.post('/auth/forgot-password/request', signupLimiter, asyncHandler(forgotPasswordRequest));
apiRouter.post('/auth/forgot-password/verify', asyncHandler(forgotPasswordVerify));
apiRouter.post('/auth/forgot-password/reset', asyncHandler(resetPassword));

// ============================================================
// Product Routes (public)
// ============================================================
apiRouter.get('/products/bestsellers', asyncHandler(getBestsellers));
apiRouter.get('/products/:id', asyncHandler(getProductById));
apiRouter.get('/products', asyncHandler(getProducts));

// ============================================================
// Cart Routes (protected)
// ============================================================
apiRouter.get('/cart', authenticate, asyncHandler(getCart));
apiRouter.post('/cart', authenticate, asyncHandler(addToCart));
apiRouter.put('/cart/:productId', authenticate, asyncHandler(updateCartItem));
apiRouter.delete('/cart/:productId', authenticate, asyncHandler(removeFromCart));
apiRouter.delete('/cart', authenticate, asyncHandler(clearCart));

// ============================================================
// Wishlist Routes (protected)
// ============================================================
apiRouter.get('/wishlist', authenticate, asyncHandler(getWishlist));
apiRouter.post('/wishlist/toggle', authenticate, asyncHandler(toggleWishlist));

// ============================================================
// Coupon Routes (public — validation doesn't require auth)
// ============================================================
apiRouter.post('/coupons/apply', asyncHandler(applyCoupon));

// ============================================================
// Order Routes (protected)
// ============================================================
apiRouter.post('/orders', authenticate, asyncHandler(placeOrder));
apiRouter.get('/orders', authenticate, asyncHandler(getOrders));
apiRouter.get('/orders/:id', authenticate, asyncHandler(getOrderById));

// ============================================================
// Address Routes (protected)
// ============================================================
apiRouter.get('/addresses', authenticate, asyncHandler(getAddresses));
apiRouter.post('/addresses', authenticate, asyncHandler(addAddress));
apiRouter.delete('/addresses/:id', authenticate, asyncHandler(deleteAddress));

// ============================================================
// Newsletter Routes (public)
// ============================================================
apiRouter.post('/newsletter/subscribe', asyncHandler(subscribe));
