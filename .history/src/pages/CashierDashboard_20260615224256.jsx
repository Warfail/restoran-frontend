import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ChevronRight, 
  Printer, 
  DollarSign, 
  CreditCard,
  LogOut
} from "lucide-react";

export default function CashierDashboard() {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState("Meja 07");
  const [searchTerm, setSearchTerm] = useState("");
  const [cashReceived, setCashReceived] = useState(50000);
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
    { id: 1, table: "Meja 07", status: "Menunggu Pembayaran", items: 2, total: 45000, active: true, statusColor: "bg-yellow-100 text-yellow-700", borderColor: "border-green-500" },
    { id: 2, table: "Meja 02", status: "Sedang Dimasak di Dapur", items: 3, total: 112500, active: false, statusColor: "bg-green-100 text-green-700", borderColor: "border-gray-200" },
    { id: 3, table: "Meja 15", status: "Selesai / Lunas", items: 1, total: 22000, active: false, statusColor: "bg-gray-100 text-gray-400", borderColor: "border-gray-200" },
  ];

  // Data detail pesanan untuk meja yang dipilih
  const orderItems = [
    { name: "Singkong Keju Original", qty: 1, price: 20000, subtotal: 20000 },
    { name: "Singkong Keju Cokelat", qty: 1, price: 25000, subtotal: 25000 },
  ];

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const change = cashReceived - totalAmount;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">D9</span>
          </div>
          <span className="text-red-600 font-bold text-lg">Singkong Keju D9</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-700 text-sm font-medium">Realtime</span>
          </div>
          <div className="text-right">
            <div className="text-gray-900 text-sm font-semibold">{currentTime}</div>
            <div className="text-gray-500 text-xs">{currentDate}</div>
          </div>
          <div className="w-px h-9 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-gray-900 text-sm font-semibold">Kasir - Ardhan Family</div>
              <div className="text-gray-500 text-xs">Store #01</div>
            </div>
            <img src="https://placehold.co/36x36/a0a0a0/a0a0a0" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Panel - Queue Tracking */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-900 font-semibold text-sm">Pelacakan Antrean</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-500 text-xs font-semibold">LIVE</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari Meja..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => setSelectedTable(table.table)}
                className={`border-2 ${selectedTable === table.table ? table.borderColor : "border-gray-200"} rounded-xl p-3.5 bg-white cursor-pointer transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-gray-900 font-bold text-base">{table.table}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${table.statusColor}`}>{table.status}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500 text-xs">{table.items} Items</span>
                  <span className={`font-bold text-sm ${table.status === "Selesai / Lunas" ? "text-gray-400" : "text-red-500"}`}>
                    Rp {table.total.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Transaction Detail */}
        <div className="flex-1 bg-gray-50 flex flex-col">
          <div className="flex-1 px-6 pt-5 pb-4">
            {/* Header Detail */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-900 font-bold text-xl">Detail Transaksi: {selectedTable}</span>
              <div className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <Printer className="w-4.5 h-4.5 text-gray-700" />
              </div>
            </div>
            <span className="text-gray-500 text-sm block mb-4">Nama Pelanggan: Tintin</span>

            {/* Order Items */}
            <div className="space-y-2.5 mb-4">
              {orderItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl px-5 py-4 flex justify-between items-center border border-gray-200">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-900 font-semibold text-sm">{item.name}</span>
                    <span className="text-gray-500 text-xs">{item.qty} x Rp {item.price.toLocaleString()}</span>
                  </div>
                  <span className="text-gray-900 font-semibold text-sm">Rp {item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              {/* Payment Methods */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 flex flex-col items-center justify-center bg-red-600 rounded-xl py-3.5 cursor-pointer gap-1.5">
                  <DollarSign className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-xs tracking-wide">CASH / TUNAI</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 rounded-xl py-3.5 cursor-pointer gap-1.5">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-400 font-bold text-xs tracking-wide">DEBIT / KARTU</span>
                </div>
              </div>

              {/* Cash Received */}
              <div className="mb-1">
                <span className="text-gray-700 text-sm font-medium block mb-1.5">Uang Diterima</span>
                <div className="border border-gray-200 rounded-lg px-3.5 py-2.5 flex justify-end bg-white">
                  <span className="text-green-600 font-semibold text-sm">Rp {cashReceived.toLocaleString()}</span>
                </div>
              </div>

              {/* Change */}
              <div className="flex justify-between py-3">
                <span className="text-gray-700 text-sm font-medium">Kembalian</span>
                <span className="text-green-600 font-bold text-sm">Rp {change.toLocaleString()}</span>
              </div>

              <div className="border-t border-dashed border-gray-200 my-1"></div>

              {/* Subtotal & Tax */}
              <div className="flex justify-between py-2">
                <span className="text-gray-700 text-sm">Subtotal</span>
                <span className="text-gray-900 text-sm font-medium">Rp {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700 text-sm">Pajak (0%)</span>
                <span className="text-gray-900 text-sm font-medium">Rp 0</span>
              </div>

              {/* Total Tagihan */}
              <div className="bg-red-600 rounded-xl mt-3 py-4 flex flex-col items-center gap-1">
                <span className="text-white text-xs font-medium tracking-wide">TOTAL TAGIHAN</span>
                <span className="text-white font-extrabold text-3xl">Rp {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="px-6 pb-5">
            <button className="w-full bg-red-600 rounded-xl py-4 flex items-center justify-center gap-2.5 hover:bg-red-700 transition">
              <Printer className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">Konfirmasi Lunas & Cetak Struk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}