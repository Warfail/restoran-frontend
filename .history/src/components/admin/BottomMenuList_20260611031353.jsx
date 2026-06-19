export default function BottomMenuList({ menus }) {
  const maxSold = menus[0]?.sold || 1;
  
  return (
    <div className="bg-white rounded-xl border border-[#BFCABA] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#BFCABA] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M14 12V10H16.6L11.4 4.85L7.4 8.85L0 1.4L1.4 0L7.4 6L11.4 2L18 8.6V6H20V12H14Z" fill="#835500"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#191C1D]">5 Menu Kurang Laris</h3>
        </div>
        <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
          <path d="M0 19L11 0L22 19H0Z" fill="#835500"/>
          <path d="M11 16C11.2833 16 11.5208 15.9042 11.7125 15.7125C11.9042 15.5208 12 15.2833 12 15C12 14.7167 11.9042 14.4792 11.7125 14.2875C11.5208 14.0958 11.2833 14 11 14C10.7167 14 10.4792 14.0958 10.2875 14.2875C10.0958 14.4792 10 14.7167 10 15C10 15.2833 10.0958 15.5208 10.2875 15.7125C10.4792 15.9042 10.7167 16 11 16Z" fill="#835500"/>
          <path d="M10 13H12V8H10V13Z" fill="#835500"/>
        </svg>
      </div>
      <div className="p-6 space-y-6">
        {menus.map((menu, idx) => {
          const percentage = (menu.sold / maxSold) * 100;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#40493D] font-semibold text-sm">{menu.name}</span>
                <span className="text-[#191C1D] font-bold text-sm">{menu.sold} terjual</span>
              </div>
              <div className="h-3 bg-[#E7E8E9] rounded-full overflow-hidden">
                <div className="h-full bg-[#707A6C] opacity-40 rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}