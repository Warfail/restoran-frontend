import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, Flame, ChefHat, Check, RefreshCw, Package, LogOut } from "lucide-react";
import { api } from "../services/api";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({ antrean: 0, dimasak: 0, total: 0 });
  
  // 🔥 CACHE KITCHEN ORDERS
  const kitchenCacheRef = useRef(null);
  const kitchenCacheTimeRef = useRef(null);
  const CACHE_DURATION = 3000; // 3 detik

  const fetchKitchenOrders = async (force = false) => {
    // 🔥 CEK CACHE DULU (KALO GA FORCE)
    if (!force && kitchenCacheRef.current && kitchenCacheTimeRef.current && 
        (Date.now() - kitchenCacheTimeRef.current < CACHE_DURATION)) {
      console.log("✅ Using cached kitchen orders");
      setOrders(kitchenCacheRef.current);
      setLoading(false);
      return;
    }
    
    try {
      const [ordersRes, countRes] = await Promise.all([
        api.getKitchenOrders(),
        api.getKitchenOrderCount()
      ]);
      
      if (ordersRes.success) {
        kitchenCacheRef.current = ordersRes.data;
        kitchenCacheTimeRef.current = Date.now();
        setOrders(ordersRes.data);
      }
      
      if (countRes.success) {
        setStats(countRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch kitchen data:", error);
      toast.error("Gagal memuat data dapur");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FETCH PERTAMA KALI
  useEffect(() => {
    fetchKitchenOrders(true);
  }, []);

  // 🔥 POLLING 5 DETIK (BUKAN 1 DETIK!)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchKitchenOrders();
    }, 5000); // 🔥 5 DETIK!
    
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const response = await api.updateKitchenStatus(orderId, newStatus);
      if (response.success) {
        toast.success(`Order ${orderId} updated to ${newStatus}`);
        // 🔥 FORCE REFRESH (LEWATI CACHE)
        await fetchKitchenOrders(true);
      } else {
        toast.error("Gagal update status");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/kitchen/login");
  };

  // 🔥 GROUP ORDERS BY STATUS
  const paidOrders = orders.filter(o => o.status === "paid");
  const cookingOrders = orders.filter(o => o.status === "cooking");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data dapur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ChefHat className="w-8 h-8 text-red-500" />
          <h1 className="text-xl font-bold text-gray-900">Dapur Singkong Keju D9</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Antrean</p>
          <p className="text-2xl font-bold text-orange-500">{stats.antrean}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Sedang Dimasak</p>
          <p className="text-2xl font-bold text-blue-500">{stats.dimasak}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-green-500">{stats.total}</p>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="px-6 max-w-6xl mx-auto mb-4">
        <button
          onClick={() => fetchKitchenOrders(true)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-6 max-w-6xl mx-auto">
        {/* Antrean */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-500" />
            Antrean ({paidOrders.length})
          </h2>
          <div className="space-y-3">
            {paidOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400">
                Tidak ada antrean
              </div>
            ) : (
              paidOrders.map(order => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  onUpdate={handleUpdateStatus}
                  updating={updating}
                  nextStatus="cooking"
                  buttonLabel="Mulai Masak"
                  buttonColor="bg-blue-500 hover:bg-blue-600"
                  icon={<Flame className="w-4 h-4" />}
                />
              ))
            )}
          </div>
        </div>

        {/* Sedang Dimasak */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            Sedang Dimasak ({cookingOrders.length})
          </h2>
          <div className="space-y-3">
            {cookingOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400">
                Tidak ada yang dimasak
              </div>
            ) : (
              cookingOrders.map(order => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  onUpdate={handleUpdateStatus}
                  updating={updating}
                  nextStatus="completed"
                  buttonLabel="Selesai"
                  buttonColor="bg-green-500 hover:bg-green-600"
                  icon={<Check className="w-4 h-4" />}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔥 COMPONENT ORDER CARD
function OrderCard({ order, onUpdate, updating, nextStatus, buttonLabel, buttonColor, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-mono text-sm font-semibold text-gray-700">{order.orderId}</p>
          <p className="text-sm text-gray-500">Meja {order.tableNumber}</p>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          Rp {order.totalAmount?.toLocaleString() || 0}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {order.items?.map((item, idx) => (
          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {item.name} × {item.quantity}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
        </span>
        <button
          onClick={() => onUpdate(order.orderId, nextStatus)}
          disabled={updating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm transition ${buttonColor} disabled:opacity-50`}
        >
          {icon}
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}