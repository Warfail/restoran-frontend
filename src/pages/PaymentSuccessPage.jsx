import { useNavigate, useLocation } from "react-router-dom";
import { Check, Receipt } from "lucide-react";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    orderId, 
    totalAmount = 45000, 
    customerName = "Tintin", 
    tableNumber = "07", 
    paymentMethod = "QRIS / M-Banking" 
  } = location.state || {};

  const handleViewStatus = () => {
    navigate(`/order-status?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-10 pb-10 px-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-[390px] flex flex-col items-center">
        {/* Success Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-500 shadow-lg shadow-red-500/30">
            <div className="flex items-center justify-center w-13 h-13 rounded-full bg-green-500">
              <Check className="w-7 h-7 text-white font-bold" />
            </div>
          </div>
          <h1 className="mt-5 text-gray-900 text-2xl font-bold text-center">
            Pembayaran Berhasil!
          </h1>
          <p className="mt-2 text-gray-500 text-sm text-center">
            Terima kasih, dana Anda telah kami terima.
          </p>
        </div>

        {/* Order Summary */}
        <div className="w-full bg-white rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex flex-row items-center justify-between py-3.5 border-b border-gray-50">
            <span className="text-gray-500 text-sm">Nama Pemesan</span>
            <span className="text-gray-900 text-sm font-medium">{customerName}</span>
          </div>
          <div className="flex flex-row items-center justify-between py-3.5 border-b border-gray-50">
            <span className="text-gray-500 text-sm">Metode Pembayaran</span>
            <span className="text-gray-900 text-sm font-medium">{paymentMethod}</span>
          </div>
          <div className="flex flex-row items-center justify-between py-3.5 border-b border-gray-50">
            <span className="text-gray-500 text-sm">Nomor Meja</span>
            <span className="text-red-500 text-sm font-semibold">Meja {tableNumber}</span>
          </div>
          <div className="flex flex-row items-center justify-between py-3.5">
            <span className="text-gray-500 text-sm">Total Bayar</span>
            <span className="text-green-500 text-sm font-semibold">Rp {totalAmount.toLocaleString()}</span>
          </div>
          <p className="mt-1 text-gray-500 text-[13px] text-center">
            Pesanan Anda telah otomatis diteruskan ke bagian dapur. Mohon tunggu sejenak di meja Anda, makanan sedang disiapkan!
          </p>
        </div>

        {/* Button */}
        <div className="w-full mt-8">
          <button
            onClick={handleViewStatus}
            className="w-full flex flex-row items-center justify-center gap-2 bg-red-500 text-white text-base font-semibold rounded-xl py-4 px-6 shadow-lg shadow-red-500/25 hover:bg-red-600 transition"
          >
            <span>Pantau Status Pesanan</span>
            <Receipt className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}