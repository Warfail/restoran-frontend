import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { 
  Search, 
  Printer, 
  DollarSign, 
  CreditCard, 
  ChevronDown,
  ArrowLeft,
  Menu,
  LogOut
} from "lucide-react";

export default function CashierDashboard() {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState("Meja 07");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [selectedBank, setSelectedBank] = useState("BCA");
  const [referenceNumber, setReferenceNumber] = useState("123456");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCurrentDate(now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Data antrean meja
  const tables = [
    { id: 1, table: "Meja 07", items: 2, total: 45000, active: true, statusColor: "text-green-500", borderColor: "border-green-500" },
    { id: 2, table: "Meja 02", items: 5, total: 112000, active: false, borderColor: "border-gray-200" },
    { id: 3, table: "Meja 15", items: 1, total: 20000, active: false, borderColor: "border-gray-200" },
  ];

  const totalAmount = 45000;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-gray-700 cursor-pointer" />
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border-2 border-red-500 flex items-center justify-center bg-white">
              <span className="text-red-500 font-bold text-sm">D9</span>
            </div>
            <span className="text-red-500 font-bold text-lg">Singkong Keju D9</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-700 text-sm font-medium">Realtime</span>
          </div>
          <div className="text-right">
            <div className="text-gray-900 font-semibold text-sm">{currentTime}</div>
            <div className="text-gray-500 text-xs">{currentDate}</div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-gray-900 text-sm font-semibold">Kasir - Ardhan Family</div>
              <div className="text-gray-500 text-xs">Store #01</div>
            </div>
            <img src="https://placehold.co/36x36/a78bfa/a78bfa" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Queue Tracking */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 py-3.5 border-b border-gray-200 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className="text-gray-900 font-semibold text-sm">Pelacakan Antrean</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => setSelectedTable(table.table)}
                className={`border-2 ${selectedTable === table.table ? table.borderColor : "border-gray-200"} rounded-xl p-4 cursor-pointer transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-bold text-base ${selectedTable === table.table ? "text-green-500" : "text-gray-900"}`}>{table.table}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{table.items} Items</span>
                  <span className={`font-bold text-base ${selectedTable === table.table ? "text-gray-900" : "text-gray-700"}`}>Rp {table.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER PANEL - Transaction Detail */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full p-6">
            {/* Header Detail */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer">
                <ArrowLeft className="w-4.5 h-4.5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-gray-900 font-bold text-xl">Detail Transaksi: {selectedTable}</h2>
                <p className="text-gray-500 text-sm">Nama Pelanggan: Tintin</p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-0">
              <div className="flex items-center px-5 py-3.5 border-b border-gray-200 bg-white">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide flex-1">ITEM</span>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide w-16 text-center">JUMLAH</span>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide w-20 text-right">HARGA</span>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide w-20 text-right">SUBTOTAL</span>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center px-5 py-4">
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium text-sm">Singkong Keju Original</div>
                    <div className="text-gray-400 text-xs">Regular Size</div>
                  </div>
                  <span className="text-gray-900 text-sm w-16 text-center">1</span>
                  <span className="text-gray-900 text-sm w-20 text-right">Rp 20.000</span>
                  <span className="text-gray-900 text-sm w-20 text-right">Rp 20.000</span>
                </div>
                <div className="flex items-center px-5 py-4">
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium text-sm">Singkong Keju Cokelat</div>
                    <div className="text-gray-400 text-xs">Extra Topping Meses</div>
                  </div>
                  <span className="text-gray-900 text-sm w-16 text-center">1</span>
                  <span className="text-gray-900 text-sm w-20 text-right">Rp 25.000</span>
                  <span className="text-gray-900 text-sm w-20 text-right">Rp 25.000</span>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-gray-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="text-gray-900 text-sm">Rp 45.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Pajak (0%)</span>
                  <span className="text-gray-900 text-sm">Rp 0</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-900 font-bold text-base">Total Tagihan</span>
                  <span className="text-green-600 font-bold text-xl">Rp 45.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Payment */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto p-6">
          <div className="space-y-5">
            <h3 className="text-gray-900 font-bold text-lg">Metode Pembayaran</h3>
            
            {/* Payment Method Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPaymentMethod("cash")}
                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl gap-1.5 transition border ${
                  selectedPaymentMethod === "cash" 
                    ? "bg-red-600 border-red-600 text-white" 
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <DollarSign className={`w-6 h-6 ${selectedPaymentMethod === "cash" ? "text-white" : "text-gray-700"}`} />
                <span className="text-xs font-semibold">CASH / TUNAI</span>
              </button>
              <button
                onClick={() => setSelectedPaymentMethod("credit")}
                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl gap-1.5 transition border ${
                  selectedPaymentMethod === "credit" 
                    ? "bg-red-600 border-red-600 text-white" 
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <CreditCard className={`w-6 h-6 ${selectedPaymentMethod === "credit" ? "text-white" : "text-gray-700"}`} />
                <span className="text-xs font-semibold">DEBIT / KARTU</span>
              </button>
            </div>

            {/* Bank Selection (only for credit) */}
            {selectedPaymentMethod === "credit" && (
              <div className="space-y-2">
                <label className="text-gray-900 font-medium text-sm">Pilih Bank</label>
                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3.5 py-2.5 bg-white cursor-pointer">
                  <span className="text-gray-900 text-sm">{selectedBank}</span>
                  <ChevronDown className="w-4.5 h-4.5 text-gray-500" />
                </div>
              </div>
            )}

            {/* Reference Number (only for credit) */}
            {selectedPaymentMethod === "credit" && (
              <div className="space-y-2">
                <label className="text-gray-900 font-medium text-sm">Nomor Referensi / Trace Number</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            {/* Total Tagihan Read-only */}
            <div className="space-y-2">
              <label className="text-gray-900 font-medium text-sm">Total Tagihan (Read-Only)</label>
              <div className="border border-gray-200 rounded-lg px-3.5 py-2.5 bg-gray-50">
                <span className="text-gray-900 text-sm">Rp {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-10">
              <button className="w-full flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 rounded-xl py-4 transition">
                <Printer className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">Konfirmasi Lunas & Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}