import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, QrCode, Landmark, DollarSign, Download, Check, X } from "lucide-react";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalAmount = 45000, orderId = "ORD-001", customerName = "Tintin", tableNumber = "07" } = location.state || {};
  
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCashInstructionModal, setShowCashInstructionModal] = useState(false);

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

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Pilih metode pembayaran terlebih dahulu!");
      return;
    }
    
    if (selectedMethod === "cash") {
      // Tampilkan modal instruksi tunai
      setShowCashInstructionModal(true);
    } else {
      // Untuk QRIS/Transfer, langsung sukses
      setShowSuccessModal(true);
    }
  };

  const closeCashModal = () => {
    setShowCashInstructionModal(false);
    // Redirect ke halaman status pesanan
    navigate("/order-status", { 
      state: { 
        orderId: `D9-${Math.floor(Math.random() * 100000)}`,
        tableNumber: tableNumber,
        totalAmount: totalAmount,
        totalItems: 2,
        customerName: customerName
      } 
    });
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/order-status", { 
      state: { 
        orderId: `D9-${Math.floor(Math.random() * 100000)}`,
        tableNumber: tableNumber,
        totalAmount: totalAmount,
        totalItems: 2,
        customerName: customerName
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
        <span className="text-red-500 text-sm font-medium">
          Selesaikan dalam {formatTime(timeLeft)}
        </span>
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

          {selectedMethod === "qris" && (
            <div className="mt-4 flex flex-col items-center">
              <div className="bg-gray-100 rounded-xl py-5 px-5">
                <img src="https://placehold.co/180x180/2d2d2d/2d2d2d" alt="QR Code" className="w-[180px] h-[180px] rounded" />
              </div>
              <div className="text-center mt-3">
                <p className="text-gray-500 text-xs">Total Pembayaran</p>
                <p className="text-green-500 text-2xl font-bold">Rp {totalAmount.toLocaleString()}</p>
              </div>
              <button className="mt-3 w-full bg-red-500 text-white text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Unduh QR Code
              </button>
            </div>
          )}
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
              <Cash className="w-5.5 h-5.5 text-gray-500" />
            </div>
            <span className="text-gray-900 font-medium text-sm">Tunai/Debit</span>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="px-4 mt-4">
        <button
          onClick={handlePayment}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Konfirmasi Pembayaran
        </button>
      </div>

      {/* MODAL INSTRUKSI TUNAI */}
      {showCashInstructionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 flex flex-col items-center">
            <div className="w-18 h-18 rounded-full bg-red-500 flex items-center justify-center mb-5">
              <Cash className="w-9 h-9 text-white" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-3 text-center">Instruksi Pembayaran Tunai</h3>
            <p className="text-gray-500 text-sm text-center mb-7">
              Pesanan Anda telah disimpan. Silakan menuju ke Kasir dan tunjukkan nomor meja Anda 
              <span className="text-gray-900 font-semibold"> (Meja {tableNumber})</span> 
              untuk menyelesaikan pembayaran tunai. Setelah kasir mengonfirmasi, pesanan akan langsung otomatis dimasak oleh dapur.
            </p>
            <button
              onClick={closeCashModal}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-xl transition mb-3"
            >
              Saya Mengerti
            </button>
            <button
              onClick={() => setShowCashInstructionModal(false)}
              className="text-gray-500 text-sm font-medium"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* MODAL SUKSES (untuk QRIS/Transfer) */}
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
              <div className="flex justify-between py-2"><span className="text-gray-500 text-sm">Nama Pemesan</span><span className="text-gray-900 text-sm font-medium">{customerName}</span></div>
              <div className="flex justify-between py-2"><span className="text-gray-500 text-sm">Metode Pembayaran</span><span className="text-gray-900 text-sm font-medium">{selectedMethod === "qris" ? "QRIS / M-Banking" : "Transfer Virtual Account"}</span></div>
              <div className="w-full h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between py-2"><span className="text-gray-500 text-sm">Nomor Meja</span><span className="text-red-500 text-sm font-medium">Meja {tableNumber}</span></div>
              <div className="w-full h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between py-2"><span className="text-gray-500 text-sm">Total Bayar</span><span className="text-green-600 text-sm font-semibold">Rp {totalAmount.toLocaleString()}</span></div>
            </div>
            <p className="text-gray-500 text-xs text-center mb-5">Pesanan Anda telah otomatis diteruskan ke bagian dapur. Mohon tunggu sejenak di meja Anda, makanan sedang disiapkan!</p>
            <button onClick={closeSuccessModal} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}