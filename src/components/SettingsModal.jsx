import React, { useState, useRef, useEffect } from "react";
import { X, Camera, Save } from "lucide-react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function SettingsModal({ isOpen, onClose, user, onUpdate }) {
  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.username || "");
      setProfilePicture(user.profilePicture || "");
    }
  }, [user]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran foto maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Nama display tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      // For mock users, simulate update since they don't exist in DB
      if (["admin", "kasir", "kitchen"].includes(user.userId)) {
        const updatedUser = { ...user, fullName, profilePicture };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        onUpdate(updatedUser);
        toast.success("Profil berhasil diupdate (Local)");
        onClose();
        return;
      }

      // API update
      const updateData = { fullName, profilePicture };
      const res = await api.updateUser(user.userId, updateData);
      
      if (res.success || res.detail === "User updated" || res) { // depends on API response
        const updatedUser = { ...user, fullName, profilePicture };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        onUpdate(updatedUser);
        toast.success("Profil berhasil diupdate");
        onClose();
      } else {
        toast.error("Gagal mengupdate profil");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="relative flex justify-center items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 text-center">Pengaturan Profil</h2>
          <button 
            onClick={onClose}
            className="absolute right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">
                    {fullName.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-md transition transform hover:scale-105"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-xs text-gray-500 mt-2">Maks. ukuran 2MB</p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nama Display</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama display"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white font-medium hover:bg-orange-600 rounded-lg transition disabled:opacity-70"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
