// export const API_BASE = import.meta.env.DEV 
//   ? "http://127.0.0.1:8000" 
//   : "https://restoran-backend-production-fb73.up.railway.app";

  export const API_BASE = "https://restoran-backend-production-fb73.up.railway.app";

// 🔥 MENU CACHE
let menuCache = null;
let menuCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

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
  getMenu: async (skipCache = false) => {
    if (!skipCache && menuCache && menuCacheTime && (Date.now() - menuCacheTime < CACHE_DURATION)) {
      console.log("✅ Using cached menu");
      return menuCache;
    }

    const res = await fetch(`${API_BASE}/menu/?limit=500&t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const data = await res.json();
    console.log("Raw response:", data);

    let menus = [];
    if (data && data.success && Array.isArray(data.data)) {
      menus = data.data;
    } else if (Array.isArray(data)) {
      menus = data;
    }

    menuCache = menus;
    menuCacheTime = Date.now();

    return menus;
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

  // ✅ FUNGSI INI SUDAH BENAR, TIDAK PERLU DIUBAH
  syncLocalPaymentSuccess: async (orderId) => {
    const res = await fetch(`${API_BASE}/payment/local-success`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    return res.json();
  },

  setPaymentMethod: async (orderId, method) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}/payment-method`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method }),
    });
    return res.json();
  },

  // ========== CASHIER ==========
  getOrders: async () => {
    const res = await fetch(`${API_BASE}/cashier/orders`);
    return res.json();
  },

  getStockLogs: async () => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/stock-logs/`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_BASE}/cashier/order/${orderId}/status`, {
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
    const token = getToken();
    const res = await fetch(`${API_BASE}/cashier/receipt/${orderId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
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
      headers: { "Content-Type": "application/json" },
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
    menuCache = null;
    return res.json();
  },

  updateMenu: async (menuId, menuData) => {
    const res = await fetch(`${API_BASE}/menu/${menuId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menuData),
    });
    menuCache = null;
    return res.json();
  },

  deleteMenu: async (menuId) => {
    const res = await fetch(`${API_BASE}/menu/${menuId}`, {
      method: "DELETE",
    });
    menuCache = null;
    return res.json();
  },

  // ========== ADMIN - INVENTORY ==========
  getInventory: async (skipCache = false) => {
    const token = getToken();
    const url = skipCache ? `${API_BASE}/inventory/?_t=${Date.now()}` : `${API_BASE}/inventory/`;
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  addInventory: async (itemData) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/inventory/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });
    return res.json();
  },

  reduceStock: async (orderId) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/inventory/reduce`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
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
      body: JSON.stringify(newStock),
    });
    return res.json();
  },

  deleteInventory: async (itemId) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/inventory/${itemId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
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