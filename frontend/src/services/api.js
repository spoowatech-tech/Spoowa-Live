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

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    removeToken();
    // Optionally redirect to login
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

export async function registerUser(name, email, password, confirmPassword) {
  const data = await request(`${API_BASE}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password, confirmPassword }),
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

export function logoutUser() {
  removeToken();
}

export function isLoggedIn() {
  return !!getToken();
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

// ============================================================
// Orders API
// ============================================================

export async function placeOrder(addressId, couponCode, discountAmount) {
  return request(`${API_BASE}/orders`, {
    method: "POST",
    body: JSON.stringify({ addressId, couponCode, discountAmount }),
  });
}

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
