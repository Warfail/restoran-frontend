import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Sidebar from "../components/admin/Sidebar";
import StatsCard from "../components/admin/StatsCard";
import TopMenuList from "../components/admin/TopMenuList";
import BottomMenuList from "../components/admin/BottomMenuList";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import Footer from "../components/admin/Footer";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalMenus: 0,
    totalUsers: 0,
    todaySales: 0,
    todayOrders: 0
  });
  const [topMenus, setTopMenus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Ambil data dari API
      const [ordersRes, menusRes, usersRes, reportsRes] = await Promise.all([
        api.getOrders(),
        api.getMenu(),
        api.getUsers(),
        api.getSalesReport ? api.getSalesReport() : Promise.resolve({ data: {} })
      ]);
      
      // Parse data orders
      const ordersData = ordersRes?.data || ordersRes || [];
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      
      // Parse data menus
      const menusData = menusRes?.data || menusRes || [];
      const menusArray = Array.isArray(menusData) ? menusData : [];
      
      // Parse data users
      const usersData = usersRes?.data || usersRes || [];
      const usersArray = Array.isArray(usersData) ? usersData : [];
      
      // Hitung total penjualan (semua waktu)
      const totalSales = ordersArray.reduce((sum, order) => {
        const amount = order?.totalAmount ?? order?.total ?? 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);
      
      // Hitung penjualan hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayOrders = ordersArray.filter(order => {
        const orderDate = order?.createdAt ? new Date(order.createdAt) : null;
        return orderDate && orderDate >= today;
      });
      
      const todaySales = todayOrders.reduce((sum, order) => {
        const amount = order?.totalAmount ?? order?.total ?? 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);
      
      // Hitung menu terlaris (top menus)
      const menuSales = {};
      ordersArray.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const menuName = item.name || item.menuName;
            if (menuName) {
              menuSales[menuName] = (menuSales[menuName] || 0) + (item.quantity || 1);
            }
          });
        }
      });
      
      const topMenusList = Object.entries(menuSales)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      
      setStats({
        totalSales: totalSales,
        totalOrders: ordersArray.length,
        totalMenus: menusArray.length,
        totalUsers: usersArray.length,
        todaySales: todaySales,
        todayOrders: todayOrders.length
      });
      
      setTopMenus(topMenusList.length > 0 ? topMenusList : menusArray.slice(0, 5).map(m => ({ name: m.name, quantity: 0 })));
      setRecentOrders(ordersArray.slice(0, 5));
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      
      // Fallback ke data dummy jika error
      setStats({
        totalSales: 0,
        totalOrders: 0,
        totalMenus: 0,
        totalUsers: 0,
        todaySales: 0,
        todayOrders: 0
      });
      setTopMenus([]);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Stats card data dari database
  const statsCards = [
    { 
      title: "Total Penjualan", 
      value: `Rp ${stats.totalSales.toLocaleString("id-ID")}`, 
      subValue: `Hari ini: Rp ${stats.todaySales.toLocaleString("id-ID")}`,
      icon: "💰", 
      bgColor: "bg-green-50", 
      iconColor: "text-green-600"
    },
    { 
      title: "Total Pesanan", 
      value: stats.totalOrders.toLocaleString("id-ID"), 
      subValue: `Hari ini: ${stats.todayOrders} order`,
      icon: "🛒", 
      bgColor: "bg-yellow-50", 
      iconColor: "text-yellow-600"
    },
    { 
      title: "Total Menu", 
      value: stats.totalMenus.toLocaleString("id-ID"), 
      subValue: "Menu aktif",
      icon: "🍽️", 
      bgColor: "bg-blue-50", 
      iconColor: "text-blue-600"
    },
    { 
      title: "Total User", 
      value: stats.totalUsers.toLocaleString("id-ID"), 
      subValue: "Admin + Kasir + Kitchen",
      icon: "👥", 
      bgColor: "bg-purple-50", 
      iconColor: "text-purple-600"
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
          <p className="text-gray-500 mt-1">Selamat datang, Admin</p>
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
    </div>
  );
}