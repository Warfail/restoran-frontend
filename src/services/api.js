// const API_BASE = "http://127.0.0.1:8000";
const API_BASE = "https://restoran-backend-production-fb73.up.railway.app";

const getToken = () => sessionStorage.getItem("token");

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
  // ========== AUTH ==========
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  // ========== MENU (Public) ==========
getMenu: async () => {
  const res = await fetch(`${API_BASE}/menu/`);
  const data = await res.json();
  console.log("Raw response:", data);
  
  // 🔥 PASTIKAN FORMAT RESPONSE
  if (data && data.success && Array.isArray(data.data)) {
    console.log("✅ Menu data found:", data.data.length);
    return data.data;
  }
  
  // Fallback kalau response langsung array
  if (Array.isArray(data)) {
    console.log("✅ Menu data (array):", data.length);
    return data;
  }
  
  console.warn("❌ Menu data is empty or not an array");
  return [];
},

  // ========== ORDERS (Customer) ==========
  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE}/orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  getOrderStatus: async (orderId) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    const data = await res.json();
    console.log("getOrderStatus response:", data);
    return data;
  },

  processCustomerPayment: async (paymentData) => {
    const res = await fetch(`${API_BASE}/orders/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    return res.json();
  },

// ========== MIDTRANS ==========
createMidtransTransaction: async (data) => {
  const res = await fetch(`${API_BASE}/payment/create-transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
},

setPaymentMethod: async (orderId, method) => {
  const res = await fetch(`${API_BASE}/payment/set-method`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, method }),
  });
  return res.json();
},

  

  // ========== CASHIER ==========
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

  processCashPayment: async (orderId, amountPaid) => {
    const res = await fetch(`${API_BASE}/cashier/payment?order_id=${orderId}&amount_paid=${amountPaid}`, {
      method: "POST",
    });
    return res.json();
  },

  getReceipt: async (orderId) => {
    const res = await fetch(`${API_BASE}/cashier/receipt/${orderId}`);
    return res.json();
  },

  confirmOrder: async (orderId) => {
    const res = await fetch(`${API_BASE}/cashier/order/${orderId}/confirm`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },

  markAsPrinted: async (orderId) => {
    const res = await fetch(`${API_BASE}/cashier/order/${orderId}/printed`, {
      method: "PUT",
    });
    return res.json();
  },

  // ========== KITCHEN ==========
  getKitchenOrders: async () => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/kitchen/orders`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.json();
  },

  updateKitchenStatus: async (orderId, status) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/kitchen/orders/${orderId}/status`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  getKitchenOrderCount: async () => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/kitchen/orders/count`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  // ========== ADMIN - MENU ==========
  createMenu: async (menuData) => {
    console.log("API received:", menuData);
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

  // ========== ADMIN - INVENTORY ==========
  getInventory: async () => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/inventory/`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  updateStock: async (itemId, newStock) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/inventory/${itemId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ stock: newStock }),
    });
    return res.json();
  },

  // ========== ADMIN - USERS ==========
  getUsers: async () => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/users/`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  createUser: async (userData) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/users/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  updateUser: async (userId, userData) => {
    const token = getToken();
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
    const token = getToken();
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  // ========== ADMIN - REPORTS ==========
  getSalesReport: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/reports/sales${query ? `?${query}` : ""}`);
  },

  // ========== DASHBOARD STATS ==========
  getDashboardStats: async () => {
    const orders = await api.getOrders();
    const menus = await api.getMenu();
    const ordersData = orders.data || orders;
    const menusData = menus.data || menus;
    
    let validOrders = [];
    if (Array.isArray(ordersData)) {
      validOrders = ordersData.filter(o => 
        o.status === "completed" || 
        o.payment_status === "paid" || 
        o.status === "paid"
      );
    }
    
    return {
      totalSales: validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      totalOrders: validOrders.length,
      totalMenus: Array.isArray(menusData) ? menusData.length : 0,
      totalUsers: 0
    };
  },
};