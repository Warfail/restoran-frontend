import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  Search, Download, Plus, ChevronLeft, ChevronRight,
  LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut,
  Eye, Pencil, History, ChevronDown
} from "lucide-react";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.getInventory();
      const inventoryData = response.data || response;
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (itemId, newStock) => {
    try {
      await api.updateStock(itemId, newStock);
      await fetchInventory();
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert("Gagal update stok");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const stats = {
    total: inventory.length,
    kritis: inventory.filter(i => i.stock <= 5 && i.stock > 0).length,
    hampirHabis: inventory.filter(i => i.stock <= 10 && i.stock > 5).length,
    habis: inventory.filter(i => i.stock === 0).length
  };

  const getStatusBadge = (stock) => {
    if (stock === 0) return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">HABIS</span>;
    if (stock <= 5) return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">KRITIS</span>;
    if (stock <= 10) return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">HAMPIR HABIS</span>;
    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">AMAN</span>;
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-red-600";
    if (stock <= 5) return "text-red-500";
    if (stock <= 10) return "text-orange-500";
    return "text-green-600";
  };

  const filteredInventory = inventory.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "Semua" || 
      (statusFilter === "Habis" && item.stock === 0) ||
      (statusFilter === "Kritis" && item.stock <= 5 && item.stock > 0) ||
      (statusFilter === "Hampir Habis" && item.stock <= 10 && item.stock > 5) ||
      (statusFilter === "Aman" && item.stock > 10);
    return matchSearch && matchStatus;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading inventory...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><LayoutDashboard className="w-5 h-5" /><span>Ringkasan</span></button>
          <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><Utensils className="w-5 h-5" /><span>Manajemen Menu</span></button>
          <button className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg w-full"><Package className="w-5 h-5" /><span>Stok Bahan</span></button>
          <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><Users className="w-5 h-5" /><span>Manajemen Pengguna</span></button>
          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><BarChart3 className="w-5 h-5" /><span>Laporan Penjualan</span></button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><Settings className="w-5 h-5" /><span>Pengaturan</span></button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1"><LogOut className="w-5 h-5" /><span>Keluar</span></button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center px-7 py-4 bg-white border-b">
          <h1 className="text-2xl font-bold text-gray-900">Stok Bahan</h1>
          <div className="flex items-center gap-3">
            <img src="https://placehold.co/36x36/d97706/d97706" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
          </div>
        </div>

        <div className="p-7">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border p-4"><div className="text-gray-500 text-xs">Total Bahan</div><div className="text-2xl font-bold">{stats.total}</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-gray-500 text-xs">Kritis (≤5)</div><div className="text-2xl font-bold text-red-600">{stats.kritis}</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-gray-500 text-xs">Hampir Habis (≤10)</div><div className="text-2xl font-bold text-orange-500">{stats.hampirHabis}</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-gray-500 text-xs">Habis</div><div className="text-2xl font-bold text-gray-400">{stats.habis}</div></div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari bahan..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <select className="border rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>Semua</option><option>Habis</option><option>Kritis</option><option>Hampir Habis</option><option>Aman</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr><th className="text-left px-5 py-3">Nama Bahan</th><th className="text-left px-5 py-3">Kategori</th><th className="text-left px-5 py-3">Stok</th><th className="text-left px-5 py-3">Status</th><th className="text-left px-5 py-3">Aksi</th></tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item._id || item.id} className="border-b hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium">{item.name}</td>
                      <td className="px-5 py-3 text-gray-600">{item.category || "Bahan Baku"}</td>
                      <td className="px-5 py-3"><span className={`font-semibold ${getStockColor(item.stock)}`}>{item.stock} {item.unit || "unit"}</span></td>
                      <td className="px-5 py-3">{getStatusBadge(item.stock)}</td>
                      <td className="px-5 py-3">
                        <button className="p-2 border rounded-md hover:bg-gray-50">
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInventory.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-gray-400">Belum ada data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}