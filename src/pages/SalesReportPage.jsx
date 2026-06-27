import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut, Search, HelpCircle, Bell, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import SettingsModal from "../components/SettingsModal";

import { api } from "../services/api";

export default function SalesReportPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  const [activePeriod, setActivePeriod] = useState("Bulanan");
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  
  // Calculate current week string for input type="week"
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const d = new Date();
    const startDate = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    return `${d.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const navigate = useNavigate();

  const [ordersData, setOrdersData] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getOrders();
        const data = res?.data || res || [];
        setOrdersData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentChartData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Process orders: filter completed/paid orders
    const validOrders = ordersData.filter(o => 
      o.status === "completed" || 
      o.payment_status === "paid" || 
      o.status === "paid"
    );

    if (activePeriod === "Tahunan") {
      const year = parseInt(selectedYear) || today.getFullYear();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      
      for (let i = 0; i < 12; i++) {
        const isFuture = year > currentYear || (year === currentYear && i > currentMonth);
        
        // Sum revenue for this month
        let monthlyRevenue = 0;
        let lastYearRevenue = 0;
        
        validOrders.forEach(o => {
          let dateStr = o.createdAt || o.updatedAt;
          const date = new Date(dateStr);
          if (date.getFullYear() === year && date.getMonth() === i) {
            monthlyRevenue += (o.totalAmount || 0);
          }
          if (date.getFullYear() === year - 1 && date.getMonth() === i) {
            lastYearRevenue += (o.totalAmount || 0);
          }
        });

        data.push({
          name: `${months[i]} ${year}`,
          pendapatan: monthlyRevenue,
          tahunLalu: lastYearRevenue
        });
      }
      return data;
    }
    
    let start, end;
    
    if (activePeriod === "Mingguan") {
      const [yearStr, weekStr] = selectedWeek.split('-W');
      const year = parseInt(yearStr);
      const week = parseInt(weekStr);
      const simpleDate = new Date(year, 0, 1 + (week - 1) * 7);
      const dayOfWeek = simpleDate.getDay();
      start = new Date(simpleDate);
      start.setDate(simpleDate.getDate() - dayOfWeek + 1);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    } else if (activePeriod === "Bulanan") {
      const [y, m] = selectedMonth.split('-');
      start = new Date(parseInt(y), parseInt(m) - 1, 1);
      end = new Date(parseInt(y), parseInt(m), 0);
    }
    
    if (start > end || isNaN(start.getTime())) return [];
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysToGenerate = Math.min(diffDays + 1, 90);
    
    let curr = new Date(start);
    for (let i = 0; i < daysToGenerate; i++) {
      const dateStr = curr.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      const currNormalized = new Date(curr);
      currNormalized.setHours(0, 0, 0, 0);
      
      let dailyRevenue = 0;
      let lastYearDailyRevenue = 0;
      
      validOrders.forEach(o => {
        let orderDateStr = o.createdAt || o.updatedAt;
        const orderDate = new Date(orderDateStr);
        const orderDateNormalized = new Date(orderDate);
        orderDateNormalized.setHours(0, 0, 0, 0);
        
        if (orderDateNormalized.getTime() === currNormalized.getTime()) {
          dailyRevenue += (o.totalAmount || 0);
        }
        
        // For last year
        const lastYearDate = new Date(currNormalized);
        lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
        if (orderDateNormalized.getTime() === lastYearDate.getTime()) {
          lastYearDailyRevenue += (o.totalAmount || 0);
        }
      });
      
      data.push({
        name: dateStr,
        pendapatan: dailyRevenue,
        tahunLalu: lastYearDailyRevenue
      });
      curr.setDate(curr.getDate() + 1);
    }
    return data;
  }, [activePeriod, selectedYear, selectedMonth, selectedWeek, ordersData]);

  const currentStats = useMemo(() => {
    const totalPendapatan = currentChartData.reduce((sum, d) => sum + d.pendapatan, 0);
    const validOrders = ordersData.filter(o => 
      o.status === "completed" || 
      o.payment_status === "paid" || 
      o.status === "paid"
    );
    const totalTransaksi = validOrders.length;
    // Asumsi 1 transaksi = 1 pelanggan baru (simplified) atau hitung unique customerName
    const uniqueCustomers = new Set(validOrders.map(o => o.customerName || "Guest")).size;
    
    return {
      pendapatan: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPendapatan),
      pendapatanGrowth: "+12.5%",
      pendapatanGrowthColor: "text-green-600",
      transaksi: new Intl.NumberFormat('id-ID').format(totalTransaksi),
      transaksiGrowth: "+8.2%",
      transaksiGrowthColor: "text-green-600",
      pelanggan: new Intl.NumberFormat('id-ID').format(uniqueCustomers),
      pelangganGrowth: "+2.1%",
      pelangganGrowthColor: "text-green-600",
      rating: "4.8/5.0",
      ratingGrowth: "+0.4",
      ratingGrowthColor: "text-green-600"
    };
  }, [currentChartData, ordersData]);

  const filteredTableData = useMemo(() => {
    if (!searchTerm.trim()) return currentChartData;
    const lowerSearch = searchTerm.toLowerCase();
    return currentChartData.filter(data => 
      data.name.toLowerCase().includes(lowerSearch) ||
      data.pendapatan.toString().includes(lowerSearch) ||
      data.tahunLalu.toString().includes(lowerSearch)
    );
  }, [currentChartData, searchTerm]);

  const { menuLaris, menuKurangLaris } = useMemo(() => {
    const validOrders = ordersData.filter(o => 
      o.status === "completed" || 
      o.payment_status === "paid" || 
      o.status === "paid"
    );

    const itemCounts = {};
    validOrders.forEach(o => {
      (o.items || []).forEach(item => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = 0;
        }
        itemCounts[item.name] += (item.quantity || 1);
      });
    });

    const sortedItems = Object.keys(itemCounts)
      .map(name => ({ name, terjual: itemCounts[name] }))
      .sort((a, b) => b.terjual - a.terjual);

    const maxSales = sortedItems.length > 0 ? sortedItems[0].terjual : 1;
    
    // Add persentase
    const finalItems = sortedItems.map(item => ({
      nama: item.name,
      terjual: item.terjual,
      persentase: Math.min(100, Math.max(5, Math.round((item.terjual / maxSales) * 100)))
    }));

    // Top 5 and Bottom 5
    const top = finalItems.slice(0, 5);
    const bottom = finalItems.length > 5 ? finalItems.slice(-5).reverse() : finalItems.slice(0).reverse();

    // If completely empty, show placeholders
    if (top.length === 0) {
      return {
        menuLaris: [{ nama: "Belum ada data", terjual: 0, persentase: 0 }],
        menuKurangLaris: [{ nama: "Belum ada data", terjual: 0, persentase: 0 }]
      };
    }

    return { menuLaris: top, menuKurangLaris: bottom };
  }, [ordersData]);

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Pendapatan
    const wsPendapatan = XLSX.utils.json_to_sheet(currentChartData.map(item => ({
      Periode: item.name,
      'Pendapatan Tahun Ini (Rp)': item.pendapatan,
      'Pendapatan Tahun Lalu (Rp)': item.tahunLalu
    })));
    XLSX.utils.book_append_sheet(wb, wsPendapatan, "Pendapatan");

    // Sheet 2: Menu Terlaris
    const wsLaris = XLSX.utils.json_to_sheet(menuLaris.map(item => ({
      'Nama Menu': item.nama,
      'Jumlah Terjual (Porsi)': item.terjual,
      'Indikator Performa (%)': item.persentase
    })));
    XLSX.utils.book_append_sheet(wb, wsLaris, "Menu Terlaris");

    // Sheet 3: Menu Kurang Laris
    const wsKurang = XLSX.utils.json_to_sheet(menuKurangLaris.map(item => ({
      'Nama Menu': item.nama,
      'Jumlah Terjual (Porsi)': item.terjual,
      'Indikator Performa (%)': item.persentase
    })));
    XLSX.utils.book_append_sheet(wb, wsKurang, "Menu Kurang Laris");

    const exportName = `Laporan_${activePeriod}_${activePeriod === 'Tahunan' ? selectedYear : activePeriod === 'Bulanan' ? selectedMonth : selectedWeek}`;
    XLSX.writeFile(wb, `${exportName}.xlsx`);
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('laporan-content');
    if (!element) return;
    
    setIsExportingPDF(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      const exportName = `Laporan ${activePeriod} ${activePeriod === 'Tahunan' ? selectedYear : activePeriod === 'Bulanan' ? selectedMonth : selectedWeek}`;
      
      pdf.setFontSize(16);
      pdf.text(exportName, margin, margin + 5);
      
      // Prevent image from overflowing A4 height
      const pageHeight = pdf.internal.pageSize.getHeight();
      let finalHeight = contentHeight;
      if (margin + 10 + contentHeight > pageHeight - margin) {
        finalHeight = pageHeight - margin - (margin + 10);
      }
      
      pdf.addImage(imgData, 'PNG', margin, margin + 10, contentWidth, finalHeight);
      pdf.save(`${exportName.replace(/ /g, '_')}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar - SAMA PERSIS DENGAN DASHBOARD */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          </div>
          <p className="text-[#CBFFC2] text-sm mt-1 font-koulen">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
  <button
  onClick={() => navigate("/admin")}
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full"
>
  <LayoutDashboard className="w-5 h-5" />
  <span>Ringkasan</span>
