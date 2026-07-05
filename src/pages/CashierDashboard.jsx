import toast from "react-hot-toast";
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
  QrCode,
  Clock,
  X,
  Landmark
} from "lucide-react";
import { api } from "../services/api";
import SettingsModal from "../components/SettingsModal";
import MobileHeader from "../components/admin/MobileHeader";

export default function CashierDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [activeTab, setActiveTab] = useState("transaksi");
  const [currentPrintOrderId, setCurrentPrintOrderId] = useState(null);

  // 🔥 AUTO-REFRESH 10 DETIK
  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.getOrders();
      const ordersData = response?.data || response || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const confirmOrder = async (orderId) => {
    try {
      const result = await api.confirmOrder(orderId);
      if (result.success) {
        toast.success("✅ Pesanan berhasil dikonfirmasi!");
        await fetchOrders();
      } else {
        toast.error("Gagal mengkonfirmasi order: " + (result.detail || ""));
      }
    } catch (error) {
      console.error("Confirm order failed:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  const openPaymentModal = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    setCashAmount("");
    setPaymentMethod(order.paymentMethod || "cash");
  };

  const processPayment = async () => {
    if (!selectedOrder) return;

    if (paymentMethod === "cash" && (!cashAmount || parseFloat(cashAmount) < selectedOrder.totalAmount)) {
      toast.error("Uang kurang!");
      return;
    }

    const finalAmount = paymentMethod === "cash" ? parseFloat(cashAmount) : selectedOrder.totalAmount;

    try {
      const response = await api.processCashPayment(selectedOrder.orderId, finalAmount);

      if (response.success) {
        if (paymentMethod === "cash") {
          toast.success(`✅ Pembayaran berhasil!\nKembalian: Rp ${response.data?.change?.toLocaleString() || (finalAmount - selectedOrder.totalAmount).toLocaleString()}`);
        } else {
          toast.success(`✅ Pembayaran berhasil dikonfirmasi!`);
        }
        await fetchOrders();
        setShowPaymentModal(false);
        setSelectedOrder(null);
        setCashAmount("");
      } else {
        toast.error("Pembayaran gagal: " + (response.detail || response.message || "Pastikan nominal benar"));
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Terjadi kesalahan pada server");
    }
  };

  const printReceipt = async (orderId) => {
    try {
      setCurrentPrintOrderId(orderId);
      const result = await api.getReceipt(orderId);
      if (result.success) {
        setReceiptData(result.data);
        setShowReceipt(true);
      } else {
        toast.error("Gagal mengambil struk");
      }
    } catch (error) {
      console.error(error);
      toast.error("Kesalahan jaringan");
    }
  };

  const currentOrders = activeTab === "transaksi" 
    ? orders.filter(o => !o.isPrinted)
    : orders.filter(o => o.isPrinted);

  const filteredOrders = currentOrders.filter(order => {
    const matchesSearch = order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tableNumber?.toString().includes(searchTerm);

    if (activeTab === "riwayat" && dateFilter) {
      const orderDate = new Date(order.createdAt || Date.now()).toISOString().split('T')[0];
      return matchesSearch && orderDate === dateFilter;
    }
    
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    if (status === "paid" || status === "settlement") {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">LUNAS</span>;
    }
    if (status === "confirmed") {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">DIKONFIRMASI</span>;
    }
    if (status === "cooking") {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">DIMASAK</span>;
    }
    if (status === "done" || status === "completed") {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">SELESAI</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">PENDING</span>;
  };

  const stats = {
    total: currentOrders.length,
    pending: currentOrders.filter(o => o.status === "pending").length,
    confirmed: currentOrders.filter(o => o.status === "confirmed").length,
    paid: currentOrders.filter(o => ["paid", "cooking", "completed", "done", "settlement"].includes(o.status)).length
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-30 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          </div>
          <p className="text-[#CBFFC2] text-sm mt-1">Cashier Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button 
            onClick={() => { setActiveTab("transaksi"); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full transition ${activeTab === "transaksi" ? "bg-[#FEB64C] text-[#704800]" : "text-white hover:bg-white/10"}`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Transaksi</span>
          </button>
          <button 
            onClick={() => { setActiveTab("riwayat"); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full transition ${activeTab === "riwayat" ? "bg-[#FEB64C] text-[#704800]" : "text-white hover:bg-white/10"}`}
          >
            <Receipt className="w-5 h-5" />
            <span>Riwayat</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="w-5 h-5" /><span>Pengaturan</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <MobileHeader title="Cashier Panel" onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="h-10 bg-gray-200 rounded-lg w-full max-w-md"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
               <div className="h-24 bg-gray-200 rounded-xl border border-gray-100"></div>
               <div className="h-24 bg-gray-200 rounded-xl border border-gray-100"></div>
               <div className="h-24 bg-gray-200 rounded-xl border border-gray-100"></div>
               <div className="h-24 bg-gray-200 rounded-xl border border-gray-100"></div>
            </div>
            <div className="bg-white rounded-xl border p-4 space-y-4">
               <div className="h-10 bg-gray-100 rounded w-full"></div>
               <div className="h-12 bg-gray-100 rounded w-full"></div>
               <div className="h-12 bg-gray-100 rounded w-full"></div>
               <div className="h-12 bg-gray-100 rounded w-full"></div>
               <div className="h-12 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">{activeTab === "transaksi" ? "Transaksi" : "Riwayat Transaksi"}</h1>
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
                <HelpCircle className="w-5 h-5 text-gray-500 cursor-pointer" />
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-gray-900 text-sm font-semibold">{currentUser?.fullName || currentUser?.username || ""}</div>
                    <div className="text-gray-500 text-xs font-medium">{currentUser?.role?.toUpperCase() || "ROLE"}</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm border border-gray-200">
                    {currentUser?.profilePicture ? (
                      <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (currentUser?.fullName || currentUser?.username || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Search and Filter */}
              <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari order ID, customer, atau meja..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {activeTab === "riwayat" && (
                  <div className="w-48">
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
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
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-400">
                            {activeTab === "transaksi" ? "Belum ada transaksi aktif" : "Belum ada riwayat transaksi"}
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{order.orderId}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">Meja {order.tableNumber}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.customerName}</td>
                            <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Rp {order.totalAmount?.toLocaleString()}</td>
                            <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {/* 🔥 TOMBOL BAYAR - HANYA UNTUK PENDING & BUKAN MIDTRANS */}
                                    {(order.status === "pending" || order.status === "confirmed") && 
                                    order.paymentMethod !== "transfer" && 
                                    order.paymentMethod !== "qris" && 
                                    order.paymentMethod !== "gopay" && 
                                    order.paymentMethod !== "credit_card" && (
                                      <button
                                        onClick={() => openPaymentModal(order)}
                                        className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                                      >
                                        <DollarSign className="w-3.5 h-3.5" />
                                        Bayar
                                      </button>
                                    )}
                                
                                {/* 🔥 TOMBOL CETAK - UNTUK LUNAS (kecuali pending) */}
                                {order.status !== "pending" && (
                                  <button 
                                    onClick={() => printReceipt(order.orderId)} 
                                    className={`px-3 py-1.5 rounded-lg ${order.isPrinted ? "bg-gray-600 hover:bg-gray-700" : "bg-purple-600 hover:bg-purple-700"} text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm`}
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    {order.isPrinted ? "Cetak Ulang" : "Cetak Struk"}
                                  </button>
                                )}
                                
                                <button 
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    // Bisa tambah modal detail kalo mau
                                    toast.info(`Detail order ${order.orderId}`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Detail
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Pembayaran</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between mb-2"><span className="text-gray-500 text-sm">Order ID</span><span className="font-mono font-semibold text-gray-900">{selectedOrder.orderId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Pelanggan</span><span className="font-medium text-gray-900">{selectedOrder.customerName}</span></div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2.5">Metode Pembayaran (Dipilih Pelanggan)</label>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3">
                  {paymentMethod === "cash" && <><DollarSign className="w-5 h-5 text-gray-600" /><span className="font-semibold text-gray-900">Tunai</span></>}
                  {paymentMethod === "debit" && <><CreditCard className="w-5 h-5 text-gray-600" /><span className="font-semibold text-gray-900">Debit / Kartu Kredit (EDC)</span></>}
                  {paymentMethod === "qris" && <><QrCode className="w-5 h-5 text-gray-600" /><span className="font-semibold text-gray-900">QRIS</span></>}
                  {paymentMethod === "transfer" && <><Landmark className="w-5 h-5 text-gray-600" /><span className="font-semibold text-gray-900">Transfer Bank</span></>}
                </div>
              </div>

              {paymentMethod === "cash" && (
                <div className="space-y-4 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">TOTAL TAGIHAN</label>
                    <div className="text-2xl font-black text-gray-900">Rp {selectedOrder.totalAmount?.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Uang Diterima (Rp)</label>
                    <input
                      type="number"
                      placeholder="Masukkan nominal uang pelanggan"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                    />
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Kembalian</span>
                    <span className={`text-xl font-bold ${cashAmount && parseFloat(cashAmount) >= selectedOrder.totalAmount ? "text-green-600" : "text-gray-400"}`}>
                      Rp {cashAmount && parseFloat(cashAmount) >= selectedOrder.totalAmount ? (parseFloat(cashAmount) - selectedOrder.totalAmount).toLocaleString() : "0"}
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === "debit" && (
                <div className="space-y-4 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">TOTAL TAGIHAN</label>
                    <div className="text-2xl font-black text-gray-900">Rp {selectedOrder.totalAmount?.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">No. Referensi / EDC (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 12345678"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 flex gap-2">
                    <span className="text-lg">ℹ️</span>
                    <span>Pastikan transaksi pada mesin EDC sudah <b>Berhasil (Approved)</b> sebelum Anda memproses pembayaran di sistem ini.</span>
                  </div>
                </div>
              )}

              {(paymentMethod === "qris" || paymentMethod === "transfer") && (
                <div className="space-y-4 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">TOTAL TAGIHAN</label>
                    <div className="text-2xl font-black text-gray-900">Rp {selectedOrder.totalAmount?.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 flex gap-2">
                    <span className="text-lg">ℹ️</span>
                    <span>Pastikan pelanggan sudah menunjukkan bukti transfer/QRIS yang <b>berhasil</b> dan saldo sudah masuk ke rekening toko.</span>
                  </div>
                </div>
              )}

              <button
                onClick={processPayment}
                disabled={paymentMethod === "cash" && (!cashAmount || parseFloat(cashAmount) < selectedOrder.totalAmount)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Printable Area */}
            <div className="bg-gray-200 p-4 flex justify-center overflow-y-auto max-h-[60vh]">
              <div id="receipt-content" className="bg-white p-4 text-gray-900 font-mono w-full max-w-[300px] shadow-sm text-[11px] leading-tight whitespace-pre-wrap">
                <div className="text-center mb-2">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto mb-1 grayscale" style={{ filter: 'grayscale(100%)' }} />
                  <div className="text-lg font-bold uppercase tracking-wider">Singkong Keju D9</div>
                  <div>Jl. Argowiyoto No.8A, Ledok</div>
                  <div>Kec. Argomulyo, Kota Salatiga</div>
                  <div>089654485375</div>
                </div>

                <div className="text-center mb-2">
                  ================================
                </div>

                <div className="mb-2">
                  <div className="flex">
                    <span className="w-[75px] shrink-0">No Nota</span>
                    <span className="mr-1">:</span>
                    <span className="flex-1 break-all">{receiptData.receiptId}</span>
                  </div>
                  <div className="flex">
                    <span className="w-[75px] shrink-0">Waktu</span>
                    <span className="mr-1">:</span>
                    <span>{new Date(receiptData.paymentDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })} {new Date(receiptData.paymentDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex">
                    <span className="w-[75px] shrink-0">Order</span>
                    <span className="mr-1">:</span>
                    <span>Meja {receiptData.tableNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="w-[75px] shrink-0">Kasir</span>
                    <span className="mr-1">:</span>
                    <span>{currentUser?.fullName || currentUser?.username || "Kasir"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-[75px] shrink-0">Jenis Order</span>
                    <span className="mr-1">:</span>
                    <span>Dine In</span>
                  </div>
                  <div className="flex">
                    <span className="w-[75px] shrink-0">Nama Order</span>
                    <span className="mr-1">:</span>
                    <span>{receiptData.customerName}</span>
                  </div>
                </div>

                <div className="text-center mb-2">
                  --------------------------------
                </div>

                <div className="mb-2">
                  {receiptData.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <span className="flex-1 pr-2">{item.quantity} {item.menuName || item.name}</span>
                      <span className="whitespace-nowrap">{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center mb-2">
                  --------------------------------
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between">
                    <span>Subtotal {receiptData.items?.reduce((acc, item) => acc + item.quantity, 0) || 0} Produk</span>
                    <span>{receiptData.totalPrice?.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{receiptData.totalPrice?.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="text-center mb-2">
                  --------------------------------
                </div>

                <div className="mb-2">
                  <div className="flex justify-between">
                    <span>Metode Bayar</span>
                    <span className="capitalize">{receiptData.paymentMethod === 'cash' ? 'Tunai' : (receiptData.paymentMethod || 'Tunai')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tunai/Bayar</span>
                    <span>{receiptData.amountPaid?.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kembali</span>
                    <span>{receiptData.change?.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="text-center mb-2">
                  ================================
                </div>

                <div className="text-center mt-2">
                  <div>Kritik dan Saran</div>
                  <div>089654485375</div>
                  <div className="mt-4 mb-2">Terima Kasih</div>
                  <div>Terbayar {new Date(receiptData.paymentDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date(receiptData.paymentDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div>dicetak: {currentUser?.fullName || currentUser?.username || "Kasir"}</div>
                </div>
              </div>
            </div>

            {/* Actions (Not Printed) */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 transition"
              >
                Tutup
              </button>
              <button
                onClick={async () => {
                  if (currentPrintOrderId) {
                    try {
                      await api.markAsPrinted(currentPrintOrderId);
                      fetchOrders(false);
                    } catch (e) {
                      console.error("Gagal update status isPrinted", e);
                    }
                  }
                  const content = document.getElementById("receipt-content").innerHTML;
                  setShowReceipt(false);
                  
                  const printWindow = window.open('', '_blank', 'width=400,height=600');
                  if (printWindow) {
                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Cetak Struk - ${receiptData.receiptId}</title>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <style>
                            @page { margin: 0; }
                            body {
                              font-family: monospace;
                              font-weight: 600;
                              color: #000;
                              margin: 0;
                              padding: 10px;
                              width: 58mm;
                              font-size: 11px;
                              line-height: 1.2;
                              background: #fff;
                            }
                            * { box-sizing: border-box; }
                            
                            .text-center { text-align: center; }
                            .mb-1 { margin-bottom: 4px; }
                            .mb-2 { margin-bottom: 8px; }
                            .mb-3 { margin-bottom: 12px; }
                            .mb-4 { margin-bottom: 16px; }
                            .mt-1 { margin-top: 4px; }
                            .mt-4 { margin-top: 16px; }
                            .my-1 { margin-top: 4px; margin-bottom: 4px; }
                            .my-2 { margin-top: 8px; margin-bottom: 8px; }
                            .mx-auto { margin-left: auto; margin-right: auto; }
                            .w-full { width: 100%; }
                            .flex { display: flex; }
                            .justify-between { justify-content: space-between; }
                            .justify-center { justify-content: center; }
                            .items-start { align-items: flex-start; }
                            .items-center { align-items: center; }
                            .flex-col { flex-direction: column; }
                            .flex-1 { flex: 1; }
                            .shrink-0 { flex-shrink: 0; }
                            .mr-1 { margin-right: 4px; }
                            .pr-2 { padding-right: 8px; }
                            .gap-1 { gap: 4px; }
                            .break-all { word-break: break-all; }
                            .whitespace-nowrap { white-space: nowrap; }
                            .whitespace-pre-wrap { white-space: pre-wrap; }
                            .leading-tight { line-height: 1.25; }
                            .border-t { border-top: 1px dashed #000; }
                            .border-dashed { border-style: dashed; }
                            .font-bold { font-weight: 900; }
                            .font-semibold { font-weight: 700; }
                            .uppercase { text-transform: uppercase; }
                            .tracking-wider { letter-spacing: 0.05em; }
                            .w-12 { width: 48px; }
                            .h-12 { height: 48px; }
                            .w-4 { width: 16px; }
                            .h-4 { height: 16px; }
                            .text-\\[10px\\] { font-size: 10px; }
                            .text-\\[11px\\] { font-size: 11px; }
                            .text-lg { font-size: 16px; }
                            .w-\\[75px\\] { width: 75px; }
                            .space-y-1 > * + * { margin-top: 4px; }
                            .space-y-2 > * + * { margin-top: 8px; }
                            
                            img { display: block; }
                            
                            @media print {
                              body { width: auto; max-width: 58mm; padding: 0; margin-left: auto; margin-right: auto;}
                            }
                          </style>
                        </head>
                        <body>
                          ${content}
                          <script>
                            setTimeout(() => {
                              window.print();
                              window.close();
                            }, 500);
                          </script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
              >
                Cetak / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}