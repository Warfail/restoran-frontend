import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Armchair, ShoppingBag, X } from "lucide-react";

export default function CustomerLandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "5";
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("");

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setOrderType(method === "dinein" ? "Makan di Tempat" : "Take Away");
    setShowNameModal(true);
  };

  const handleConfirm = () => {
    if (!customerName.trim()) {
      toast.error("Masukkan nama Anda terlebih dahulu");
      return;
    }
    // Simpan ke session/local storage
    sessionStorage.setItem("customerName", customerName);
    sessionStorage.setItem("orderType", orderType);
    sessionStorage.setItem("tableNumber", tableNumber);
    
    // Redirect ke halaman menu
    navigate(`/menu?table=${tableNumber}&name=${encodeURIComponent(customerName)}&type=${orderType}`);
  };

  return (
    <div className="min-h-screen bg-amber-50/30 flex flex-col items-center justify-start relative">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('https://placehold.co/402x874/f0ebe4/f0ebe4')] bg-cover bg-center opacity-40"></div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pt-16 pb-8 flex flex-col items-center min-h-screen">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
            <div className="w-17 h-17 rounded-full border-3 border-red-600 flex items-center justify-center overflow-hidden">
              <img src="/logo.PNG" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-gray-900 font-bold text-xl leading-tight">
              Selamat Datang di<br />Singkong Keju D9 Salatiga
            </h1>
            <p className="text-gray-500 text-sm mt-1">Silakan pilih metode penyajian pesanan Anda</p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="w-full flex flex-col gap-4 mt-2">
          {/* Dine In Option */}
          <div
            onClick={() => handleMethodSelect("dinein")}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Armchair className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-bold text-base">Makan di Tempat (Dine In)</span>
              <span className="text-gray-500 text-xs mt-0.5">Pesanan akan disajikan hangat langsung di meja Anda.</span>
            </div>
          </div>

          {/* Take Away Option */}
          <div
            onClick={() => handleMethodSelect("takeaway")}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-bold text-base">Bawa Pulang (Take Away)</span>
              <span className="text-gray-500 text-xs mt-0.5">Pesanan akan dikemas rapi dengan wadah praktis D9.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-7 flex flex-col items-center">
            <h3 className="text-gray-900 font-bold text-xl mb-5 text-center">Masukan Nama Anda</h3>
            <input
              type="text"
              placeholder="Nama"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              autoFocus
            />
            <button
              onClick={handleConfirm}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 rounded-full transition"
            >
              Confirm
            </button>
          </div>
        </div>
      )}


    </div>
  );
}