import { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, Package, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";

export default function NotificationDropdown({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  // Load read notification IDs from localStorage
  const [readNotifIds, setReadNotifIds] = useState(() => {
    const saved = localStorage.getItem("readNotifIds");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Polling notifications every 10s
    const fetchNotifications = async () => {
      try {
        let newNotifs = [];
        
        if (userRole === "admin") {
          // Admin gets low stock notifications
          const inventoryResponse = await api.getInventory();
          const inventory = inventoryResponse.data || inventoryResponse || [];
          const lowStock = inventory.filter(item => item.stock <= 10);
          
          if (lowStock.length > 0) {
            newNotifs = lowStock.map(item => ({
              id: `stock-${item._id || item.id}`,
              type: "stock",
              title: "Peringatan Stok",
              message: `Stok ${item.name} ${item.stock === 0 ? "Habis" : "Menipis"} (${item.stock} ${item.unit})`,
              time: new Date(),
              read: false,
              critical: item.stock === 0
            }));
          }
        } else if (userRole === "kasir") {
          // Cashier gets new order notifications
          const ordersResponse = await api.getOrders();
          const orders = ordersResponse.data || ordersResponse || [];
          const pendingOrders = orders.filter(o => o.status === "pending" || o.payment_status === "pending");
          
          if (pendingOrders.length > 0) {
            newNotifs = pendingOrders.map(order => ({
              id: `order-${order.orderId || order._id}`,
              type: "order",
              title: "Pesanan Baru",
              message: `Pesanan Meja ${order.tableNumber} - ${order.customerName || "Guest"}`,
              time: new Date(order.createdAt),
              read: false,
              critical: false
            }));
          }
        }
        
        // Apply read state from localStorage
        setNotifications(prev => {
          const merged = [...newNotifs];
          
          prev.forEach(p => {
            if (!merged.find(m => m.id === p.id)) {
              merged.push(p);
            }
          });
          
          // Apply read status based on readNotifIds state
          merged.forEach(m => {
            if (readNotifIds.includes(m.id)) {
              m.read = true;
            }
          });
          
          merged.sort((a, b) => b.time - a.time);
          const limited = merged.slice(0, 10);
          
          setHasUnread(limited.some(n => !n.read));
          return limited;
        });
        
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);
    
    return () => clearInterval(intervalId);
  }, [userRole, readNotifIds]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const newReadIds = [...new Set([...readNotifIds, ...allIds])];
    setReadNotifIds(newReadIds);
    localStorage.setItem("readNotifIds", JSON.stringify(newReadIds));
    
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setHasUnread(false);
  };
  
  const getIcon = (type, critical) => {
    if (type === "stock") {
      return critical ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Package className="w-5 h-5 text-orange-500" />;
    }
    return <Bell className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer relative hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-4.5 h-4.5 text-gray-600" />
        {hasUnread && (
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></div>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-800 text-sm">Notifikasi</h3>
            {hasUnread && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tandai semua dibaca
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center flex flex-col items-center">
                <Bell className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">Tidak ada notifikasi saat ini</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 flex gap-3 transition-colors ${notif.read ? 'bg-white opacity-70' : 'bg-blue-50/30'}`}
                    onClick={() => {
                      if (!notif.read) {
                        const newReadIds = [...readNotifIds, notif.id];
                        setReadNotifIds(newReadIds);
                        localStorage.setItem("readNotifIds", JSON.stringify(newReadIds));
                        
                        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                        setHasUnread(notifications.some(n => n.id !== notif.id && !n.read));
                      }
                    }}
                  >
                    <div className="mt-0.5">
                      {getIcon(notif.type, notif.critical)}
                    </div>
                    <div className="flex-1 cursor-pointer">
                      <p className={`text-sm ${notif.read ? 'text-gray-700 font-medium' : 'text-gray-900 font-semibold'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                        {notif.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
