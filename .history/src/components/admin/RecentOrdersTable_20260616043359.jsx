import { Eye } from "lucide-react";

export default function RecentOrdersTable({ orders, onViewDetail }) {
  // Pastikan orders adalah array
  let safeOrders = [];
  
  if (orders && Array.isArray(orders)) {
    safeOrders = orders;
  } else if (orders && orders.data && Array.isArray(orders.data)) {
    safeOrders = orders.data;
  } else {
    safeOrders = [];
  }

  // Jika tidak ada data
  if (safeOrders.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        Belum ada order terbaru
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ID Order
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {safeOrders.map((order, index) => {
              // Ambil nilai dengan aman (pakai default jika undefined)
              const total = order?.totalAmount ?? order?.total ?? 0;
              const customerName = order?.customerName ?? order?.customer?.name ?? "Guest";
              const orderId = order?.orderId ?? (order?._id ? order._id.slice(-8) : `ORD${index + 1}`);
              const status = order?.status ?? "pending";
              
              // Tentukan warna badge berdasarkan status
              let badgeColor = "bg-yellow-100 text-yellow-700";
              let statusText = "MENUNGGU";
              
              if (status === "completed" || status === "paid") {
                badgeColor = "bg-green-100 text-green-700";
                statusText = status === "completed" ? "SELESAI" : "DIBAYAR";
              } else if (status === "cooking") {
                badgeColor = "bg-blue-100 text-blue-700";
                statusText = "DIMASAK";
              } else if (status === "processing") {
                badgeColor = "bg-purple-100 text-purple-700";
                statusText = "DIPROSES";
              } else if (status === "cancelled") {
                badgeColor = "bg-red-100 text-red-700";
                statusText = "BATAL";
              } else if (status === "pending") {
                badgeColor = "bg-yellow-100 text-yellow-700";
                statusText = "MENUNGGU";
              }
              
              return (
                <tr key={order?._id || order?.id || index} className="border-b hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-mono text-sm text-gray-600">
                    {orderId}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {customerName}
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800">
                    Rp {total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => onViewDetail && onViewDetail(order)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      title="Lihat detail"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}