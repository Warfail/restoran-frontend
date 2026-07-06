import SettingsModal from "../components/SettingsModal";
import MobileHeader from "../components/admin/MobileHeader";
import Sidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    isAvailable: true,
    recipe: [] 
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const [recipeInput, setRecipeInput] = useState({
  ingredientName: "",
  quantity: "",
  unit: "kg"
});
const [inventoryList, setInventoryList] = useState([]);

// Fetch inventory buat dropdown
useEffect(() => {
  const fetchInventory = async () => {
    try {
      const response = await api.getInventory();
      setInventoryList(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };
  fetchInventory();
}, []);

const addRecipeItem = () => {
  if (!recipeInput.ingredientName || !recipeInput.quantity) {
    toast.error("Lengkapi data bahan");
    return;
  }
  setFormData(prev => ({
    ...prev,
    recipe: [...prev.recipe, {
      ingredientId: recipeInput.ingredientId || `INV-${Date.now()}`,
      name: recipeInput.ingredientName,
      quantity: parseFloat(recipeInput.quantity),
      unit: recipeInput.unit
    }]
  }));
  setRecipeInput({ ingredientName: "", quantity: "", unit: "kg", ingredientId: "" });
};

const removeRecipeItem = (index) => {
  setFormData(prev => ({
    ...prev,
    recipe: prev.recipe.filter((_, i) => i !== index)
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || Number(formData.price) <= 0) {
      toast("Mohon lengkapi data menu");
      return;
    }
    
    setLoading(true);
    
    try {
      // Backend akan generate menuId otomatis
      const menuData = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock) || 0,
        description: formData.description,
        isAvailable: formData.isAvailable,
        image: imagePreview || "https://placehold.co/100x80/c8a96e/c8a96e",
        recipe: formData.recipe || []
      };

       console.log("📤 Sending menuData:", menuData);
      console.log("Price type:", typeof menuData.price);  // Harus "number"
      console.log("Stock type:", typeof menuData.stock);  // Harus "number"
      
      const response = await api.createMenu(menuData);
      console.log("Menu created:", response);
      
      if (response.success) {
        toast.success("✅ Menu berhasil ditambahkan!");
        navigate("/admin/menu");
      } else {
        toast.error("Gagal menambahkan menu: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Create menu failed:", error);
      toast.error("Terjadi kesalahan saat menambahkan menu");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar active="menu" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <MobileHeader title="Tambah Menu Baru" onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <AdminHeader 
              title="Tambah Menu Baru" 
              subtitle="Lengkapi informasi di bawah ini untuk menambahkan menu baru."
            >
              <div className="flex items-center gap-4 hidden sm:flex">
                <div className="flex items-center gap-2 cursor-pointer bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition" onClick={() => navigate("/admin/menu")}>
                  <ArrowLeft className="w-5 h-5" />
                  <span>Kembali ke Daftar Menu</span>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-gray-900 text-sm font-semibold">{currentUser?.fullName || currentUser?.username || ""}</div>
                    <div className="text-gray-500 text-xs font-medium">{currentUser?.role?.toUpperCase() || "ROLE"}</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm border border-gray-200">
                    {currentUser?.profilePicture ? (
                      <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (currentUser?.fullName || currentUser?.username || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
              </div>
            </AdminHeader>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* LEFT COLUMN */}
              <div className="flex-1 space-y-5">
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Nama Menu *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Singkong Keju Original Large"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Kategori *</label>
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
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Harga (Rp) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Stok</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Recipe / Bahan Baku */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Resep / Bahan Baku</label>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={recipeInput.ingredientName}
                        onChange={(e) => {
                          const selected = inventoryList.find(i => i.name === e.target.value);
                          setRecipeInput({
                            ingredientName: e.target.value,
                            ingredientId: selected?._id || "",
                            unit: selected?.unit || "kg"
                          });
                        }}
                      >
                        <option value="">Pilih Bahan</option>
                        {inventoryList.map(item => (
                          <option key={item._id} value={item.name}>{item.name} ({item.unit})</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        placeholder="Qty"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={recipeInput.quantity}
                        onChange={(e) => setRecipeInput(prev => ({ ...prev, quantity: e.target.value }))}
                      />
                    </div>
                    <div className="w-20">
                      <span className="text-sm text-gray-500 py-2 block">{recipeInput.unit || "kg"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={addRecipeItem}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      Tambah
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.recipe.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-sm font-medium flex-1">{item.name}</span>
                        <span className="text-sm text-gray-500">{item.quantity} {item.unit}</span>
                        <button
                          type="button"
                          onClick={() => removeRecipeItem(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Jelaskan detail menu..."
                    rows={4}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="w-full lg:w-80 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Unggah Foto Menu</label>
                  <div className="border border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-gray-50 transition"
                       onClick={() => document.getElementById("imageInput").click()}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-3">
                          <Camera className="w-7 h-7 text-green-600" />
                        </div>
                        <div className="text-gray-700 text-sm font-medium">Klik untuk upload gambar</div>
                        <div className="text-gray-400 text-xs mt-1">PNG, JPG up to 5MB</div>
                      </>
                    )}
                  </div>
                  <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                {/* Status */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-900 text-sm font-semibold">Status Ketersediaan</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${formData.isAvailable ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {formData.isAvailable ? "TERSEDIA" : "TIDAK TERSEDIA"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Aktifkan untuk menjual menu ini</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                      className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${formData.isAvailable ? "bg-green-600" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${formData.isAvailable ? "right-0.5" : "left-0.5"}`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => navigate("/admin/menu")} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
                Batal
              </button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-green-700 rounded-lg text-sm font-semibold text-white hover:bg-green-800 transition disabled:opacity-50">
                <Save className="w-4 h-4" />
                {loading ? "Menyimpan..." : "Simpan Menu"}
              </button>
            </div>

            {/* Tips Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center"><Lightbulb className="w-4.5 h-4.5 text-amber-500" /></div>
                <div><h3 className="text-sm font-semibold text-gray-900 mb-1">Tips Foto</h3><p className="text-xs text-gray-500">Gunakan pencahayaan alami agar makanan terlihat menarik.</p></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center"><Tag className="w-4.5 h-4.5 text-amber-500" /></div>
                <div><h3 className="text-sm font-semibold text-gray-900 mb-1">Strategi Harga</h3><p className="text-xs text-gray-500">Gunakan harga psikologis seperti Rp19.900.</p></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center"><FileText className="w-4.5 h-4.5 text-amber-500" /></div>
                <div><h3 className="text-sm font-semibold text-gray-900 mb-1">Deskripsi</h3><p className="text-xs text-gray-500">Sertakan bahan dan keunikan menu.</p></div>
              </div>
            </div>



          </form>
          </div>
        </main>
      </div>
    
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />
    </div>
  );
}