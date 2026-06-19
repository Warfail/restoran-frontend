const API_BASE = "http://localhost:8000/api";

// Helper untuk fetch dengan token
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Something went wrong");
  }
  
  return response.json();
};

// API Services
export const api = {
  // Auth
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },
  
  // Menu
  getMenu: () => fetchWithAuth("/menu"),
  createMenu: (data) => fetchWithAuth("/menu", { method: "POST", body: JSON.stringify(data) }),
  updateMenu: (id, data) => fetchWithAuth(`/menu/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMenu: (id) => fetchWithAuth(`/menu/${id}`, { method: "DELETE" }),
  
  // Order
  createOrder: (data) => fetchWithAuth("/orders", { method: "POST", body: JSON.stringify(data) }),
  getOrder: (id) => fetchWithAuth(`/orders/${id}`),
  updateOrderStatus: (id, status) => fetchWithAuth(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  
  // Payment
  processPayment: (data) => fetchWithAuth("/payments", { method: "POST", body: JSON.stringify(data) }),
  
  // Users
  getUsers: () => fetchWithAuth("/users"),
  createUser: (data) => fetchWithAuth("/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id, data) => fetchWithAuth(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id) => fetchWithAuth(`/users/${id}`, { method: "DELETE" }),
  
  // Inventory
  getInventory: () => fetchWithAuth("/inventory"),
  updateStock: (id, stock) => fetchWithAuth(`/inventory/${id}`, { method: "PUT", body: JSON.stringify({ stock }) }),
  
  // Reports
  getSalesReport: (params) => fetchWithAuth(`/reports/sales?${new URLSearchParams(params)}`),
  
  // Kitchen
  getKitchenOrders: () => fetchWithAuth("/kitchen/orders"),
  updateKitchenStatus: (id, status) => fetchWithAuth(`/kitchen/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
};