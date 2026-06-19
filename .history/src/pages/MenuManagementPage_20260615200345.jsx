import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash,
  ChevronLeft,
  ChevronRight,
  LayoutDashboardIcon,
  Utensils,
  PackageIcon,
  UsersIcon,
  ChartBarIcon,
  SettingsIcon,
  LogOutIcon
} from "lucide-react";

export default function MenuManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Data menu (nanti dari API)
  const menus = [
    { id: 1, name: "Singkong Keju Cokelat", description: "Varian manis paling populer", category: "MAKANAN", price: 15000, status: "Tersedia", statusColor: "bg-green-100 text-green-700", available: true, image: "https://placehold.co/56x56/3d2c1e/3d2c1e" },
    { id: 2, name: "Es Teh Manis", description: "Teh melati seduh segar", category: "MINUMAN", price: 5000, status: "Tersedia", statusColor: "bg-green-100 text-green-700", available: true, image: "https://placehold.co/56x56/c8a84b/c8a84b" },
    { id: 3, name: "Singkong Keju Original", description: "Resep turun temurun D9", category: "MAKANAN", price: 12000, status: "Habis", statusColor: "bg-red-100 text-red-500", available: false, image: "https://placehold.co/56x56/2d2010/2d2010" },
  ];

  const stats = [
    { title: "Total Menu", value: "42", icon: "📋", bgColor: "bg-gray-100", iconColor: "text-gray-600" },
    { title: "Makanan", value: "28", icon: "🍽️", bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    { title: "Minuman", value: "14", icon: "🥤", bgColor: "bg-pink-50", iconColor: "text-pink-600" },
    { title: "Stok Habis", value: "3", icon: "⚠️", bgColor: "bg-red-50", iconColor: "text-red-500" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <LayoutDashboardIcon className="w-5 h-5" />
            <span>Ringkasan</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 bg-white text-[#E12A2C] rounded-lg font-semibold w-full">
            <Utensils className="w-5 h-5" />
            <span>Manajemen Menu</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <PackageIcon className="w-5 h-5" />
            <span>Stok Bahan</span>
          </button>

          <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <UsersIcon className="w-5 h-5" />
            <span>Manajemen Pengguna</span>
          </button>

          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <ChartBarIcon className="w-5 h-5" />
            <span>Laporan Penjualan</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition">
            <SettingsIcon className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition">
            <LogOutIcon className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-5 bg-white border-b border-gray-200 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Daftar Menu Cafe</h1>
            <p className="text-gray-500 text-sm mt-1 hidden sm:block">Kelola ketersediaan, harga, dan informasi menu Singkong Keju D9</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-gray-900 text-sm font-semibold">Admin D9</div>
              <div className="text-gray-500 text-xs">SUPER ADMIN</div>
            </div>
            <img src="https://placehold.co/40x40/8B6F5E/8B6F5E" alt="Admin" className="w-10 h-10 rounded-full object-cover" />
          </div>
        </div>

        <div className="p-6">
          {/* Search & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <label className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1 block">Cari Menu</label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-80">
                <SearchIcon className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari...." className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <button onClick={() => navigate("/admin/menu/add")} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
              <PlusIcon className="w-4 h-4" />
              <span>Tambah Menu Baru</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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

          {/* Menu Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">THUMBNAIL</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">MENU NAME</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CATEGORY</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">PRICE</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">STATUS</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr key={menu.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <img src={menu.image} alt={menu.name} className="w-14 h-14 rounded-lg object-cover" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-gray-900 text-sm">{menu.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{menu.description}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${menu.category === "MAKANAN" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-pink-50 text-pink-600 border border-pink-200"}`}>
                          {menu.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-900 text-sm font-medium">Rp {menu.price.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${menu.available ? "bg-green-600" : "bg-gray-300"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${menu.available ? "right-0.5" : "left-0.5"}`}></span>
                          </button>
                          <span className={`text-sm font-medium ${menu.available ? "text-gray-900" : "text-red-500"}`}>{menu.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"><PencilIcon className="w-3.5 h-3.5 text-gray-500" /></button>
                          <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-red-50"><TrashIcon className="w-3.5 h-3.5 text-gray-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-gray-200 gap-3">
              <div className="text-gray-500 text-sm">Menampilkan 1 - 10 dari 42 menu</div>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronLeftIcon className="w-3.5 h-3.5 text-gray-500" /></button>
                <button className="w-8 h-8 rounded-md bg-green-600 text-white text-sm font-semibold">1</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-700 text-sm">2</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-700 text-sm">3</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center">...</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-700 text-sm">5</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronRightIcon className="w-3.5 h-3.5 text-gray-500" /></button>
              </div>
            </div>
          </div>

          {/* Bottom Tips Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-lg">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Tips Penjualan</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Menu dengan status 'Tersedia' secara otomatis muncul di aplikasi POS kasir dan QR Menu Pelanggan. Pastikan stok bahan cukup sebelum mengaktifkan menu.</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 text-lg">📈</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Menu Terlaris</h3>
                <p className="text-gray-500 text-xs leading-relaxed">'Singkong Keju Cokelat' menyumbang 40% dari total pendapatan minggu ini. Pertimbangkan untuk membuat promo bundling dengan 'Es Teh Manis'.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}