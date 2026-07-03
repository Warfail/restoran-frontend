import SettingsModal from "../components/SettingsModal";
import MobileHeader from "../components/admin/MobileHeader";
import Sidebar from "../components/admin/Sidebar";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  Search, Plus, Pencil,
  LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut
} from "lucide-react";

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
  const [editingItem, setEditingItem] = useState(null);
  const [editStock, setEditStock] = useState("");

  // 🔥 FUNGSI FORMAT ANGKA STOK
  const formatStock = (value) => {
    if (value === undefined || value === null) return '0';
    const rounded = Math.round(value * 100) / 100;
    return rounded.toString();
  };

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
      await api.updateStock(itemId, { stock: parseInt(newStock) });
      await fetchInventory();
      toast.success("Stok berhasil diupdate!");
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Gagal update stok");
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
            <div className="hidden md:flex justify-between items-center px-7 py-4 bg-white border-b">
              <h1 className="text-2xl font-bold text-gray-900">Stok Bahan</h1>
              <div className="flex items-center gap-3">
                <img src="https://placehold.co/36x36/d97706/d97706" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
              </div>
            </div>

            <div className="p-7">
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
                          {editingItem === item._id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                className="w-24 px-2 py-1 border rounded text-sm"
                                autoFocus
                              />
                              <button
                                onClick={() => updateStock(item._id, editStock)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="px-2 py-1 bg-gray-300 rounded text-xs"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <span className={`font-semibold ${getStockColor(item.stock)}`}>
                              {item.stock} {item.unit || "unit"}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">{getStatusBadge(item.stock)}</td>
                        <td className="px-5 py-3">
                          <button 
                            onClick={() => {
                              setEditingItem(item._id);
                              setEditStock(item.stock.toString());
                            }}
                            className="p-2 border rounded-md hover:bg-gray-50"
                          >
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </button>
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
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}