import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Sidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";
import MobileHeader from "../components/admin/MobileHeader";
import StatsCard from "../components/admin/StatsCard";
import TopMenuList from "../components/admin/TopMenuList";
import BottomMenuList from "../components/admin/BottomMenuList";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import Footer from "../components/admin/Footer";
import SettingsModal from "../components/SettingsModal";
import NotificationDropdown from "../components/NotificationDropdown";
import { HelpCircle, X } from "lucide-react";

export default function AdminDashboard() {
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalMenus: 0,
    totalUsers: 0,
    lastMonthSales: 0,
    lastMonthOrders: 0,
    lastMonthMenus: 0,
    lastMonthUsers: 0
  });
  const [topMenus, setTopMenus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Ambil semua data dari API
      const [ordersRes, menusRes, usersRes] = await Promise.all([
        api.getOrders(),
        api.getMenu(),
        api.getUsers().catch(() => ({ data: [] }))
      ]);
      
      // Parse data orders
      let ordersArray = [];
      if (ordersRes) {
        if (Array.isArray(ordersRes)) {
          ordersArray = ordersRes;
        } else if (ordersRes.data && Array.isArray(ordersRes.data)) {
          ordersArray = ordersRes.data;
        } else if (ordersRes.orders && Array.isArray(ordersRes.orders)) {
          ordersArray = ordersRes.orders;
        }
      }
      
      // Parse data menus
      let menusArray = [];
      if (menusRes) {
        if (Array.isArray(menusRes)) {
          menusArray = menusRes;
        } else if (menusRes.data && Array.isArray(menusRes.data)) {
          menusArray = menusRes.data;
        }
      }
      
      // Parse data users
      let usersArray = [];
      if (usersRes) {
        if (Array.isArray(usersRes)) {
          usersArray = usersRes;
        } else if (usersRes.data && Array.isArray(usersRes.data)) {
          usersArray = usersRes.data;
        }
      }
      
      // Hitung total saat ini
      const currentSales = ordersArray.reduce((sum, order) => {
        const amount = order?.totalAmount || order?.total || order?.grandTotal || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);
      
      const currentOrders = ordersArray.length;
      const currentMenus = menusArray.length;
      const currentUsers = usersArray.length;
      
      // Hitung data bulan lalu (untuk growth)
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const lastMonthOrdersList = ordersArray.filter(order => {
        const orderDate = order?.createdAt ? new Date(order.createdAt) : null;
        return orderDate && orderDate >= firstDayLastMonth && orderDate <= lastDayLastMonth;
      });
      
      const lastMonthSales = lastMonthOrdersList.reduce((sum, order) => {
        const amount = order?.totalAmount || order?.total || order?.grandTotal || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);
      
      const lastMonthOrders = lastMonthOrdersList.length;
      
      // Hitung growth (persentase)
      const calculateGrowth = (current, last) => {
        if (last === 0) return current > 0 ? 100 : 0;
        return parseFloat(((current - last) / last * 100).toFixed(1));
      };
      
      setStats({
        totalSales: currentSales,
        totalOrders: currentOrders,
        totalMenus: currentMenus,
        totalUsers: currentUsers,
        lastMonthSales: lastMonthSales,
        lastMonthOrders: lastMonthOrders,
        lastMonthMenus: 0, // Belum ada data historis menu
        lastMonthUsers: 0   // Belum ada data historis user
      });
      
      // Hitung menu terlaris
      const menuSales = {};
      ordersArray.forEach(order => {
        const items = order?.items || order?.orderItems || [];
        if (Array.isArray(items)) {
          items.forEach(item => {
            const menuName = item?.name || item?.menuName || item?.productName;
            const quantity = item?.quantity || 1;
            if (menuName) {
              menuSales[menuName] = (menuSales[menuName] || 0) + quantity;
            }
          });
        }
      });
      
      const topMenusList = Object.entries(menuSales)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      
      setTopMenus(topMenusList.length > 0 ? topMenusList : menusArray.slice(0, 5).map(m => ({ name: m.name, quantity: 0 })));
      setRecentOrders(ordersArray.slice(0, 5));
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hitung growth untuk setiap card
  const salesGrowth = stats.lastMonthSales === 0 
    ? (stats.totalSales > 0 ? 100 : 0)
    : parseFloat(((stats.totalSales - stats.lastMonthSales) / stats.lastMonthSales * 100).toFixed(1));
    
  const ordersGrowth = stats.lastMonthOrders === 0
    ? (stats.totalOrders > 0 ? 100 : 0)
    : parseFloat(((stats.totalOrders - stats.lastMonthOrders) / stats.lastMonthOrders * 100).toFixed(1));

  // Stats card data dengan growth dari database
  const statsCards = [
    { 
      title: "Total Penjualan", 
      value: `Rp ${stats.totalSales.toLocaleString('id-ID')}`, 
      icon: "💰", 
      bgColor: "bg-green-50", 
      iconColor: "text-green-600",
      growth: salesGrowth
    },
    { 
      title: "Total Pesanan", 
      value: stats.totalOrders.toLocaleString('id-ID'), 
      icon: "🛒", 
      bgColor: "bg-yellow-50", 
      iconColor: "text-yellow-600",
      growth: ordersGrowth
    },
    { 
      title: "Total Menu", 
      value: stats.totalMenus.toLocaleString('id-ID'), 
      icon: "🍽️", 
      bgColor: "bg-blue-50", 
      iconColor: "text-blue-600",
      growth: 0
    },
    { 
      title: "Total User", 
      value: stats.totalUsers.toLocaleString('id-ID'), 
      icon: "👥", 
      bgColor: "bg-purple-50", 
      iconColor: "text-purple-600",
      growth: 0
    }
  ];

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    if (status === 'paid' || status === 'completed') return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">SELESAI</span>;
    if (status === 'cooking') return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">DIMASAK</span>;
    if (status === 'processing') return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">DIPROSES</span>;
    if (status === 'cancelled') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">BATAL</span>;
    return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">MENUNGGU</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <Sidebar active="dashboard" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <MobileHeader title="Dashboard" onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8 flex-1">
        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="h-32 bg-gray-200 rounded-xl"></div>
               <div className="h-32 bg-gray-200 rounded-xl"></div>
               <div className="h-32 bg-gray-200 rounded-xl"></div>
               <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="h-64 bg-gray-200 rounded-xl"></div>
               <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-80 bg-gray-200 rounded-xl"></div>
          </div>
        ) : (
          <>
              <AdminHeader 
                title="Dashboard" 
                subtitle={`Selamat datang, ${currentUser?.fullName || currentUser?.username || "Admin"}`}
              >
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, idx) => (
                <StatsCard key={idx} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <TopMenuList menus={topMenus} />
              <BottomMenuList menus={[]} />
            </div>

            <RecentOrdersTable orders={recentOrders} onViewDetail={handleViewOrder} />
            <Footer />
          </>
        )}
      </main>
      </div>

      {showOrderDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Detail Pesanan</h2>
              <button onClick={() => setShowOrderDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm text-gray-500 font-bold mb-1">ID Pesanan</div>
                  <div className="font-mono font-black text-lg text-gray-900">{selectedOrder.orderId}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-bold mb-1">Status</div>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Pelanggan</div>
                    <div className="font-bold text-gray-900">{selectedOrder.customerName || selectedOrder.customer?.name || "Guest"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Meja</div>
                    <div className="font-bold text-gray-900">{selectedOrder.tableNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Tipe</div>
                    <div className="font-bold text-gray-900">{selectedOrder.orderType || "Dine In"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Waktu</div>
                    <div className="font-bold text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Daftar Menu</h3>
              <div className="space-y-3 mb-6">
                {(selectedOrder.items || selectedOrder.orderItems || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-700">{item.quantity}x</div>
                      <div>
                        <div className="font-bold text-gray-900">{item.menuName || item.name}</div>
                        {item.notes && <div className="text-xs text-gray-500 italic">Catatan: {item.notes}</div>}
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-600 text-lg">Total Pembayaran</span>
                  <span className="font-black text-green-700 text-2xl">Rp {(selectedOrder.totalAmount || selectedOrder.grandTotal || selectedOrder.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              <button 
                onClick={() => setShowOrderDetailsModal(false)}
                className="px-6 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}