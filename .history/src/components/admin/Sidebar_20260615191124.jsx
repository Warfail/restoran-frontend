import { useNavigate } from "react-router-dom";

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
        <p className="text-[#CBFFC2] text-sm mt-1 font-koulen">Admin Panel</p>
      </div>

      <nav className="p-4 space-y-1">
        <button onClick={() => navigate("/admin/summary")} className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" fill="#704800"/>
          </svg>
          Ringkasan
        </button>

        <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
            <path d="M1.4 18L0 16.6L10.25 6.35C9.95 5.65 9.90833 4.85833 10.125 3.975C10.3417 3.09167 10.8167 2.3 11.55 1.6C12.4333 0.716667 13.4167 0.2 14.5 0.05C15.5833 -0.1 16.4667 0.166667 17.15 0.85C17.8333 1.53333 18.1 2.41667 17.95 3.5C17.8 4.58333 17.2833 5.56667 16.4 6.45C15.7 7.18333 14.9083 7.65833 14.025 7.875C13.₁4₁₇ 8.09₁₆₇ ₁₂.₃₅ 8.05 ₁₁.₆₅ 7.75L₁₀.₄ 9L₁₈ ₁₆.₆L₁₆.₆ ₁₈L₉ ₁₀.…L₁.…Z"/>
          </svg>
          Manajemen Menu
        </button>

        <button onClick={() => navigate("/admin/inventory")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M12.5 18.925L8.25 14.675L9.65 13.275L12.5 16.125L18.15 10.475L19.55 11.875L12.5 18.925Z"/>
            <path d="M18 9H16V4H14V7H4V4H2V18H8V20H2C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.175C6.35833 1.41667 6.71667 0.9375 7.25 0.5625C7.78333 0.1875 8.36667 0 9 0C9.66667 0 10.2625 0.1875 10.7875 0.5625C11.3125 0.9375 11.6667 1.41667 11.85 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V9Z"/>
          </svg>
          Stok Bahan
        </button>

        <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg font-medium">
  {/* icon & teks Ringkasan */}
</button>

<button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">
  {/* icon & teks Laporan Penjualan */}
</button>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition">
          <svg width="21" height="20" viewBox="0 0 21 20" fill="white">
            <path d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3Z"/>
          </svg>
          Pengaturan
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
            <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z"/>
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}