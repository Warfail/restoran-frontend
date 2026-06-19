import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, UtensilsCrossed, Flame, ChefHat, Info, RefreshCw, Clock, Wallet } from "lucide-react";
import { api } from "../services/api";

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId = "D9-20481", tableNumber = "07", totalAmount = 45000, totalItems = 2, customerName = "Tintin" } = location.state || {};
  
  const { initialStatus = 0 } = location.state || {};
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("customer");

  const statuses = [
    { id: 0, name: "Menunggu Pembayaran", icon: Clock, description: "Silakan lakukan pembayaran ke kasir.", canUpdate: ["kasir"] },
    { id: 1, name: "Pembayaran Berhasil", icon: Wallet, description: "Pembayaran telah terverifikasi.", canUpdate: ["kasir", "system"] },
    { id: 2, name: "Pesanan Diterima Dapur", icon: UtensilsCrossed, description: "Pesanan Anda sedang antre untuk dimasak.", canUpdate: ["kitchen"] },
    { id: 3, name: "Sedang Dimasak", icon: Flame, description: "Menunggu giliran penggorengan.", canUpdate: ["kitchen"] },
    { id: 4, name: "Siap Disajikan", icon: ChefHat, description: "Sajian hangat akan segera diantar.", canUpdate: ["kitchen"] },
  ];

const fetchLatestStatus = async () => {
  try {
    const response = await api.getOrderStatus(orderId);
    console.log("Full response:", response);
    
    // Response format: { success: true, data: { status: "paid", ... } }
    if (response.success && response.data) {
      const currentStatusText = response.data.status;
      console.log("Status text:", currentStatusText);
      
      const statusMap = {
        "pending": 0,
        "paid": 1,
        "confirmed": 2,
        "cooking": 3,
        "done": 4
      };
      
      const newStatus = statusMap[currentStatusText] ?? 0;
      if (newStatus !== currentStatus) {
        setCurrentStatus(newStatus);
      }
    } else {
      console.warn("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Failed to fetch order status:", error);
  }
};

  useEffect(() => {
    const userRole = localStorage.getItem("role") || "customer";
    setRole(userRole);
    
    const interval = setInterval(fetchLatestStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const canUpdate = () => {
    if (currentStatus >= statuses.length - 1) return false;
    const nextStatus = statuses[currentStatus + 1];
    return nextStatus.canUpdate.includes(role);
  };

  const handleRefresh = () => {
    if (!canUpdate()) {
      alert(`Hanya ${statuses[currentStatus + 1]?.canUpdate.join(" atau ")} yang dapat mengupdate ke status ini.`);
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setCurrentStatus(prev => Math.min(prev + 1, statuses.length - 1));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6 max-w-md mx-auto">
      <div className="bg-white px-4 py-3.5 flex justify-between items-center">
        <h1 className="text-green-600 font-semibold text-base">Status Pesanan</h1>
        <div className="bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">Meja {tableNumber}</div>
      </div>
      <div className="w-full h-px bg-gray-200"></div>
      
      <div className="bg-white pb-4">
        <div className="flex flex-col items-center pt-6 pb-2">
          <h2 className="text-gray-700 font-semibold text-lg mb-2">Status Pesanan Anda</h2>
          <div className="bg-red-500 text-white text-xs font-semibold px-5 py-1 rounded-full mb-6">Meja {tableNumber}</div>
          
          <div className="w-full px-4">
            {statuses.map((status, idx) => {
              const isCompleted = currentStatus >= status.id;
              return (
                <div key={status.id} className="flex items-start gap-3.5 py-3 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${isCompleted ? "bg-red-500" : "bg-gray-100 border-2 border-gray-200"}`}>
                      <status.icon className={`w-4.5 h-4.5 ${isCompleted ? "text-white" : "text-gray-400"}`} />
                    </div>
                    {idx < statuses.length - 1 && <div className={`w-0.5 flex-1 h-10 mt-1 ${isCompleted ? "bg-red-500" : "bg-gray-200"}`}></div>}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className={`text-sm font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{status.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{status.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-2.5"><span className="text-gray-700 text-sm font-medium">Detail Pesanan</span><span className="text-gray-400 text-xs">ID #{orderId}</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-900 font-bold text-sm">Total Pesanan: {totalItems} Item</span><span className="text-amber-500 font-bold text-sm">Rp {totalAmount.toLocaleString()}</span></div>
      </div>

      <div className="mx-4 mt-3 bg-green-50 border border-green-200 rounded-lg p-3.5 flex gap-2.5">
        <Info className="w-5 h-5 text-green-500 flex-shrink-0" />
        <p className="text-gray-700 text-xs leading-relaxed">Singkong kami dibuat segar setiap pesanan. Terima kasih telah bersabar untuk rasa terbaik!</p>
      </div>

      <div className="mx-4 mt-5 mb-6">
        <button onClick={handleRefresh} disabled={loading || !canUpdate()} className={`w-full font-semibold text-base py-4 rounded-xl flex items-center justify-center gap-2 transition ${canUpdate() ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Memperbarui..." : currentStatus >= statuses.length - 1 ? "Pesanan Selesai" : canUpdate() ? `Update ke: ${statuses[currentStatus + 1]?.name}` : "Menunggu Update dari Pihak Restoran"}
        </button>
      </div>
    </div>
  );
}