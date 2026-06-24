import { useState } from "react";
import { X, ChevronDown, MapPin, Info, User, Shield } from "lucide-react";

export default function UpdateUserModal({ user, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    role: user?.role || "",
    branch: user?.branch || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const submitData = { ...formData };
    if (!submitData.password) {
      delete submitData.password;
    }
    
    onUpdate(user._id || user.id, submitData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Ubah Data & Peran Karyawan</h2>
          <p className="text-gray-500 text-sm">Pastikan perubahan telah sesuai dengan kebijakan operasional cabang.</p>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Content */}
        <div className="px-8 py-6">
          {/* User Info Card */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "https://placehold.co/48x48/7c9e7a/7c9e7a"}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="text-gray-900 font-bold text-base">{user.name}</div>
                <div className="text-green-600 font-semibold text-sm">{user.id}</div>
              </div>
            </div>
            <div className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
              {user.status}
            </div>
          </div>

          {/* Role & Branch */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="text-gray-700 text-xs font-medium mb-2 block">Peran Saat Ini</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Pilih Peran</option>
                  <option value="Kasir">Kasir</option>
                  <option value="Admin">Admin</option>
                  <option value="Kitchen">Kitchen</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-gray-700 text-xs font-medium mb-2 block">Lokasi Cabang</label>
              <div className="relative">
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-gray-700 text-xs font-medium mb-2 block">Ubah Kata Sandi (Kosongkan jika tidak ingin diubah)</label>
            <div className="relative">
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan kata sandi baru"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Warning Info */}
          <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-xs">
              Perubahan peran akan langsung mempengaruhi hak akses sistem aplikasi di perangkat kasir cabang terpilih.
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Buttons */}
        <div className="flex justify-end gap-4 px-8 py-5">
          <button onClick={onClose} className="text-green-600 text-sm font-semibold hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}