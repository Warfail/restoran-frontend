import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import SettingsModal from "../components/SettingsModal";

export default function InventoryPageNew() {
  const [currentUser, setCurrentUser] = useState(null);
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
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.getInventory();
      const data = response.data || response;
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (itemId, newStock) => {
    try {
      await api.updateStock(itemId, { stock: newStock });
      await fetchInventory();
      toast.success("Stok berhasil diupdate!");
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

  // Hitung statistik dari data real
  const stats = {
    total: inventory.length,
    kritis: inventory.filter(i => i.stock <= 5 && i.stock > 0).length,
    hampirHabis: inventory.filter(i => i.stock <= 10 && i.stock > 5).length,
    habis: inventory.filter(i => i.stock === 0).length
  };

  const getStatusBadge = (stock) => {
    if (stock === 0) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">HABIS</span>;
    if (stock <= 5) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">KRITIS</span>;
    if (stock <= 10) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">MENIPIS</span>;
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">AMAN</span>;
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-red-600";
    if (stock <= 5) return "text-orange-500";
    if (stock <= 10) return "text-yellow-600";
    return "text-green-600";
  };

  // Filter data
  const filteredInventory = inventory.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "Semua" || 
      (statusFilter === "Habis" && item.stock === 0) ||
      (statusFilter === "Kritis" && item.stock <= 5 && item.stock > 0) ||
      (statusFilter === "Menipis" && item.stock <= 10 && item.stock > 5) ||
      (statusFilter === "Aman" && item.stock > 10);
    const matchCategory = categoryFilter === "Semua" || item.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });



  return (
    <div className="flex h-screen w-full font-['Inter',sans-serif] bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[220px] min-w-[220px] bg-[#c0392b] flex flex-col h-full">
        <div className="px-6 py-7 pb-5">
          <div className="text-white text-xl font-bold">Singkong Keju D9</div>
          <div className="text-[#f8c8c0] text-[11px] font-semibold tracking-wide uppercase mt-0.5">ADMIN PANEL</div>
        </div>
        
        <div className="flex flex-col gap-1 px-3 flex-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#f8d7d3] text-sm font-medium hover:bg-white/10">
            <i className="ti ti-layout-dashboard text-base"></i><span>Ringkasan</span>
          </button>
          <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#f8d7d3] text-sm font-medium hover:bg-white/10">
            <i className="ti ti-tools-kitchen-2 text-base"></i><span>Manajemen Menu</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#e74c3c] text-white text-sm font-semibold">
            <i className="ti ti-package text-base"></i><span>Stok Bahan</span>
          </button>
          <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#f8d7d3] text-sm font-medium hover:bg-white/10">
            <i className="ti ti-users text-base"></i><span>Manajemen Pengguna</span>
          </button>
          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#f8d7d3] text-sm font-medium hover:bg-white/10">
            <i className="ti ti-chart-bar text-base"></i><span>Laporan Penjualan</span>
          </button>
        </div>

        <div className="flex flex-col gap-1 px-3 pb-6 mt-auto">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#f8d7d3] text-sm font-medium hover:bg-white/10">
            <i className="ti ti-settings text-base"></i><span>Pengaturan</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#f8d7d3] text-sm font-medium hover:bg-white/10">
            <i className="ti ti-logout text-base"></i><span>Keluar</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Inventory</span><span>/</span><span className="text-[#c0392b] font-medium">Stock Management</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1"><i className="ti ti-bell text-xl text-gray-500"></i><i className="ti ti-help-circle text-xl text-gray-500"></i></div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <div className="text-gray-900 text-sm font-semibold">{currentUser?.fullName || currentUser?.username || ""}</div>
                <div className="text-gray-500 text-xs font-medium">{currentUser?.role?.toUpperCase() || "ROLE"}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm border border-gray-200">
                {currentUser?.profilePicture ? (
                  <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (currentUser?.fullName || currentUser?.username || "U").charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">Stok Bahan</h1>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border p-5 h-24 shadow-sm"></div>
                <div className="bg-white rounded-xl border p-5 h-24 shadow-sm"></div>
                <div className="bg-white rounded-xl border p-5 h-24 shadow-sm"></div>
                <div className="bg-white rounded-xl border p-5 h-24 shadow-sm"></div>
              </div>
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border shadow-sm p-4 space-y-4">
                <div className="h-10 bg-gray-100 rounded w-full"></div>
                <div className="h-12 bg-gray-100 rounded w-full"></div>
                <div className="h-12 bg-gray-100 rounded w-full"></div>
                <div className="h-12 bg-gray-100 rounded w-full"></div>
                <div className="h-12 bg-gray-100 rounded w-full"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards - Data Real dari MongoDB */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center"><i className="ti ti-package text-2xl text-green-700"></i></div>
                  <div><div className="text-xs text-gray-500 font-medium">Total SKU</div><div className="text-2xl font-bold">{stats.total} Item</div></div>
                </div>
                <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center"><i className="ti ti-alert-triangle text-2xl text-orange-700"></i></div>
                  <div><div className="text-xs text-gray-500 font-medium">Kritis (≤5)</div><div className="text-2xl font-bold text-orange-600">{stats.kritis} Item</div></div>
                </div>
                <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center"><i className="ti ti-hourglass text-2xl text-yellow-700"></i></div>
                  <div><div className="text-xs text-gray-500 font-medium">Hampir Habis (≤10)</div><div className="text-2xl font-bold text-yellow-600">{stats.hampirHabis} Item</div></div>
                </div>
                <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center"><i className="ti ti-clipboard-list text-2xl text-red-700"></i></div>
                  <div><div className="text-xs text-gray-500 font-medium">Habis</div><div className="text-2xl font-bold text-red-600">{stats.habis} Item</div></div>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>
                  <input type="text" placeholder="Cari...." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <select className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option>Semua</option><option>Habis</option><option>Kritis</option><option>Menipis</option><option>Aman</option>
                    </select>
                    <i className="ti ti-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
                  </div>
                  <div className="relative">
                    <select className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                      <option>Semua</option><option>Bahan Baku</option><option>Topping</option>
                    </select>
                    <i className="ti ti-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">ITEM NAME</th>
                        <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">KATEGORI</th>
                        <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">CURRENT STOCK</th>
                        <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">SAFETY LIMIT</th>
                        <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">STATUS</th>
                        <th className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map((item) => (
                        <tr key={item._id} className="border-b border-gray-50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center"><i className="ti ti-package text-gray-500"></i></div>
                              <span className="font-semibold text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-gray-700">{item.category || "Bahan Baku"}</td>
                          <td className="px-3 py-4"><span className={`font-semibold ${getStockColor(item.stock)}`}>{item.stock} {item.unit || "unit"}</span></td>
                          <td className="px-3 py-4 text-gray-700">{item.minStock || 10} {item.unit || "unit"}</td>
                          <td className="px-3 py-4">{getStatusBadge(item.stock)}</td>
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <i className="ti ti-pencil text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => {
                                const newStock = prompt("Update stok:", item.stock);
                                if (newStock !== null) updateStock(item._id, parseInt(newStock));
                              }}></i>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredInventory.length === 0 && (
                        <tr><td colSpan="6" className="text-center py-8 text-gray-400">Belum ada data inventory</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}