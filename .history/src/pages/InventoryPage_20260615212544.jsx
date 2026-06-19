import { useState } from "react";
import UpdateStockModal from "../components/UpdateStockModal";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Download, 
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Utensils,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Eye,
  Pencil,
  History,
  ChevronDown
} from "lucide-react";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
const [selectedItem, setSelectedItem] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleUpdateStock = (itemId, newStock, note) => {
  console.log(`Update item ${itemId} to ${newStock} ${note}`);
  // Panggil API update stock di sini
};

// Tombol pensil di tabel panggil ini:
const openUpdateModal = (item) => {
  setSelectedItem(item);
  setIsModalOpen(true);
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const stats = [
    { title: "Total SKU", value: "124 Item", icon: "📦", bgColor: "bg-green-50", iconColor: "text-green-700" },
    { title: "Kritis (Out)", value: "8 Item", icon: "⚠️", bgColor: "bg-red-50", iconColor: "text-red-600" },
    { title: "Hampir Habis", value: "15 Item", icon: "⏳", bgColor: "bg-orange-50", iconColor: "text-orange-600" },
    { title: "Order Pending", value: "4 Order", icon: "📄", bgColor: "bg-purple-50", iconColor: "text-purple-600" },
  ];

  const items = [
    { id: 1, name: "Singkong", category: "Bahan Baku", stock: "8 Pack", safetyLimit: "20 Pack", status: "KRITIS", statusColor: "red", unit: "Pack" },
    { id: 2, name: "Minyak Goreng Sawit", category: "Bahan Baku", stock: "18 Pack", safetyLimit: "20 Pack", status: "HAMPIR HABIS", statusColor: "orange", unit: "Pack" },
    { id: 3, name: "Keju Cheddar Parut", category: "Topping", stock: "45 Pack", safetyLimit: "10 Pack", status: "AMAN", statusColor: "green", unit: "Pack" },
  ];

  const getStatusBadge = (status, color) => {
    const styles = {
      red: "bg-red-50 text-red-600 border-red-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      green: "bg-green-50 text-green-600 border-green-200",
    };
    return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[color]}`}>{status}</span>;
  };

  const getStockColor = (stock, limit) => {
    const numStock = parseInt(stock);
    const numLimit = parseInt(limit);
    if (numStock <= 5) return "text-red-600";
    if (numStock <= numLimit) return "text-orange-500";
    return "text-green-600";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR - Sama dengan sebelumnya */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <LayoutDashboard className="w-5 h-5" />
            <span>Ringkasan</span>
          </button>

          <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <Utensils className="w-5 h-5" />
            <span>Manajemen Menu</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium transition w-full">
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
      <main className="ml-64 flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Inventory</span>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-semibold text-[#E12A2C]">Stock Management</span>
          </div>
          <div className="flex items-center gap-4">
            <i className="ti ti-bell text-2xl text-gray-500 cursor-pointer"></i>
            <i className="ti ti-help-circle text-2xl text-gray-500 cursor-pointer"></i>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <div className="text-gray-900 text-sm font-semibold">Admin Sistem</div>
                <div className="text-gray-500 text-xs">SUPERUSER</div>
              </div>
              <img src="https://placehold.co/36x36/d97706/d97706" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
            </div>
          </div>
        </div>

        <div className="p-7">
          {/* Title & Actions */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Stok Bahan</h1>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-700 rounded-lg text-sm font-semibold text-white hover:bg-green-800">
                <Plus className="w-4 h-4" />
                Tambah Bahan Baru
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Inventory</span>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-semibold text-[#E12A2C]">Stock Management</span>
          </div>

          {/* Stats Cards */}
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

          {/* Search & Filters */}
          <div className="mb-4">
            <label className="text-gray-500 text-sm font-medium mb-1 block">Cari Bahan</label>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari...." className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <div className="flex items-center gap-1 border border-gray-300 rounded-lg bg-white px-3 py-1.5 cursor-pointer">
                    <span className="text-sm text-gray-700">{statusFilter}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Kategori:</span>
                  <div className="flex items-center gap-1 border border-gray-300 rounded-lg bg-white px-3 py-1.5 cursor-pointer">
                    <span className="text-sm text-gray-700">{categoryFilter}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">Terakhir diperbarui: Hari ini, 09:41 AM</span>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">ITEM NAME</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">KATEGORI</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">CURRENT STOCK</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SAFETY LIMIT</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">STATUS</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                            <i className="ti ti-package text-green-700 text-lg"></i>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm">{item.category}</td>
                      <td className="px-4 py-4"><span className={`font-semibold text-sm ${getStockColor(item.stock, item.safetyLimit)}`}>{item.stock}</span></td>
                      <td className="px-4 py-4 text-gray-700 text-sm">{item.safetyLimit}</td>
                      <td className="px-4 py-4">{getStatusBadge(item.status, item.statusColor)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1 cursor-pointer">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </div>
                          <History className="w-4 h-4 text-gray-500 cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-between items-center px-5 py-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">Showing 1 to 3 of 124 items</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronLeft className="w-3.5 h-3.5 text-gray-500" /></button>
                <button className="w-8 h-8 rounded-md bg-green-700 text-white text-sm font-semibold">1</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-700 text-sm">2</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-700 text-sm">3</button>
                <button className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"><ChevronRight className="w-3.5 h-3.5 text-gray-500" /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}