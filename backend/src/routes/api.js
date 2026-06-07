import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';

// Auth Controllers
import { signupRequest, signupVerify, login, googleAuth, refresh, logout, getProfile, forgotPasswordRequest, forgotPasswordVerify, resetPassword } from '../controllers/auth.js';

// Product Controllers
import { getProducts, getProductById, getBestsellers, getAllProductsAdmin, createProduct, updateProductAdmin, deleteProductAdmin } from '../controllers/products.js';

// Cart Controllers
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.js';

// Coupon Controllers
import { applyCoupon } from '../controllers/coupons.js';

// Order Controllers
import { placeOrder, getOrders, getOrderById, createRazorpayOrder, verifyRazorpayPayment, getAdminOrders, updateOrderStatusAdmin } from '../controllers/orders.js';

// Address Controllers
import { getAddresses, addAddress, deleteAddress } from '../controllers/addresses.js';

// Newsletter Controllers
import { subscribe, getSubscribers } from '../controllers/newsletter.js';

// Contact Message Controllers
import { submitContact, getContactMessages, markAsRead } from '../controllers/contactMessages.js';

// Wishlist Controllers
import { getWishlist, toggleWishlist } from '../controllers/wishlist.js';

// RBAC Controllers
import { getSuperAdminDashboard, getCityDistributorDashboard, getGymDistributorDashboard, getTrainerDashboard, getCustomerDashboard } from '../controllers/dashboard.js';
import { submitTrainerApplication, submitGymApplication, getApplications, reviewApplication } from '../controllers/applications.js';
import { validateReferralCode, applyReferralCode, getReferralInfo } from '../controllers/referrals.js';
import { getMyCommissions, getCommissionBreakdown } from '../controllers/commissions.js';
import { getCommissionRules, createCommissionRule, updateCommissionRule, deleteCommissionRule } from '../controllers/commissionRules.js';
import { getAllUsers, getUsersByRole, updateUserRole, getUserProfile } from '../controllers/roles.js';

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
apiRouter.get('/products/admin/all',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getAllProductsAdmin)
);
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
apiRouter.post('/orders/razorpay/create', authenticate, asyncHandler(createRazorpayOrder));
apiRouter.post('/orders/razorpay/verify', authenticate, asyncHandler(verifyRazorpayPayment));
apiRouter.get('/orders/admin/all',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getAdminOrders)
);
apiRouter.get('/orders', authenticate, asyncHandler(getOrders));
apiRouter.get('/orders/:id', authenticate, asyncHandler(getOrderById));
apiRouter.put('/orders/:id/status',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(updateOrderStatusAdmin)
);

// ============================================================
// Address Routes (protected)
// ============================================================
apiRouter.get('/addresses', authenticate, asyncHandler(getAddresses));
apiRouter.post('/addresses', authenticate, asyncHandler(addAddress));
apiRouter.delete('/addresses/:id', authenticate, asyncHandler(deleteAddress));

// ============================================================
// Newsletter Routes (public + admin)
// ============================================================
apiRouter.post('/newsletter/subscribe', asyncHandler(subscribe));
apiRouter.get('/newsletter/subscribers',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getSubscribers)
);

// ============================================================
// Contact Message Routes (public + admin)
// ============================================================
apiRouter.post('/contact', asyncHandler(submitContact));
apiRouter.get('/contact',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getContactMessages)
);
apiRouter.put('/contact/:id/read',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(markAsRead)
);

// ============================================================
// Product Admin Routes (Super Admin CRUD)
// ============================================================
apiRouter.post('/products',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(createProduct)
);
apiRouter.put('/products/:id',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(updateProductAdmin)
);
apiRouter.delete('/products/:id',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(deleteProductAdmin)
);

// ============================================================
// RBAC: Dashboard Routes (role-protected)
// ============================================================
apiRouter.get('/dashboard/super-admin',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getSuperAdminDashboard)
);

apiRouter.get('/dashboard/city-distributor',
  authenticate, authorize('CITY_DISTRIBUTOR'),
  asyncHandler(getCityDistributorDashboard)
);

apiRouter.get('/dashboard/gym-distributor',
  authenticate, authorize('GYM_OR_AREA_DISTRIBUTOR'),
  asyncHandler(getGymDistributorDashboard)
);

apiRouter.get('/dashboard/trainer',
  authenticate, authorize('TRAINER_OR_RETAILER'),
  asyncHandler(getTrainerDashboard)
);

apiRouter.get('/dashboard/customer',
  authenticate,
  asyncHandler(getCustomerDashboard)
);

// ============================================================
// RBAC: Application Routes
// ============================================================
apiRouter.post('/applications/trainer', asyncHandler(submitTrainerApplication));
apiRouter.post('/applications/gym', asyncHandler(submitGymApplication));

apiRouter.get('/applications',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getApplications)
);

apiRouter.put('/applications/:id/review',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(reviewApplication)
);

// ============================================================
// RBAC: Referral Routes
// ============================================================
apiRouter.post('/referrals/validate', asyncHandler(validateReferralCode));
apiRouter.post('/referrals/apply', authenticate, asyncHandler(applyReferralCode));
apiRouter.get('/referrals/my-info', authenticate, asyncHandler(getReferralInfo));

// ============================================================
// RBAC: Commission Routes
// ============================================================
apiRouter.get('/commissions', authenticate, asyncHandler(getMyCommissions));

apiRouter.get('/commissions/breakdown',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getCommissionBreakdown)
);

// ============================================================
// RBAC: Role / User Management Routes (Super Admin)
// ============================================================
apiRouter.get('/roles/users',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getAllUsers)
);

apiRouter.get('/roles/users/:role',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getUsersByRole)
);

apiRouter.put('/roles/users/:id',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(updateUserRole)
);

apiRouter.get('/roles/profile', authenticate, asyncHandler(getUserProfile));

// ============================================================
// RBAC: Commission Rules (Super Admin CRUD)
// ============================================================
apiRouter.get('/commission-rules',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(getCommissionRules)
);

apiRouter.post('/commission-rules',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(createCommissionRule)
);

apiRouter.put('/commission-rules/:id',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(updateCommissionRule)
);

apiRouter.delete('/commission-rules/:id',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(deleteCommissionRule)
);
