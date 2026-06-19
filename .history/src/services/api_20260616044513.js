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

  // Admin - Dashboard Stats (opsional)
getDashboardStats: async () => {
  const orders = await api.getOrders();
  const menus = await api.getMenu();
  const ordersData = orders.data || orders;
  const menusData = menus.data || menus;
  
  return {
    totalSales: Array.isArray(ordersData) ? ordersData.reduce((sum, o) => sum + (o.totalAmount || 0), 0) : 0,
    totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
    totalMenus: Array.isArray(menusData) ? menusData.length : 0,
    totalUsers: 0 // nanti dari API users
  };
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

  // Payment untuk Customer (QRIS/Transfer)
processCustomerPayment: async (paymentData) => {
  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  return res.json();
},

  // Kitchen
 // Kitchen
getKitchenOrders: async () => {
  const res = await fetch(`${API_BASE}/kitchen/orders`);
  return res.json();
},

updateKitchenStatus: async (orderId, status) => {
  const res = await fetch(`${API_BASE}/kitchen/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
},

  // Admin - Menu Management
  // Admin - Menu Management
createMenu: async (menuData) => {
  console.log("API received:", menuData);  // ← Tambah ini
  console.log("Price type in API:", typeof menuData.price);  // ← Tambah ini
  console.log("Stock type in API:", typeof menuData.stock);  // ← Tambah ini
  const res = await fetch(`${API_BASE}/menu/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menuData),
  });
  return res.json();
},
  
updateMenu: async (menuId, menuData) => {
  const res = await fetch(`${API_BASE}/menu/${menuId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menuData),
  });
  return res.json();
},
  deleteMenu: async (menuId) => {
    const res = await fetch(`${API_BASE}/menu/${menuId}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // Admin - Inventory
// Inventory endpoints
getInventory: async () => {
  const res = await fetch(`${API_BASE}/inventory/`, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
  });
  return res.json();
},

updateStock: async (itemId, newStock) => {
  const res = await fetch(`${API_BASE}/inventory/${itemId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ stock: newStock }),
  });
  return res.json();
},

  // Admin - Users
// Users endpoints
getUsers: async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/users/`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
},

updateUser: async (userId, userData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(userData),
  });
  return res.json();
},

deleteUser: async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
},

  // Admin - Reports
  getSalesReport: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/reports/sales${query ? `?${query}` : ""}`);
  },
};