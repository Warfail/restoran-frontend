import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import StatsCard from "../components/admin/StatsCard";
import TopMenuList from "../components/admin/TopMenuList";
import BottomMenuList from "../components/admin/BottomMenuList";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import Footer from "../components/admin/Footer";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [topMenus, setTopMenus] = useState([]);
  const [bottomMenus, setBottomMenus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setStats([
        { title: "Total Penjualan", value: "Rp 45.230.000", icon: "💰", growth: "+12.5%", bgColor: "bg-green-50", iconColor: "text-green-600" },
        { title: "Total Pesanan", value: "1,284", icon: "🛒", growth: "+8.2%", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
        { title: "Pelanggan Baru", value: "342", icon: "👥", growth: "-2.1%", bgColor: "bg-red-50", iconColor: "text-red-600" },
        { title: "Rata-rata Rating", value: "4.8/5.0", icon: "⭐", growth: "+0.4%", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" }
      ]);

      setTopMenus([
        { name: "Singkong Keju Original", price: 25000, sold: 842 },
        { name: "Singkong Keju Cokelat", price: 28000, sold: 612 },
        { name: "Singkong Keju Spesial", price: 32000, sold: 540 },
        { name: "Es Teh Manis Jumbo", price: 8000, sold: 480 }
      ]);

      setBottomMenus([
        { name: "Kopi Tubruk Gula Aren", sold: 12 },
        { name: "Singkong Rebus Polos", sold: 18 },
        { name: "Juice Alpukat (Seasonal)", sold: 24 },
        { name: "Es Jeruk Hangat", sold: 32 }
      ]);

      setRecentOrders([
        { id: "#D9-00124", customer: "Budi Santoso", time: "14:20 WIB", method: "QRIS", status: "SELESAI", total: 65000 },
        { id: "#D9-00123", customer: "Ani Wijaya", time: "14:15 WIB", method: "Tunai", status: "PROSES", total: 25000 },
        { id: "#D9-00122", customer: "Siti Aminah", time: "13:58 WIB", method: "Transfer Bank", status: "SELESAI", total: 120000 }
      ]);

      setLoading(false);
    }, 500);
  }, []);

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