import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  HelpCircle,
  Search,
  UserPlus,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Settings,
  LogOut,
  LayoutDashboard,
  Utensils,
  Package,
  Users,
  BarChart3,
  Shield,
  History,
  ArrowRight
} from "lucide-react";

export default function UserListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Data karyawan (nanti dari API)
  const employees = [
    { id: "D9-ST-001", name: "Adi Saputra", email: "adi.saputra@d9.com", role: "Kepala Dapur", roleBadge: "bg-amber-100 text-amber-800", branch: "Salatiga Utama", status: "Aktif", statusColor: "text-green-600", avatar: "AS", avatarBg: "bg-green-600" },
    { id: "D9-CS-042", name: "Siti Aminah", email: "siti.a@d9.com", role: "Kasir", roleBadge: "bg-green-700 text-white", branch: "Semarang Kota", status: "Aktif", statusColor: "text-green-600", avatar: "https://placehold.co/38x38/2d6a4f/2d6a4f", avatarBg: "" },
    { id: "D9-AD-005", name: "Rudi Ramdan", email: "rudi.ramdan@d9.com", role: "Admin", roleBadge: "bg-gray-100 text-gray-700", branch: "Head Office", status: "Nonaktif", statusColor: "text-orange-500", avatar: "RR", avatarBg: "bg-gray-200 text-gray-600" },
    { id: "D9-CS-088", name: "Fajar Prasetyo", email: "fajar.p@d9.com", role: "Kasir", roleBadge: "bg-green-700 text-white", branch: "Salatiga Utama", status: "Aktif", statusColor: "text-green-600", avatar: "https://placehold.co/38x38/4a7c59/4a7c59", avatarBg: "" },
  ];

  const stats = [
    { title: "Total Staf", value: "24", icon: "👥", bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Aktif", value: "22", icon: "🛡️", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
    { title: "Izin/Sakit", value: "2", icon: "📅", bgColor: "bg-pink-50", iconColor: "text-pink-600" },
    { title: "Admin", value: "3", icon: "⚙️", bgColor: "bg-gray-100", iconColor: "text-gray-600" },
  ];

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
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full"
>
  <Users className="w-5 h-5" />
  <span>Manajemen Pengguna</span>
</button>

<button
  onClick={() => navigate("/reports")}
  className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium transition w-full"
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
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>Perubahan Berhasil Disimpan!</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
              <Bell className="w-4 h-4 text-gray-500" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
              <HelpCircle className="w-4 h-4 text-gray-500" />
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-gray-900 text-sm font-semibold">Admin Sistem</div>
                <div className="text-gray-500 text-xs">SUPERUSER</div>
              </div>
              <img src="https://placehold.co/36x36/E12A2C/E12A2C" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Search & Add Button */}
          <div className="mb-6">
            <label className="text-gray-500 text-xs font-medium mb-2 block">Cari Karyawan atau ID</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 gap-2 w-full sm:w-96 shadow-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari...." className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={() => navigate("/users/add")} className="...">
  <UserPlus className="w-4 h-4" />
  <span>Tambah Karyawan</span>
</button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-11 h-11 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-medium">{stat.title}</div>
                  <div className="text-gray-900 text-2xl font-bold">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 bg-white">
                  <Filter className="w-3.5 h-3.5" /> Filter Peran
                </button>
                <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 bg-white">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan
                </button>
              </div>
              <div className="text-gray-500 text-xs">Menampilkan 1 - 4 dari 24 karyawan</div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">NAMA KARYAWAN</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ID PEGAWAI</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">PERAN</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">CABANG</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">STATUS</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {emp.avatarBg ? (
                            <div className={`w-9 h-9 rounded-full ${emp.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>{emp.avatar}</div>
                          ) : (
                            <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                          )}
                          <div>
                            <div className="text-gray-900 text-sm font-semibold">{emp.name}</div>
                            <div className="text-gray-500 text-xs">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-gray-700 text-sm font-medium">{emp.id}</td>
                      <td className="px-3 py-3.5"><span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${emp.roleBadge}`}>{emp.role}</span></td>
                      <td className="px-3 py-3.5 text-gray-700 text-sm">{emp.branch}</td>
                      <td className="px-3 py-3.5"><span className={`flex items-center gap-1.5 text-sm font-medium ${emp.statusColor}`}><span className={`w-1.5 h-1.5 rounded-full ${emp.statusColor === 'text-green-600' ? 'bg-green-600' : 'bg-orange-500'}`}></span>{emp.status}</span></td>
                      <td className="px-3 py-3.5">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Pencil className="w-3.5 h-3.5 text-gray-500" /></button>
                          <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-red-50"><Trash className="w-3.5 h-3.5 text-gray-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-gray-100 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">Baris per halaman: <span className="border border-gray-200 rounded px-2 py-0.5 text-gray-700">10</span></div>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronLeft className="w-3.5 h-3.5 text-gray-500" /></button>
                <button className="w-8 h-8 rounded-md bg-green-800 text-white text-sm font-semibold">1</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-700 text-sm">2</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronRight className="w-3.5 h-3.5 text-gray-500" /></button>
              </div>
            </div>
          </div>

          {/* Two Column Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Keamanan & Akses */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><Shield className="w-4 h-4 text-green-600" /></div>
                <h3 className="text-gray-900 text-base font-bold">Keamanan & Akses</h3>
              </div>
              <p className="text-gray-500 text-sm mb-4">Atur kebijakan kata sandi dan pembatasan IP untuk menjaga integritas data sistem Singkong Keju D9.</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center"><span className="text-green-600 text-xs">✓</span></div><span className="text-gray-700 text-sm">Otentikasi Dua Faktor (2FA) diaktifkan</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center"><span className="text-green-600 text-xs">✓</span></div><span className="text-gray-700 text-sm">Kedaluwarsa sesi: 8 Jam</span></div>
              </div>
              <button className="text-green-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Konfigurasi Keamanan <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>

            {/* Log Aktivitas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><History className="w-4 h-4 text-amber-500" /></div>
                <h3 className="text-gray-900 text-base font-bold">Log Aktivitas Terbaru</h3>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-green-600 mt-1.5"></div><div><div className="text-gray-900 text-sm font-semibold">Budi Santoso mengubah peran Siti Aminah ke Kasir Utama.</div><div className="text-gray-400 text-xs">15 menit yang lalu</div></div></div>
                <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5"></div><div><div className="text-gray-900 text-sm font-semibold">System menonaktifkan akun Rudi Ramdan karena tidak aktif.</div><div className="text-gray-400 text-xs">2 jam yang lalu</div></div></div>
              </div>
              <button className="text-amber-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Lihat Semua Log <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}