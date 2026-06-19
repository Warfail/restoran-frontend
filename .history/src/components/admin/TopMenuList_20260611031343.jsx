export default function TopMenuList({ menus }) {
  return (
    <div className="bg-white rounded-xl border border-[#BFCABA] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#BFCABA] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z" fill="#2E7D32"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#191C1D]">5 Menu Paling Laris</h3>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6Z" fill="#0D631B"/>
          <path d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#0D631B"/>
        </svg>
      </div>
      <div className="p-6 space-y-6">
        {menus.map((menu, idx) => {
          const maxSold = menus[0]?.sold || 1;
          const percentage = (menu.sold / maxSold) * 100;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#40493D] font-semibold text-sm">
                  {menu.name} {menu.price && `(Rp ${menu.price.toLocaleString()})`}
                </span>
                <span className="text-[#191C1D] font-bold text-sm">{menu.sold} terjual</span>
              </div>
              <div className="h-3 bg-[#E7E8E9] rounded-full overflow-hidden">
                <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}