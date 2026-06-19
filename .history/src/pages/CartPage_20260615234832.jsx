import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Notes } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber = "07", customerName = "Tintin" } = location.state || {};
  
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Singkong Keju Original", price: 20000, quantity: 1, image: "https://placehold.co/70x70/e8c97a/e8c97a", note: "Porsi Besar", customNote: "" },
    { id: 2, name: "Singkong Keju Cokelat", price: 25000, quantity: 1, image: "https://placehold.co/70x70/5c3d1e/5c3d1e", note: "Gelas Besar", customNote: "" },
  ]);
  
  const [noteInput, setNoteInput] = useState("");
  const [selectedItemNote, setSelectedItemNote] = useState(null);

  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const addNote = (id) => {
    if (noteInput.trim()) {
      setCartItems(items => items.map(item => 
        item.id === id ? { ...item, customNote: noteInput } : item
      ));
      setNoteInput("");
      setSelectedItemNote(null);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0;
  const total = subtotal + tax;

  const handleCheckout = () => {
    alert("Lanjut ke pembayaran");
    // navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="text-green-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-green-600 text-lg font-bold">Konfirmasi Pesanan</h1>
            <p className="text-gray-500 text-xs">Meja {tableNumber}</p>
          </div>
        </div>
        <div className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md">
          Meja {tableNumber}
        </div>
      </div>

      {/* Stepper */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <span className="text-green-500 text-xs font-medium">Keranjang</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs font-bold">2</span>
            </div>
            <span className="text-gray-400 text-xs font-medium">Bayar</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-gray-900 font-bold text-lg">Rincian Pesanan</h2>
          <button className="text-green-500 text-xs font-medium">Tambah Item +</button>
        </div>

        {cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-3.5 mb-3 shadow-sm">
            <div className="flex gap-3">
              <img src={item.image} alt={item.name} className="w-[70px] h-[70px] rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-gray-900 font-semibold text-sm">{item.name}</span>
                  <span className="text-green-600 font-semibold text-sm">Rp {item.price.toLocaleString()}</span>
                </div>
                <p className="text-gray-400 text-xs mt-0.5 mb-2">{item.note}</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-full border-2 border-red-500 flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5 text-red-500" />
                  </button>
                  <span className="text-gray-900 font-semibold text-sm w-5 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 text-green-500" />
                  </button>
                </div>
              </div>
            </div>
            {item.customNote && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex items-start gap-1.5">
                <Notes className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                <span className="text-gray-500 text-xs">Catatan: {item.customNote}</span>
              </div>
            )}
          </div>
        ))}

        {/* Catatan Input */}
        <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2 mt-1">
          <Notes className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Catatan: Esnya sedikit saja"
            className="flex-1 bg-transparent text-gray-500 text-xs border-none focus:outline-none"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && selectedItemNote && addNote(selectedItemNote)}
          />
        </div>
      </div>

      {/* Payment Summary */}
      <div className="px-4 pb-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-gray-900 font-bold text-base mb-3.5">Ringkasan Pembayaran</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Nama Pemesan</span>
              <span className="text-gray-900 text-xs font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Subtotal</span>
              <span className="text-gray-900 text-xs font-medium">Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Pajak (0%)</span>
              <span className="text-gray-900 text-xs font-medium">Rp {tax.toLocaleString()}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-gray-900 font-bold text-sm">Total Pembayaran</span>
              <span className="text-green-600 font-bold text-sm">Rp {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-4 pb-6">
        <button
          onClick={handleCheckout}
          className="w-full bg-red-500 rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-red-600 transition"
        >
          <span className="text-white font-semibold text-base">Lanjutkan ke Pembayaran</span>
          <i className="ti ti-arrow-right text-white text-lg"></i>
        </button>
      </div>
    </div>
  );
}