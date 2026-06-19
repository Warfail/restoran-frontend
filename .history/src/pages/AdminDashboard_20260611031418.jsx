import { useState, useEffect } from "react";
import Sidebar from "../components/admin/Sidebar";
import StatsCard from "../components/admin/StatsCard";
import TopMenuList from "../components/admin/TopMenuList";
import BottomMenuList from "../components/admin/BottomMenuList";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import Footer from "../components/admin/Footer";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [topMenus, setTopMenus] = useState([]);
  const [bottomMenus, setBottomMenus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setStats([
        { title: "Total Penjualan", value: "Rp 45.280.000", icon: "💰", growth: 12.5, bgColor: "bg-green-50", iconColor: "text-green-700" },
        { title: "Total Pesanan", value: "1,842 Pesanan", icon: "📦", growth: 5.2, bgColor: "bg-amber-50", iconColor: "text-amber-700" },
        { title: "Pelanggan Baru", value: "324 Orang", icon: "👥", growth: 8.1, bgColor: "bg-pink-50", iconColor: "text-pink-700" },
        { title: "Rata-rata Keranjang", value: "Rp 24.580", icon: "🛒", growth: -2.4, bgColor: "bg-orange-50", iconColor: "text-orange-700" }
      ]);

      setTopMenus([
        { name: "Singkong Keju Original", price: 25000, sold: 842 },
        { name: "Singkong Keju Premium", price: 35000, sold: 620 },
        { name: "Singkong Goreng Rempah", sold: 512 },
        { name: "Singkong Keju Coklat", sold: 430 },
        { name: "Paket Hemat Keluarga", price: 75000, sold: 390 }
      ]);

      setBottomMenus([
        { name: "Singkong Thailand Pedas", sold: 42 },
        { name: "Keripik Singkong Madu", sold: 35 },
        { name: "Minuman Jahe Instan", sold: 28 },
        { name: "Extra Topping Saus Keju", sold: 22 },
        { name: "Edisi Terbatas Matcha", sold: 12 }
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