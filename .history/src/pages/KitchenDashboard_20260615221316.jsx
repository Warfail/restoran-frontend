import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Check, AlertTriangle, LogOut } from "lucide-react";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("antrean");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

  // Update waktu setiap detik
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/kitchen/login");
  };

  const pendingOrders = [
    { id: 1, table: "Meja 08", time: "03.45", items: ["2x Singkong Keju Original", "1x Singkong Keju Cokelat", "1x Es Teh"] },
    { id: 2, table: "Meja 10", time: "04.55", items: ["1x Singkong Keju Original", "1x Nasi Goreng Special", "1x Es Jeruk"] },
    { id: 3, table: "Meja 02", time: "06.55", items: ["3x Singkong Keju Cokelat", "1x Nasi Goreng Seafood", "1x Nasi Goreng Special", "1x Es Teh", "1x Es Jeruk"] },
  ];

  const cookingOrders = [
    { id: 4, table: "Meja 08", time: "05.45", waitTime: "10.34", items: [
      { name: "2x Singkong Keju Original", done: false },
      { name: "1x Singkong Keju Cokelat", done: false },
      { name: "1x Es Teh", done: true },
    ] },
    { id: 5, table: "Meja 10", time: "05.45", waitTime: "10.34", items: [
      { name: "1x Singkong Keju Original", done: false },
      { name: "1x Nasi Goreng Special", done: false },
      { name: "1x Es Jeruk", done: true },
    ] },
    { id: 6, table: "Meja 02", time: "10.45", waitTime: "12.34", urgent: true, items: [
      { name: "2x Singkong Keju Cokelat", done: true },
      { name: "1x Nasi Goreng Seafood", done: false },
      { name: "1x Nasi Goreng Special", done: false },
      { name: "1x Es Teh", done: true },
      { name: "1x Es Jeruk", done: true },
    ] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-gray-900 font-semibold text-sm">Kitchen Production Feed - Live</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab("antrean")}
              className={`px-5 py-5 text-sm font-medium transition ${activeTab === "antrean" ? "text-gray-900 border-b-2 border-red-500" : "text-gray-500"}`}
            >
              Antrean Meja
            </button>
            <button className="px-5 py-5 text-sm font-medium text-gray-500">Total Menu</button>
            <button className="px-5 py-5 text-sm font-medium text-gray-500">Kelola Stok Menu</button>
            <button className="px-5 py-5 text-sm font-medium text-gray-500">Kelola Stok Bahan</button>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <span className="text-gray-900 font-medium text-sm">{currentTime}</span>
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-right">
              <div className="text-gray-900 text-sm font-semibold">Head Kitchen</div>
              <div className="text-gray-500 text-xs">SHIFT A</div>
            </div>
            <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center hover:bg-gray-600 transition">
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* LEFT PANEL - PENDING ORDERS */}
        <div className="w-80 min-w-[280px] bg-white border-r border-gray-200 flex flex-col">
          <div className="px-6 py-5">
            <h2 className="text-gray-900 font-bold text-sm uppercase tracking-wide">ANTREAN BARU</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-900 font-bold text-base">{order.table}</span>
                  <span className="text-gray-900 font-medium text-sm">{order.time}</span>
                </div>
                <div className="space-y-1 mb-3.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-gray-700 text-xs">{item}</div>
                  ))}
                </div>
                <button className="w-full border border-gray-300 rounded-lg py-2 text-gray-900 text-xs font-medium bg-white hover:bg-gray-50 transition">
                  Mulai Masak
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - COOKING ORDERS */}
        <div className="flex-1 bg-gray-50 flex flex-col">
          <div className="py-5">
            <h2 className="text-center text-gray-900 font-bold text-sm uppercase tracking-wide">SEDANG DIMASAK</h2>
          </div>
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cookingOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center px-5 pt-4 pb-1">
                    <span className="text-gray-900 font-bold text-base">{order.table}</span>
                    <span className={`text-sm font-semibold ${order.urgent ? "text-red-500" : "text-amber-500"}`}>
                      {order.time}
                    </span>
                  </div>
                  <div className="px-5 pb-2">
                    <span className="text-gray-400 text-xs">Antrean Sejak {order.waitTime}</span>
                  </div>
                  <div className="flex-1 px-5 pb-4 space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-700 text-xs">{item.name}</span>
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${item.done ? "bg-gray-900 border-gray-900" : "border-gray-300 bg-white"}`}>
                          {item.done && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-4">
                    <button className="w-full border border-gray-300 rounded-lg py-2 text-gray-900 text-xs font-medium bg-white hover:bg-gray-50 transition">
                      Selesai
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}