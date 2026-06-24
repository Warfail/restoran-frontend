import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { Minus, Plus, FileText, ArrowLeft, ArrowRight } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber = "07", customerName = "Guest", orderType = "Makan di Tempat" } = location.state || {};
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      calculateTotal(parsedCart);
    }
  }, []);

  useEffect(() => {
    calculateTotal(cartItems);
  }, [cartItems]);

  const calculateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(subtotal);
    setTotal(subtotal);
  };

  const updateQuantity = (itemId, change) => {
    setCartItems(prev => {
      const newCart = prev.map(item => {
        const id = item._id || item.menuId || item.id;
        if (id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => {
        const id = item._id || item.menuId || item.id;
        return id !== itemId;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Keranjang kosong!");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName: customerName,
        tableNumber: parseInt(tableNumber),
        orderType: orderType,
        items: cartItems.map(item => ({
          menuId: item.menuId || item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
           category: item.category || "Makanan"
        })),
        totalAmount: total,
        note: noteInput
      };

      console.log("Sending order:", orderData);
      const response = await api.createOrder(orderData);
      console.log("Order response:", response);

      if (response.success) {
        const savedOrder = response.data;
        localStorage.removeItem("cart");
        
        // ✅ Navigasi ke PaymentPage
        navigate("/payment", {
          state: {
            orderId: savedOrder.orderId,
            totalAmount: savedOrder.totalAmount || total,
            customerName: customerName,
            tableNumber: tableNumber,
            orderType: orderType,
            items: savedOrder.items || cartItems
          }
        });
      } else {
        toast.error("Gagal membuat pesanan");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Gagal memproses pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center font-['Inter',sans-serif] max-w-[390px] mx-auto p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-6">Tambahkan menu favorit Anda</p>
          <button onClick={goBack} className="bg-[#E53935] text-white px-6 py-3 rounded-xl font-semibold">
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-gray-100">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="text-[#2E7D32]">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="text-[#2E7D32] text-lg font-bold leading-6">Konfirmasi Pesanan</div>
            <div className="text-gray-500 text-sm font-normal">Meja {tableNumber}</div>
          </div>
        </div>
        <div className="bg-[#E53935] text-white text-sm font-semibold px-3.5 py-1.5 rounded-lg">
          Meja {tableNumber}
        </div>
      </div>

      {/* Stepper */}
      <div className="px-4 py-3 bg-gray-100">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2E7D32] flex items-center justify-center">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <span className="text-[#2E7D32] text-sm font-medium">Keranjang</span>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <span className="text-gray-400 text-sm font-medium">Bayar</span>
          </div>
        </div>
      </div>

      {/* Rincian Pesanan */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-900 text-xl font-bold">Rincian Pesanan</h2>
          <button onClick={goBack} className="text-[#2E7D32] text-sm font-medium">
            Tambah Item +
          </button>
        </div>

        <div className="space-y-3">
          {cartItems.map((item) => {
            const itemId = item._id || item.menuId || item.id;
            return (
              <div key={itemId} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex gap-3">
                  <img 
                    src={item.image || "https://placehold.co/72x72/e8c97a/e8c97a"} 
                    alt={item.name} 
                    className="w-[72px] h-[72px] rounded-lg object-cover" 
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-900 font-semibold text-[15px]">{item.name}</h3>
                        <p className="text-gray-500 text-sm mt-0.5">{item.variant || item.category || "Menu"}</p>
                      </div>
                      <span className="text-[#2E7D32] font-semibold text-[15px]">Rp {item.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button 
                        onClick={() => updateQuantity(itemId, -1)}
                        className="w-7 h-7 rounded-full border-2 border-[#E53935] flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#E53935]" />
                      </button>
                      <span className="text-gray-900 font-semibold text-[15px] w-5 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(itemId, 1)}
                        className="w-7 h-7 rounded-full border-2 border-[#E53935] flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E53935]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note Input */}
        <div className="bg-[#F3F4F6] rounded-lg p-2.5 flex items-center gap-2 mt-3">
          <FileText className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Catatan: Esnya sedikit saja"
            className="flex-1 bg-transparent text-gray-500 text-sm border-none focus:outline-none"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
        </div>
      </div>

      {/* Ringkasan Pembayaran */}
      <div className="mx-4 bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-gray-900 font-bold text-base mb-4">Ringkasan Pembayaran</h3>
        <div className="space-y-2.5">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Nama Pemesan</span>
            <span className="text-gray-900 text-sm font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Subtotal</span>
            <span className="text-gray-900 text-sm font-medium">Rp {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Pajak (0%)</span>
            <span className="text-gray-900 text-sm font-medium">Rp 0</span>
          </div>
          <div className="border-t border-dashed border-gray-200 my-0.5"></div>
          <div className="flex justify-between">
            <span className="text-gray-900 font-bold text-[15px]">Total Pembayaran</span>
            <span className="text-[#2E7D32] font-bold text-[15px]">Rp {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-4 pt-4 pb-6">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-[#E53935] rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-red-600 transition disabled:opacity-50 shadow-lg shadow-red-500/25"
        >
          <span className="text-white font-semibold text-base">
            {loading ? "Memproses..." : "Lanjutkan ke Pembayaran"}
          </span>
          <ArrowRight className="w-4.5 h-4.5 text-white" />
        </button>
      </div>
    </div>
  );
}