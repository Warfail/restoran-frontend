import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  Bell, LogOut, Check, Plus, Search, Minus, RefreshCw,
  ChevronDown, ChevronUp
} from "lucide-react";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("antrean");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Data dari API
  const [pendingOrders, setPendingOrders] = useState([]);
  const [cookingOrders, setCookingOrders] = useState([]);
  
  // State untuk kelola stok bahan
  const [inventory, setInventory] = useState([]);
  const [counters, setCounters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders dari API
  const fetchOrders = async () => {
    try {
      const response = await api.getKitchenOrders();
      console.log("Kitchen orders response:", response);
      
      const ordersData = response?.data || response || [];
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      
      // Filter berdasarkan status
      const pending = ordersArray.filter(o => o.status === "paid" || o.status === "confirmed");
      const cooking = ordersArray.filter(o => o.status === "cooking");
      
      setPendingOrders(pending);
      setCookingOrders(cooking);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // Fetch inventory dari API
  const fetchInventory = async () => {
    try {
      const response = await api.getInventory();
      const inventoryData = response?.data || response || [];
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchInventory()]);
      setLoading(false);
    };
    loadData();

    // Timer for realtime clock
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);

    // Refresh orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    
    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/kitchen/login");
  };

  // Kitchen Order Actions
  const startCooking = async (orderId) => {
    try {
      await api.updateKitchenStatus(orderId, "cooking");
      await fetchOrders();
    } catch (error) {
      console.error("Failed to start cooking:", error);
      alert("Gagal mulai masak: " + (error.message || "Unknown error"));
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await api.updateKitchenStatus(orderId, "completed");
      await fetchOrders();
    } catch (error) {
      console.error("Failed to complete order:", error);
      alert("Gagal menyelesaikan order: " + (error.message || "Unknown error"));
    }
  };

  // Inventory Actions
  const updateCounter = (id, change) => {
    setCounters(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change)
    }));
  };

  const handleUpdateStock = async (id) => {
    const newStock = counters[id] || 0;
    try {
      await api.updateStock(id, newStock);
      await fetchInventory();
      setCounters(prev => ({ ...prev, [id]: 0 }));
      alert("✅ Stok berhasil diupdate!");
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert("Gagal update stok: " + (error.message || "Unknown error"));
    }
  };

  const getStatusBadge = (stock) => {
    if (stock === 0) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">HABIS</span>;
    if (stock <= 5) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">KRITIS</span>;
    if (stock <= 10) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">MENIPIS</span>;
    return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">AMAN</span>;
  };

  const getStockColor = (stock) => {
    if (stock === 0 || stock <= 5) return "text-red-500";
    if (stock <= 10) return "text-orange-500";
    return "text-green-600";
  };

  const stats = {
    total: inventory.length,
    menipis: inventory.filter(i => i.stock <= 10 && i.stock > 0).length,
    habis: inventory.filter(i => i.stock === 0).length,
  };

  const filteredInventory = inventory.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading kitchen dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-semibold text-sm">Kitchen Production Feed - Live</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            <button 
              onClick={() => setActiveTab("antrean")} 
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "antrean" ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}
            >
              Antrean Meja
            </button>
            <button 
              onClick={() => setActiveTab("kelolastokbahan")} 
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "kelolastokbahan" ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}
            >
              Kelola Stok Bahan
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{currentTime}</span>
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
            <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600">
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Content - Antrean Meja */}
      {activeTab === "antrean" && (
        <div className="flex flex-1">
          {/* Left Panel - Pending Orders */}
          <div className="w-80 bg-white border-r flex flex-col">
            <div className="px-5 py-4 border-b">
              <h2 className="font-bold text-sm uppercase">ANTREAN BARU ({pendingOrders.length})</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {pendingOrders.length === 0 && (
                <div className="text-center text-gray-400 py-8">Tidak ada antrean 🎉</div>
              )}
              {pendingOrders.map(order => (
                <div key={order._id || order.orderId} className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Meja {order.tableNumber || "-"}</span>
                    <span className="text-sm text-gray-500">{order.customerName || "Guest"}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-600">{item.quantity}x {item.name}</div>
                    ))}
                  </div>
                  <button 
                    onClick={() => startCooking(order.orderId || order._id)} 
                    className="w-full border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
                  >
                    Mulai Masak
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Cooking Orders */}
          <div className="flex-1 bg-gray-50">
            <div className="py-4">
              <h2 className="text-center font-bold text-sm uppercase">SEDANG DIMASAK ({cookingOrders.length})</h2>
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cookingOrders.length === 0 && (
                <div className="text-center text-gray-400 py-8 col-span-3">Tidak ada pesanan dimasak</div>
              )}
              {cookingOrders.map(order => (
                <div key={order._id || order.orderId} className="bg-white rounded-xl border p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Meja {order.tableNumber || "-"}</span>
                    <span className="text-amber-500 text-sm font-semibold">{order.customerName || "Guest"}</span>
                  </div>
                  <div className="space-y-2 my-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm">{item.quantity}x {item.name}</span>
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center">
                          {item.done && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => completeOrder(order.orderId || order._id)} 
                    className="w-full border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
                  >
                    Selesai
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content - Kelola Stok Bahan */}
      {activeTab === "kelolastokbahan" && (
        <div className="flex-1 p-6 space-y-4">
          {/* Stats Cards */}
          <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-xl p-5 shadow-sm">
              <div className="text-gray-500 text-xs font-semibold uppercase">TOTAL BAHAN</div>
              <div className="text-green-500 text-4xl font-bold">{stats.total}</div>
            </div>
            <div className="flex-1 bg-white rounded-xl p-5 shadow-sm">
              <div className="text-gray-500 text-xs font-semibold uppercase">STOK MENIPIS</div>
              <div className="text-orange-500 text-4xl font-bold">{stats.menipis}</div>
            </div>
            <div className="flex-1 bg-white rounded-xl p-5 shadow-sm">
              <div className="text-gray-500 text-xs font-semibold uppercase">STOK HABIS</div>
              <div className="text-red-500 text-4xl font-bold">{stats.habis}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari bahan..." 
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          {/* Bahan List */}
          <div className="space-y-2">
            {filteredInventory.map(item => (
              <div key={item._id || item.id} className="bg-white rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm border">
                <div className="flex-1 min-w-[120px]">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.category || "Bahan Baku"}</div>
                </div>
                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                  <span className={`text-xl font-bold ${getStockColor(item.stock)}`}>
                    {item.stock} {item.unit || "unit"}
                  </span>
                  {getStatusBadge(item.stock)}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateCounter(item._id || item.id, -1)} 
                    className="w-8 h-8 border rounded-lg flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-10 text-center font-semibold">
                    {counters[item._id || item.id] || 0}
                  </div>
                  <button 
                    onClick={() => updateCounter(item._id || item.id, 1)} 
                    className="w-8 h-8 border rounded-lg flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => handleUpdateStock(item._id || item.id)} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Update
                </button>
              </div>
            ))}
            {filteredInventory.length === 0 && (
              <div className="text-center text-gray-400 py-8">Tidak ada bahan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}