import { Menu } from "lucide-react";

export default function MobileHeader({ title, onMenuClick }) {
  return (
    <div className="md:hidden flex items-center justify-between bg-white border-b px-4 py-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      </div>
      <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full border" />
    </div>
  );
}
