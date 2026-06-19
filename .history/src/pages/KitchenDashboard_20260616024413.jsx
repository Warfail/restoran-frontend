import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Bell, LogOut, ChevronDown, ChevronUp, Check, AlertTriangle, Plus, Search, Minus, RefreshCw, Plus as PlusIcon } from "lucide-react";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("kelolastokbahan");
  const [currentTime, setCurrentTime] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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

  // Data untuk Kelola Stok Menu
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Es Teh", status: "AVAILABLE", image: "https://placehold.co/80x60/c8a96e/c8a96e" },
    { id: 2, name: "Kopi Susu", status: "AVAILABLE", image: "https://placehold.co/80x60/6b3a2a/6b3a2a" },
    { id: 3, name: "Nasi Goreng Ayam", status: "AVAILABLE", image: "https://placehold.co/80x60/c8a040/c8a040" },
    { id: 4, name: "Nasi Goreng Seafood", status: "AVAILABLE", image: "https://placehold.co/80x60/b85c38/b85c38" },
    { id: 5, name: "Singkong Keju", status: "DISABLED", image: "https://placehold.co/80x60/c87040/c87040" },
  ]);

  // Data untuk Kelola Stok Bahan
  const [bahanItems, setBahanItems] = useState([
    { id: 1, name: "Singkong", stock: 8, unit: "Pack", status: "MENIPIS", statusColor: "red", image: "https://placehold.co/56x56/f5e6c8/f5e6c8" },
    { id: 2, name: "Minyak Goreng", stock: 18, unit: "Pack", status: "MENIPIS", statusColor: "red", image: "https://placehold.co/56x56/fde68a/fde68a" },
    { id: 3, name: "Beras", stock: 45, unit: "Pack", status: "AMAN", statusColor: "green", image: "https://placehold.co/56x56/fef9c3/fef9c3" },
    { id: 4, name: "Garam", stock: 0, unit: "Pack", status: "HABIS", statusColor: "dark", image: "https://placehold.co/56x56/e5e7eb/e5e7eb" },
    { id: 5, name: "Gula Pasir", stock: 5, unit: "Pack", status: "MENIPIS", statusColor: "red", image: "https://placehold.co/56x56/fef3c7/fef3c7" },
  ]);

  const [counters, setCounters] = useState({});

  const updateCounter = (id, change) => {
    setCounters(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change)
    }));
  };

  const handleUpdateStock = (id) => {
    const newStock = counters[id] || 0;
    setBahanItems(prev => prev.map(item =>
      item.id === id ? { ...item, stock: newStock, status: newStock === 0 ? "HABIS" : newStock <= 10 ? "MENIPIS" : "AMAN" } : item
    ));
    setCounters(prev => ({ ...prev, [id]: 0 }));
  };

  const handleRefill = (id) => {
    // Simulasi refill
    setBahanItems(prev => prev.map(item =>
      item.id === id ? { ...item, stock: 50, status: "AMAN" } : item
    ));
  };

  const toggleStatus = (id) => {
    setMenuItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: item.status === "AVAILABLE" ? "DISABLED" : "AVAILABLE" } : item
    ));
  };

  const stats = {
    total: bahanItems.length,
    menipis: bahanItems.filter(i => i.status === "MENIPIS").length,
    habis: bahanItems.filter(i => i.status === "HABIS").length,
  };

  const filteredBahan = bahanItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status, color) => {
    const styles = {
      red: "bg-red-500 text-white",
      green: "bg-green-100 text-green-600",
      dark: "bg-gray-900 text-white"
    };
    return <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${styles[color]}`}>{status}</span>;
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-gray-900";
    if (stock <= 10) return "text-red-500";
    return "text-green-600";
  };

  // Data Antrean (sama seperti sebelumnya)
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

  // Data Menu (Total Menu)
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

  const renderKelolaStokMenu = () => (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-500">Kelola Ketersediaan Menu</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-gray-700 text-sm font-medium">Live Sync Active</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <img src={item.image} alt={item.name} className="w-20 h-15 rounded-lg object-cover" />
              <div className="flex flex-col items-end gap-1">
                <div className="relative inline-flex items-center cursor-pointer" onClick={() => toggleStatus(item.id)}>
                  <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${item.status === "AVAILABLE" ? "bg-green-500" : "bg-gray-400"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${item.status === "AVAILABLE" ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </div>
                <span className={`text-[10px] font-semibold tracking-wide ${item.status === "AVAILABLE" ? "text-green-500" : "text-gray-400"}`}>{item.status}</span>
              </div>
            </div>
            <div className="text-gray-900 font-semibold text-sm mt-1">{item.name}</div>
          </div>
        ))}
        <div className="bg-white rounded-xl border border-dashed border-gray-300 shadow-sm p-4 flex flex-col items-center justify-center min-h-[140px] cursor-pointer hover:bg-gray-50 transition">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"><Plus className="w-5 h-5 text-gray-500" /></div>
        </div>
      </div>
    </div>
  );

  const renderKelolaStokBahan = () => (
    <div className="flex-1 p-6 space-y-4">
      {/* Stats Cards */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide">TOTAL BAHAN</div>
          <div className="flex items-baseline gap-2 mt-1"><span className="text-green-500 text-4xl font-bold">{stats.total}</span><span className="text-gray-500 text-sm">Item</span></div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide">STOK MENIPIS</div>
          <div className="flex items-baseline gap-2 mt-1"><span className="text-orange-500 text-4xl font-bold">{stats.menipis}</span><span className="text-gray-500 text-sm">Item</span></div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide">STOK HABIS</div>
          <div className="flex items-baseline gap-2 mt-1"><span className="text-red-500 text-4xl font-bold">{stats.habis}</span><span className="text-gray-500 text-sm">Item</span></div>
        </div>
      </div>

      {/* Search & Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari bahan..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-red-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="text-gray-900 font-bold text-sm">Daftar Bahan Baku Utama</div>
        <div className="w-72 hidden sm:block"></div>
      </div>

      {/* Bahan List */}
      <div className="space-y-2">
        {filteredBahan.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm ${item.status === "HABIS" ? "border border-red-200 shadow-md" : "border border-gray-200"}`}>
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1 min-w-[100px]"><div className="text-gray-900 font-semibold text-sm">{item.name}</div></div>
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <span className={`text-xl font-bold ${getStockColor(item.stock)}`}>{item.stock} {item.unit}</span>
              {getStatusBadge(item.status, item.statusColor)}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateCounter(item.id, -1)} className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"><Minus className="w-4 h-4 text-gray-700" /></button>
              <div className="w-12 text-center text-gray-900 font-semibold text-sm">{counters[item.id] || 0}</div>
              <button onClick={() => updateCounter(item.id, 1)} className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"><PlusIcon className="w-4 h-4 text-gray-700" /></button>
            </div>
            {item.status === "HABIS" ? (
              <button onClick={() => handleRefill(item.id)} className="flex items-center gap-1.5 px-5 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600"><PlusIcon className="w-3.5 h-3.5" />Refill</button>
            ) : (
              <button onClick={() => handleUpdateStock(item.id)} className="flex items-center gap-1.5 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"><RefreshCw className="w-3.5 h-3.5" />Update</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div><span className="text-gray-900 font-semibold text-sm">Kitchen Production Feed - Live</span></div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => setActiveTab("antrean")} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "antrean" ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>Antrean Meja</button>
            <button onClick={() => setActiveTab("totalmenu")} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "totalmenu" ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>Total Menu</button>
            <button onClick={() => setActiveTab("kelolastokmenu")} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "kelolastokmenu" ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>Kelola Stok Menu</button>
            <button onClick={() => setActiveTab("kelolastokbahan")} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "kelolastokbahan" ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>Kelola Stok Bahan</button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm font-medium">{currentTime}</span>
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-2"><div className="text-right hidden sm:block"><div className="text-gray-900 text-sm font-semibold">Head Kitchen</div><div className="text-gray-400 text-xs">SHIFT A</div></div><button onClick={handleLogout} className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600"><LogOut className="w-4 h-4 text-white" /></button></div>
          </div>
        </div>
      </header>

      {/* Content */}
      {activeTab === "antrean" && (
        <div className="flex flex-1">
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col"><div className="px-6 py-5"><h2 className="text-gray-900 font-bold text-sm uppercase">ANTREAN BARU</h2></div><div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">{pendingOrders.map(order => (<div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex justify-between mb-3"><span className="font-bold">{order.table}</span><span>{order.time}</span></div><div className="space-y-1 mb-3">{order.items.map((item, idx) => (<div key={idx} className="text-gray-600 text-xs">{item}</div>))}</div><button className="w-full border border-gray-300 rounded-lg py-2 text-sm bg-white">Mulai Masak</button></div>))}</div></div>
          <div className="flex-1 bg-gray-50"><div className="py-5"><h2 className="text-center font-bold text-sm uppercase">SEDANG DIMASAK</h2></div><div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{cookingOrders.map(order => (<div key={order.id} className="bg-white rounded-xl border p-4"><div className="flex justify-between"><span className="font-bold">{order.table}</span><span className={order.urgent ? "text-red-500" : "text-amber-500"}>{order.time}</span></div><div className="text-gray-400 text-xs mt-1">Antrean Sejak {order.waitTime}</div><div className="space-y-2 my-3">{order.items.map((item, idx) => (<div key={idx} className="flex justify-between"><span className="text-sm">{item.name}</span><div className="w-5 h-5 border-2 rounded flex items-center justify-center">{item.done && <Check className="w-3 h-3" />}</div></div>))}</div><button className="w-full border rounded-lg py-2 text-sm">Selesai</button></div>))}</div></div>
        </div>
      )}

      {activeTab === "totalmenu" && (
        <div className="flex-1 p-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{renderMenuList(menuCategories.makanan, "makanan")}{renderMenuList(menuCategories.minuman, "minuman")}{renderMenuList(menuCategories.cemilan, "cemilan")}</div></div>
      )}

      {activeTab === "kelolastokmenu" && renderKelolaStokMenu()}
      {activeTab === "kelolastokbahan" && renderKelolaStokBahan()}
    </div>
  );
}