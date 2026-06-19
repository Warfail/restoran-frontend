const API_BASE = "http://localhost:8000";

export const api = {
  login: async (username, password) => {
    if (username === "admin" && password === "admin123") {
      return {
        success: true,
        token: "dummy-token-123",
        role: "admin"
      };
    }
    return { success: false, message: "Username atau password salah" };
  },

  getMenu: async () => {
    const res = await fetch(`${API_BASE}/menu`);
    return res.json();
  },

  getOrders: async () => {
    const res = await fetch(`${API_BASE}/cashier/orders`);
    return res.json();
  },
};