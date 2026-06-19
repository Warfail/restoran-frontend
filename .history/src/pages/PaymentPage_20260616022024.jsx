import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, QrCode, Landmark, DollarSign, Download, Check, X } from "lucide-react";
import { api } from "../services/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount = 45000, customerName = "Tintin", tableNumber = "07", items = [] } = location.state || {};
  
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
      const paymentData = {
        orderId,
        method: selectedMethod,
        amount: totalAmount,
        status: "success"
      };
      
      const response = await api.processCustomerPayment(paymentData);
      console.log("Payment response:", response);
      
      if (response.success) {
        if (selectedMethod === "cash") {
  // Tampilkan instruksi, jangan ubah status
  setShowCashInstructionModal(true);
} else {
  // QRIS/Transfer langsung proses payment
  const response = await api.processCustomerPayment(paymentData);
  if (response.success) {
    setShowSuccessModal(true);
  }
}
      } else {
        alert("Pembayaran gagal, silakan coba lagi");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

const closeCashModal = () => {
  setShowCashInstructionModal(false);
  // JANGAN panggil api.processPayment di sini!
  // Langsung redirect ke order status dengan status pending
  navigate("/order-status", { 
    state: { 
      orderId: orderId,
      tableNumber: tableNumber,
      totalAmount: totalAmount,
      items: items,
      customerName: customerName,
      paymentMethod: "cash",
      status: "pending"  // ← status tetap pending
    } 
  });
};

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/order-status", { 
      state: { 
        orderId,
        tableNumber,
        totalAmount,
        items,
        customerName,
        paymentMethod: selectedMethod
      } 
    });
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
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
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
            <div className="w-18 h-18 rounded-full bg-red-500 flex items-center justify-center mb-5">
              <DollarSign className="w-9 h-9 text-white" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-3 text-center">Instruksi Pembayaran Tunai</h3>
            <p className="text-gray-500 text-sm text-center mb-7">
              Pesanan Anda telah disimpan. Silakan menuju ke Kasir dan tunjukkan nomor meja Anda 
              <span className="text-gray-900 font-semibold"> (Meja {tableNumber})</span> 
              untuk menyelesaikan pembayaran tunai.
            </p>
            <button onClick={closeCashModal} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-xl transition mb-3">
              Saya Mengerti
            </button>
            <button onClick={() => setShowCashInstructionModal(false)} className="text-gray-500 text-sm font-medium">Kembali</button>
          </div>
        </div>
      )}

      {/* MODAL SUKSES */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col items-center">
            <div className="w-18 h-18 rounded-full bg-red-500 flex items-center justify-center shadow-lg mb-5">
              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-900 font-bold text-xl mb-1">Pembayaran Berhasil!</h3>
            <p className="text-gray-500 text-sm text-center mb-5">Terima kasih, dana Anda telah kami terima.</p>
            <div className="w-full bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between py-2"><span className="text-gray-500 text-sm">Order ID</span><span className="text-gray-900 font-mono text-sm">{orderId}</span></div>
              <div className="flex justify-between py-2"><span className="text-gray-500 text-sm">Metode</span><span className="text-gray-900 text-sm font-medium">{selectedMethod === "qris" ? "QRIS" : "Transfer Bank"}</span></div>
              <div className="w-full h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between py-2"><span className="text-gray-500 text-sm">Total Bayar</span><span className="text-green-600 text-sm font-semibold">Rp {totalAmount.toLocaleString()}</span></div>
            </div>
            <p className="text-gray-500 text-xs text-center mb-5">Pesanan Anda telah diteruskan ke dapur.</p>
            <button onClick={closeSuccessModal} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}