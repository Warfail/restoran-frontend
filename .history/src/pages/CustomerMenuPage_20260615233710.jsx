import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";

export default function CustomerMenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "5";
  const customerName = searchParams.get("name") || "Guest";
  const orderType = searchParams.get("type") || "Makan di Tempat";
  
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data menu (nanti dari API)
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Singkong Keju Original", price: 12000, category: "Makanan", image: "🍠", available: true },
    { id: 2, name: "Singkong Keju Cokelat", price: 15000, category: "Makanan", image: "🍫", available: true },
    { id: 3, name: "Singkong Keju Spesial", price: 18000, category: "Makanan", image: "⭐", available: true },
    { id: 4, name: "Nasi Goreng Special", price: 25000, category: "Makanan", image: "🍚", available: true },
    { id: 5, name: "Mie Ayam", price: 20000, category: "Makanan", image: "🍜", available: true },
    { id: 6, name: "Es Teh", price: 5000, category: "Minuman", image: "🧊", available: true },
    { id: 7, name: "Es Jeruk", price: 8000, category: "Minuman", image: "🍊", available: true },
    { id: 8, name: "Kopi Hitam", price: 10000, category: "Minuman", image: "☕", available: true },
  ]);

  const categories = ["Semua", "Makanan", "Minuman"];
  const [selectedCategory, setSelectedCategory] = useState("Semua");

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
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        setCart(cart.filter(i => i.id !== itemId));
      } else {
        setCart(cart.map(i => 
          i.id === itemId 
            ? { ...i, quantity: newQuantity, subtotal: newQuantity * i.price }
            : i
        ));
      }
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
    const orderData = {
      tableNumber: parseInt(tableNumber),
      customerName: customerName,
      orderType: orderType,
      items: cart.map(item => ({
        menuId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      })),
      totalAmount: totalAmount,
      status: "pending"
    };
    
    console.log("Order data:", orderData);
    
    setTimeout(() => {
      alert(`✅ Pesanan berhasil!\n\n${customerName}\n${orderType} - Meja ${tableNumber}\nTotal: Rp ${totalAmount.toLocaleString()}\n\nSilakan konfirmasi ke kasir untuk pembayaran.`);
      setCart([]);
      setShowCart(false);
      setLoading(false);
    }, 1000);
  };

  const filteredMenu = menuItems.filter(item => 
    (selectedCategory === "Semua" || item.category === selectedCategory) && item.available
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-red-600">Singkong Keju D9</h1>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>Meja {tableNumber}</span>
              <span>•</span>
              <span>{customerName}</span>
              <span>•</span>
              <span>{orderType}</span>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
        <div className="flex overflow-x-auto px-2 gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 text-sm font-medium transition whitespace-nowrap ${
                selectedCategory === cat 
                  ? "text-red-600 border-b-2 border-red-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredMenu.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-3">
                <div className="text-4xl mb-2">{item.image}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                <p className="text-red-600 font-bold text-sm mt-1">Rp {item.price.toLocaleString()}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 rounded-lg transition"
                >
                  + Pesan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">{cart.length} item</span>
              <p className="font-bold text-gray-800">Rp {totalAmount.toLocaleString()}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Checkout"}
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
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
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                        <div className="text-red-600 font-semibold text-sm">Rp {item.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"><Minus className="w-3.5 h-3.5 text-gray-700" /></button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"><Plus className="w-3.5 h-3.5 text-white" /></button>
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 ml-1"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-red-600">Rp {totalAmount.toLocaleString()}</span></div>
                <button onClick={handleCheckout} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition">Konfirmasi Pesanan</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}