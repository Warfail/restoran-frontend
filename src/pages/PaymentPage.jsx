import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, QrCode, Landmark, DollarSign } from "lucide-react";
import { api } from "../services/api";

// Pastikan gambar QRIS disimpan di src/assets/qris.jpeg
import qrisImg from "../assets/qris.jpeg"; 

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount, customerName, tableNumber, items } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Timer countdown
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

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Pilih metode pembayaran terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      if (selectedMethod === "qris") {
        const payload = {
          orderId,
          totalAmount,
          customerName,
          customerEmail: `${(customerName || 'guest').replace(/\s+/g, '').toLowerCase()}@restorand9.com`
        };
        const res = await api.createMidtransTransaction(payload);
        if (res.success && res.token) {
          window.snap.pay(res.token, {
            onSuccess: function(result) {
              console.log("Midtrans success:", result);
              setShowInstructionModal(true);
            },
            onPending: function(result) {
              console.log("Midtrans pending:", result);
              toast.error("Pembayaran masih tertunda.");
            },
            onError: function(result) {
              console.error("Midtrans error:", result);
              toast.error("Pembayaran gagal!");
            },
            onClose: function() {
              toast.error("Anda menutup popup sebelum menyelesaikan pembayaran.");
            }
          });
        } else {
          toast.error(res.detail || "Gagal memuat pembayaran QRIS.");
        }
      } else {
        await api.setPaymentMethod(orderId, selectedMethod);
        setShowInstructionModal(true);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
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
        {/* QRIS */}
        <div
          onClick={() => setSelectedMethod("qris")}
          className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${
            selectedMethod === "qris" ? "border-2 border-green-500" : "border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">QRIS</p>
              <p className="text-gray-500 text-xs">Scan menggunakan e-wallet atau m-banking</p>
            </div>
          </div>
          
          {/* Show message if selected */}
          {selectedMethod === "qris" && (
            <div className="mt-4 flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">Klik tombol di bawah untuk menampilkan QRIS Anda</p>
            </div>
          )}
        </div>

        {/* Tunai */}
        <div
          onClick={() => setSelectedMethod("cash")}
          className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${
            selectedMethod === "cash" ? "border-2 border-green-500" : "border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5.5 h-5.5 text-gray-500" />
            </div>
            <span className="text-gray-900 font-medium text-sm">Tunai Kasir</span>
          </div>
        </div>

        {/* Debit */}
        <div
          onClick={() => setSelectedMethod("debit")}
          className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${
            selectedMethod === "debit" ? "border-2 border-green-500" : "border border-gray-200"
          }`}
        >
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
          {loading ? "Memproses..." : selectedMethod === "qris" ? "Tampilkan QRIS" : "Konfirmasi Pembayaran"}
        </button>
      </div>

      {/* MODAL INSTRUKSI */}
      {showInstructionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-5">
              {selectedMethod === "qris" ? (
                <QrCode className="w-8 h-8 text-white" />
              ) : selectedMethod === "debit" ? (
                <Landmark className="w-8 h-8 text-white" />
              ) : (
                <DollarSign className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-3 text-center">
              {selectedMethod === "qris" ? "Pembayaran Berhasil!" : `Instruksi Pembayaran ${selectedMethod === "debit" ? "Debit" : "Tunai"}`}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-7">
              {selectedMethod === "qris" ? (
                <>
                  Pesanan Anda telah <b>Lunas</b> dan diteruskan ke Dapur. Kasir akan segera mencetak struk Anda untuk Meja <span className="text-gray-900 font-semibold">{tableNumber}</span>.
                </>
              ) : (
                <>
                  Pesanan Anda telah disimpan. Silakan menuju ke Kasir dan tunjukkan nomor meja Anda
                  <span className="text-gray-900 font-semibold"> (Meja {tableNumber})</span>
                  {" "}untuk menyelesaikan pembayaran. Setelah kasir mengonfirmasi, pesanan akan otomatis dimasak oleh dapur.
                </>
              )}
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