import SettingsModal from "../components/SettingsModal";
import MobileHeader from "../components/admin/MobileHeader";
import Sidebar from "../components/admin/Sidebar";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import UpdateMenuModal from "../components/UpdateMenuModal";
import {
  
  Search, Plus, Pencil, Trash, ChevronLeft, ChevronRight,
  LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut
} from "lucide-react";

export default function MenuManagementPage() {
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
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
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

  const openUpdateModal = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleUpdateMenu = async (menuId, formData) => {
    try {
      await api.updateMenu(menuId, formData);
      await fetchMenus();
      setToast({ show: true, message: "Menu berhasil diupdate" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (error) {
      console.error("Failed to update menu:", error);
      toast.error("Gagal mengupdate menu");
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

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const filteredMenus = menus.filter(m => {
    const matchSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === "all" || m.category?.toLowerCase() === filterCategory;
    return matchSearch && matchCategory;
  });



  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast.message}
        </div>
      )}

      <Sidebar active="menu" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <MobileHeader title="Manajemen Menu" onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="flex justify-between items-center mb-6">
               <div className="h-8 bg-gray-200 rounded w-48"></div>
               <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-80 mb-6"></div>
            <div className="bg-white rounded-xl border p-4 space-y-4">
               <div className="h-8 bg-gray-100 rounded w-full"></div>
               <div className="h-8 bg-gray-100 rounded w-full"></div>
               <div className="h-8 bg-gray-100 rounded w-full"></div>
               <div className="h-8 bg-gray-100 rounded w-full"></div>
               <div className="h-8 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-green-700">Daftar Menu Cafe</h1>
              <button onClick={() => navigate("/admin/menu/add")} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto justify-center"><Plus className="w-4 h-4" />Tambah Menu</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xl">🍔</div>
                <div>
                  <div className="text-gray-500 text-xs font-medium">Total Menu</div>
                  <div className="text-gray-900 text-xl font-bold">{menus.length}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 text-xl">✅</div>
                <div>
                  <div className="text-gray-500 text-xs font-medium">Tersedia</div>
                  <div className="text-gray-900 text-xl font-bold">{menus.filter(m => m.isAvailable !== false).length}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 text-xl">📦</div>
                <div>
                  <div className="text-gray-500 text-xs font-medium">Total Stok</div>
                  <div className="text-gray-900 text-xl font-bold">{menus.reduce((sum, m) => sum + (m.stock || 0), 0)}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 text-xl">🏷️</div>
                <div>
                  <div className="text-gray-500 text-xs font-medium">Kategori</div>
                  <div className="text-gray-900 text-xl font-bold">{new Set(menus.map(m => m.category)).size}</div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-80 shadow-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari menu..." className="flex-1 text-sm outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none w-full sm:w-48 shadow-sm">
                <option value="all">Semua Kategori</option>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Gambar</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Nama Menu</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Kategori</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Harga</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Stok</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMenus.map(menu => (
                    <tr key={menu._id || menu.menuId} className="border-b hover:bg-gray-50 transition">
                      <td className="px-5 py-3">
                        <img src={menu.image || "https://placehold.co/100x80/c8a96e/c8a96e"} alt={menu.name} className="w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm" />
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">{menu.name}</td>
                      <td className="px-5 py-3"><span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        menu.category?.toLowerCase() === 'makanan' ? 'bg-orange-50 text-orange-600' :
                        menu.category?.toLowerCase() === 'minuman' ? 'bg-blue-50 text-blue-600' :
                        menu.category?.toLowerCase() === 'snack' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>{menu.category}</span></td>
                      <td className="px-5 py-3 text-gray-700">Rp {menu.price?.toLocaleString()}</td>
                      <td className="px-5 py-3 text-gray-700">{menu.stock || 0}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openUpdateModal(menu)} className="p-2 border rounded-md hover:bg-gray-50">
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => deleteMenu(menu._id, menu.name)} className="p-2 border rounded-md hover:bg-red-50">
                            <Trash className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMenus.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-400">Belum ada menu yang ditemukan</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
      </main>
      </div>

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