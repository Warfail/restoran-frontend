import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronDown, 
  Camera, 
  Save,
  Lightbulb,
  Tag,
  FileText,
  LayoutDashboard,
  Utensils,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

export default function AddMenuPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    isAvailable: true
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data menu baru:", formData);
    // Nanti panggil API POST /menu
    alert("Menu berhasil ditambahkan!");
    navigate("/admin/menu");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <LayoutDashboard className="w-5 h-5" />
            <span>Ringkasan</span>
          </button>

          <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-3 px-4 py-3 bg-white text-[#E12A2C] rounded-lg font-semibold w-full">
            <Utensils className="w-5 h-5" />
            <span>Manajemen Menu</span>
          </button>

          <button onClick={() => navigate("/admin/inventory")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <Package className="w-5 h-5" />
            <span>Stok Bahan</span>
          </button>

          <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <Users className="w-5 h-5" />
            <span>Manajemen Pengguna</span>
          </button>

          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition w-full">
            <BarChart3 className="w-5 h-5" />
            <span>Laporan Penjualan</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full transition">
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full mt-1 transition">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin/menu")}>
            <ArrowLeft className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-semibold">Kembali ke Daftar Menu</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-gray-900 text-sm font-semibold">Admin D9</div>
              <div className="text-gray-500 text-xs">SUPER ADMIN</div>
            </div>
            <img src="https://placehold.co/40x40/8b6f5e/8b6f5e" alt="Admin" className="w-10 h-10 rounded-full object-cover" />
          </div>
        </div>

        <div className="p-8">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tambah Menu Baru</h1>
            <p className="text-gray-500 text-sm mt-1">Lengkapi informasi di bawah ini untuk menambahkan menu singkong atau produk lainnya.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* LEFT COLUMN - Form Fields */}
              <div className="flex-1 space-y-5">
                {/* Nama Menu */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Nama Menu</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Singkong Keju Original Large"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Kategori & Harga */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Kategori</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 border border-red-500 rounded-lg text-sm text-gray-700 bg-white cursor-pointer appearance-none focus:outline-none"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        <option value="makanan">Makanan</option>
                        <option value="minuman">Minuman</option>
                        <option value="snack">Snack</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Harga (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 text-sm">Rp</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-8 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Jelaskan detail menu seperti bahan, porsi, dan keunikan rasa..."
                    rows={5}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN - Image Upload & Status */}
              <div className="w-full lg:w-80 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Unggah Foto Menu</label>
                  <div className="border border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center h-80 cursor-pointer hover:bg-gray-50 transition"
                       onClick={() => document.getElementById("imageInput").click()}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-3">
                          <Camera className="w-7 h-7 text-green-600" />
                        </div>
                        <div className="text-gray-700 text-sm font-medium">Klik atau seret gambar ke sini</div>
                        <div className="text-gray-400 text-xs mt-1">PNG, JPG up to 5MB (Recomm. 800×800px)</div>
                      </>
                    )}
                  </div>
                  <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                {/* Status Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 text-lg">✓</span>
                      <span className="text-gray-900 text-sm font-semibold">Status Ketersediaan</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                      {formData.isAvailable ? "TERSEDIA" : "TIDAK TERSEDIA"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Aktifkan untuk menjual menu ini sekarang</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                      className={`relative inline-flex w-11 h-5 rounded-full transition-colors ${formData.isAvailable ? "bg-green-600" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.isAvailable ? "right-0.5" : "left-0.5"}`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => navigate("/admin/menu")} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
                Batal
              </button>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-green-700 rounded-lg text-sm font-semibold text-white hover:bg-green-800 transition">
                <Save className="w-4 h-4" />
                Simpan Menu
              </button>
            </div>

            {/* Tips Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Li className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Tips Foto</h3>
                  <p className="text-xs text-gray-500">Gunakan pencahayaan alami agar singkong terlihat renyah.</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Strategi Harga</h3>
                  <p className="text-xs text-gray-500">Gunakan harga psikologis seperti Rp19.900 untuk paket.</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">SEO Lokal</h3>
                  <p className="text-xs text-gray-500">Sertakan kata 'Singkong Keju D9 Salatiga' di deskripsi.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}