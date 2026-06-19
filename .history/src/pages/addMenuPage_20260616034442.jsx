import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  ArrowLeft, ChevronDown, Camera, Save,
  Lightbulb, Tag, FileText,
  LayoutDashboard, Utensils, Package, Users, BarChart3, Settings, LogOut
} from "lucide-react";

export default function AddMenuPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", category: "", price: 0, stock: 0, description: "", isAvailable: true
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const menuData = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      description: formData.description,
      isAvailable: formData.isAvailable,
      image: imagePreview || "https://placehold.co/100x80/c8a96e/c8a96e"
    };
    
    try {
      const response = await api.createMenu(menuData);
      if (response.success) {
        alert("✅ Menu berhasil ditambahkan!");
        navigate("/admin/menu");
      }
    } catch (error) {
      alert("Gagal menambahkan menu");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 w-64 h-full bg-[#E12A2C] shadow-lg z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold text-white">Singkong Keju D9</h2>
          <p className="text-[#CBFFC2] text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">Ringkasan</button>
          <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-3 px-4 py-3 bg-[#FEB64C] text-[#704800] rounded-lg w-full">Manajemen Menu</button>
          <button onClick={() => navigate("/admin/inventory")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">Stok Bahan</button>
          <button onClick={() => navigate("/users")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">Manajemen Pengguna</button>
          <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">Laporan Penjualan</button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg w-full">Keluar</button>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b">
          <button onClick={() => navigate("/admin/menu")} className="flex items-center gap-2 text-green-600">← Kembali</button>
        </div>
        
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Tambah Menu Baru</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Menu" className="w-full p-2 border rounded" required />
            
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" required>
              <option value="">Pilih Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
              <option value="snack">Snack</option>
            </select>
            
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Harga" className="w-full p-2 border rounded" required />
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stok" className="w-full p-2 border rounded" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Deskripsi" className="w-full p-2 border rounded" rows="3"></textarea>
            
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
              {loading ? "Menyimpan..." : "Simpan Menu"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}