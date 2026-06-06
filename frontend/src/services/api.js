const API_BASE = "/api";

// ============================================================
// Token Management
// ============================================================

function getToken() {
  return localStorage.getItem("spoowa_token");
}

function setToken(token) {
  localStorage.setItem("spoowa_token", token);
}

function removeToken() {
  localStorage.removeItem("spoowa_token");
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...options.headers,
  };

  // Ensure cookies are sent with requests for refresh tokens
  const fetchOptions = { ...options, headers, credentials: "include" };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
    // Try refreshing the token
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include' // Important: send http-only cookie
      });
      
      if (refreshRes.ok) {
        const { token } = await refreshRes.json();
        setToken(token);
        
        // Retry original request with new token
        fetchOptions.headers.Authorization = `Bearer ${token}`;
        response = await fetch(url, fetchOptions);
      } else {
        removeToken();
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    } catch (e) {
      removeToken();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ============================================================
// Auth API
// ============================================================

export async function signupRequest(name, email, password, phone) {
  return request(`${API_BASE}/auth/signup-request`, {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
}

export async function signupVerify(name, email, password, phone, code) {
  const data = await request(`${API_BASE}/auth/signup-verify`, {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone, code }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export async function googleLogin(credential) {
  const data = await request(`${API_BASE}/auth/google`, {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export async function loginUser(email, password) {
  const data = await request(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export async function getProfile() {
  return request(`${API_BASE}/auth/profile`);
}

export async function logoutUser() {
  try {
    await request(`${API_BASE}/auth/logout`, { method: "POST" });
  } catch (e) {}
  removeToken();
}

export function isLoggedIn() {
  return !!getToken();
}

export async function forgotPasswordRequest(identifier) {
  return request(`${API_BASE}/auth/forgot-password/request`, {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export async function forgotPasswordVerify(identifier, code) {
  return request(`${API_BASE}/auth/forgot-password/verify`, {
    method: "POST",
    body: JSON.stringify({ identifier, code }),
  });
}

export async function resetPassword(resetToken, newPassword) {
  return request(`${API_BASE}/auth/forgot-password/reset`, {
    method: "POST",
    body: JSON.stringify({ resetToken, newPassword }),
  });
}

// ============================================================
// Products API
// ============================================================

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", Array.isArray(filters.type) ? filters.type.join(",") : filters.type);
  if (filters.benefit) params.set("benefit", Array.isArray(filters.benefit) ? filters.benefit.join(",") : filters.benefit);
  if (filters.priceMin) params.set("priceMin", filters.priceMin);
  if (filters.priceMax) params.set("priceMax", filters.priceMax);
  if (filters.size) params.set("size", Array.isArray(filters.size) ? filters.size.join(",") : filters.size);
  if (filters.rating) params.set("rating", filters.rating);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", filters.page);
  if (filters.limit) params.set("limit", filters.limit);

  const query = params.toString();
  return request(`${API_BASE}/products${query ? `?${query}` : ""}`);
}

export async function getProductById(id) {
  return request(`${API_BASE}/products/${id}`);
}

export async function getBestsellers(limit = 8) {
  return request(`${API_BASE}/products/bestsellers?limit=${limit}`);
}

// ============================================================
// Cart API
// ============================================================

export async function getCart() {
  return request(`${API_BASE}/cart`);
}

export async function addToCart(productId, quantity = 1) {
  return request(`${API_BASE}/cart`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(productId, quantity) {
  return request(`${API_BASE}/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(productId) {
  return request(`${API_BASE}/cart/${productId}`, {
    method: "DELETE",
  });
}

export async function clearCart() {
  return request(`${API_BASE}/cart`, {
    method: "DELETE",
  });
}

// ============================================================
// Wishlist API
// ============================================================

export async function getWishlist() {
  return request(`${API_BASE}/wishlist`);
}

export async function toggleWishlist(productId) {
  return request(`${API_BASE}/wishlist/toggle`, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

// ============================================================
// Coupons API
// ============================================================

export async function applyCoupon(code, orderTotal) {
  return request(`${API_BASE}/coupons/apply`, {
    method: "POST",
    body: JSON.stringify({ code, orderTotal }),
  });
}

export const couponsAPI = { apply: applyCoupon };

// ============================================================
// Orders API
// ============================================================

export async function placeOrder(orderData) {
  return request(`${API_BASE}/orders`, {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export const ordersAPI = {
  createRazorpayOrder: async (amount) => {
    return request(`${API_BASE}/orders/razorpay/create`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },
  verifyRazorpayPayment: async (paymentData) => {
    return request(`${API_BASE}/orders/razorpay/verify`, {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }
};

export async function getOrders() {
  return request(`${API_BASE}/orders`);
}

export async function getOrderById(id) {
  return request(`${API_BASE}/orders/${id}`);
}

// ============================================================
// Addresses API
// ============================================================

export async function getAddresses() {
  return request(`${API_BASE}/addresses`);
}

export async function addAddress(addressData) {
  return request(`${API_BASE}/addresses`, {
    method: "POST",
    body: JSON.stringify(addressData),
  });
}

export async function deleteAddress(id) {
  return request(`${API_BASE}/addresses/${id}`, {
    method: "DELETE",
  });
}

// ============================================================
// Newsletter API
// ============================================================

export async function subscribeNewsletter(email) {
  return request(`${API_BASE}/newsletter/subscribe`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// ============================================================
// Health Check
// ============================================================

export async function getHealthCheck() {
  return request(`${API_BASE}/health`);
}

// ============================================================
// RBAC: Dashboard APIs
// ============================================================

export async function getSuperAdminDashboard() {
  return request(`${API_BASE}/dashboard/super-admin`);
}

export async function getCityDistributorDashboard() {
  return request(`${API_BASE}/dashboard/city-distributor`);
}

export async function getGymDistributorDashboard() {
  return request(`${API_BASE}/dashboard/gym-distributor`);
}

export async function getTrainerDashboardData() {
  return request(`${API_BASE}/dashboard/trainer`);
}

export async function getCustomerDashboardData() {
  return request(`${API_BASE}/dashboard/customer`);
}

// ============================================================
// RBAC: Application APIs
// ============================================================

export async function submitTrainerApplication(data) {
  return request(`${API_BASE}/applications/trainer`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitGymApplication(data) {
  return request(`${API_BASE}/applications/gym`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getApplications(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.page) params.set("page", filters.page);
  const query = params.toString();
  return request(`${API_BASE}/applications${query ? `?${query}` : ""}`);
}

export async function reviewApplication(id, decision, reviewNotes = "") {
  return request(`${API_BASE}/applications/${id}/review`, {
    method: "PUT",
    body: JSON.stringify({ decision, review_notes: reviewNotes }),
  });
}

// ============================================================
// RBAC: Referral APIs
// ============================================================

export async function validateReferralCode(code) {
  return request(`${API_BASE}/referrals/validate`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function applyReferralCode(code) {
  return request(`${API_BASE}/referrals/apply`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function getReferralInfo() {
  return request(`${API_BASE}/referrals/my-info`);
}

// ============================================================
// RBAC: Commission APIs
// ============================================================

export async function getMyCommissions(page = 1) {
  return request(`${API_BASE}/commissions?page=${page}`);
}

export async function getCommissionBreakdown(page = 1) {
  return request(`${API_BASE}/commissions/breakdown?page=${page}`);
}

// ============================================================
// RBAC: Role / User Management APIs
// ============================================================

export async function getAllUsers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.role) params.set("role", filters.role);
  if (filters.page) params.set("page", filters.page);
  const query = params.toString();
  return request(`${API_BASE}/roles/users${query ? `?${query}` : ""}`);
}

export async function updateUserRoleApi(userId, data) {
  return request(`${API_BASE}/roles/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getRoleProfile() {
  return request(`${API_BASE}/roles/profile`);
}
