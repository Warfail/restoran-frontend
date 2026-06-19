import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell,
  HelpCircle,
  ArrowLeft,
  User,
  ShieldCheck,
  Lock,
  UserPlus,
  Settings,
  LogOut,
  LayoutDashboard,
  Utensils,
  Package,
  Users,
  BarChart3
} from "lucide-react";

export default function UserManagementPage() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState({
    admin: false,
    kitchen: false,
    kasir: false,
    settings: false
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handlePermissionChange = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar - SAMA PERSIS DENGAN DASHBOARD */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1 font-koulen">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button
  onClick={() => navigate("/admin")}
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full"
>
  <LayoutDashboard className="w-5 h-5" />
  <span>Ringkasan</span>
</button>

<button
  onClick={() => navigate("/admin/menu")}
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full"
>
  <Utensils className="w-5 h-5" />
  <span>Manajemen Menu</span>
</button>

<button
  onClick={() => navigate("/admin/inventory")}
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full"
>
  <Package className="w-5 h-5" />
  <span>Stok Bahan</span>
</button>

<button
  onClick={() => navigate("/users")}
  className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium transition w-full"
>
  <Users className="w-5 h-5" />
  <span>Manajemen Pengguna</span>
</button>

<button
  onClick={() => navigate("/reports")}
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition"
>
  <BarChart3 className="w-5 h-5" />
  <span>Laporan Penjualan</span>
</button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition">
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <div className="text-green-600 text-lg font-bold">Manajamen Pengguna</div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
              <div className="w-2 h-2 bg-red-500 rounded-full -mt-4 -ml-2"></div>
            </div>
            <HelpCircle className="w-5 h-5 text-gray-500 cursor-pointer" />
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <div className="text-gray-900 text-[13px] font-semibold">Admin Sistem</div>
                <div className="text-gray-500 text-[11px] font-medium">SUPERUSER</div>
              </div>
              <img src="https://placehold.co/36x36/E12A2C/E12A2C" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 px-8 py-8">
          {/* Back Button & Title */}
          <div className="flex items-center gap-3 mb-2">
            <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
            <h1 className="text-[28px] font-bold text-gray-900">Tambah Karyawan Baru</h1>
          </div>
          
          <p className="text-gray-500 text-sm mb-8 ml-8">
            Daftarkan personel baru untuk operasional Singkong Keju D9.
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Personal Info */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-7">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-[18px] h-[18px] text-gray-700" />
                <h3 className="text-gray-900 text-base font-semibold">Informasi Pribadi</h3>
              </div>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 text-[13px] font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-400 bg-white focus:outline-none focus:border-green-500"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 text-[13px] font-medium">Alamat Email</label>
                  <input
                    type="email"
                    placeholder="contoh@d9.com"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-400 bg-white focus:outline-none focus:border-green-500"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 text-[13px] font-medium">Nomor Telepon</label>
                  <input
                    type="text"
                    placeholder="0812xxxx"
                    className="w-full md:w-[200px] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-400 bg-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Role & Permissions */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Role & Branch */}
              <div className="bg-white rounded-xl border border-gray-200 p-7">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-[18px] h-[18px] text-gray-700" />
                  <h3 className="text-gray-900 text-base font-semibold">Peran & Akses</h3>
                </div>
                
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-700 text-[13px] font-medium">Pilih Jabatan (Role)</label>
                    <div className="relative">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-500 bg-white cursor-pointer appearance-none focus:outline-none focus:border-green-500"
                      >
                        <option value="" disabled selected>Pilih Role</option>
                        <option value="admin">Admin</option>
                        <option value="kasir">Kasir</option>
                        <option value="kitchen">Kitchen</option>
                      </select>
                      <i className="ti ti-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none"></i>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-700 text-[13px] font-medium">Penempatan Cabang</label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white cursor-pointer appearance-none focus:outline-none focus:border-green-500">
                        <option value="salatiga" selected>Salatiga Utama</option>
                        <option value="semarang">Semarang</option>
                      </select>
                      <i className="ti ti-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none"></i>
                    </div>
                  </div>
                  
                  {/* Status Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3.5 border border-gray-200">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-900 text-sm font-medium">Status Akun</span>
                      <span className="text-gray-500 text-xs">Aktifkan akses login segera setelah pendaftaran</span>
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

              {/* Permissions */}
              <div className="bg-white rounded-xl border border-gray-200 p-7">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-[18px] h-[18px] text-gray-700" />
                  <h3 className="text-gray-900 text-base font-semibold">Hak Akses</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(permissions).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 border border-gray-200 rounded-lg px-3.5 py-3 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => handlePermissionChange(key)}
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => {}}
                        className="w-4 h-4 accent-green-600 cursor-pointer"
                      />
                      <span className="text-gray-700 text-sm capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => navigate("/users")} className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium bg-white hover:bg-gray-50 transition">
  Batal
</button>
<button className="flex items-center gap-2 px-5 py-2.5 bg-[#E12A2C] rounded-lg text-white text-sm font-medium hover:bg-red-700 transition">
  <UserPlus className="w-4 h-4" />
  <span>Tambah Karyawan</span>
</button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1bc964] rounded-lg text-white text-sm font-medium hover:bg-red-700 transition">
              <UserPlus className="w-4 h-4" />
              <span>Tambah Karyawan</span>
            </button>
          </div>

          {/* Footer Quote */}
          <div className="text-center text-gray-400 text-[13px] mt-10">
            "SDM yang unggul adalah kunci kualitas Singkong Keju D9 yang legendaris."
          </div>
        </div>
      </main>
    </div>
  );
}