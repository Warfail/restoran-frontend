import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  Bell, LogOut, Check, Plus, Search, Minus, RefreshCw,
  UtensilsCrossed, Coffee, ChefHat, LayoutDashboard, Package, Settings
} from "lucide-react";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("antrean");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Data orders
  const [foodOrders, setFoodOrders] = useState([]);
  const [drinkOrders, setDrinkOrders] = useState([]);
  const [foodCooking, setFoodCooking] = useState([]);
  const [drinkCooking, setDrinkCooking] = useState([]);
  
  // Inventory
  const [inventory, setInventory] = useState([]);
  const [counters, setCounters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

const fetchOrders = async () => {
  try {
    const response = await api.getKitchenOrders();
    const ordersData = response?.data || response || [];
    const ordersArray = Array.isArray(ordersData) ? ordersData : [];
    
    console.log("📦 All orders:", ordersArray);
    
    // 🔥 PISAHKAN BERDASARKAN MENU ID
    const makanan = [];
    const minuman = [];
    
    ordersArray.forEach(order => {
      // Cek apakah order punya item makanan (menuId dimulai M atau S)
      const hasMakanan = order.items?.some(item => {
        const menuId = item.menuId || "";
        return menuId.startsWith("M") || menuId.startsWith("S");
      });
      // Cek apakah order punya item minuman (menuId dimulai D)
      const hasMinuman = order.items?.some(item => {
        const menuId = item.menuId || "";
        return menuId.startsWith("D");
      });
      
      if (hasMakanan) makanan.push(order);
      if (hasMinuman) minuman.push(order);
    });
    
    console.log("🍽️ Makanan (M/S):", makanan);
    console.log("🥤 Minuman (D):", minuman);
    
    setFoodOrders(makanan);
    setDrinkOrders(minuman);
    setFoodCooking([]);
    setDrinkCooking([]);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
};

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
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchInventory()]);
      setLoading(false);
    };
    loadData();

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);

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

  const startCooking = async (orderId) => {
    try {
      await api.updateKitchenStatus(orderId, "cooking");
      await fetchOrders();
    } catch (error) {
      console.error("Failed to start cooking:", error);
      alert("Gagal mulai masak");
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await api.updateKitchenStatus(orderId, "completed");
      await fetchOrders();
    } catch (error) {
      console.error("Failed to complete order:", error);
      alert("Gagal menyelesaikan order");
    }
  };

  // Inventory functions
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
      alert("Gagal update stok");
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading kitchen dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-sm">Kitchen Production - Live</span>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button 
              onClick={() => setActiveTab("antrean")} 
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "antrean" ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}
            >
              Antrean
            </button>
            <button 
              onClick={() => setActiveTab("kelolastokbahan")} 
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "kelolastokbahan" ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}
            >
              Stok Bahan
            </button>
          </div>
          <span className="text-sm font-medium">{currentTime}</span>
          <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
          <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600">
            <LogOut className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      {/* Antrean Section */}
      {activeTab === "antrean" && (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SECTION MAKANAN */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center gap-2 mb-4 border-b pb-3">
                <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                <h2 className="font-bold text-lg text-gray-800">Makanan</h2>
                <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                  Antrean: {foodOrders.length}
                </span>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {foodOrders.length === 0 && (
                  <div className="text-center text-gray-400 py-8">Tidak ada antrean makanan 🎉</div>
                )}
                {foodOrders.map(order => (
                  <div key={order.orderId || order._id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-800">Meja {order.tableNumber}</span>
                      <span className="text-sm text-gray-500">{order.customerName || "Guest"}</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600">{item.quantity}x {item.name}</div>
                      ))}
                    </div>
                    <button 
                      onClick={() => startCooking(order.orderId || order._id)} 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      🍳 Mulai Masak
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-3">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">🔥 Sedang Dimasak ({foodCooking.length})</h3>
                <div className="space-y-2">
                  {foodCooking.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-4">Tidak ada makanan dimasak</div>
                  )}
                  {foodCooking.map(order => (
                    <div key={order.orderId || order._id} className="bg-orange-50 rounded-lg p-2 border border-orange-200 flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-800">Meja {order.tableNumber}</span>
                        <span className="text-xs text-gray-500 ml-2">{order.customerName || "Guest"}</span>
                      </div>
                      <button 
                        onClick={() => completeOrder(order.orderId || order._id)} 
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        ✅ Selesai
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION MINUMAN */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center gap-2 mb-4 border-b pb-3">
                <Coffee className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-lg text-gray-800">Minuman</h2>
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  Antrean: {drinkOrders.length}
                </span>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {drinkOrders.length === 0 && (
                  <div className="text-center text-gray-400 py-8">Tidak ada antrean minuman 🎉</div>
                )}
                {drinkOrders.map(order => (
                  <div key={order.orderId || order._id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-800">Meja {order.tableNumber}</span>
                      <span className="text-sm text-gray-500">{order.customerName || "Guest"}</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600">{item.quantity}x {item.name}</div>
                      ))}
                    </div>
                    <button 
                      onClick={() => startCooking(order.orderId || order._id)} 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      🧊 Mulai Buat
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-3">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">🧊 Sedang Dibuat ({drinkCooking.length})</h3>
                <div className="space-y-2">
                  {drinkCooking.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-4">Tidak ada minuman dibuat</div>
                  )}
                  {drinkCooking.map(order => (
                    <div key={order.orderId || order._id} className="bg-blue-50 rounded-lg p-2 border border-blue-200 flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-800">Meja {order.tableNumber}</span>
                        <span className="text-xs text-gray-500 ml-2">{order.customerName || "Guest"}</span>
                      </div>
                      <button 
                        onClick={() => completeOrder(order.orderId || order._id)} 
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        ✅ Selesai
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Stok Bahan Section */}
      {activeTab === "kelolastokbahan" && (
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <div className="text-gray-500 text-xs font-semibold uppercase">TOTAL BAHAN</div>
              <div className="text-green-500 text-4xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <div className="text-gray-500 text-xs font-semibold uppercase">STOK MENIPIS</div>
              <div className="text-orange-500 text-4xl font-bold">{stats.menipis}</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
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
                  <div className="font-semibold text-gray-800">{item.name}</div>
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
                    className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-10 text-center font-semibold">
                    {counters[item._id || item.id] || 0}
                  </div>
                  <button 
                    onClick={() => updateCounter(item._id || item.id, 1)} 
                    className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50"
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