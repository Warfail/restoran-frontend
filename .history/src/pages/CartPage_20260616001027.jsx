import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Minus, Plus, FileText, ArrowRight } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber = "07", customerName = "Tintin" } = location.state || {};
  
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Singkong Keju Original", price: 20000, quantity: 1, image: "https://placehold.co/72x72/e8c97a/e8c97a", variant: "Porsi Besar", customNote: "" },
    { id: 2, name: "Singkong Keju Cokelat", price: 25000, quantity: 1, image: "https://placehold.co/72x72/5c3d1e/5c3d1e", variant: "Gelas Besar", customNote: "" },
  ]);
  
  const [noteInput, setNoteInput] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0;
  const total = subtotal + tax;

  const handleCheckout = () => {
  // ... setelah konfirmasi pesanan, arahkan ke payment
  navigate("/payment", { 
    state: { 
      totalAmount: total,
      orderId: `ORD-${Date.now()}`
    } 
  });
};

  return (
    <div className="min-h-screen bg-gray-100 pb-6 max-w-md mx-auto">
      {/* Stepper */}
      <div className="px-4 py-4 bg-gray-100">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <span className="text-gray-900 text-sm font-medium">Keranjang</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 relative">
            <div className="absolute left-0 top-0 h-full w-0 bg-green-600"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
              <span className="text-gray-400 text-sm font-bold">2</span>
            </div>
            <span className="text-gray-400 text-sm font-medium">Bayar</span>
          </div>
        </div>
      </div>

      {/* Rincian Pesanan */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-900 text-xl font-bold">Rincian Pesanan</h2>
          <button className="text-red-500 text-sm font-medium">Tambah Item +</button>
        </div>

        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-[72px] h-[72px] rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-gray-900 font-semibold text-base">{item.name}</h3>
                      <p className="text-gray-500 text-sm mt-0.5">{item.variant}</p>
                    </div>
                    <span className="text-green-600 font-semibold text-sm">Rp {item.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-end items-center gap-3 mt-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5 text-red-500" />
                    </button>
                    <span className="text-gray-900 font-semibold text-sm w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
              {item.customNote && (
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                  <span className="text-gray-500 text-xs">Catatan: {item.customNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Catatan Input */}
        <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2 mt-3">
          <FileText className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Catatan: Esnya sedikit saja"
            className="flex-1 bg-transparent text-gray-500 text-xs border-none focus:outline-none"
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
            <span className="text-gray-900 text-sm font-medium">Rp {tax.toLocaleString()}</span>
          </div>
          <div className="border-t border-dashed border-gray-200 my-1"></div>
          <div className="flex justify-between">
            <span className="text-gray-900 font-bold text-base">Total Pembayaran</span>
            <span className="text-green-600 font-bold text-base">Rp {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-4 pt-4 pb-6">
        <button
          onClick={handleCheckout}
          className="w-full bg-red-500 rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-red-600 transition"
        >
          <span className="text-white font-semibold text-base">Lanjutkan ke Pembayaran</span>
          <ArrowRight className="w-4.5 h-4.5 text-white" />
        </button>
      </div>
    </div>
  );
}