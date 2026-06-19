export default function RecentOrdersTable({ orders }) {
  const getStatusBadge = (status) => {
    if (status === "SELESAI") {
      return <span className="px-3 py-1 rounded-full bg-green-50 text-[#0D631B] text-xs font-bold uppercase">SELESAI</span>;
    }
    return <span className="px-3 py-1 rounded-full bg-amber-50 text-[#704800] text-xs font-bold uppercase">PROSES</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-[#BFCABA] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#BFCABA] flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#191C1D]">Transaksi Terakhir</h3>
        <button className="text-[#0D631B] text-xs font-bold">Lihat Semua</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F3F4F5]">
            <tr>
              <th className="px-6 py-4 text-left text-[#40493D] text-xs font-bold uppercase tracking-wider">ID PESANAN</th>
              <th className="px-6 py-4 text-left text-[#40493D] text-xs font-bold uppercase tracking-wider">PELANGGAN</th>
              <th className="px-6 py-4 text-left text-[#40493D] text-xs font-bold uppercase tracking-wider">WAKTU</th>
              <th className="px-6 py-4 text-left text-[#40493D] text-xs font-bold uppercase tracking-wider">METODE</th>
              <th className="px-6 py-4 text-left text-[#40493D] text-xs font-bold uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-right text-[#40493D] text-xs font-bold uppercase tracking-wider">TOTAL</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-[#BFCABA]">
            {orders.map((order, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-[#0D631B] font-bold text-sm">{order.id}</td>
                <td className="px-6 py-4 text-[#191C1D] text-sm">{order.customer}</td>
                <td className="px-6 py-4 text-[#40493D] text-sm">{order.time}</td>
                <td className="px-6 py-4 text-[#191C1D] text-sm">{order.method}</td>
                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4 text-right text-[#191C1D] font-bold text-sm">Rp {order.total.toLocaleString()}</td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}