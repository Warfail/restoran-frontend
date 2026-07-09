// src/pages/PaymentMethodsPage.jsx
// BUAT FILE BARU INI

import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, Landmark, DollarSign } from "lucide-react";

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount, customerName, tableNumber, items, orderType, note } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

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

  const handleProceed = () => {
    if (!selectedMethod) {
      toast.error("Pilih metode pembayaran terlebih dahulu!");
      return;
    }

    navigate('/payment', {
      state: {
        orderId,
        totalAmount,
        customerName,
        tableNumber,
        items,
        orderType,
        note,
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
          <span className="text-gray-900 font-mono text-sm font-semibold">{orderId || "-"}</span>
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

      {/* Proceed Button */}
      <div className="px-4 mt-4">
        <button
          onClick={handleProceed}
          disabled={!selectedMethod}
          className={`w-full font-semibold py-3 rounded-lg transition ${
            selectedMethod
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selectedMethod ? "Lanjut ke Pembayaran" : "Pilih metode pembayaran"}
        </button>
      </div>
    </div>
  );
}