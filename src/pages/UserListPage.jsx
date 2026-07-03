import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import UpdateUserModal from "../components/UpdateUserModal";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  UserPlus, 
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
  LogOut,
  Bell,
  HelpCircle,
  Filter,
  ArrowUpDown,
  Shield,
  History,
  ArrowRight,
  Check
} from "lucide-react";
import { api } from "../services/api";
import SettingsModal from "../components/SettingsModal";
import MobileHeader from "../components/admin/MobileHeader";
import Sidebar from "../components/admin/Sidebar";

export default function UserListPage() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getUsers();
      const usersData = response.data || response;
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const handleUpdateUser = async (userId, formData) => {
    try {
      await api.updateUser(userId, formData);
      toast.success("User berhasil diupdate!");
      fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Gagal mengupdate user");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (confirm(`Hapus user "${username}"?`)) {
      try {
        await api.deleteUser(userId);
        toast.success("User berhasil dihapus!");
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Gagal menghapus user");
      }
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Hitung statistik dari data real
  const stats = [
    { title: "Total Staf", value: users.length.toString(), icon: "👥", bgColor: "bg-green-50", iconColor: "text-green-700" },
    { title: "Aktif", value: users.filter(u => u.isActive !== false).length.toString(), icon: "🛡️", bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    { title: "Nonaktif", value: users.filter(u => u.isActive === false).length.toString(), icon: "📅", bgColor: "bg-pink-50", iconColor: "text-pink-500" },
    { title: "Admin", value: users.filter(u => u.role === "admin").length.toString(), icon: "⚙️", bgColor: "bg-gray-100", iconColor: "text-gray-500" },
  ];

  // Filter users berdasarkan search
  const filteredUsers = users.filter(user => {
    const matchSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (user.fullName || user.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadge = (rawRole) => {
    const role = (rawRole || "").toLowerCase();
    const normalizedRole = role === "cashier" ? "kasir" : role;
    
    switch (normalizedRole) {
      case "admin":
        return { text: "Admin", class: "bg-gray-100 text-gray-700" };
      case "kasir":
        return { text: "Kasir", class: "bg-green-50 text-green-700" };
      case "kitchen":
        return { text: "Kitchen", class: "bg-amber-50 text-amber-700" };
      default:
        return { text: rawRole || "Staff", class: "bg-gray-100 text-gray-600" };
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };



  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar active="users" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <MobileHeader title="Manajemen Pengguna" onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 md:p-8 animate-pulse space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
               <div className="h-24 bg-gray-200 rounded-xl"></div>
               <div className="h-24 bg-gray-200 rounded-xl"></div>
               <div className="h-24 bg-gray-200 rounded-xl"></div>
               <div className="h-24 bg-gray-200 rounded-xl"></div>
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
            {/* Header */}
            <div className="hidden md:flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
              <h1 className="text-2xl font-bold text-green-700">Manajemen Pengguna</h1>
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer"><Bell className="w-4 h-4 text-gray-500" /></div>
                <div className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer"><HelpCircle className="w-4 h-4 text-gray-500" /></div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-gray-900 text-sm font-semibold">{currentUser?.fullName || currentUser?.name || currentUser?.username || ""}</div>
                    <div className="text-gray-500 text-xs font-medium">{currentUser?.role?.toUpperCase() || "ROLE"}</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm border border-gray-200">
                    {currentUser?.profilePicture ? (
                      <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (currentUser?.fullName || currentUser?.name || currentUser?.username || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {/* Search & Add */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex-1 max-w-md w-full">
                  <div className="text-gray-500 text-xs font-medium mb-1">Cari Karyawan</div>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Cari nama atau username..." 
                      className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none" 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                  </div>
                </div>
                <button onClick={() => navigate("/users/add")} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm w-full sm:w-auto mt-4 sm:mt-0">
                  <UserPlus className="w-4 h-4" />
                  Tambah Karyawan
                </button>
              </div>

              {/* Stats - Data Real */}
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

              {/* Table */}
              <div className="bg-white rounded-xl border border-gray-200">
                {/* Filter Bar */}
                <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-3 border-b border-gray-200">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 bg-white">
                      <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                    <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 bg-white">
                      <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan
                    </button>
                  </div>
                  <div className="text-gray-500 text-xs">
                    Menampilkan {paginatedUsers.length} dari {filteredUsers.length} karyawan
                  </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">NAMA KARYAWAN</th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">USERNAME</th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">PERAN</th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">STATUS</th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => {
                        const role = getRoleBadge(user.role);
                        const isActive = user.isActive !== false;
                        
                        return (
                          <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full ${isActive ? 'bg-green-700' : 'bg-gray-400'} flex items-center justify-center text-white font-bold text-sm`}>
                                  {getInitials(user.fullName || user.name || user.username)}
                                </div>
                                <div>
                                  <div className="text-gray-900 text-sm font-medium">{user.fullName || user.name || "-"}</div>
                                  <div className="text-gray-400 text-xs">{user.email || user.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-gray-500 text-sm">{user.username}</td>
                            <td className="px-3 py-3">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${role.class}`}>
                                {role.text}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`flex items-center gap-1.5 text-xs font-medium ${isActive ? 'text-green-600' : 'text-red-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-600' : 'bg-red-500'}`}></span>
                                {isActive ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openUpdateModal(user)} className="text-gray-400 hover:text-gray-600">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteUser(user._id, user.username)} className="text-gray-400 hover:text-red-500">
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {paginatedUsers.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-gray-400">
                            Tidak ada data user
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      Baris per halaman: <span className="border border-gray-200 rounded px-2 py-0.5 text-gray-700 bg-white">{itemsPerPage}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-50"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-8 h-8 rounded-md ${currentPage === i + 1 ? 'bg-green-700 text-white' : 'border border-gray-200 text-gray-700'} text-sm font-semibold`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-50"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Cards - Tetap seperti sebelumnya */}
              <div className="grid grid-cols-2 gap-5 mt-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-2"><Shield className="w-5 h-5 text-green-700" /><h3 className="text-gray-900 font-bold">Keamanan & Akses</h3></div>
                  <p className="text-gray-500 text-sm mb-4">Atur kebijakan kata sandi dan pembatasan IP untuk menjaga integritas data sistem Singkong Keju D9.</p>
                  <div className="space-y-2 mb-4"><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center"><Check className="w-3 h-3 text-green-600" /></div><span className="text-gray-600 text-sm">Otentikasi Dua Faktor (2FA) diaktifkan</span></div><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center"><Check className="w-3 h-3 text-green-600" /></div><span className="text-gray-600 text-sm">Kedaluwarsa sesi: 8 Jam</span></div></div>
                  <button className="text-green-700 text-sm font-semibold flex items-center gap-1">Konfigurasi Keamanan <ArrowRight className="w-3.5 h-3.5" /></button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-2"><History className="w-5 h-5 text-amber-600" /><h3 className="text-gray-900 font-bold">Log Aktivitas Terbaru</h3></div>
                  <div className="space-y-3 mb-4"><div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-green-600 mt-1.5"></div><div><span className="text-gray-800 text-sm font-medium">System</span><span className="text-gray-500 text-sm"> Total {users.length} user terdaftar</span><div className="text-gray-400 text-xs mt-0.5">Sistem</div></div></div></div>
                  <button className="text-amber-600 text-sm font-semibold flex items-center gap-1">Lihat Semua Log <ArrowRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </>
        )}
        </main>
      </div>

      <UpdateUserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateUser}
      />
    
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}