import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, ChevronDown, ChevronUp } from "lucide-react";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("totalmenu");
  const [currentTime, setCurrentTime] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/kitchen/login");
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Data menu berdasarkan kategori
  const menuCategories = {
    makanan: [
      { id: 1, name: "Nasi Goreng Special", quantity: 2 },
      { id: 2, name: "Nasi Goreng Seafood", quantity: 1 },
    ],
    minuman: [
      { id: 3, name: "Es Teh", quantity: 2 },
      { id: 4, name: "Es Jeruk", quantity: 2 },
    ],
    cemilan: [
      { id: 5, name: "Singkong Keju Original", quantity: 2 },
      { id: 6, name: "Singkong Keju Cokelat", quantity: 2 },
    ],
  };

  const renderMenuList = (items, category) => (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between px-5 py-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleExpand(`${category}-${item.id}`)}
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-medium text-sm">{item.name}</span>
            <span className="text-red-500 font-semibold text-sm">{item.quantity}x</span>
          </div>
          {expandedItems[`${category}-${item.id}`] ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-gray-900 font-semibold text-sm">Kitchen Production Feed - Live</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab("antrean")}
              className={`px-5 py-4 text-sm font-medium transition ${activeTab === "antrean" ? "text-gray-900 border-b-2 border-red-500" : "text-gray-500"}`}
            >
              Antrean Meja
            </button>
            <button
              onClick={() => setActiveTab("totalmenu")}
              className={`px-5 py-4 text-sm font-medium transition relative ${activeTab === "totalmenu" ? "text-gray-900 font-semibold" : "text-gray-500"}`}
            >
              <span className={activeTab === "totalmenu" ? "border-b-2 border-red-500 pb-4" : ""}>Total Menu</span>
            </button>
            <button className="px-5 py-4 text-sm font-medium text-gray-500">Kelola Stok Menu</button>
            <button className="px-5 py-4 text-sm font-medium text-gray-500">Kelola Stok Bahan</button>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <span className="text-gray-900 font-semibold text-sm tabular-nums">{currentTime}</span>
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <div className="text-gray-900 text-sm font-semibold">Head Kitchen</div>
                <div className="text-gray-500 text-[11px] font-medium tracking-wide">SHIFT A</div>
              </div>
              <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-600 transition">
                <LogOut className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          <div className="flex-1 flex items-center justify-center gap-2 py-3.5 cursor-pointer hover:bg-gray-50 transition">
            <i className="ti ti-tools-kitchen-2 text-gray-700 text-xl"></i>
            <span className="text-gray-700 font-semibold text-sm">Makanan</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 py-3.5 cursor-pointer hover:bg-gray-50 transition">
            <i className="ti ti-cup text-gray-700 text-xl"></i>
            <span className="text-gray-700 font-semibold text-sm">Minuman</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 py-3.5 cursor-pointer hover:bg-gray-50 transition">
            <i className="ti ti-pizza text-gray-700 text-xl"></i>
            <span className="text-gray-700 font-semibold text-sm">Cemilan</span>
          </div>
        </div>
      </div>

      {/* Menu List Content */}
      <div className="flex-1 bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Makanan Column */}
          <div className="space-y-3">
            <h3 className="text-gray-900 font-semibold text-sm mb-2 hidden">Makanan</h3>
            {renderMenuList(menuCategories.makanan, "makanan")}
          </div>

          {/* Minuman Column */}
          <div className="space-y-3">
            <h3 className="text-gray-900 font-semibold text-sm mb-2 hidden">Minuman</h3>
            {renderMenuList(menuCategories.minuman, "minuman")}
          </div>

          {/* Cemilan Column */}
          <div className="space-y-3">
            <h3 className="text-gray-900 font-semibold text-sm mb-2 hidden">Cemilan</h3>
            {renderMenuList(menuCategories.cemilan, "cemilan")}
          </div>
        </div>
      </div>
    </div>
  );
}