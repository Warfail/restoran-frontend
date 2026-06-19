import { useState } from "react";
import UpdateUserModal from "../components/UpdateUserModal";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  UserPlus, 
  Pencil, 
  Trash,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Utensils,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  Filter,
  ArrowUpDown,
  Shield,
  History,
  ArrowRight,
  Check
} from "lucide-react";

export default function UserListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  

  const employees = [
    { id: "D9-ST-001", name: "Adi Saputra", email: "adi.saputra@d9.com", role: "Kepala Dapur", roleBadge: "bg-amber-50 text-amber-700", branch: "Salatiga Utama", status: "Aktif", statusColor: "text-green-600", avatar: "AS", avatarBg: "bg-green-700" },
    { id: "D9-CS-042", name: "Siti Aminah", email: "siti.a@d9.com", role: "Kasir", roleBadge: "bg-green-50 text-green-700", branch: "Semarang Kota", status: "Aktif", statusColor: "text-green-600", avatar: "https://placehold.co/36x36/2d6a4f/2d6a4f", avatarBg: "" },
    { id: "D9-AD-005", name: "Rudi Ramdan", email: "rudi.ramdan@d9.com", role: "Admin", roleBadge: "bg-gray-100 text-gray-600", branch: "Head Office", status: "Nonaktif", statusColor: "text-red-500", avatar: "RR", avatarBg: "bg-gray-200" },
    { id: "D9-CS-088", name: "Fajar Prasetyo", email: "fajar.p@d9.com", role: "Kasir", roleBadge: "bg-green-50 text-green-700", branch: "Salatiga Utama", status: "Aktif", statusColor: "text-green-600", avatar: "https://placehold.co/36x36/374151/374151", avatarBg: "" },
  ];

  const stats = [
    { title: "Total Staf", value: "24", icon: "👥", bgColor: "bg-green-50", iconColor: "text-green-700" },
    { title: "Aktif", value: "22", icon: "🛡️", bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    { title: "Izin/Sakit", value: "2", icon: "📅", bgColor: "bg-pink-50", iconColor: "text-pink-500" },
    { title: "Admin", value: "3", icon: "⚙️", bgColor: "bg-gray-100", iconColor: "text-gray-500" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#c0392b] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Singkong Keju D9</h2>
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide mt-1">Admin Panel</p>
        </div>

        <nav className="p-3 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition w-full">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Ringkasan</span>
          </button>
          <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition w-full">
            <Utensils className="w-5 h-5" />
            <span className="text-sm">Manajemen Menu</span>
          </button>
          <button onClick={() => navigate("/admin/inventory")} className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition w-full">
            <Package className="w-5 h-5" />
            <span className="text-sm">Stok Bahan</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 bg-amber-400 text-amber-900 rounded-lg font-semibold w-full">
            <Users className="w-5 h-5" />
            <span className="text-sm">Manajemen Pengguna</span>
          </button>
          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition w-full">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm">Laporan Penjualan</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/10 rounded-lg w-full transition">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Pengaturan</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-bold text-green-700">Manajamen Pengguna</h1>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer"><Bell className="w-4 h-4 text-gray-500" /></div>
            <div className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer"><HelpCircle className="w-4 h-4 text-gray-500" /></div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-gray-900 text-sm font-semibold">Admin Sistem</div>
                <div className="text-gray-400 text-xs font-medium tracking-wide">SUPERUSER</div>
              </div>
              <img src="https://placehold.co/36x36/c0392b/c0392b" alt="Admin" className="w-9 h-9 rounded-full object-cover" />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search & Add */}
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="text-gray-500 text-xs font-medium mb-1">Cari Karyawan atau ID</div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari...." className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <button onClick={() => navigate("/users/add")} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition">
              <UserPlus className="w-4 h-4" />
              <span>Tambah Karyawan</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
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

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-3 border-b border-gray-200">
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

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">NAMA KARYAWAN</th>
                    <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">ID PEGAWAI</th>
                    <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">PERAN</th>
                    <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">CABANG</th>
                    <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">STATUS</th>
                    <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {emp.avatarBg ? (
                            <div className={`w-9 h-9 rounded-full ${emp.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>{emp.avatar}</div>
                          ) : (
                            <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                          )}
                          <div>
                            <div className="text-gray-900 text-sm font-medium">{emp.name}</div>
                            <div className="text-gray-400 text-xs">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500 text-sm">{emp.id}</td>
                      <td className="px-3 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${emp.roleBadge}`}>{emp.role}</span></td>
                      <td className="px-3 py-3 text-gray-600 text-sm">{emp.branch}</td>
                      <td className="px-3 py-3"><span className={`flex items-center gap-1.5 text-xs font-medium ${emp.statusColor}`}><span className={`w-1.5 h-1.5 rounded-full ${emp.statusColor === "text-green-600" ? "bg-green-600" : "bg-red-500"}`}></span>{emp.status}</span></td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button className="text-gray-400 hover:text-gray-600"><Pencil className="w-4 h-4" /></button>
                          <button className="text-gray-400 hover:text-red-500"><Trash className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">Baris per halaman: <span className="border border-gray-200 rounded px-2 py-0.5 text-gray-700 bg-white">10</span></div>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronLeft className="w-3.5 h-3.5 text-gray-500" /></button>
                <button className="w-8 h-8 rounded-md bg-green-700 text-white text-sm font-semibold">1</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 text-gray-700 text-sm">2</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 text-gray-700 text-sm">3</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronRight className="w-3.5 h-3.5 text-gray-500" /></button>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-2 gap-5 mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2"><Shield className="w-5 h-5 text-green-700" /><h3 className="text-gray-900 font-bold">Keamanan & Akses</h3></div>
              <p className="text-gray-500 text-sm mb-4">Atur kebijakan kata sandi dan pembatasan IP untuk menjaga integritas data sistem Singkong Keju D9.</p>
              <div className="space-y-2 mb-4"><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center"><Check className="w-3 h-3 text-green-600" /></div><span className="text-gray-600 text-sm">Otentikasi Dua Faktor (2FA) diaktifkan</span></div><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center"><Check className="w-3 h-3 text-green-600" /></div><span className="text-gray-600 text-sm">Kedaluwarsa sesi: 8 Jam</span></div></div>
              <button className="text-green-700 text-sm font-semibold flex items-center gap-1">Konfigurasi Keamanan <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2"><History className="w-5 h-5 text-amber-600" /><h3 className="text-gray-900 font-bold">Log Aktivitas Terbaru</h3></div>
              <div className="space-y-3 mb-4"><div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-green-600 mt-1.5"></div><div><span className="text-gray-800 text-sm font-medium">Budi Santoso</span><span className="text-gray-500 text-sm"> mengubah peran Siti Aminah ke Kasir Utama.</span><div className="text-gray-400 text-xs mt-0.5">15 menit yang lalu</div></div></div><div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5"></div><div><span className="text-gray-800 text-sm font-medium">System</span><span className="text-gray-500 text-sm"> menonaktifkan akun Rudi Ramdan karena tidak aktif.</span><div className="text-gray-400 text-xs mt-0.5">2 jam yang lalu</div></div></div></div>
              <button className="text-amber-600 text-sm font-semibold flex items-center gap-1">Lihat Semua Log <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}