import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, X, Search, CheckCircle } from "lucide-react";
import { api } from "../services/api";

export default function CustomerMenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "5";
  const customerName = searchParams.get("name") || "Guest";
  const orderType = searchParams.get("type") || "Makan di Tempat";
  
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["Semua"]);

  // Fetch menu dari API
  useEffect(() => {
const fetchMenu = async () => {
  try {
    setLoading(true);
    const menus = await api.getMenu();
    console.log("Menus:", menus); // Harusnya array
  
    if (Array.isArray(menus) && menus.length > 0) {
      setMenuItems(menus);
      const uniqueCats = ["Semua", ...new Set(menus.map(item => item.category))];
      setCategories(uniqueCats);
    } else {
      console.warn("Menu data is empty or not an array");
      setMenuItems([]);
    }
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    setMenuItems([]);
  } finally {
    setLoading(false);
  }
};
    fetchMenu();
  }, []);
  const addToCart = (item) => {
    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1, subtotal: (cartItem.quantity + 1) * cartItem.price }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, subtotal: item.price }]);
    }
  };

  const updateQuantity = (itemId, change) => {
    const item = cart.find(i => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      setCart(cart.map(i => 
        i.id === itemId 
          ? { ...i, quantity: newQuantity, subtotal: newQuantity * i.price }
          : i
      ));
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => i.id !== itemId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

 const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        tableNumber: parseInt(tableNumber),
        customerName,
        orderType,
        items: cart.map(item => ({
          menuId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        })),
        totalAmount,
        status: "pending"
      };
      
      const response = await api.createOrder(orderData);
      console.log("Order created:", response);
      
      setOrderSummary(orderData);
      setShowCart(false);
      setShowSuccessModal(true);
      setCart([]);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Gagal memproses pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const goToPayment = () => {
    setShowSuccessModal(false);
    setCart([]);
    navigate("/payment", { 
      state: { 
        totalAmount: orderSummary.totalAmount,
        customerName: customerName,
        tableNumber: tableNumber,
        orderType: orderType,
        items: orderSummary.items
      } 
    });
  };

const filteredMenu = menuItems.filter(item => {
  // Pastikan item dan item.name ada
  if (!item || !item.name) return false;
  
  const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
  const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesCategory && matchesSearch && item.isAvailable !== false;
});

const groupedMenu = filteredMenu.reduce((groups, item) => {
  if (!item || !item.category) return groups;
  if (!groups[item.category]) groups[item.category] = [];
  groups[item.category].push(item);
  return groups;
}, {});

if (loading) {
  return (
    <div className="min-h-screen bg-[#FFF0F0] flex items-center justify-center">
      <div className="text-center">Loading menu...</div>
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
      <header className="bg-[#FFF0F0] sticky top-0 z-10">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full border-2 border-red-600 flex items-center justify-center bg-white">
              <span className="text-red-600 font-bold text-sm">D-9</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-600 font-bold text-base">Singkong Keju</span>
              <span className="text-red-600 font-medium text-xs">D9</span>
            </div>
          </div>
          <div className="bg-red-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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
        {Object.keys(groupedMenu).map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-gray-900 font-bold text-xl mb-4">{category}</h2>
            <div className="space-y-0">
              {groupedMenu[category].map((item) => (
                <div key={item.id} className="flex items-center gap-3.5 py-4 border-b border-gray-100">
                  <img src={item.image} alt={item.name} className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-sm">{item.name}</h3>
                    <p className="text-gray-900 font-bold text-base mt-1">Rp {item.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="border border-red-600 text-red-600 text-xs font-medium px-5 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition"
                  >
                    Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

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
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <img src={item.image} alt={item.name} className="w-14 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                        <div className="text-red-600 font-semibold text-sm">Rp {item.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-200"><Minus className="w-3.5 h-3.5 text-gray-700" /></button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-red-500"><Plus className="w-3.5 h-3.5 text-white" /></button>
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-gray-200 ml-1"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
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

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-gray-900 font-bold text-xl mb-2">Pesanan Berhasil!</h3>
              
              <div className="bg-gray-50 rounded-xl p-4 w-full mb-4 text-left">
                <p className="text-gray-800 font-semibold mb-1">{orderSummary.customerName}</p>
                <p className="text-gray-500 text-sm mb-2">{orderSummary.orderType} - Meja {orderSummary.tableNumber}</p>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="max-h-32 overflow-y-auto mb-2">
                  {orderSummary.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-gray-600">{item.name} x{item.quantity}</span>
                      <span className="text-gray-800">Rp {item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-green-600">Rp {orderSummary.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-4">
                Silakan lanjutkan ke pembayaran.
              </p>
              
              <button
                onClick={goToPayment}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition"
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}