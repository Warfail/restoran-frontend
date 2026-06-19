// src/pages/AddMenuPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, UploadIcon } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";

export default function AddMenuPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "makanan",
    stock: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data menu baru:", formData);
    // Nanti panggil API POST /menu
    alert("Menu berhasil ditambahkan (simulasi)");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {/* Header dengan tombol back */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 rounded-lg hover:bg-gray-200 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Tambah Menu</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Menu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Menu
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Contoh: Singkong Keju Spesial"
                required
              />
            </div>

            {/* Harga & Kategori */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="25000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            {/* Stok */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="50"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Deskripsi menu..."
              />
            </div>

            {/* Upload Gambar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto Menu
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 transition">
                  <UploadIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Pilih Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <span className="text-sm text-green-600">
                    {formData.image.name}
                  </span>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
              >
                Simpan Menu
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}