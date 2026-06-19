export default function StatsCard({ title, value, icon, growth, bgColor, iconColor }) {
  const isPositive = growth >= 0;
  
  return (
    <div className="bg-white p-6 rounded-xl border border-[#BFCABA] shadow-sm">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className={`px-2 py-1 rounded ${bgColor}`}>
          <span className={`text-sm font-bold ${iconColor}`}>
            {isPositive ? "+" : ""}{growth}%
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[#40493D] text-sm font-semibold">{title}</p>
        <p className="text-[#191C1D] text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}