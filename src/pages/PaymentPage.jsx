import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, QrCode, Landmark, DollarSign, Smartphone } from "lucide-react";
import { api } from "../services/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount, customerName, tableNumber, items } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);
  const snapLoadedRef = useRef(false);

  // 🔥 LOAD SNAP.JS (PRELOAD)
  useEffect(() => {
    if (!window.snap && !snapLoadedRef.current) {
      snapLoadedRef.current = true;
      
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
      script.async = true;
      script.onload = () => {
        console.log("✅ Snap.js preloaded");
        setSnapLoaded(true);
      };
      script.onerror = () => {
        console.error("❌ Failed to load Snap.js");
        toast.error("Gagal memuat payment gateway. Silakan refresh.");
      };
      document.body.appendChild(script);
    } else if (window.snap) {
      setSnapLoaded(true);
    }
  }, []);

  // 🔥 TIMER COUNTDOWN
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 🔥 HANDLE PAYMENT
  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Pilih metode pembayaran terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      if (selectedMethod === "cash" || selectedMethod === "debit") {
        await api.setPaymentMethod(orderId, selectedMethod);
        setShowInstructionModal(true);
        setLoading(false);
        return;
      }

      // 🔥 DIGITAL PAYMENT (GoPay / QRIS / Transfer)
      await api.setPaymentMethod(orderId, selectedMethod); // Save method first
      const response = await api.createMidtransTransaction({
        orderId: orderId,
        totalAmount: totalAmount,
        customerName: customerName,
        customerEmail: "customer@example.com",
        items: items || [],
      });

      console.log("Midtrans response:", response);

      if (!response.success || !response.token) {
        toast.error("Gagal membuat transaksi pembayaran.");
        setLoading(false);
        return;
      }

      if (!snapLoaded || !window.snap) {
        toast.error("Payment gateway belum siap. Silakan refresh halaman.");
        setLoading(false);
        return;
      }

      // 🔥 BAYAR PAKE SNAP
      window.snap.pay(response.token, {
        onSuccess: async function (result) {
          console.log("✅ Payment success:", result);
          
          try {
            await api.syncLocalPaymentSuccess(orderId);
            console.log("✅ Local success called");
          } catch(err) {
            console.error("❌ Local success failed:", err);
          }
          
          // 🔥 LANGSUNG NAVIGASI
          navigate("/payment-success", {
            state: {
              orderId: result.order_id || orderId,
              totalAmount: result.gross_amount || totalAmount,
              customerName: customerName,
              tableNumber: tableNumber,
              paymentMethod: selectedMethod === "gopay" ? "GoPay" : 
                            selectedMethod === "qris" ? "QRIS" : "Transfer Bank",
              transactionStatus: result.transaction_status,
            }
          });
        },
        onPending: function (result) {
          console.log("⏳ Payment pending:", result);
          toast.info("⏳ Menunggu pembayaran...");
          navigate(`/order-status?orderId=${result.order_id || orderId}`);
        },
        onError: function (result) {
          console.error("❌ Payment error:", result);
          toast.error("❌ Pembayaran gagal.");
          setLoading(false);
        },
        onClose: function () {
          console.log("Payment popup closed");
          toast.info("Pembayaran dibatalkan.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      // 🔥 JANGAN SET LOADING FALSE DI SINI (SUDAH DI HANDLE DI ATAS)
    }
  };

  const closeModal = () => {
    setShowInstructionModal(false);
    navigate(`/order-status?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Pilih Metode Pembayaran</h1>
      </div>

      {/* Timer */}
      <div className="bg-red-50 py-2.5 px-4 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 text-red-500" />
        <span className="text-red-500 text-sm font-medium">Selesaikan dalam {formatTime(timeLeft)}</span>
      </div>

      {/* Info Order */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Order ID</span>
          <span className="text-gray-900 font-mono text-sm font-semibold">{orderId}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500 text-sm">Total Pembayaran</span>
          <span className="text-green-600 font-bold text-lg">Rp {totalAmount?.toLocaleString() || 0}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500 text-sm">Meja</span>
          <span className="text-red-500 font-semibold text-sm">Meja {tableNumber}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-4 space-y-3">
        <div onClick={() => setSelectedMethod("gopay")} className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${selectedMethod === "gopay" ? "border-2 border-green-500" : "border border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">GoPay</p>
              <p className="text-gray-500 text-xs">Bayar pake GoPay</p>
            </div>
          </div>
        </div>

        <div onClick={() => setSelectedMethod("qris")} className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${selectedMethod === "qris" ? "border-2 border-green-500" : "border border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">QRIS</p>
              <p className="text-gray-500 text-xs">Scan menggunakan e-wallet atau m-banking</p>
            </div>
          </div>
        </div>

        <div onClick={() => setSelectedMethod("transfer")} className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${selectedMethod === "transfer" ? "border-2 border-green-500" : "border border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Landmark className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">Transfer Virtual Account</p>
              <p className="text-gray-500 text-xs">BCA, BNI, BRI, Permata</p>
            </div>
          </div>
        </div>

        <div onClick={() => setSelectedMethod("cash")} className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${selectedMethod === "cash" ? "border-2 border-green-500" : "border border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5.5 h-5.5 text-gray-500" />
            </div>
            <span className="text-gray-900 font-medium text-sm">Tunai Kasir</span>
          </div>
        </div>

        <div onClick={() => setSelectedMethod("debit")} className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${selectedMethod === "debit" ? "border-2 border-green-500" : "border border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Landmark className="w-5.5 h-5.5 text-gray-500" />
            </div>
            <span className="text-gray-900 font-medium text-sm">Debit Kasir (EDC)</span>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="px-4 mt-4">
        <button
          onClick={handlePayment}
          disabled={loading || !selectedMethod}
          className={`w-full font-semibold py-3 rounded-lg transition ${
            selectedMethod && !loading
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Memproses..." : "Konfirmasi Pembayaran"}
        </button>
      </div>

      {/* MODAL INSTRUKSI */}
      {showInstructionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-5">
              {selectedMethod === "debit" ? (
                <Landmark className="w-8 h-8 text-white" />
              ) : (
                <DollarSign className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-3 text-center">
              {selectedMethod === "debit" ? "Instruksi Pembayaran Debit" : "Instruksi Pembayaran Tunai"}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-7">
              Pesanan Anda telah disimpan. Silakan menuju ke Kasir dan tunjukkan nomor meja Anda
              <span className="text-gray-900 font-semibold"> (Meja {tableNumber})</span>
              {" "}untuk menyelesaikan pembayaran. Setelah kasir mengonfirmasi, pesanan akan otomatis dimasak oleh dapur.
            </p>
            <button
              onClick={closeModal}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-xl transition mb-3"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}