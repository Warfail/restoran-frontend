import toast from "react-hot-toast";
import SettingsModal from "../components/SettingsModal";
import MobileHeader from "../components/admin/MobileHeader";
import Sidebar from "../components/admin/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  UserPlus,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  LayoutDashboard,
  Utensils,
  Package,
  Users,
  BarChart3
} from "lucide-react";

export default function UserManagementPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: ""
  });

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Pilih role terlebih dahulu!");
      return;
    }
    if (!formData.username || !formData.password) {
      toast("Username dan Password wajib diisi!");
      return;
    }
    
    try {
      const payload = {
        ...formData,
        role: selectedRole,
        isActive
      };
      const response = await api.createUser(payload);
      if (response.success || response.userId) {
        toast.success("Karyawan berhasil ditambahkan!");
        navigate("/users");
      } else {
        toast.error("Gagal menambahkan karyawan: " + (response.detail || "Kesalahan server"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan: " + err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar active="users" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <MobileHeader title="Manajemen Pengguna" onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="hidden md:flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
            <h1 className="text-xl font-bold text-green-600">Manajemen Pengguna</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer relative">
                  <Bell className="w-4.5 h-4.5 text-gray-600" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
                  <HelpCircle className="w-4.5 h-4.5 text-gray-600" />
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-gray-900 text-sm font-semibold">{currentUser?.fullName || currentUser?.username || ""}</div>
                  <div className="text-gray-500 text-xs font-medium">{currentUser?.role?.toUpperCase() || "ROLE"}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm border border-gray-200">
                  {currentUser?.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (currentUser?.fullName || currentUser?.username || "U").charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Form Content */}
        <div className="p-8">
          {/* Back Button & Title */}
          <div className="flex items-center gap-3 mb-2">
            <div onClick={() => navigate("/users")} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200">
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Karyawan Baru</h1>
          </div>
          <p className="text-gray-500 text-sm mb-6 ml-11">Daftarkan personel baru untuk operasional Singkong Keju D9.</p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Personal Info */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-gray-700" />
                <h3 className="text-gray-900 font-semibold text-base">Informasi Pribadi</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1.5 block">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1.5 block">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Masukkan username untuk login"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1.5 block">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1.5 block">Alamat Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="contoh@d9.com"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1.5 block">Nomor Telepon</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0812xxxx"
                    className="w-full md:w-64 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Role & Access */}
            <div className="flex-1 flex flex-col gap-5">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <ShieldCheck className="w-5 h-5 text-gray-700" />
                  <h3 className="text-gray-900 font-semibold text-base">Peran & Akses</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-1.5 block">Pilih Jabatan (Role)</label>
                    <div className="relative">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-500 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="" disabled selected>Pilih Role</option>
                        <option value="admin">Admin</option>
                        <option value="kasir">Kasir</option>
                        <option value="kitchen">Kitchen</option>
                      </select>
                      <i className="ti ti-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-1.5 block">Penempatan Cabang</label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="salatiga" selected>Salatiga Utama</option>
                        <option value="semarang">Semarang</option>
                      </select>
                      <i className="ti ti-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3.5 border border-gray-200">
                    <div>
                      <div className="text-gray-900 text-sm font-medium">Status Akun</div>
                      <div className="text-gray-400 text-xs">Aktifkan akses login segera setelah pendaftaran</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${isActive ? 'bg-green-600' : 'bg-gray-300'}`}
                        onClick={() => setIsActive(!isActive)}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${isActive ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                      <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        {isActive ? 'AVAILABLE' : 'DISABLED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => navigate("/users")} className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium bg-white hover:bg-gray-50 transition">
              Batal
            </button>
            <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 bg-[#c0392b] rounded-lg text-white text-sm font-medium hover:bg-red-700 transition">
              <UserPlus className="w-4 h-4" />
              <span>Tambah Karyawan</span>
            </button>
          </div>

          {/* Footer Quote */}
          <div className="text-center text-gray-400 text-xs mt-8">
            "SDM yang unggul adalah kunci kualitas Singkong Keju D9 yang legendaris."
          </div>
        </div>
        </main>
      </div>
    
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}