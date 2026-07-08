import SettingsModal from "../components/SettingsModal";
import MobileHeader from "../components/admin/MobileHeader";
import Sidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";
import NotificationDropdown from "../components/NotificationDropdown";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  Search, Plus, Pencil, Trash, X, AlertTriangle,
  LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut, Bell, HelpCircle
} from "lucide-react";
import UpdateInventoryModal from "../components/UpdateInventoryModal";

export default function InventoryPage() {
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
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editStock, setEditStock] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // 🔥 FUNGSI FORMAT ANGKA STOK
  const formatStock = (value) => {
    if (value === undefined || value === null) return '0';
    const rounded = Math.round(value * 100) / 100;
    return rounded.toString();
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(() => {
      fetchInventory(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchInventory = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.getInventory(true);
      const inventoryData = response.data || response;
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const updateStock = async (itemId, updateData) => {
    try {
      await api.updateStock(itemId, updateData);
      await fetchInventory();
      toast.success("Bahan berhasil diupdate!");
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Gagal update bahan");
    }
  };

  const deleteInventoryItem = async () => {
    if (!deletingItem) return;
    try {
      await api.deleteInventory(deletingItem._id || deletingItem.id);
      await fetchInventory();
      toast.success("Item berhasil dihapus!");
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Gagal menghapus item");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
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
    if (stock <= 5) return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">KRITIS</span>;
    if (stock <= 10) return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">HAMPIR HABIS</span>;
    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">AMAN</span>;
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-red-600";
    if (stock <= 5) return "text-orange-500";
    if (stock <= 10) return "text-yellow-600";
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



  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar active="inventory" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <MobileHeader title="Stok Bahan" onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 md:p-7">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Stok</h1>
                <p className="text-gray-500 text-sm mt-1">Pantau dan kelola stok menu di sistem</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
               <div className="h-24 bg-gray-200 rounded-xl border"></div>
               <div className="h-24 bg-gray-200 rounded-xl border"></div>
               <div className="h-24 bg-gray-200 rounded-xl border"></div>
               <div className="h-24 bg-gray-200 rounded-xl border"></div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="h-10 bg-gray-200 rounded-lg w-72"></div>
               <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            </div>
            <div className="bg-white rounded-xl border p-4 space-y-4">
               <div className="h-10 bg-gray-100 rounded w-full"></div>
               <div className="h-12 bg-gray-100 rounded w-full"></div>
               <div className="h-12 bg-gray-100 rounded w-full"></div>
               <div className="h-12 bg-gray-100 rounded w-full"></div>
               <div className="h-12 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 md:p-7">
              <AdminHeader title="Stok Bahan Baku">
                <div className="flex items-center gap-4 hidden sm:flex">
                  <NotificationDropdown userRole="admin" />
                  <HelpCircle className="w-5 h-5 text-gray-500 cursor-pointer" />
                  <div className="flex items-center gap-3 ml-2 border-l pl-4 border-gray-200">
                    <div className="text-right">
                      <div className="text-gray-900 text-sm font-bold">{currentUser?.fullName || currentUser?.username || "Admin"}</div>
                      <div className="text-gray-500 text-xs font-bold">{currentUser?.role?.toUpperCase() || "ADMIN"}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm border border-gray-200 cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
                      {currentUser?.profilePicture ? (
                        <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        (currentUser?.fullName || currentUser?.username || "A").charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                </div>
              </AdminHeader>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border p-4">
                  <div className="text-gray-500 text-xs">Total Bahan</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <div className="text-gray-500 text-xs">Kritis (≤5)</div>
                  <div className="text-2xl font-bold text-red-600">{stats.kritis}</div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <div className="text-gray-500 text-xs">Hampir Habis (≤10)</div>
                  <div className="text-2xl font-bold text-orange-500">{stats.hampirHabis}</div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <div className="text-gray-500 text-xs">Habis</div>
                  <div className="text-2xl font-bold text-gray-400">{stats.habis}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari bahan..." 
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    className="border rounded-lg px-3 py-2 text-sm" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>Semua</option>
                    <option>Habis</option>
                    <option>Kritis</option>
                    <option>Hampir Habis</option>
                    <option>Aman</option>
                  </select>
                  <button onClick={() => navigate("/admin/inventory/add")} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition whitespace-nowrap">
                    <Plus className="w-4 h-4" /> Tambah Bahan
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-5 py-3">Nama Bahan</th>
                      <th className="text-left px-5 py-3">Kategori</th>
                      <th className="text-left px-5 py-3">Stok</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item._id || item.id} className="border-b hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium">{item.name}</td>
                        <td className="px-5 py-3 text-gray-600">{item.category || "Bahan Baku"}</td>
                        <td className="px-5 py-3">
                          <span className={`font-semibold ${getStockColor(item.stock)}`}>
                            {item.stock} {item.unit || "unit"}
                          </span>
                        </td>
                        <td className="px-5 py-3">{getStatusBadge(item.stock)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setEditingItem(item);
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 border rounded-md hover:bg-gray-50 text-blue-600 border-blue-200 hover:border-blue-300 transition"
                              title="Edit Stok"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setDeletingItem(item);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 border rounded-md hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 transition"
                              title="Hapus Item"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredInventory.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400">Belum ada data</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      </div>

      {/* Edit Modal Overlay */}
      <UpdateInventoryModal 
        item={editingItem} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={updateStock} 
      />

      {/* Delete Modal Overlay */}
      {isDeleteModalOpen && deletingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Hapus Item?</h2>
              <p className="text-gray-500 text-sm">Anda yakin ingin menghapus <span className="font-semibold text-gray-800">"{deletingItem.name}"</span> dari inventori? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition">Batal</button>
              <button onClick={deleteInventoryItem} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}