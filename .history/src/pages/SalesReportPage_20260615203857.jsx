import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut,  } from "lucide-react";

export default function SalesReportPage() {
  const [activePeriod, setActivePeriod] = useState("Bulanan");
  const navigate = useNavigate();

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
          <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
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
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition">
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
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
                <div className="text-gray-900 text-[13px] font-semibold">Admin Sistem</div>
                <div className="text-gray-500 text-[11px] font-medium">SUPERUSER</div>
              </div>
              <img src="https://placehold.co/36x36/d97706/d97706" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
            </div>
          </div>
        </div>

        {/* Content - Sama seperti sebelumnya */}
        <div className="px-7 py-5 space-y-5">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 flex-1 max-w-[420px] w-full">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari...." className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                {["Bulanan", "Mingguan", "Harian"].map((period) => (
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
              
              <button className="flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:bg-green-700 transition">
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>Ekspor PDF</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="💰" iconBg="bg-green-50" iconColor="text-green-600" title="Total Pendapatan" value="Rp 45.230.000" growth="+12.5%" growthColor="text-green-600" />
            <StatCard icon="🛒" iconBg="bg-yellow-50" iconColor="text-yellow-600" title="Total Transaksi" value="1,284" growth="+8.2%" growthColor="text-green-600" />
            <StatCard icon="👥" iconBg="bg-red-50" iconColor="text-red-600" title="Pelanggan Baru" value="342" growth="-2.1%" growthColor="text-red-600" />
            <StatCard icon="⭐" iconBg="bg-yellow-50" iconColor="text-yellow-600" title="Rata-rata Rating" value="4.8/5.0" growth="+0.4" growthColor="text-green-600" />
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900 text-base font-bold">Tren Pendapatan Bulanan</h3>
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
            
            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 900 260" className="w-full min-w-[500px] h-[260px]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                {[20, 65, 110, 155, 200].map((y) => (
                  <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                ))}
                <path d="M 0 220 C 30 215, 60 205, 75 195 C 100 180, 130 165, 150 158 C 180 148, 210 145, 225 143 C 255 140, 285 142, 300 145 C 330 150, 360 158, 375 162 C 405 168, 435 170, 450 168 C 480 164, 510 155, 525 148 C 555 132, 585 105, 600 88 C 630 58, 660 38, 675 32 C 705 22, 735 28, 750 35 C 780 48, 810 72, 825 85 C 855 108, 885 130, 900 140" fill="url(#greenGrad)" stroke="none" />
                <path d="M 0 220 C 30 215, 60 205, 75 195 C 100 180, 130 165, 150 158 C 180 148, 210 145, 225 143 C 255 140, 285 142, 300 145 C 330 150, 360 158, 375 162 C 405 168, 435 170, 450 168 C 480 164, 510 155, 525 148 C 555 132, 585 105, 600 88 C 630 58, 660 38, 675 32 C 705 22, 735 28, 750 35 C 780 48, 810 72, 825 85 C 855 108, 885 130, 900 140" fill="none" stroke="#16a34a" strokeWidth="2.5" />
                {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"].map((month, idx) => (
                  <text key={month} x={idx * 75} y="248" fill="#9ca3af" fontSize="11" textAnchor="middle">{month}</text>
                ))}
              </svg>
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
                <MenuRankItem name="Singkong Keju Original" sold="842 Porsi" percentage={100} />
                <MenuRankItem name="Singkong Keju Cokelat" sold="612 Porsi" percentage={72} />
                <MenuRankItem name="Singkong Keju Spesial" sold="540 Porsi" percentage={64} />
                <MenuRankItem name="Es Teh Manis Jumbo" sold="480 Porsi" percentage={57} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-900 text-base font-bold">5 Menu Kurang Laris</h3>
                <span className="text-xl">📉</span>
              </div>
              <div className="space-y-4">
                <MenuRankItem name="Kopi Tubruk Gula Aren" sold="12 Porsi" percentage={15} color="bg-amber-500" />
                <MenuRankItem name="Singkong Rebus Polos" sold="18 Porsi" percentage={22} color="bg-amber-500" />
                <MenuRankItem name="Juice Alpukat (Seasonal)" sold="24 Porsi" percentage={30} color="bg-amber-500" />
                <MenuRankItem name="Es Jeruk Hangat" sold="32 Porsi" percentage={38} color="bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
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