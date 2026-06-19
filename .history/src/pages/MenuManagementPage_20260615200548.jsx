import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
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
  LogOut
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

  const menus = [
    { id: 1, name: "Singkong Keju Cokelat", description: "Varian manis paling populer", category: "MAKANAN", price: 15000, status: "Tersedia", available: true, image: "https://placehold.co/56x56/3d2c1e/3d2c1e" },
    { id: 2, name: "Es Teh Manis", description: "Teh melati seduh segar", category: "MINUMAN", price: 5000, status: "Tersedia", available: true, image: "https://placehold.co/56x56/c8a84b/c8a84b" },
    { id: 3, name: "Singkong Keju Original", description: "Resep turun temurun D9", category: "MAKANAN", price: 12000, status: "Habis", available: false, image: "https://placehold.co/56x56/2d2010/2d2010" },
  ];

  const stats = [
    { title: "Total Menu", value: "42", icon: "📋", bgColor: "bg-gray-100" },
    { title: "Makanan", value: "28", icon: "🍽️", bgColor: "bg-amber-50" },
    { title: "Minuman", value: "14", icon: "🥤", bgColor: "bg-pink-50" },
    { title: "Stok Habis", value: "3", icon: "⚠️", bgColor: "bg-red-50" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <LayoutDashboard className="w-5 h-5" />
            <span>Ringkasan</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 bg-white text-[#E12A2C] rounded-lg font-semibold w-full">
            <Utensils className="w-5 h-5" />
            <span>Manajemen Menu</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <Package className="w-5 h-5" />
            <span>Stok Bahan</span>
          </button>

          <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <Users className="w-5 h-5" />
            <span>Manajemen Pengguna</span>
          </button>

          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
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

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Daftar Menu Cafe</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola ketersediaan, harga, dan informasi menu Singkong Keju D9</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-gray-900 text-sm font-semibold">Admin D9</div>
              <div className="text-gray-500 text-xs">SUPER ADMIN</div>
            </div>
            <img src="https://placehold.co/40x40/8B6F5E/8B6F5E" alt="Admin" className="w-10 h-10 rounded-full object-cover" />
          </div>
        </div>

        <div className="p-6">
          {/* Search & Add */}
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="w-80">
              <label className="text-gray-500 text-xs font-medium uppercase mb-1 block">Cari Menu</label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari menu..." className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <button onClick={() => navigate("/admin/menu/add")} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
              <Plus className="w-4 h-4" />
              <span>Tambah Menu Baru</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
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
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">THUMBNAIL</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">MENU NAME</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">CATEGORY</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">PRICE</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">STATUS</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr key={menu.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3"><img src={menu.image} alt={menu.name} className="w-14 h-14 rounded-lg object-cover" /></td>
                      <td className="px-5 py-3"><div className="font-semibold text-gray-900 text-sm">{menu.name}</div><div className="text-gray-500 text-xs">{menu.description}</div></td>
                      <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${menu.category === "MAKANAN" ? "bg-amber-50 text-amber-600" : "bg-pink-50 text-pink-600"}`}>{menu.category}</span></td>
                      <td className="px-5 py-3 text-gray-900 text-sm">Rp {menu.price.toLocaleString()}</td>
                      <td className="px-5 py-3"><span className={`text-sm font-medium ${menu.available ? "text-green-600" : "text-red-500"}`}>{menu.status}</span></td>
                      <td className="px-5 py-3"><div className="flex gap-2"><button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><Pencil className="w-3.5 h-3.5 text-gray-500" /></button><button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><Trash className="w-3.5 h-3.5 text-gray-500" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200">
              <div className="text-gray-500 text-sm">Menampilkan 1 - 3 dari 42 menu</div>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronLeft className="w-3.5 h-3.5 text-gray-500" /></button>
                <button className="w-8 h-8 rounded-md bg-green-600 text-white text-sm">1</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 text-gray-700 text-sm">2</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 text-gray-700 text-sm">3</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronRight className="w-3.5 h-3.5 text-gray-500" /></button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border p-5 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center"><span className="text-green-600">💡</span></div>
              <div><h3 className="font-semibold text-gray-900 text-sm mb-1">Tips Penjualan</h3><p className="text-gray-500 text-xs">Menu dengan status 'Tersedia' secara otomatis muncul di aplikasi POS kasir dan QR Menu Pelanggan.</p></div>
            </div>
            <div className="bg-white rounded-xl border p-5 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center"><span className="text-amber-600">📈</span></div>
              <div><h3 className="font-semibold text-gray-900 text-sm mb-1">Menu Terlaris</h3><p className="text-gray-500 text-xs">'Singkong Keju Cokelat' menyumbang 40% dari total pendapatan minggu ini.</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}