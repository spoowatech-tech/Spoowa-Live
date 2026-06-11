// ============================================================
// Medusa.js Store API Client
// ============================================================

const MEDUSA_BACKEND_URL = "/store";
const ADMIN_API_URL = "/admin";

// ============================================================
// Publishable API Key — Medusa v2 requires this for store APIs
// We'll set this after creating one in the admin panel.
// For now, we'll try without it and add it later.
// ============================================================
let publishableApiKey = "pk_07791845c900f091e7f5b693339231019cc5275860f3098c1288772a37a3f5a1";

export function setPublishableApiKey(key) {
  // Not needed if hardcoded
}

// ============================================================
// Token Management (Medusa customer auth)
// ============================================================

function getToken() {
  return localStorage.getItem("medusa_token");
}

function setToken(token) {
  localStorage.setItem("medusa_token", token);
}

function removeToken() {
  localStorage.removeItem("medusa_token");
}

// ============================================================
// Cart ID Management
// ============================================================

function getCartId() {
  return localStorage.getItem("medusa_cart_id");
}

function setCartId(id) {
  localStorage.setItem("medusa_cart_id", id);
}

function removeCartId() {
  localStorage.removeItem("medusa_cart_id");
}

// ============================================================
// Generic Request Helper
// ============================================================

async function request(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (publishableApiKey) {
    headers["x-publishable-api-key"] = publishableApiKey;
  }

  const fetchOptions = { ...options, headers, credentials: "include", cache: "no-store" };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const errorMsg = data.message || data.error || `API error: ${response.status}`;
    throw new Error(errorMsg);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {};
  }

  return response.json();
}

// ============================================================
// Auth API (Medusa v2 Customer Auth)
// ============================================================

export async function registerCustomer({ first_name, last_name, email, password }) {
  // Step 1: Register the customer
  const data = await request(`${MEDUSA_BACKEND_URL}/customers`, {
    method: "POST",
    body: JSON.stringify({ first_name, last_name, email }),
  });

  return data;
}

