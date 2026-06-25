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

export default function CashierDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
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

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 10000); // Refresh setiap 10 detik tanpa loading
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.getOrders();
      console.log("Orders from API:", response);
      // Sesuaikan dengan response format backend
      const ordersData = response.data || response;
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
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const confirmOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8000/cashier/order/${orderId}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (result.success) {
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
          toast.success(`Pembayaran berhasil!\nKembalian: Rp ${response.data?.change?.toLocaleString() || (finalAmount - selectedOrder.totalAmount).toLocaleString()}`);
        } else {
          toast.success(`Pembayaran Debit berhasil dikonfirmasi!`);
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
    const response = await api.getReceipt(orderId);
    // const result = await res.json();  // ← HAPUS INI
    // ✅ PAKE response LANGSUNG (karena api.getReceipt udah return JSON)
    if (response.success) {
      setReceiptData(response.data);
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
    if (status === "paid") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">LUNAS</span>;
    if (status === "confirmed") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">DIKONFIRMASI</span>;
    if (status === "cooking") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">DIMASAK</span>;
    if (status === "done" || status === "completed") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">SELESAI</span>;
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">PENDING</span>;
  };

  const stats = {
    total: currentOrders.length,
    pending: currentOrders.filter(o => o.status === "pending").length,
    confirmed: currentOrders.filter(o => o.status === "confirmed").length,
    paid: currentOrders.filter(o => ["paid", "cooking", "completed", "done"].includes(o.status)).length
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
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          </div>
          <p className="text-[#CBFFC2] text-sm mt-1">Cashier Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setActiveTab("transaksi")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full transition ${activeTab === "transaksi" ? "bg-[#FEB64C] text-[#704800]" : "text-white hover:bg-white/10"}`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Transaksi</span>
          </button>
          <button 
            onClick={() => setActiveTab("riwayat")}
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
      <main className="ml-64 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">{activeTab === "transaksi" ? "Transaksi" : "Riwayat Transaksi"}</h1>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
            <HelpCircle className="w-5 h-5 text-gray-500 cursor-pointer" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-gray-900 text-sm font-semibold">{currentUser?.fullName || currentUser?.username || "Loading..."}</div>
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
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{order.orderId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Meja {order.tableNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.customerName}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Rp {order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Tombol Bayar hanya muncul jika belum dibayar (pending/confirmed) */}
                          {(order.status === "pending" || order.status === "confirmed") && (
                            <button
                              onClick={() => openPaymentModal(order)}
                              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                              title="Proses Pembayaran"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              Bayar
                            </button>
                          )}
                          
                          {/* Tombol Cetak / Cetak Ulang selalu muncul */}
                          <button 
                            onClick={() => printReceipt(order.orderId)} 
                            className={`px-3 py-1.5 rounded-lg ${order.isPrinted ? "bg-gray-600 hover:bg-gray-700" : "bg-purple-600 hover:bg-purple-700"} text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm`} 
                            title={order.isPrinted ? "Cetak Ulang Struk" : "Cetak Struk"}
                          >
                            <Printer className="w-3.5 h-3.5" />
                            {order.isPrinted ? "Cetak Ulang" : "Cetak Struk"}
                          </button>
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
            <div id="receipt-content" className="p-6 bg-white text-gray-900 text-sm font-mono">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Singkong Keju D9</h2>
                <p className="text-xs text-gray-500">Jl. Argowiyoto No.8A, Ledok, Kec. Argomulyo, Kota Salatiga, Jawa Tengah 50732</p>
                <div className="border-b border-dashed border-gray-300 my-4"></div>
              </div>

              <div className="mb-4">
                <p>No: {receiptData.receiptId}</p>
                <p>Tgl: {new Date(receiptData.paymentDate).toLocaleString()}</p>
                <p>Meja: {receiptData.tableNumber}</p>
                <p>Pelanggan: {receiptData.customerName}</p>
              </div>

              <div className="border-b border-dashed border-gray-300 my-4"></div>

              <div className="space-y-2 mb-4">
                {receiptData.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.menuName}</span>
                    <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-gray-300 my-4"></div>

              <div className="space-y-1 mb-6">
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>Rp {receiptData.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>DIBAYAR</span>
                  <span>Rp {receiptData.amountPaid?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>KEMBALI</span>
                  <span>Rp {receiptData.change?.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>Terima Kasih Atas Kunjungan Anda!</p>
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
      fetchOrders(false); // update the list
    } catch (e) {
      console.error("Gagal update status isPrinted", e);
    }
  }
  setShowReceipt(false);
  const content = document.getElementById("receipt-content").innerHTML;
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Cetak Struk - ${receiptData.receiptId}</title>
        <style>
          body { font-family: monospace; padding: 20px; color: #000; }
          .text-center { text-align: center; }
          .mb-6 { margin-bottom: 24px; }
          .mb-4 { margin-bottom: 16px; }
          .my-4 { margin-top: 16px; margin-bottom: 16px; }
          .border-b { border-bottom: 1px dashed #ccc; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .font-bold { font-weight: bold; }
          .space-y-1 > * + * { margin-top: 4px; }
          .space-y-2 > * + * { margin-top: 8px; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
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