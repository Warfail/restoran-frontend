import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Table, ArrowRight } from "lucide-react";

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Masukkan nama Anda!");
      return;
    }
    if (!tableNumber.trim()) {
      alert("Masukkan nomor meja!");
      return;
    }

    sessionStorage.setItem("customerName", name);
    sessionStorage.setItem("tableNumber", tableNumber);

    navigate(`/menu?table=${tableNumber}&name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-gray-900 font-bold text-xl text-center">
            Singkong Keju D9
          </h1>
          <p className="text-gray-500 text-sm text-center mt-1">
            Silakan isi data diri Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Anda
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Masukkan nama..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Nomor Meja */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Meja
            </label>
            <div className="relative">
              <Table className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Masukkan nomor meja..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            Lihat Menu
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Silakan isi nama dan nomor meja untuk mulai memesan.
        </p>
      </div>
    </div>
  );
}