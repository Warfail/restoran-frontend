import { useState, useEffect } from "react";
import { X, Save, ChevronDown } from "lucide-react";
import toast from "react-hot-toast"; // ← TAMBAHKAN INI
import { api } from "../services/api"; 
import { compressImage } from "../utils/imageCompressor";

export default function UpdateMenuModal({ menu, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    image: "",
    isAvailable: true,
    recipe: [] 
  });

  const [recipeInput, setRecipeInput] = useState({
    ingredientName: "",
    quantity: "",
    unit: "kg",
    ingredientId: ""
  });
  const [inventoryList, setInventoryList] = useState([]);

  // Fetch inventory untuk dropdown
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
      recipe: [...(prev.recipe || []), {
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

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name || "",
        category: menu.category || "",
        price: menu.price || 0,
        stock: menu.stock || 0,
        image: menu.image || "",
        isAvailable: menu.isAvailable !== false,
        recipe: menu.recipe || [] // ← TAMBAHKAN INI
      });
      setImagePreview(menu.image || null);
    }
  }, [menu]);

  if (!isOpen || !menu) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setImagePreview(compressedBase64);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
      } catch (error) {
        toast.error("Gagal memproses gambar");
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updateData = {
        ...formData,
        recipe: formData.recipe || []
      };
      await onUpdate(menu.menuId || menu._id, updateData);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Gagal mengupdate menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Menu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1 block">Nama Menu</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-700 text-sm font-medium mb-1 block">Kategori</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                  <option value="snack">Snack</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-gray-700 text-sm font-medium mb-1 block">Harga</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium mb-1 block">Stok</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Recipe / Bahan Baku */}
<div className="mt-6">
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
            <label className="text-gray-700 text-sm font-medium mb-1 block">Foto Menu (Opsional)</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">No img</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
            <span className="text-gray-700 text-sm font-medium">Status</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Nonaktif</span>
              <button
                onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${formData.isAvailable ? "bg-green-600" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.isAvailable ? "right-0.5" : "left-0.5"}`}></span>
              </button>
              <span className="text-xs text-gray-500">Aktif</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 rounded-lg text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}