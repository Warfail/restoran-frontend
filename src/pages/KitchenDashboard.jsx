import toast from "react-hot-toast";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  Bell, LogOut, Check, Plus, Search, Minus, RefreshCw,
  UtensilsCrossed, Coffee, ChefHat
} from "lucide-react";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("antrean");
  const [currentTime, setCurrentTime] = useState("");
  const [nowTime, setNowTime] = useState(new Date());
  const [tickCount, setTickCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [newOrders, setNewOrders] = useState([]);
  const [foodCooking, setFoodCooking] = useState([]);
  const [snackCooking, setSnackCooking] = useState([]);
  const [drinkCooking, setDrinkCooking] = useState([]);
  
  const [checkedItems, setCheckedItems] = useState({});
  const [stockLogs, setStockLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [counters, setCounters] = useState({});
  const [menuList, setMenuList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cookingStartTimes, setCookingStartTimes] = useState({});

  const menuDict = useMemo(() => {
    const dict = {};
    menuList.forEach(m => { dict[m.name] = m.category; });
    return dict;
  }, [menuList]);

  const formatStock = (value) => {
    if (value === undefined || value === null) return '0';
    const rounded = Math.round(value * 100) / 100;
    return rounded.toString();
  };

  const fetchStockLogs = async () => {
    try {
      const response = await api.getStockLogs();
      setStockLogs(response.data || []);
    } catch (error) {
      console.error("Failed to fetch stock logs:", error);
    }
  };

  const convertToSmallUnit = (stock, unit) => {
    const conversions = {
      "kg": { multiplier: 1000, smallUnit: "gr" },
      "liter": { multiplier: 1000, smallUnit: "ml" },
      "dus": { multiplier: 24, smallUnit: "pcs" },
      "karung": { multiplier: 50, smallUnit: "kg" },
    };
    if (conversions[unit]) {
      return {
        value: stock * conversions[unit].multiplier,
        unit: conversions[unit].smallUnit
      };
    }
    return { value: stock, unit: unit };
  };

  const fetchOrders = async (currentMenus = menuList) => {
    try {
      const dict = {};
      if (Array.isArray(currentMenus)) {
        currentMenus.forEach(m => { dict[m.name] = m.category; });
      }

      const response = await api.getKitchenOrders();
      const ordersData = response?.data || response || [];
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];

      ordersArray.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

      const newOrdersList = [];
      const makanan = [];
      const snack = [];
      const minuman = [];

      const savedCompleted = JSON.parse(localStorage.getItem("kitchenCompletedSections") || "{}");

      ordersArray.forEach(order => {
        if (order.status === "paid" || order.status === "pending") {
          newOrdersList.push(order);
        } else if (order.status === "cooking") {
          const getCat = (item) => (dict[item.name] || item.category || "Makanan").toLowerCase();

          const hasMakanan = order.items?.some(item => getCat(item) === "makanan");
          const hasSnack = order.items?.some(item => getCat(item) === "snack");
          const hasMinuman = order.items?.some(item => getCat(item) === "minuman");

          const completedForOrder = savedCompleted[order.orderId || order._id] || [];

          if (hasMakanan && !completedForOrder.includes("makanan")) {
            makanan.push({ ...order, originalItems: order.items, items: order.items.filter(item => getCat(item) === "makanan") });
          }
          if (hasSnack && !completedForOrder.includes("snack")) {
            snack.push({ ...order, originalItems: order.items, items: order.items.filter(item => getCat(item) === "snack") });
          }
          if (hasMinuman && !completedForOrder.includes("minuman")) {
            minuman.push({ ...order, originalItems: order.items, items: order.items.filter(item => getCat(item) === "minuman") });
          }
        }
      });

      setNewOrders(newOrdersList);
      setFoodCooking(makanan);
      setSnackCooking(snack);
      setDrinkCooking(minuman);

      setCookingStartTimes(JSON.parse(localStorage.getItem("kitchenCookingStartTimes") || "{}"));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const toggleCheck = (orderId, idx) => {
    const key = `${orderId}-${idx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const fetchInventory = async () => {
    try {
      const response = await api.getInventory();
      const inventoryData = response?.data || response || [];
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  const fetchMenus = async () => {
    try {
      const menus = await api.getMenu().catch(() => []);
      if (Array.isArray(menus)) {
        setMenuList(menus);
      }
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    }
  };

  // 🔥 LOAD DATA AWAL
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const menus = await api.getMenu().catch(() => []);
        if (Array.isArray(menus)) setMenuList(menus);
        await Promise.all([fetchOrders(menus), fetchInventory(), fetchStockLogs()]);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
      setLoading(false);
    };
    loadData();

    // Timer update waktu
    const timer = setInterval(() => {
      const now = new Date();
      setNowTime(now);
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setTickCount(t => t + 1);
    }, 1000);

    // 🔥 POLLING JADI 10 DETIK (BIAR GA BERAT)
    const interval = setInterval(() => fetchOrders(), 10000);
    
    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/kitchen/login");
  };

  const startCooking = async (orderId) => {
    try {
      const stockResult = await api.reduceStock(orderId);
      
      if (!stockResult.success) {
        toast.error(`Stok tidak cukup: ${stockResult.errors?.join(", ")}`);
        return;
      }
      
      // 🔥 NOTIFIKASI MENU YANG DI-DISABLE
      if (stockResult.disabled_menus && stockResult.disabled_menus.length > 0) {
        toast.warning(
          `⚠️ Menu dinonaktifkan (bahan habis): ${stockResult.disabled_menus.join(", ")}`
        );
      }
      
      const response = await api.updateKitchenStatus(orderId, "cooking");
      
      if (response.success || response) {
        const newStartTimes = { ...cookingStartTimes, [orderId]: new Date().toISOString() };
        localStorage.setItem("kitchenCookingStartTimes", JSON.stringify(newStartTimes));
        setCookingStartTimes(newStartTimes);

        await fetchOrders();
        toast.success("Order mulai dimasak!");
      } else {
        toast.error("Gagal mulai masak: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to start cooking:", error);
      toast.error("Gagal mulai masak: " + (error.message || "Unknown error"));
    }
  };

  const completeSection = async (order, category) => {
    try {
      const orderId = order.orderId || order._id;
      const saved = JSON.parse(localStorage.getItem("kitchenCompletedSections") || "{}");
      const orderCompleted = saved[orderId] || [];
      
      if (!orderCompleted.includes(category)) {
        orderCompleted.push(category);
      }
      
      const itemsToEvaluate = order.originalItems || order.items;
      const menuDict = {};
      menuList.forEach(m => menuDict[m.name] = m.category);
      const getCat = (item) => (menuDict[item.name] || item.category || "Makanan").toLowerCase();
      
      const hasMakanan = itemsToEvaluate?.some(item => getCat(item) === "makanan");
      const hasSnack = itemsToEvaluate?.some(item => getCat(item) === "snack");
      const hasMinuman = itemsToEvaluate?.some(item => getCat(item) === "minuman");
      
      const requiredCats = [];
      if (hasMakanan) requiredCats.push("makanan");
      if (hasSnack) requiredCats.push("snack");
      if (hasMinuman) requiredCats.push("minuman");
      
      const isAllDone = requiredCats.every(cat => orderCompleted.includes(cat));
      
      if (isAllDone) {
        const response = await api.updateKitchenStatus(orderId, "completed");
        if (response.success || response) {
          toast.success(`Pesanan Meja ${order.tableNumber} telah selesai total!`);
          delete saved[orderId];
        }
      } else {
        saved[orderId] = orderCompleted;
        toast.success(`${category.toUpperCase()} untuk Meja ${order.tableNumber} selesai!`);
      }
      
      localStorage.setItem("kitchenCompletedSections", JSON.stringify(saved));
      await fetchOrders();
    } catch (error) {
      console.error("Failed to complete section:", error);
      toast.error("Gagal menyelesaikan bagian pesanan");
    }
  };

  const completeOrder = async (orderId) => {
    try {
      const response = await api.updateKitchenStatus(orderId, "completed");
      console.log("Complete order response:", response);
      if (response.success) {
        await fetchOrders();
        toast.success("Order selesai!");
      } else {
        toast.error("Gagal menyelesaikan order: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to complete order:", error);
      toast.error("Gagal menyelesaikan order: " + (error.message || "Unknown error"));
    }
  };

  const updateCounter = (id, change) => {
    setCounters(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change)
    }));
  };

  const handleUpdateStock = async (id) => {
    const newStock = counters[id] || 0;
    try {
      await api.updateStock(id, newStock);
      await fetchInventory();
      setCounters(prev => ({ ...prev, [id]: 0 }));
      toast.success("Stok berhasil diupdate!");
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Gagal update stok");
    }
  };

  const toggleMenuAvailability = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.updateMenu(id, { isAvailable: newStatus });
      toast.success(newStatus ? "Menu diaktifkan" : "Menu dinonaktifkan");
    } catch (error) {
      console.error("Failed to update menu:", error);
      toast.error("Gagal update status menu");
    }
  };

  const getStatusBadge = (stock) => {
    if (stock === 0) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">HABIS</span>;
    if (stock <= 5) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">KRITIS</span>;
    if (stock <= 10) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">MENIPIS</span>;
    return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">AMAN</span>;
  };

  const getStockColor = (stock) => {
    if (stock === 0 || stock <= 5) return "text-red-500";
    if (stock <= 10) return "text-orange-500";
    return "text-green-600";
  };

  const stats = {
    total: inventory.length,
    menipis: inventory.filter(i => i.stock <= 10 && i.stock > 0).length,
    habis: inventory.filter(i => i.stock === 0).length,
  };

  const filteredInventory = inventory.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMenuList = menuList.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCookingStartTime = (orderId, fallbackDate) => {
    if (cookingStartTimes[orderId]) {
      return new Date(cookingStartTimes[orderId]);
    }
    
    let start = new Date(fallbackDate);
    if (start.getTime() > nowTime.getTime() + 60000) {
      start = new Date(start.getTime() - 7 * 60 * 60 * 1000);
    }
    if (start.getTime() > nowTime.getTime()) {
      start = nowTime;
    }
    return start;
  };

  const getTimerInfo = (order, category) => {
    const start = getCookingStartTime(order.orderId || order._id, order.updatedAt || order.createdAt || Date.now());
    const elapsedMs = nowTime - start;
    
    let targetMins = 15;
    if (category === "snack") targetMins = 10;
    if (category === "minuman") targetMins = 5;
    
    const targetMs = targetMins * 60 * 1000;
    
    const isAlert = elapsedMs >= targetMs;
    const isOverdue = isAlert;
    
    const safeElapsed = Math.max(0, elapsedMs);
    const m = Math.floor(safeElapsed / 60000);
    const s = Math.floor((safeElapsed % 60000) / 1000);
    
    const timeString = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    return {
      timeString,
      isAlert,
      isOverdue
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-sm">Kitchen Production - Live</span>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button onClick={() => setActiveTab("antrean")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "antrean" ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}>Antrean</button>
            <button onClick={() => setActiveTab("stokmenu")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "stokmenu" ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}>Stok Menu</button>
            <button onClick={() => setActiveTab("kelolastokbahan")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "kelolastokbahan" ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}>Stok Bahan</button>
            <button onClick={() => setActiveTab("stocklog")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "stocklog" ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}>Log Stok</button>
          </div>
          <span className="text-sm font-medium">{currentTime}</span>
          <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
          <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600">
            <LogOut className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 p-6 animate-pulse space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div className="h-24 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div className="h-24 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Antrean Section */}
          {activeTab === "antrean" && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                <div className="lg:col-span-1 bg-[#F9FAFB] rounded-xl shadow-sm border p-4 flex flex-col h-full border-green-200">
                  <div className="flex items-center gap-2 mb-4 border-b border-green-200 pb-3">
                    <h2 className="font-bold text-lg text-gray-800 uppercase tracking-wide">Antrean Baru</h2>
                    <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{newOrders.length}</span>
                  </div>
                  <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                    {newOrders.length === 0 && <div className="text-center text-gray-400 py-8 text-sm">Tidak ada antrean baru</div>}
                    {newOrders.map(order => {
                      const orderTime = new Date(order.createdAt || Date.now()).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                      return (
                        <div key={order.orderId || order._id} className="bg-white rounded-xl p-4 shadow-sm border border-red-100 relative">
                          <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                            <span className="font-bold text-gray-800 text-lg">Meja {order.tableNumber}</span>
                            <span className="text-xs font-bold text-gray-500">{orderTime}</span>
                          </div>
                          <div className="space-y-1.5 mb-4">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="text-sm text-gray-700 font-medium flex items-start gap-2">
                                <span className="font-bold">{item.quantity}x</span> <span>{item.name}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end">
                            <button onClick={() => startCooking(order.orderId || order._id)} className="bg-white border-2 border-red-400 hover:bg-red-50 text-gray-800 px-4 py-1.5 rounded-lg text-sm font-bold transition shadow-sm">Mulai Masak</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Makanan */}
                  <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 border-b pb-3">
                      <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                      <h2 className="font-bold text-lg text-gray-800">Makanan</h2>
                      <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">{foodCooking.length} Dimasak</span>
                    </div>
                    <div className="space-y-3 overflow-y-auto flex-1">
                      {foodCooking.length === 0 && <div className="text-center text-gray-400 text-sm py-8">Tidak ada makanan dimasak</div>}
                      {foodCooking.map(order => {
                        const timerInfo = getTimerInfo(order, "makanan");
                        return (
                          <div key={order.orderId || order._id} className={`rounded-lg p-3 border transition-colors ${timerInfo.isAlert ? (timerInfo.isOverdue ? 'bg-red-100 border-red-500 animate-pulse' : 'bg-red-50 border-red-400') : 'bg-orange-50 border-orange-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-gray-800">Meja {order.tableNumber}</span>
                                <span className="text-xs text-gray-500 ml-2">{order.customerName || "Guest"}</span>
                              </div>
                              <div className={`text-xs font-bold px-2 py-1 rounded-full flex flex-col items-center shadow-sm ${timerInfo.isAlert ? 'bg-red-500 text-white' : 'bg-white border text-gray-700'}`}>
                                <span>{timerInfo.timeString}</span>
                                {timerInfo.isAlert && <span className="text-[10px] leading-none uppercase">Kritis</span>}
                              </div>
                            </div>
                            <div className="space-y-2 mb-3">
                              {order.items?.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                                  <input type="checkbox" checked={!!checkedItems[`${order.orderId || order._id}-${item.name}-${idx}`]} onChange={() => toggleCheck(`${order.orderId || order._id}-${item.name}`, idx)} className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                  <span className={`text-sm font-medium ${checkedItems[`${order.orderId || order._id}-${item.name}-${idx}`] ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.quantity}x {item.name}</span>
                                </label>
                              ))}
                            </div>
                            <button onClick={() => completeSection(order, "makanan")} className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium transition mt-1">Selesai Makanan</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Snack */}
                  <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 border-b pb-3">
                      <UtensilsCrossed className="w-5 h-5 text-yellow-600" />
                      <h2 className="font-bold text-lg text-gray-800">Snack</h2>
                      <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">{snackCooking.length} Dimasak</span>
                    </div>
                    <div className="space-y-3 overflow-y-auto flex-1">
                      {snackCooking.length === 0 && <div className="text-center text-gray-400 text-sm py-8">Tidak ada snack dimasak</div>}
                      {snackCooking.map(order => {
                        const timerInfo = getTimerInfo(order, "snack");
                        return (
                          <div key={order.orderId || order._id} className={`rounded-lg p-3 border transition-colors ${timerInfo.isAlert ? (timerInfo.isOverdue ? 'bg-red-100 border-red-500 animate-pulse' : 'bg-red-50 border-red-400') : 'bg-yellow-50 border-yellow-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-gray-800">Meja {order.tableNumber}</span>
                                <span className="text-xs text-gray-500 ml-2">{order.customerName || "Guest"}</span>
                              </div>
                              <div className={`text-xs font-bold px-2 py-1 rounded-full flex flex-col items-center shadow-sm ${timerInfo.isAlert ? 'bg-red-500 text-white' : 'bg-white border text-gray-700'}`}>
                                <span>{timerInfo.timeString}</span>
                                {timerInfo.isAlert && <span className="text-[10px] leading-none uppercase">Kritis</span>}
                              </div>
                            </div>
                            <div className="space-y-2 mb-3">
                              {order.items?.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                                  <input type="checkbox" checked={!!checkedItems[`${order.orderId || order._id}-${item.name}-${idx}`]} onChange={() => toggleCheck(`${order.orderId || order._id}-${item.name}`, idx)} className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                                  <span className={`text-sm font-medium ${checkedItems[`${order.orderId || order._id}-${item.name}-${idx}`] ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.quantity}x {item.name}</span>
                                </label>
                              ))}
                            </div>
                            <button onClick={() => completeSection(order, "snack")} className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium transition mt-1">Selesai Snack</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Minuman */}
                  <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 border-b pb-3">
                      <Coffee className="w-5 h-5 text-blue-600" />
                      <h2 className="font-bold text-lg text-gray-800">Minuman</h2>
                      <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{drinkCooking.length} Dibuat</span>
                    </div>
                    <div className="space-y-3 overflow-y-auto flex-1">
                      {drinkCooking.length === 0 && <div className="text-center text-gray-400 text-sm py-8">Tidak ada minuman dibuat</div>}
                      {drinkCooking.map(order => {
                        const timerInfo = getTimerInfo(order, "minuman");
                        return (
                          <div key={order.orderId || order._id} className={`rounded-lg p-3 border transition-colors ${timerInfo.isAlert ? (timerInfo.isOverdue ? 'bg-red-100 border-red-500 animate-pulse' : 'bg-red-50 border-red-400') : 'bg-blue-50 border-blue-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-gray-800">Meja {order.tableNumber}</span>
                                <span className="text-xs text-gray-500 ml-2">{order.customerName || "Guest"}</span>
                              </div>
                              <div className={`text-xs font-bold px-2 py-1 rounded-full flex flex-col items-center shadow-sm ${timerInfo.isAlert ? 'bg-red-500 text-white' : 'bg-white border text-gray-700'}`}>
                                <span>{timerInfo.timeString}</span>
                                {timerInfo.isAlert && <span className="text-[10px] leading-none uppercase">Kritis</span>}
                              </div>
                            </div>
                            <div className="space-y-2 mb-3">
                              {order.items?.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                                  <input type="checkbox" checked={!!checkedItems[`${order.orderId || order._id}-${item.name}-${idx}`]} onChange={() => toggleCheck(`${order.orderId || order._id}-${item.name}`, idx)} className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                                  <span className={`text-sm font-medium ${checkedItems[`${order.orderId || order._id}-${item.name}-${idx}`] ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.quantity}x {item.name}</span>
                                </label>
                              ))}
                            </div>
                            <button onClick={() => completeSection(order, "minuman")} className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium transition mt-1">Selesai Minuman</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stok Bahan Section */}
          {activeTab === "kelolastokbahan" && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border"><div className="text-gray-500 text-xs font-semibold uppercase">TOTAL BAHAN</div><div className="text-green-500 text-4xl font-bold">{stats.total}</div></div>
                <div className="bg-white rounded-xl p-5 shadow-sm border"><div className="text-gray-500 text-xs font-semibold uppercase">STOK MENIPIS</div><div className="text-orange-500 text-4xl font-bold">{stats.menipis}</div></div>
                <div className="bg-white rounded-xl p-5 shadow-sm border"><div className="text-gray-500 text-xs font-semibold uppercase">STOK HABIS</div><div className="text-red-500 text-4xl font-bold">{stats.habis}</div></div>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari bahan..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="space-y-2">
                {filteredInventory.map(item => {
                  const displayStock = convertToSmallUnit(item.stock, item.unit);
                  return (
                    <div key={item._id || item.id} className="bg-white rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm border">
                      <div className="flex-1 min-w-[120px]"><div className="font-semibold text-gray-800">{item.name}</div><div className="text-xs text-gray-500">{item.category || "Bahan Baku"}</div></div>
                      <div className="flex flex-col items-center gap-1 min-w-[80px]">
                        <span className={`text-xl font-bold ${getStockColor(item.stock)}`}>{formatStock(displayStock.value)} {displayStock.unit}</span>
                        {getStatusBadge(item.stock)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCounter(item._id || item.id, -1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50"><Minus className="w-3.5 h-3.5" /></button>
                        <div className="w-10 text-center font-semibold">{counters[item._id || item.id] || 0}</div>
                        <button onClick={() => updateCounter(item._id || item.id, 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <button onClick={() => handleUpdateStock(item._id || item.id)} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"><RefreshCw className="w-3.5 h-3.5" /> Update</button>
                    </div>
                  );
                })}
                {filteredInventory.length === 0 && <div className="text-center text-gray-400 py-8">Tidak ada bahan</div>}
              </div>
            </div>
          )}

          {/* Stok Menu Section */}
          {activeTab === "stokmenu" && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="bg-white rounded-xl p-5 shadow-sm border mb-4">
                <div className="text-gray-500 text-xs font-semibold uppercase">TOTAL MENU</div>
                <div className="text-blue-500 text-4xl font-bold">{menuList.length}</div>
              </div>
              <div className="relative w-72 mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari menu..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="space-y-2">
                {filteredMenuList.map(menu => (
                  <div key={menu._id || menu.id} className="bg-white rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm border justify-between">
                    <div className="flex items-center gap-3">
                      <img src={menu.image} alt={menu.name} className="w-12 h-12 rounded object-cover border" loading="lazy" />
                      <div>
                        <div className="font-semibold text-gray-800">{menu.name}</div>
                        <div className="text-xs text-gray-500">{menu.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${menu.isAvailable !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {menu.isAvailable !== false ? "AKTIF" : "HABIS"}
                      </span>
                      <button onClick={() => toggleMenuAvailability(menu._id || menu.id, menu.isAvailable !== false)} className={`relative inline-flex items-center h-8 rounded-full w-16 transition-colors duration-300 focus:outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${menu.isAvailable !== false ? "bg-green-100" : "bg-red-100"}`}>
                        <span className={`inline-flex items-center justify-center w-8 h-8 transform rounded-full transition-transform duration-300 shadow-[0_2px_5px_rgba(0,0,0,0.2)] ${menu.isAvailable !== false ? "translate-x-8 bg-gradient-to-br from-green-400 to-green-600" : "translate-x-0 bg-gradient-to-br from-red-400 to-red-600"}`}>
                          {menu.isAvailable !== false ? (
                            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
                {filteredMenuList.length === 0 && <div className="text-center text-gray-400 py-8">Tidak ada menu ditemukan</div>}
              </div>
            </div>
          )}

          {/* Log Stok Section */}
          {activeTab === "stocklog" && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-4">📋 Log Pemakaian Bahan</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {stockLogs.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">Belum ada log pemakaian</div>
                  ) : (
                    stockLogs.map((log, idx) => {
                      const displayLog = convertToSmallUnit(log.quantity, log.unit || "gr");
                      return (
                        <div key={idx} className="flex justify-between items-center text-sm border-b py-3 hover:bg-gray-50 px-2 rounded">
                          <div className="flex-1">
                            <span className="font-medium text-gray-800">{log.menuName || "Menu"}</span>
                            <span className="text-gray-500 text-xs ml-2">{log.timestamp ? new Date(log.timestamp).toLocaleDateString() : ""}</span>
                          </div>
                          <div className="flex-1 text-center">
                            <span className="text-gray-600">{formatStock(displayLog.value)} {displayLog.unit}</span>
                          </div>
                          <div className="flex-1 text-right">
                            <span className="text-gray-500 text-xs">{log.ingredientName || ""}</span>
                            <span className="text-gray-400 text-xs ml-2">{log.performedBy || "kitchen"}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="mt-4 pt-3 border-t grid grid-cols-3 gap-4 text-center">
                  <div><div className="text-xs text-gray-500">Total Log</div><div className="font-bold">{stockLogs.length}</div></div>
                  <div><div className="text-xs text-gray-500">Total Bahan Terpakai</div><div className="font-bold text-orange-600">{formatStock(stockLogs.reduce((sum, log) => sum + (log.quantity || 0), 0))} unit</div></div>
                  <div><div className="text-xs text-gray-500">Menu Terbanyak</div><div className="font-bold text-sm truncate">{stockLogs.length > 0 ? Object.entries(stockLogs.reduce((acc, log) => { acc[log.menuName] = (acc[log.menuName] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "-" : "-"}</div></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}