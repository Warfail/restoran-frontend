const API_BASE = "http://localhost:8000";

const getToken = () => localStorage.getItem("token");

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

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

  // Menu (Customer) - LANGSUNG TANPA AUTH
  getMenu: async () => {
    const res = await fetch(`${API_BASE}/menu`);
    const data = await res.json();
    console.log("Raw response:", data);
    
    if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  },
  getMenuByCategory: (category) => fetchWithAuth(`/menu?category=${category}`),

  // Order (Customer)
  createOrder: (orderData) => fetchWithAuth("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  }),

getOrderStatus: async (orderId) => {
  const res = await fetch(`${API_BASE}/orders/${orderId}`);
  const data = await res.json();
  console.log("getOrderStatus response:", data);
  return data;
},

  // Orders untuk Kasir
  getOrders: async () => {
    const res = await fetch(`${API_BASE}/cashier/orders`);
    return res.json();
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Payment untuk Kasir (Tunai)
  processCashPayment: async (orderId, amountPaid) => {
    const res = await fetch(`${API_BASE}/cashier/payment?order_id=${orderId}&amount_paid=${amountPaid}`, {
      method: "POST",
    });
    return res.json();
  },

  

  // Kitchen
  getKitchenOrders: () => fetchWithAuth("/kitchen/orders"),
  updateKitchenStatus: (orderId, status) => fetchWithAuth(`/kitchen/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  }),

  // Admin - Menu Management
  createMenu: (menuData) => fetchWithAuth("/menu", {
    method: "POST",
    body: JSON.stringify(menuData),
  }),
  updateMenu: (menuId, menuData) => fetchWithAuth(`/menu/${menuId}`, {
    method: "PUT",
    body: JSON.stringify(menuData),
  }),
  deleteMenu: (menuId) => fetchWithAuth(`/menu/${menuId}`, {
    method: "DELETE",
  }),

  // Admin - Inventory
  getInventory: () => fetchWithAuth("/inventory"),
  updateStock: (itemId, stock) => fetchWithAuth(`/inventory/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ stock }),
  }),

  // Admin - Users
  getUsers: () => fetchWithAuth("/users"),
  createUser: (userData) => fetchWithAuth("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  }),
  updateUser: (userId, userData) => fetchWithAuth(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  }),
  deleteUser: (userId) => fetchWithAuth(`/users/${userId}`, {
    method: "DELETE",
  }),

  // Admin - Reports
  getSalesReport: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/reports/sales${query ? `?${query}` : ""}`);
  },
};