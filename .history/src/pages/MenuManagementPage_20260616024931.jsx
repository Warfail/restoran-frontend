import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import UpdateMenuModal from "../components/UpdateMenuModal";
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
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleUpdateMenu = async (menuId, formData) => {
    try {
      await api.updateMenu(menuId, formData);
      await fetchMenus();
      setToast({ show: true, message: "Menu berhasil diupdate" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (error) {
      console.error("Failed to update menu:", error);
    }
  };

  const openUpdateModal = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const deleteMenu = async (menuId, menuName) => {
    if (!confirm(`Yakin ingin menghapus ${menuName}?`)) return;
    try {
      await api.deleteMenu(menuId);
      await fetchMenus();
      setToast({ show: true, message: `${menuName} berhasil dihapus` });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (error) {
      console.error("Failed to delete menu:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const filteredMenus = menus.filter(menu =>
    menu.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">Loading menus...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg">
          <span>✓</span> {toast.message}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">
            <LayoutDashboard className="w-5 h-5" />
            <span>Ringkasan</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium w-full">
            <Utensils className="w-5 h-5" />
            <span>Manajemen Menu</span>
          </button>

          <button onClick={() => navigate("/admin/inventory")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">
            <Package className="w-5 h-5" />
            <span>Stok Bahan</span>
          </button>

          <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">
            <Users className="w-5 h-5" />
            <span>Manajemen Pengguna</span>
          </button>

          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">
            <BarChart3 className="w-5 h-5" />
            <span>Laporan Penjualan</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1">
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

          {/* Menu Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">MENU NAME</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">CATEGORY</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">PRICE</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">STOCK</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMenus.map((menu) => (
                    <tr key={menu._id || menu.menuId} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-semibold text-gray-900 text-sm">{menu.name}</td>
                      <td className="px-5 py-3"><span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">{menu.category}</span></td>
                      <td className="px-5 py-3 text-gray-900 text-sm">Rp {menu.price?.toLocaleString()}</td>
                      <td className="px-5 py-3 text-gray-900 text-sm">{menu.stock || 0}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openUpdateModal(menu)} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                            <Pencil className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button onClick={() => deleteMenu(menu.menuId || menu._id, menu.name)} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-red-50">
                            <Trash className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMenus.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-8 text-gray-400">Belum ada menu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL UPDATE MENU */}
      <UpdateMenuModal
        menu={selectedMenu}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateMenu}
      />
    </div>
  );
}