import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Sidebar from "../components/admin/Sidebar";
import StatsCard from "../components/admin/StatsCard";
import TopMenuList from "../components/admin/TopMenuList";
import BottomMenuList from "../components/admin/BottomMenuList";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import Footer from "../components/admin/Footer";
import SettingsModal from "../components/SettingsModal";

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Selamat datang, {currentUser?.fullName || currentUser?.username || "Admin"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopMenuList menus={topMenus} />
          <BottomMenuList menus={[]} />
        </div>

        <RecentOrdersTable orders={recentOrders} />
        <Footer />
      </main>
    
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}