</button>

<button
  onClick={() => navigate("/admin/menu")}
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full"
>
  <Utensils className="w-5 h-5" />
  <span>Manajemen Menu</span>
</button>

<button
  onClick={() => navigate("/admin/inventory")}
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full"
>
  <Package className="w-5 h-5" />
  <span>Stok Bahan</span>
</button>

<button
  onClick={() => navigate("/users")}
  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full"
>
  <Users className="w-5 h-5" />
  <span>Manajemen Pengguna</span>
</button>

<button
  onClick={() => navigate("/reports")}
  className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium transition w-full"
>
  <BarChart3 className="w-5 h-5" />
  <span>Laporan Penjualan</span>
</button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="w-5 h-5" /><span>Pengaturan</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Sisa halaman laporan */}
      <main className="ml-64 flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-green-600 text-2xl font-bold">Laporan Penjualan</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
            <HelpCircle className="w-5 h-5 text-gray-500 cursor-pointer" />
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

        {/* Content - Sama seperti sebelumnya */}
        <div id="laporan-content" className="px-7 py-5 space-y-5 bg-gray-50">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 flex-1 max-w-[420px] w-full shadow-sm">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari data (tanggal, bulan, atau nominal)...." 
                className="flex-1 text-sm text-gray-700 bg-transparent border-none focus:outline-none" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  {["Tahunan", "Bulanan", "Mingguan"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setActivePeriod(period)}
                      className={`px-3.5 py-2 text-xs font-semibold cursor-pointer transition ${
                        activePeriod === period 
                          ? "bg-green-600 text-white" 
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>

                {activePeriod === "Tahunan" && (
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm">
                    <select
                      className="px-2 py-1 text-xs text-gray-700 bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-green-500 rounded"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                  </div>
                )}

                {activePeriod === "Bulanan" && (
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm">
                    <input
                      type="month"
                      className="px-2 py-1 text-xs text-gray-700 bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-green-500 rounded"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                  </div>
                )}

                {activePeriod === "Mingguan" && (
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm">
                    <input
                      type="week"
                      className="px-2 py-1 text-xs text-gray-700 bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-green-500 rounded"
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:bg-green-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor Excel</span>
                </button>
                <button 
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExportingPDF ? "Memproses..." : "Ekspor PDF"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="💰" iconBg="bg-green-50" iconColor="text-green-600" title="Total Pendapatan" value={currentStats.pendapatan} growth={currentStats.pendapatanGrowth} growthColor={currentStats.pendapatanGrowthColor} />
            <StatCard icon="🛒" iconBg="bg-yellow-50" iconColor="text-yellow-600" title="Total Transaksi" value={currentStats.transaksi} growth={currentStats.transaksiGrowth} growthColor={currentStats.transaksiGrowthColor} />
            <StatCard icon="👥" iconBg="bg-red-50" iconColor="text-red-600" title="Pelanggan Baru" value={currentStats.pelanggan} growth={currentStats.pelangganGrowth} growthColor={currentStats.pelangganGrowthColor} />
            <StatCard icon="⭐" iconBg="bg-yellow-50" iconColor="text-yellow-600" title="Rata-rata Rating" value={currentStats.rating} growth={currentStats.ratingGrowth} growthColor={currentStats.ratingGrowthColor} />
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900 text-base font-bold">Tren Pendapatan</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                  <span className="text-gray-700 text-xs font-medium">Tahun Ini</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  <span className="text-gray-700 text-xs font-medium">Tahun Lalu</span>
                </div>
              </div>
            </div>
            
            <div className="w-full mt-4 pb-2">
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentChartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTahunLalu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => value === 0 ? '0' : `Rp${value/1000000}Jt`} width={65} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}
                  />
                  <Area type="monotone" dataKey="pendapatan" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorPendapatan)" animationDuration={1000} animationEasing="ease-in-out" />
                  <Area type="monotone" dataKey="tahunLalu" stroke="#9ca3af" strokeWidth={2} fillOpacity={1} fill="url(#colorTahunLalu)" animationDuration={1000} animationEasing="ease-in-out" />
                  <Brush dataKey="name" height={30} stroke="#16a34a" tickFormatter={() => ''} travellerWidth={10} />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Data Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 text-base font-bold">Rincian Data Transaksi</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Tanggal / Periode</th>
                    <th className="px-4 py-3 whitespace-nowrap">Pendapatan Tahun Ini</th>
                    <th className="px-4 py-3 whitespace-nowrap">Pendapatan Tahun Lalu</th>
                    <th className="px-4 py-3 whitespace-nowrap">Pertumbuhan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTableData.length > 0 ? (
                    filteredTableData.map((data, idx) => {
                      const growth = data.tahunLalu === 0 ? 100 : ((data.pendapatan - data.tahunLalu) / data.tahunLalu) * 100;
                      return (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{data.name}</td>
                          <td className="px-4 py-3 text-green-700 font-semibold whitespace-nowrap">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.pendapatan)}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.tahunLalu)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        Tidak ada data yang cocok dengan "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-900 text-base font-bold">5 Menu Paling Laris</h3>
                <span className="text-xl">📈</span>
              </div>
              <div className="space-y-4">
                {menuLaris.map(menu => (
                  <MenuRankItem key={menu.nama} name={menu.nama} sold={`${menu.terjual} Porsi`} percentage={menu.persentase} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-900 text-base font-bold">5 Menu Kurang Laris</h3>
                <span className="text-xl">📉</span>
              </div>
              <div className="space-y-4">
                {menuKurangLaris.map(menu => (
                  <MenuRankItem key={menu.nama} name={menu.nama} sold={`${menu.terjual} Porsi`} percentage={menu.persentase} color="bg-amber-500" />
                ))}
              </div>
            </div>
          </div>
        </div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
      </main>
    </div>
  );
}

// Helper Components
function StatCard({ icon, iconBg, iconColor, title, value, growth, growthColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          <span className={`text-xl ${iconColor}`}>{icon}</span>
        </div>
        <span className={`text-sm font-semibold ${growthColor}`}>{growth}</span>
      </div>
      <div className="text-gray-500 text-xs font-normal mt-1">{title}</div>
      <div className="text-gray-900 text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function MenuRankItem({ name, sold, percentage, color = "bg-green-600" }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-gray-900 text-xs font-semibold">{name}</span>
        <span className="text-gray-900 text-xs font-semibold">{sold}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    
    </div>
  );
}