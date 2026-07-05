import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  LogOut, RefreshCw, CheckCircle, Clock, AlertCircle, 
  Printer, Search, Eye 
} from "lucide-react";

export default function CashierDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔥 FETCH ORDERS + AUTO-REFRESH
  const fetchOrders = async () => {
    try {
      const response = await api.getOrders();
      const ordersData = response?.data || response || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Gagal memuat data pesanan");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AUTO-REFRESH SETIAP 10 DETIK
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      console.log("🔄 Auto-refresh kasir...");
      fetchOrders();
    }, 10000); // 10 detik

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const handleConfirmPayment = async (orderId) => {
    setProcessing(true);
    try {
      const response = await api.confirmOrder(orderId);
      if (response.success) {
        toast.success(`✅ Pesanan ${orderId} telah dibayar!`);
        await fetchOrders();
      } else {
        toast.error("Gagal konfirmasi pembayaran");
      }
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintReceipt = async (orderId) => {
    try {
      const response = await api.getReceipt(orderId);
      const receiptData = response.data || response;
      
      // 🔥 PRINT RECEIPT (SIMPLE)
      const printWindow = window.open("", "_blank", "width=400,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Struk Pesanan</title>
              <style>
                body { font-family: monospace; padding: 20px; max-width: 300px; margin: auto; }
                .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                .item { display: flex; justify-content: space-between; padding: 5px 0; }
                .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>Singkong Keju D9</h2>
                <p>${orderId}</p>
                <p>${new Date().toLocaleString()}</p>
              </div>
              ${receiptData.items?.map(item => `
                <div class="item">
                  <span>${item.name} x${item.quantity}</span>
                  <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              `).join('')}
              <div class="total">
                <div class="item">
                  <span>Total</span>
                  <span>Rp ${receiptData.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
              <div class="footer">
                Terima kasih telah berkunjung! 😊
              </div>
              <script>
                setTimeout(() => { window.print(); }, 500);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error("Failed to print receipt:", error);
      toast.error("Gagal mencetak struk");
    }
  };

  const getStatusBadge = (order) => {
    const status = order.status || order.payment_status || "pending";
    
    if (status === "paid" || status === "settlement" || status === "completed") {
      return (
        <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold">
          <CheckCircle className="w-3.5 h-3.5" />
          LUNAS
        </span>
      );
    } else if (status === "cooking") {
      return (
        <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          DIMASAK
        </span>
      );
    } else if (status === "pending") {
      return (
        <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          PENDING
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          {status}
        </span>
      );
    }
  };

  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    return (
      order.orderId?.toLowerCase().includes(search) ||
      order.customerName?.toLowerCase().includes(search) ||
      order.tableNumber?.toString().includes(search)
    );
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending" || o.payment_status === "pending").length,
    paid: orders.filter(o => o.status === "paid" || o.payment_status === "paid" || o.status === "settlement").length,
    cooking: orders.filter(o => o.status === "cooking").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data kasir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-red-600">💳 Kasir D9</h1>
          <p className="text-sm text-gray-500">Manajemen pesanan & pembayaran</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Total Order</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Lunas</p>
          <p className="text-2xl font-bold text-green-500">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Dimasak</p>
          <p className="text-2xl font-bold text-blue-500">{stats.cooking}</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-6 max-w-7xl mx-auto mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari order ID, customer, atau meja..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE ORDERS */}
      <div className="px-6 pb-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID Order</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Meja</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Belum ada pesanan
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.orderId || order._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm font-medium">{order.orderId}</td>
                    <td className="px-6 py-4 text-sm">Meja {order.tableNumber}</td>
                    <td className="px-6 py-4 text-sm">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">
                      Rp {order.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleConfirmPayment(order.orderId)}
                            disabled={processing}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                          >
                            💰 Bayar
                          </button>
                        )}
                        {(order.status === "paid" || order.status === "settlement") && (
                          <button
                            onClick={() => handlePrintReceipt(order.orderId)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                        >
                          <Eye className="w-4 h-4" />
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
  );
}