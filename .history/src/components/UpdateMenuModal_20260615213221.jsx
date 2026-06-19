import { useState } from "react";
import { X, ClipboardList, CircleCheck, ChevronDown } from "lucide-react";

export default function UpdateMenuModal({ menu, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: menu?.name || "",
    category: menu?.category || "",
    price: menu?.price || 0,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !menu) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdate(menu.id, formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900">Update Menu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Ubah informasi menu yang sudah ada.
        </p>

        {/* Info Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2.5 mb-6">
          <ClipboardList className="w-5 h-5 text-green-600" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-green-700 text-sm font-medium">ID Menu: {menu.id}</span>
            <div className="w-px h-3.5 bg-green-300"></div>
            <span className="text-green-700 text-sm font-medium">Status: {menu.status}</span>
          </div>
        </div>

        {/* Nama Menu */}
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium mb-2 block">Nama Menu</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Kategori & Harga */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="text-gray-700 text-sm font-medium mb-2 block">Kategori</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-red-500 rounded-lg px-3.5 py-2.5 text-gray-500 text-sm bg-white appearance-none focus:outline-none"
              >
                <option value="">Pilih Kategori</option>
                <option value="MAKANAN">Makanan</option>
                <option value="MINUMAN">Minuman</option>
                <option value="SNACK">Snack</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-gray-700 text-sm font-medium mb-2 block">Harga (Rp)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-green-600 rounded-lg px-3.5 py-2.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 text-gray-700 text-sm font-medium hover:bg-gray-100 rounded-lg transition">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <CircleCheck className="w-4 h-4" />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}