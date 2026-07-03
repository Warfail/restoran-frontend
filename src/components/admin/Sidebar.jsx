import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut } from "lucide-react";
import SettingsModal from "../../components/SettingsModal";

export default function Sidebar({ active = "dashboard", isOpen, onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Ringkasan", icon: LayoutDashboard, path: "/admin" },
    { id: "menu", label: "Manajemen Menu", icon: Utensils, path: "/admin/menu" },
    { id: "inventory", label: "Stok Bahan", icon: Package, path: "/admin/inventory" },
    { id: "users", label: "Manajemen Pengguna", icon: Users, path: "/users" },
    { id: "reports", label: "Laporan Penjualan", icon: BarChart3, path: "/reports" }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-30 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          </div>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (onClose) onClose();
                }} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full ${isActive ? "bg-[#FEB64C] text-[#704800] font-medium" : "text-white hover:bg-white/10"}`}
              >
                <Icon className="w-5 h-5" /><span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="w-5 h-5" /><span>Pengaturan</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1">
            <LogOut className="w-5 h-5" /><span>Keluar</span>
          </button>
        </div>
      
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
      </aside>
    </>
  );
}