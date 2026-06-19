import { useState } from "react";
import { X, ClipboardList, CircleCheck } from "lucide-react";

export default function UpdateStockModal({ item, isOpen, onClose, onUpdate }) {
  const [newStock, setNewStock] = useState(item?.stock || 0);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async () => {
    setLoading(true);
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdate(item.id, newStock, note);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold text-gray-900">Update Manual Stok Bahan</h2>
            <p className="text-gray-500 text-sm max-w-md">
              Masukkan jumlah stok fisik terbaru hasil opname gudang untuk memperbarui data sistem.
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
            <X className="w-4.5 h-4.5 text-gray-500" />
          </button>
        </div>

        {/* Item Info Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2.5">
          <ClipboardList className="w-5 h-5 text-green-600" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-green-700 text-sm font-medium">Item: {item.name} (SKU: {item.id})</span>
            <div className="w-px h-3.5 bg-green-300"></div>
            <span className="text-green-700 text-sm font-medium">Kategori: {item.category}</span>
          </div>
        </div>

        {/* Stock Inputs */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-gray-700 text-sm font-medium">Stok Sistem Saat Ini</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-500 text-sm">
              {item.stock} {item.unit}
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-gray-700 text-sm font-medium">Jumlah Stok Fisik Baru</label>
            <div className="flex items-center justify-between border border-green-600 rounded-lg px-3.5 py-2.5 bg-white">
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full text-gray-400 text-sm bg-transparent border-none focus:outline-none"
                placeholder="0"
              />
              <span className="text-gray-500 text-sm ml-2">{item.unit}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label className="text-gray-700 text-sm font-medium">Catatan / Alasan Perubahan</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Penyesuaian stock opname mingguan, barang menyusut, atau rusak..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-400 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-1">
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