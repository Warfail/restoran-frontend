import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
        <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="p-4 space-y-1">
        {/* Ringkasan */}
        <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium w-full">
          <LayoutDashboard className="w-5 h-5" />
          <span>Ringkasan</span>
        </button>

        {/* Manajemen Menu */}
        <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
          <Utensils className="w-5 h-5" />
          <span>Manajemen Menu</span>
        </button>

        {/* Stok Bahan */}
        <button onClick={() => navigate("/admin/inventory")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
          <Package className="w-5 h-5" />
          <span>Stok Bahan</span>
        </button>

        {/* Manajemen Pengguna */}
        <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
          <Users className="w-5 h-5" />
          <span>Manajemen Pengguna</span>
        </button>

        {/* Laporan Penjualan */}
        <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
          <BarChart3 className="w-5 h-5" />
          <span>Laporan Penjualan</span>
        </button>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition">
          <Settings className="w-5 h-5" />
          <span>Pengaturan</span>
        </button>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition">
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}