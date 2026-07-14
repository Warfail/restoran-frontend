import toast from "react-hot-toast";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, X, Search, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../services/api";

export default function CustomerMenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "5";
  const customerName = searchParams.get("name") || "Guest";
  const orderType = searchParams.get("type") || "Makan di Tempat";
  
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });
  const [showCart, setShowCart] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sync cart to localStorage whenever it changes so state is never lost
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const [orderSummary, setOrderSummary] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["Semua"]);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://restoran-backend-production-fb73.up.railway.app";

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🔥 FETCH MENU DENGAN FILTER KATEGORI + PAGINATION
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        
        let url = `${API_URL}/menu/?page=${page}&limit=12&t=${Date.now()}`;
        if (selectedCategory !== "Semua") {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (debouncedSearch) {
          url += `&search=${encodeURIComponent(debouncedSearch)}`;
        }
        
        const response = await fetch(url, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Menu data:", data);
        
        if (data.success) {
          const menus = data.data || [];
          if (Array.isArray(menus) && menus.length > 0) {
            // 🔥 SANITASI KATEGORI (PASTIKAN MINUMAN KELUAR!)
            const sanitizedMenus = menus.map(item => {
              let category = item.category || "Makanan";
              // 🔥 NORMALISASI: "minuman" → "Minuman"
              if (category.toLowerCase() === "minuman") {
                category = "Minuman";
              }
              // 🔥 VALIDASI: KALO GA VALID → "Makanan"
              const validCategories = ["Makanan", "Snack", "Minuman"];
              if (!validCategories.includes(category)) {
                category = "Makanan";
              }
              return { ...item, category };
            });
            
            console.log("✅ After sanitize:", sanitizedMenus);
            
            setMenuItems(sanitizedMenus);
            setCategories(["Semua", "Makanan", "Snack", "Minuman"]);
          } else {
            setMenuItems([]);
          }
          setTotalPages(data.pagination?.totalPages || 1);
        } else {
          console.warn("API returned success: false", data);
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        toast.error("Gagal memuat menu. Silakan refresh.");
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, [page, selectedCategory, debouncedSearch]);


  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const addToCart = (item) => {
    const itemId = item._id || item.menuId || item.id;
    const existing = cart.find(cartItem => (cartItem._id || cartItem.menuId || cartItem.id) === itemId);
    
    if (existing) {
      if (existing.quantity + 1 > (item.stock || 0)) {
        toast.error(`Stok maksimal untuk ${item.name} adalah ${item.stock || 0}`);
        return;
      }
      setCart(cart.map(cartItem => 
        (cartItem._id || cartItem.menuId || cartItem.id) === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1, subtotal: (cartItem.quantity + 1) * cartItem.price }
          : cartItem
      ));
    } else {
      if ((item.stock || 0) < 1) {
        toast.error(`Stok ${item.name} habis`);
        return;
      }
      setCart([...cart, { 
        ...item, 
        quantity: 1, 
        subtotal: item.price,
        category: item.category || "Makanan"
      }]);
    }
  };

  const updateQuantity = (itemId, change) => {
    const item = cart.find(i => (i._id || i.menuId || i.id) === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (change > 0 && newQuantity > (item.stock || 0)) {
        toast.error(`Stok maksimal untuk ${item.name} adalah ${item.stock || 0}`);
        return;
      }
      if (newQuantity <= 0) {
        removeFromCart(itemId);
      } else {
        setCart(cart.map(i => 
          (i._id || i.menuId || i.id) === itemId
            ? { ...i, quantity: newQuantity, subtotal: newQuantity * i.price }
            : i
        ));
      }
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => (i._id || i.menuId || i.id) !== itemId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Keranjang kosong!");
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    navigate("/cart", {
      state: {
        customerName: customerName,
        tableNumber: tableNumber,
        orderType: orderType,
        items: cart,
        totalAmount: totalAmount
      }
    });
  };

  const filteredMenu = useMemo(() => {
    return menuItems;
  }, [menuItems]);

  const groupedMenu = useMemo(() => {
    return filteredMenu.reduce((groups, item) => {
      if (!item || !item.category) return groups;
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
      return groups;
    }, {});
  }, [filteredMenu]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF0F0] pb-24">
        <header className="bg-gradient-to-b from-red-50 to-[#FFF0F0] sticky top-0 z-10 shadow-sm rounded-b-3xl mb-4 h-[180px] animate-pulse"></header>
        <div className="flex-1 bg-white rounded-t-3xl px-4 py-8 min-h-screen">
          <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-6 animate-pulse"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (menuItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-[#FFF0F0] flex items-center justify-center">
        <div className="text-center text-gray-500">Menu tidak tersedia</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0F0] pb-24">
      {/* Header */}
      <header className="bg-gradient-to-b from-red-50 to-[#FFF0F0] sticky top-0 z-10 shadow-sm rounded-b-3xl mb-4 transition-all duration-300">
        <div className="flex justify-between items-center px-4 py-4 relative">
          <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply rounded-b-3xl" style={{ backgroundImage: 'radial-gradient(#ef4444 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center bg-white overflow-hidden shadow-sm hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-red-700 font-extrabold text-lg tracking-tight drop-shadow-sm">Singkong Keju</span>
              <span className="text-red-600 font-bold text-xs -mt-1 tracking-wider uppercase">D9 Salatiga</span>
            </div>
          </div>
          <div className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow relative z-10">
            Meja {tableNumber}
          </div>
        </div>

        {/* Search Bar + Cart Icon */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3.5 py-2.5 shadow-sm">
              <Search className="w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari...."
                className="flex-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => setShowCart(true)} className="relative bg-white rounded-full p-2.5 shadow-sm">
              <ShoppingCart className="w-5 h-5 text-red-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 px-4 pb-3.5 overflow-x-auto">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  : "bg-white text-gray-900 border border-gray-200 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Menu List */}
      <div className="flex-1 bg-white rounded-t-3xl px-4 py-5">
        {Object.keys(groupedMenu).length === 0 ? (
          <div className="text-center text-gray-400 py-8">Tidak ada menu yang cocok</div>
        ) : (
          Object.keys(groupedMenu).map((category) => (
            <div key={category} className="mb-6">
              <h2 className="text-gray-900 font-bold text-xl mb-4">{category}</h2>
              <div className="space-y-0">
                {groupedMenu[category].map((item) => (
                  <div key={item._id || item.menuId || item.id} className={`flex items-center gap-3.5 py-4 border-b border-gray-100 ${item.isAvailable === false ? 'opacity-50 grayscale' : ''}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-16 rounded-xl object-cover flex-shrink-0" 
                      loading="lazy"
                      width="80"
                      height="64"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-sm">{item.name}</h3>
                      <p className="text-gray-900 font-bold text-base mt-1">Rp {item.price.toLocaleString()}</p>
                    </div>
                    {(() => {
                      if (item.isAvailable === false) {
                        return (
                          <div className="border-2 border-gray-400 text-gray-500 text-xs font-bold px-4 py-1.5 rounded-full bg-gray-100 cursor-not-allowed">
                            Sold Out
                          </div>
                        );
                      }
                      const cartItem = cart.find(c => (c._id || c.menuId || c.id) === (item._id || item.menuId || item.id));
                      if (cartItem) {
                        return (
                          <div className="flex items-center bg-gray-100 rounded-full p-0.5 shadow-sm">
                            <button onClick={() => updateQuantity(item._id || item.menuId || item.id, -1)} className="w-7 h-7 rounded-full bg-white text-gray-600 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="w-7 text-center font-bold text-gray-700 text-sm">{cartItem.quantity}</span>
                            <button onClick={() => updateQuantity(item._id || item.menuId || item.id, 1)} className="w-7 h-7 rounded-full bg-red-500 text-white shadow-sm flex items-center justify-center hover:bg-red-600 transition-colors active:scale-95"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        );
                      }
                      return (
                        <button
                          onClick={() => addToCart(item)}
                          className="border-2 border-red-600 text-red-600 text-xs font-bold px-5 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition active:scale-95"
                        >
                          Tambah
                        </button>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔥 PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 pb-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-3 rounded-xl border border-gray-200 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-medium text-gray-600">
            {page} / {totalPages}
          </span>
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-3 rounded-xl border border-gray-200 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* FLOATING CHECKOUT BAR */}
      {cart.length > 0 && !showCart && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-white via-white/80 to-transparent pt-12 pb-6 pointer-events-none">
          <div 
            onClick={handleCheckout}
            className="max-w-md mx-auto bg-red-600 rounded-2xl shadow-lg p-3 flex items-center justify-between cursor-pointer hover:bg-red-700 transition active:scale-[0.98] pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-800/40 rounded-full w-10 h-10 flex items-center justify-center relative">
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              </div>
              <div className="flex flex-col text-white">
                <span className="text-[11px] text-red-100 font-medium leading-none mb-1">Total Pesanan</span>
                <span className="font-bold leading-none">Rp {totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-white font-bold text-sm bg-red-500/50 px-3 py-1.5 rounded-xl">
              Lanjut
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Keranjang Belanja</h2>
              <button onClick={() => setShowCart(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Keranjang kosong</div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item._id || item.menuId || item.id} className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-xl p-3 hover:shadow-md transition-shadow">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-14 h-14 rounded-lg object-cover"
                        loading="lazy"
                        width="56"
                        height="56"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm leading-tight mb-1">{item.name}</div>
                        <div className="text-red-600 font-bold text-sm">Rp {item.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                          <button onClick={() => updateQuantity(item._id || item.menuId || item.id, -1)} className="w-7 h-7 rounded-full bg-white text-gray-600 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-7 text-center font-bold text-gray-700 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id || item.menuId || item.id, 1)} className="w-7 h-7 rounded-full bg-red-500 text-white shadow-sm flex items-center justify-center hover:bg-red-600 transition-colors active:scale-95"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item._id || item.menuId || item.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors active:scale-95 ml-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-red-600">Rp {totalAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  Konfirmasi Pesanan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}