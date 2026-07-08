import { useState } from "react";
import { X, ChevronDown, MapPin, Info, User, Shield } from "lucide-react";

export default function UpdateUserModal({ user, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullName: user?.fullName || user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    branch: user?.branch || "",
    password: "",
    isActive: user?.isActive !== false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 shrink-0 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Ubah Data Karyawan</h2>
          <p className="text-gray-500 text-[11px]">Pastikan perubahan telah sesuai dengan kebijakan.</p>
        </div>

        {/* Content (Scrollable) */}
        <div className="px-5 py-4 overflow-y-auto">
          {/* User Info Card */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "https://placehold.co/48x48/7c9e7a/7c9e7a"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-gray-900 font-bold text-sm">{user.name}</div>
                <div className="text-green-600 font-semibold text-xs">{user.id}</div>
              </div>
            </div>
            <div className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
              {user.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-gray-700 text-xs font-medium mb-1 block">Nama Lengkap</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-gray-700 text-xs font-medium mb-1 block">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-2">
              <label className="text-gray-700 text-xs font-medium mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@d9.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-gray-700 text-xs font-medium mb-1 block">Peran</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-xs bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Pilih Peran</option>
                  <option value="Kasir">Kasir</option>
                  <option value="Admin">Admin</option>
                  <option value="Kitchen">Kitchen</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-gray-700 text-xs font-medium mb-1 block">Cabang</label>
              <div className="relative">
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-gray-700 text-xs font-medium mb-1 block">Ubah Kata Sandi (Kosongkan jika tidak)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Kata sandi baru"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-gray-800 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          {/* Status Akun */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 mb-4 border border-gray-200">
            <div>
              <div className="text-gray-900 text-sm font-medium">Status Akun</div>
              <div className="text-gray-400 text-xs">Akses login ke sistem</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${formData.isActive ? 'bg-green-600' : 'bg-gray-300'}`}
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${formData.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {formData.isActive ? 'AKTIF' : 'NONAKTIF'}
              </span>
            </div>
          </div>

          {/* Warning Info */}
          <div className="flex gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mt-2">
            <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-[10px] leading-tight">
              Perubahan peran akan langsung mempengaruhi hak akses sistem aplikasi di perangkat kasir cabang terpilih.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 px-5 py-3 bg-gray-50 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="text-gray-600 text-xs font-semibold hover:bg-gray-200 px-4 py-2 rounded-lg transition border border-gray-300 bg-white">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}