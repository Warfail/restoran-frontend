import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, QrCode, Landmark, DollarSign, Check } from "lucide-react";
import { api } from "../services/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount, customerName, tableNumber, items } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);
  const [showCashInstructionModal, setShowCashInstructionModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      alert("Pilih metode pembayaran terlebih dahulu!");
      return;
    }
    
    setLoading(true);
    try {
      if (selectedMethod === "cash") {
        // Tampilkan instruksi tunai
        setShowCashInstructionModal(true);
      } else {
        // QRIS atau Transfer - panggil API
        const paymentData = {
          orderId: orderId,
          method: selectedMethod,
          amount: totalAmount,
          status: "success"
        };
        
        const response = await api.processCustomerPayment(paymentData);
        console.log("Payment response:", response);
        
        if (response.success) {
          // Navigasi ke Payment Success Page
          navigate("/payment-success", {
            state: {
              orderId: orderId,
              totalAmount: totalAmount,
              customerName: customerName,
              tableNumber: tableNumber,
              paymentMethod: selectedMethod === "qris" ? "QRIS" : "Transfer Bank"
            }
          });
        } else {
          alert("Pembayaran gagal. Silakan coba lagi.");
        }
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const closeCashModal = () => {
    setShowCashInstructionModal(false);
    // Untuk tunai, langsung ke order status (pending)
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
          <span className="text-green-600 font-bold text-lg">Rp {totalAmount.toLocaleString()}</span>
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">QRIS</p>
                <p className="text-gray-500 text-xs">(Verifikasi Otomatis)</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-5 bg-blue-900 rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">BCA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Virtual Account */}
        <div
          onClick={() => setSelectedMethod("transfer")}
          className={`bg-white rounded-xl p-4 transition-all cursor-pointer ${
            selectedMethod === "transfer" ? "border-2 border-green-500" : "border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Landmark className="w-5.5 h-5.5 text-gray-500" />
            </div>
            <div className="flex-1 flex justify-between items-center">
              <span className="text-gray-900 font-medium text-sm">Transfer Virtual Account</span>
              <div className="w-9 h-5.5 bg-blue-900 rounded flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">BCA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tunai/Debit */}
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
            <span className="text-gray-900 font-medium text-sm">Tunai/Debit</span>
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

      {/* MODAL INSTRUKSI TUNAI */}
      {showCashInstructionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-5">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-3 text-center">Instruksi Pembayaran Tunai</h3>
            <p className="text-gray-500 text-sm text-center mb-7">
              Pesanan Anda telah disimpan. Silakan menuju ke Kasir dan tunjukkan nomor meja Anda 
              <span className="text-gray-900 font-semibold"> (Meja {tableNumber})</span> 
              untuk menyelesaikan pembayaran tunai. Setelah kasir mengonfirmasi, pesanan akan langsung otomatis dimasak oleh dapur.
            </p>
            <button onClick={closeCashModal} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-xl transition mb-3">
              Saya Mengerti
            </button>
            <button onClick={() => setShowCashInstructionModal(false)} className="text-gray-500 text-sm font-medium">
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}