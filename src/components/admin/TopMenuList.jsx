export default function TopMenuList({ menus }) {
  return (
    <div className="bg-white rounded-xl border border-[#BFCABA] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#BFCABA] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <span className="text-xl">🔥</span>  {/* Icon api / trending up */}
          </div>
          <h3 className="text-xl font-semibold text-[#191C1D]">5 Menu Paling Laris</h3>
        </div>
        <span className="text-green-600 text-sm font-semibold">↑ +12%</span>
      </div>
      <div className="p-6 space-y-4">
        {menus.map((menu, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "📋"}</span>
                <span className="text-[#40493D] font-semibold text-sm">
                  {menu.name} {menu.price && `(Rp ${menu.price.toLocaleString()})`}
                </span>
              </div>
              <span className="text-[#191C1D] font-bold text-sm">{menu.sold} terjual</span>
            </div>
            <div className="h-2 bg-[#E7E8E9] rounded-full overflow-hidden">
              <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${(menu.sold / menus[0]?.sold) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}