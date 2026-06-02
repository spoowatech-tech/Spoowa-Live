const API_BASE = "/api";

export async function getGreeting(name) {
  const response = await fetch(`${API_BASE}/greeting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error(`Greeting API error: ${response.status}`);
  }
  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) {
    throw new Error(`Products API error: ${response.status}`);
  }
  return response.json();
}

export async function getHealthCheck() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error(`Health API error: ${response.status}`);
  }
  return response.json();
}
