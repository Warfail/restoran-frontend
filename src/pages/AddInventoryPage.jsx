import MobileHeader from "../components/admin/MobileHeader";
import Sidebar from "../components/admin/Sidebar";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, Info, AlertTriangle, Save } from "lucide-react";

export default function AddInventoryPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    unit: "",
    safetyLimit: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.stock || !formData.unit) {
      toast.error("Mohon lengkapi semua field yang wajib");
      return;
    }

    setLoading(true);
    try {
      await api.addInventory({
        name: formData.name,
        category: formData.category,
        stock: parseFloat(formData.stock),
        unit: formData.unit,
        safetyLimit: formData.safetyLimit ? parseFloat(formData.safetyLimit) : 0
      });
      toast.success("Bahan baru berhasil ditambahkan!");
      navigate("/admin/inventory");
    } catch (error) {
      console.error("Failed to add inventory:", error);
      toast.error("Gagal menambahkan bahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar active="inventory" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <MobileHeader title="Tambah Bahan" onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Back Button */}
            <button 
              onClick={() => navigate("/admin/inventory")}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Stok Bahan
            </button>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Tambah Bahan Baru</h1>
                  <p className="text-gray-500 text-sm">
                    Pastikan semua informasi bahan baku yang dimasukkan akurat untuk akurasi laporan stok.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Nama Bahan Baku</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Keju Mozzarella"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Kategori</label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition text-gray-700"
                        >
                          <option value="" disabled>Pilih Kategori</option>
                          <option value="Bahan Baku">Bahan Baku</option>
                          <option value="Bumbu">Bumbu</option>
                          <option value="Sayuran">Sayuran</option>
                          <option value="Daging">Daging</option>
                          <option value="Minuman">Minuman</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Satuan</label>
                      <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        placeholder="Pack"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                      />
                    </div>
                  </div>
                  
                  {/* Divider line like in design */}
                  <hr className="border-gray-200 my-6" />

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Stok Awal / Current Stock</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          placeholder="0"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-gray-400 font-medium">Qty</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Batas Aman / Safety Limit</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="safetyLimit"
                          value={formData.safetyLimit}
                          onChange={handleChange}
                          placeholder="Masukkan batas minimum stok untuk alert"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 mt-8 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/inventory")}
                      className="px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-[#e31837] hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? "Menyimpan..." : "Simpan Bahan Baru"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Alert Box */}
            <div className="bg-[#f0f8f1] border border-[#d1e7dd] rounded-lg p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-green-800 mb-1">Pemberitahuan Stok</h3>
                <p className="text-sm text-green-700">
                  Sistem akan otomatis mengirim notifikasi jika stok berada di bawah "Batas Aman".
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
