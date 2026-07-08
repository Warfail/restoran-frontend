import { AlertTriangle } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hapus Item?</h2>
          <p className="text-gray-500 text-sm">
            Anda yakin ingin menghapus <span className="font-semibold text-gray-800">"{itemName}"</span>? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