export async function loginCustomer(email, password) {
  // Medusa v2 auth: POST /auth/customer/emailpass
  const authData = await request(`/auth/customer/emailpass`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (authData.token) {
    setToken(authData.token);
  }

  return authData;
}

export async function getCustomerProfile() {
  return request(`${MEDUSA_BACKEND_URL}/customers/me`);
}

export async function logoutCustomer() {
  removeToken();
  // Medusa v2 doesn't have a logout endpoint per se,
  // we just remove the token
}

export function isLoggedIn() {
  return !!getToken();
}

// ============================================================
// Social Auth Helpers (Google / Facebook OAuth)
// ============================================================

/**
 * Returns the backend URL to initiate a social OAuth flow.
 * Redirecting the browser to this URL will start the OAuth consent screen.
 * @param {'google'} provider
 */
export function getSocialAuthUrl(provider) {
  // This hits the Medusa backend directly (not proxied /store)
  // The Vite proxy forwards /auth/* to the backend
  return `/auth/customer/${provider}`;
}

/**
 * After social login, the user may not have a customer record yet.
 * This creates one using the token from the OAuth flow.
 */
export async function createCustomerFromSocial(profileData = {}) {
  return request(`${MEDUSA_BACKEND_URL}/customers`, {
    method: "POST",
    body: JSON.stringify(profileData),
  });
}

/**
 * Store a social auth token and mark the user as logged in.
 * @param {string} token - JWT token from social auth callback
 */
export function storeSocialToken(token) {
  setToken(token);
}


// ============================================================
// Products API
// ============================================================

export async function getProducts(params = {}) {
  const searchParams = new URLSearchParams(params);

  // If fetching by category, append as category_id[]
  if (params.category_id) {
    searchParams.delete("category_id");
    // Medusa v2 uses category_id[] for filtering
    const ids = Array.isArray(params.category_id) ? params.category_id : [params.category_id];
    ids.forEach(id => searchParams.append("category_id[]", id));
  }
  if (params.order) searchParams.set("order", params.order);

  // Always expand prices and images
  searchParams.set("fields", "+variants.calculated_price,+images");

  const query = searchParams.toString();
  return request(`${MEDUSA_BACKEND_URL}/products${query ? `?${query}` : ""}`);
}

export async function getProductById(id, regionId) {
  const params = new URLSearchParams();
  params.set("fields", "+variants.calculated_price,+images");
  if (regionId) params.set("region_id", regionId);
  return request(`${MEDUSA_BACKEND_URL}/products/${id}?${params.toString()}`);
}

export async function getProductCategories() {
  return request(`${MEDUSA_BACKEND_URL}/product-categories`);
}

// ============================================================
// Cart API (Medusa v2)
// ============================================================

export async function createCart(regionId) {
  const body = {};
  if (regionId) body.region_id = regionId;
  
  const data = await request(`${MEDUSA_BACKEND_URL}/carts`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (data.cart?.id) {
    setCartId(data.cart.id);
  }

  return data;
}

export async function getCart() {
  const cartId = getCartId();
  if (!cartId) return null;

  try {
    return await request(`${MEDUSA_BACKEND_URL}/carts/${cartId}`);
  } catch (error) {
    // Cart might have expired or been completed
    if (error.message.includes("404") || error.message.includes("not found")) {
      removeCartId();
      return null;
    }
    throw error;
  }
}

export async function addToCart(variantId, quantity = 1) {
  let cartId = getCartId();

  // Create a cart if one doesn't exist
  if (!cartId) {
    const regions = await getRegions();
    const region = regions.regions?.[0];
    const cartData = await createCart(region?.id);
    cartId = cartData.cart?.id;
  }

  return request(`${MEDUSA_BACKEND_URL}/carts/${cartId}/line-items`, {
    method: "POST",
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });
}

export async function updateCartItem(lineItemId, quantity) {
  const cartId = getCartId();
  if (!cartId) throw new Error("No cart found");

  return request(`${MEDUSA_BACKEND_URL}/carts/${cartId}/line-items/${lineItemId}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(lineItemId) {
  const cartId = getCartId();
  if (!cartId) throw new Error("No cart found");

  return request(`${MEDUSA_BACKEND_URL}/carts/${cartId}/line-items/${lineItemId}`, {
    method: "DELETE",
  });
}

export async function updateCartCustomer() {
  const cartId = getCartId();
  if (!cartId) return;

  const token = getToken();
  if (!token) return;

  // Associate logged-in customer with cart
  return request(`${MEDUSA_BACKEND_URL}/carts/${cartId}/customer`, {
    method: "POST",
  });
}

// ============================================================
// Shipping & Checkout
// ============================================================

export async function getCartShippingOptions(cartId) {
  return request(`${MEDUSA_BACKEND_URL}/shipping-options?cart_id=${cartId}`);
}

export async function addShippingMethod(cartId, shippingOptionId) {
  return request(`${MEDUSA_BACKEND_URL}/carts/${cartId}/shipping-methods`, {
    method: "POST",
    body: JSON.stringify({ option_id: shippingOptionId }),
  });
}

export async function setCartAddress(cartId, addressData) {
  return request(`${MEDUSA_BACKEND_URL}/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify({
      shipping_address: addressData,
      billing_address: addressData,
    }),
  });
}

export async function initiatePaymentSession(cartId, providerId) {
  return request(`${MEDUSA_BACKEND_URL}/carts/${cartId}/payment-sessions`, {
    method: "POST",
    body: JSON.stringify({ provider_id: providerId }),
  });
}

export async function completeCart(cartId) {
  const data = await request(`${MEDUSA_BACKEND_URL}/carts/${cartId}/complete`, {
    method: "POST",
  });

  // Clear cart ID after completion
  if (data.type === "order") {
    removeCartId();
  }

  return data;
}

// ============================================================
// Regions API
// ============================================================

export async function getRegions() {
  return request(`${MEDUSA_BACKEND_URL}/regions`);
}

// ============================================================
// Orders API
// ============================================================

export async function getOrders() {
  return request(`${MEDUSA_BACKEND_URL}/orders`);
}

export async function getOrderById(id) {
  return request(`${MEDUSA_BACKEND_URL}/orders/${id}`);
}

// ============================================================
// Health Check
// ============================================================

export async function getHealthCheck() {
  return request(`/health`);
}
