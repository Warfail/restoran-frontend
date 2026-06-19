import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  Search, Plus, Pencil, Trash, ChevronLeft, ChevronRight,
  LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut
} from "lucide-react";

export default function MenuManagementPage() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await api.getMenu();
      const menusData = response.data || response;
      setMenus(Array.isArray(menusData) ? menusData : []);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMenu = async (menuId, menuName) => {
    if (!confirm(`Hapus ${menuName}?`)) return;
    try {
      await api.deleteMenu(menuId);
      await fetchMenus();
      setToast({ show: true, message: `${menuName} dihapus` });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredMenus = menus.filter(m => m.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><LayoutDashboard className="w-5 h-5" /><span>Ringkasan</span></button>
          <button className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg w-full"><Utensils className="w-5 h-5" /><span>Manajemen Menu</span></button>
          <button onClick={() => navigate("/admin/inventory")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><Package className="w-5 h-5" /><span>Stok Bahan</span></button>
          <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><Users className="w-5 h-5" /><span>Manajemen Pengguna</span></button>
          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><BarChart3 className="w-5 h-5" /><span>Laporan Penjualan</span></button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full"><Settings className="w-5 h-5" /><span>Pengaturan</span></button>
          <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1"><LogOut className="w-5 h-5" /><span>Keluar</span></button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Daftar Menu Cafe</h1>
          <button onClick={() => navigate("/admin/menu/add")} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg"><Plus className="w-4 h-4" />Tambah Menu</button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-80 mb-6">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari menu..." className="flex-1 text-sm outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr><th className="text-left px-5 py-3">Nama Menu</th><th className="text-left px-5 py-3">Kategori</th><th className="text-left px-5 py-3">Harga</th><th className="text-left px-5 py-3">Stok</th><th className="text-left px-5 py-3">Aksi</th></tr>
            </thead>
            <tbody>
              {filteredMenus.map(menu => (
                <tr key={menu._id || menu.menuId} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{menu.name}</td>
                  <td className="px-5 py-3"><span className="px-2 py-1 rounded-full bg-gray-100 text-xs">{menu.category}</span></td>
                  <td className="px-5 py-3">Rp {menu.price?.toLocaleString()}</td>
                  <td className="px-5 py-3">{menu.stock || 0}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openUpdateModal(menu)} className="p-2 border rounded-md hover:bg-gray-50"><Pencil className="w-4 h-4 text-gray-500" /></button>
                      <button onClick={() => deleteMenu(menu.menuId || menu._id, menu.name)} className="p-2 border rounded-md hover:bg-red-50"><Trash className="w-4 h-4 text-gray-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMenus.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-gray-400">Belum ada menu</td></tr>}
            </tbody>
          </table>
        </div>
      </main>

      {/* Toast */}
      {toast.show && <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">{toast.message}</div>}
    </div>
  );
}