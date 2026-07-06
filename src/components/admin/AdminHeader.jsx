export default function AdminHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {children}
        </div>
      )}
    </div>
  );
}
