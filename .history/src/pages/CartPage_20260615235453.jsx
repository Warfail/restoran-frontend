import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Minus, Plus, FileText, X } from "lucide-react";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const handleConfirmOrder = () => {
    const orderData = {
      tableNumber,
      customerName,
      items: cartItems,
      subtotal,
      tax,
      total,
      orderNote,
      createdAt: new Date().toISOString()
    };
    console.log("Order confirmed:", orderData);
    alert(`✅ Pesanan berhasil dikonfirmasi!\n\n${customerName} - Meja ${tableNumber}\nTotal: Rp ${total.toLocaleString()}`);
    setShowConfirmModal(false);
    navigate("/order-success");
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
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full border-2 border-red-500 flex items-center justify-center">
                    <Minus className="w-3.5 h-3.5 text-red-500" />
                  </button>
                  <span className="text-gray-900 font-semibold text-sm w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-green-500" />
                  </button>
                </div>
              </div>
            </div>
            {item.customNote && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                <span className="text-gray-500 text-xs">Catatan: {item.customNote}</span>
              </div>
            )}
          </div>
        ))}

        {/* Catatan Input */}
        <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2 mt-1">
          <FileText className="w-4 h-4 text-gray-500" />
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

      {/* Confirm Button */}
      <div className="px-4 pb-6">
        <button
          onClick={() => setShowConfirmModal(true)}
          className="w-full bg-red-500 rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-red-600 transition"
        >
          <span className="text-white font-semibold text-base">Konfirmasi Pesanan</span>
          <i className="ti ti-arrow-right text-white text-lg"></i>
        </button>
      </div>

      {/* Konfirmasi Pesanan Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900 font-bold text-lg">Konfirmasi Pesanan</h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Catatan untuk pesanan */}
            <div className="mb-4">
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">Catatan Pesanan (Opsional)</label>
              <textarea
                placeholder="Tambahkan catatan untuk pesanan Anda..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows="3"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </div>

            {/* Ringkasan cepat */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Item</span>
                <span className="text-gray-900 font-semibold text-sm">{cartItems.reduce((sum, i) => sum + i.quantity, 0)} item</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Pembayaran</span>
                <span className="text-red-600 font-bold text-base">Rp {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border border-gray-300 rounded-xl py-2.5 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 bg-red-600 rounded-xl py-2.5 text-white text-sm font-semibold hover:bg-red-700"
              >
                Ya, Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}