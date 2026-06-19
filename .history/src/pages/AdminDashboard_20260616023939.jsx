import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Sidebar from "../components/admin/Sidebar";
import StatsCard from "../components/admin/StatsCard";
import TopMenuList from "../components/admin/TopMenuList";
import BottomMenuList from "../components/admin/BottomMenuList";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import Footer from "../components/admin/Footer";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
// ... import lainnya

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
      
      // Ambil data dari API
      const orders = await api.getOrders();
      const menus = await api.getMenu();
      
      const ordersData = orders.data || orders;
      const menusData = menus.data || menus;
      
      // Hitung statistik
      const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0;
      const totalMenus = Array.isArray(menusData) ? menusData.length : 0;
      const totalSales = Array.isArray(ordersData) 
        ? ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        : 0;
      
      setStats({
        totalSales,
        totalOrders,
        totalMenus,
        totalUsers: 0 // nanti dari API users
      });
      
      // Top 5 menus (sementara dari menu list)
      setTopMenus(Array.isArray(menusData) ? menusData.slice(0, 5) : []);
      
      // Recent orders
      setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... render JSX (sama seperti sebelumnya, tapi data dari state)
}

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
          {stats.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopMenuList menus={topMenus} />
          <BottomMenuList menus={bottomMenus} />
        </div>

        <RecentOrdersTable orders={recentOrders} />
        <Footer />
      </main>
    </div>
  );
}