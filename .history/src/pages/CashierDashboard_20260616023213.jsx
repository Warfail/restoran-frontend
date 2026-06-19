import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  CreditCard, 
  Receipt, 
  LogOut,
  LayoutDashboard,
  Utensils,
  Package,
  Users,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  Printer,
  DollarSign,
  QrCode
} from "lucide-react";
import { api } from "../services/api";

export default function CashierDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashAmount, setCashAmount] = useState("");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Refresh setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders();
      console.log("Orders from API:", response);
      // Sesuaikan dengan response format backend
      const ordersData = response.data || response;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

const confirmPayment = async (orderId) => {
  try {
    // Pake endpoint confirm-payment (bukan updateOrderStatus biasa)
    const response = await fetch(`http://localhost:8000/orders/${orderId}/confirm-payment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    
    if (result.success) {
      await fetchOrders();
      alert("✅ Pembayaran berhasil dikonfirmasi!");
    } else {
      alert("Gagal mengkonfirmasi pembayaran");
    }
  } catch (error) {
    console.error("Confirm payment failed:", error);
    alert("Terjadi kesalahan");
  }
};

  const openPaymentModal = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    setCashAmount("");
  };

const processPayment = async () => {
  if (!selectedOrder) return;
  
  if (paymentMethod === "cash" && parseFloat(cashAmount) < selectedOrder.totalAmount) {
    alert("Uang kurang!");
    return;
  }
  
  try {
    const response = await api.processCashPayment(selectedOrder.orderId, parseFloat(cashAmount));
    
    if (response.success) {
      alert(`✅ Pembayaran berhasil!\nTotal: Rp ${selectedOrder.totalAmount.toLocaleString()}\nKembalian: Rp ${response.change?.toLocaleString() || 0}`);
      await fetchOrders();
      setShowPaymentModal(false);
      setSelectedOrder(null);
      setCashAmount("");
    } else {
      alert("Pembayaran gagal");
    }
  } catch (error) {
    console.error("Payment failed:", error);
    alert("Terjadi kesalahan");
  }
};

  const filteredOrders = orders.filter(order => 
    order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tableNumber?.toString().includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    if (status === "paid") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">LUNAS</span>;
    if (status === "confirmed") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">DIKONFIRMASI</span>;
    if (status === "cooking") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">DIMASAK</span>;
    if (status === "done") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">SELESAI</span>;
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">PENDING</span>;
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    paid: orders.filter(o => o.status === "paid").length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Cashier Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium w-full">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <CreditCard className="w-5 h-5" />
            <span>Transaksi</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <Receipt className="w-5 h-5" />
            <span>Riwayat</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition">
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Kasir Dashboard</h1>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
            <HelpCircle className="w-5 h-5 text-gray-500 cursor-pointer" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-gray-900 text-sm font-semibold">Kasir</div>
                <div className="text-gray-500 text-xs">SHIFT A</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">K</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari order ID, customer, atau meja..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-500 text-xs font-medium">Total Order</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-500 text-xs font-medium">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-500 text-xs font-medium">Confirmed</div>
              <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-500 text-xs font-medium">Paid</div>
              <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ID ORDER</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">MEJA</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">PELANGGAN</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">TOTAL</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">STATUS</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{order.orderId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Meja {order.tableNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.customerName}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Rp {order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50" title="Detail">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          {order.status === "pending" && (
  <button 
    onClick={() => confirmPayment(order.orderId)} 
    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100" 
    title="Konfirmasi Pembayaran"
  >
    <CheckCircle className="w-4 h-4 text-blue-600" />
  </button>
)}
                          {order.status === "confirmed" && (
                            <button onClick={() => openPaymentModal(order)} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100" title="Bayar">
                              <CreditCard className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          {order.status === "paid" && (
                            <button className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100" title="Struk">
                              <Printer className="w-4 h-4 text-purple-600" />
                            </button>
                          )}
                        </div>
                       </td>
                     </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400">Belum ada order</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Pembayaran</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2"><span className="text-gray-600">Order ID</span><span className="font-mono font-semibold">{selectedOrder.orderId}</span></div>
                <div className="flex justify-between mb-2"><span className="text-gray-600">Pelanggan</span><span className="font-medium">{selectedOrder.customerName}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-900 font-bold">Total</span><span className="text-xl font-bold text-gray-900">Rp {selectedOrder.totalAmount?.toLocaleString()}</span></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
                <div className="flex gap-3">
                  <button onClick={() => setPaymentMethod("cash")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition ${paymentMethod === "cash" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:bg-gray-50"}`}>
                    <DollarSign className="w-4 h-4" /> Tunai
                  </button>
                  <button onClick={() => setPaymentMethod("qris")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition ${paymentMethod === "qris" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:bg-gray-50"}`}>
                    <QrCode className="w-4 h-4" /> QRIS
                  </button>
                </div>
              </div>

              {paymentMethod === "cash" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tunai</label>
                  <input type="number" placeholder="Masukkan nominal" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
                  {cashAmount && parseFloat(cashAmount) >= selectedOrder.totalAmount && <div className="mt-2 text-sm text-green-600">Kembalian: Rp {(parseFloat(cashAmount) - selectedOrder.totalAmount).toLocaleString()}</div>}
                </div>
              )}

              <button onClick={processPayment} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition">Proses Pembayaran</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}