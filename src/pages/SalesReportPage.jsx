import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut, Search, HelpCircle, Bell, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import SettingsModal from "../components/SettingsModal";

const dataBulanan = [
  { name: 'Jan', pendapatan: 2500000, tahunLalu: 2000000 },
  { name: 'Feb', pendapatan: 3000000, tahunLalu: 2200000 },
  { name: 'Mar', pendapatan: 2800000, tahunLalu: 2500000 },
  { name: 'Apr', pendapatan: 3500000, tahunLalu: 2800000 },
  { name: 'Mei', pendapatan: 4200000, tahunLalu: 3000000 },
  { name: 'Jun', pendapatan: 3800000, tahunLalu: 3200000 },
  { name: 'Jul', pendapatan: 4500000, tahunLalu: 3500000 },
  { name: 'Agu', pendapatan: 4800000, tahunLalu: 3800000 },
  { name: 'Sep', pendapatan: 4000000, tahunLalu: 3500000 },
  { name: 'Okt', pendapatan: 5200000, tahunLalu: 4000000 },
  { name: 'Nov', pendapatan: 5800000, tahunLalu: 4500000 },
  { name: 'Des', pendapatan: 6500000, tahunLalu: 5000000 },
];

const dataMingguan = [
  { name: 'Sen', pendapatan: 850000, tahunLalu: 700000 },
  { name: 'Sel', pendapatan: 900000, tahunLalu: 750000 },
  { name: 'Rab', pendapatan: 880000, tahunLalu: 800000 },
  { name: 'Kam', pendapatan: 950000, tahunLalu: 820000 },
  { name: 'Jum', pendapatan: 1200000, tahunLalu: 950000 },
  { name: 'Sab', pendapatan: 1800000, tahunLalu: 1500000 },
  { name: 'Min', pendapatan: 2100000, tahunLalu: 1700000 },
];

const dataTahunan = [
  { name: '2020', pendapatan: 25000000, tahunLalu: 20000000 },
  { name: '2021', pendapatan: 30000000, tahunLalu: 25000000 },
  { name: '2022', pendapatan: 38000000, tahunLalu: 30000000 },
  { name: '2023', pendapatan: 45000000, tahunLalu: 38000000 },
  { name: '2024', pendapatan: 52000000, tahunLalu: 45000000 },
];

const menuLaris = [
  { nama: "Singkong Keju Original", terjual: 842, persentase: 100 },
  { nama: "Singkong Keju Cokelat", terjual: 612, persentase: 72 },
  { nama: "Singkong Keju Spesial", terjual: 540, persentase: 64 },
  { nama: "Es Teh Manis Jumbo", terjual: 480, persentase: 57 }
];

const menuKurangLaris = [
  { nama: "Kopi Tubruk Gula Aren", terjual: 12, persentase: 15 },
  { nama: "Singkong Rebus Polos", terjual: 18, persentase: 22 },
  { nama: "Juice Alpukat (Seasonal)", terjual: 24, persentase: 30 },
  { nama: "Es Jeruk Hangat", terjual: 32, persentase: 38 }
];

export default function SalesReportPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  const [activePeriod, setActivePeriod] = useState("Bulanan");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const navigate = useNavigate();

  const currentChartData = activePeriod === "Tahunan" 
    ? dataTahunan 
    : activePeriod === "Mingguan" 
      ? dataMingguan 
      : dataBulanan;

  const statsMapping = {
    Mingguan: {
      pendapatan: "Rp 8.480.000",
      pendapatanGrowth: "+5.2%",
      pendapatanGrowthColor: "text-green-600",
      transaksi: "342",
      transaksiGrowth: "+2.1%",
      transaksiGrowthColor: "text-green-600",
      pelanggan: "84",
      pelangganGrowth: "-1.5%",
      pelangganGrowthColor: "text-red-600",
      rating: "4.8/5.0",
      ratingGrowth: "+0.1",
      ratingGrowthColor: "text-green-600"
    },
    Bulanan: {
      pendapatan: "Rp 45.230.000",
      pendapatanGrowth: "+12.5%",
      pendapatanGrowthColor: "text-green-600",
      transaksi: "1,284",
      transaksiGrowth: "+8.2%",
      transaksiGrowthColor: "text-green-600",
      pelanggan: "342",
      pelangganGrowth: "-2.1%",
      pelangganGrowthColor: "text-red-600",
      rating: "4.8/5.0",
      ratingGrowth: "+0.4",
      ratingGrowthColor: "text-green-600"
    },
    Tahunan: {
      pendapatan: "Rp 542.800.000",
      pendapatanGrowth: "+24.8%",
      pendapatanGrowthColor: "text-green-600",
      transaksi: "15,420",
      transaksiGrowth: "+18.5%",
      transaksiGrowthColor: "text-green-600",
      pelanggan: "4,120",
      pelangganGrowth: "+12.4%",
      pelangganGrowthColor: "text-green-600",
      rating: "4.9/5.0",
      ratingGrowth: "+0.2",
      ratingGrowthColor: "text-green-600"
    }
  };

  const currentStats = statsMapping[activePeriod];

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

    XLSX.writeFile(wb, `Laporan_Penjualan_${activePeriod}.xlsx`);
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
      
      pdf.setFontSize(16);
      pdf.text(`Laporan Penjualan - Periode ${activePeriod}`, margin, margin + 5);
      
      // Prevent image from overflowing A4 height
      const pageHeight = pdf.internal.pageSize.getHeight();
      let finalHeight = contentHeight;
      if (margin + 10 + contentHeight > pageHeight - margin) {
        finalHeight = pageHeight - margin - (margin + 10);
      }
      
      pdf.addImage(imgData, 'PNG', margin, margin + 10, contentWidth, finalHeight);
      pdf.save(`Laporan_Penjualan_${activePeriod}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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
                <div className="text-gray-900 text-sm font-semibold">{currentUser?.fullName || currentUser?.username || "Loading..."}</div>
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
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 flex-1 max-w-[420px] w-full">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari...." className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
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
              <h3 className="text-gray-900 text-base font-bold">Tren Pendapatan {activePeriod}</h3>
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
            
            <div className="w-full h-[280px] mt-4">
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
                  <Area type="monotone" dataKey="tahunLalu" name="Tahun Lalu" stroke="#9ca3af" strokeWidth={2} fillOpacity={1} fill="url(#colorTahunLalu)" />
                  <Area type="monotone" dataKey="pendapatan" name="Tahun Ini" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorPendapatan)" />
                </AreaChart>
              </ResponsiveContainer>
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