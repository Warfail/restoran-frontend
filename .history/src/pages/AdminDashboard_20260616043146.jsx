import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Sidebar from "../components/admin/Sidebar";
import StatsCard from "../components/admin/StatsCard";
import TopMenuList from "../components/admin/TopMenuList";
import BottomMenuList from "../components/admin/BottomMenuList";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import Footer from "../components/admin/Footer";
import { Eye } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalMenus: 0,
    totalUsers: 0
  });
  const [topMenus, setTopMenus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const orders = await api.getOrders();
      const menus = await api.getMenu();
      
      const ordersData = orders.data || orders;
      const menusData = menus.data || menus;
      
      const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0;
      const totalMenus = Array.isArray(menusData) ? menusData.length : 0;
      const totalSales = Array.isArray(ordersData) 
        ? ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        : 0;
      
      setStats({
        totalSales,
        totalOrders,
        totalMenus,
        totalUsers: 0
      });
      
      setTopMenus(Array.isArray(menusData) ? menusData.slice(0, 5) : []);
      setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stats card data (array untuk map)
  const statsCards = [
    { title: "Total Penjualan", value: `Rp ${stats.totalSales.toLocaleString()}`, icon: "💰", bgColor: "bg-green-50", iconColor: "text-green-600", growth: "+12.5%" },
    { title: "Total Pesanan", value: stats.totalOrders.toLocaleString(), icon: "🛒", bgColor: "bg-yellow-50", iconColor: "text-yellow-600", growth: "+5.2%" },
    { title: "Total Menu", value: stats.totalMenus.toLocaleString(), icon: "🍽️", bgColor: "bg-blue-50", iconColor: "text-blue-600", growth: "+2.1%" },
    { title: "Total User", value: stats.totalUsers.toLocaleString(), icon: "👥", bgColor: "bg-purple-50", iconColor: "text-purple-600", growth: "+0.8%" }
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
          <p className="text-gray-500 mt-1">Selamat datang, Admin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopMenuList menus={topMenus} />
          <BottomMenuList menus={[]} /> {/* Belum ada data untuk bottom menus */}
        </div>

        <RecentOrdersTable orders={recentOrders} />
        <Footer />
      </main>
    </div>
  );
}