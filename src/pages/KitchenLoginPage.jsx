import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, HelpCircle } from "lucide-react";

export default function KitchenLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulasi login (nanti panggil API)
    setTimeout(() => {
      const u = username.trim().toLowerCase();
      const p = password.trim();
      if (u === "kitchen" && p === "kitchen123") {
        localStorage.setItem("token", "kitchen-token-123");
        localStorage.setItem("role", "kitchen");
        if (rememberMe) {
          localStorage.setItem("rememberedUser", username);
        }
        navigate("/kitchen/dashboard");
      } else {
        setError("Username atau password salah");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-12 sm:p-8 flex flex-col items-center">
        {/* Logo & Title */}
        <div className="text-red-600 text-2xl font-bold tracking-tight mb-4 text-center">
          Singkong Keju D9
        </div>

        <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5 overflow-hidden border-2 border-red-500">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Selamat Datang</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Silakan masuk ke akun Anda</p>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-5">
            <label className="text-gray-700 text-sm font-medium mb-1.5 block">Username</label>
            <div className="flex items-center w-full border border-gray-200 rounded-xl bg-gray-50 px-3.5 py-3 gap-2.5 focus-within:ring-2 focus-within:ring-red-400">
              <i className="ti ti-user text-gray-400 text-lg"></i>
              <input
                type="text"
                placeholder="Masukkan username"
                className="flex-1 bg-transparent border-none text-gray-700 text-sm focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-gray-700 text-sm font-medium mb-1.5 block">Kata Sandi</label>
            <div className="flex items-center w-full border border-gray-200 rounded-xl bg-gray-50 px-3.5 py-3 gap-2.5 focus-within:ring-2 focus-within:ring-red-400">
              <i className="ti ti-lock text-gray-400 text-lg"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                className="flex-1 bg-transparent border-none text-gray-700 text-sm focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                {showPassword ? <EyeOff className="w-4.5 h-4.5 text-gray-400" /> : <Eye className="w-4.5 h-4.5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-7">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <span className="text-gray-700 text-sm">Ingat saya</span>
            </label>
            <button type="button" className="text-green-600 text-sm font-medium hover:underline">
              Lupa Kata Sandi?
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-base font-semibold py-3.5 rounded-xl transition duration-200 disabled:opacity-50"
          >
            <LogIn className="w-4.5 h-4.5" />
            <span>{loading ? "Memproses..." : "Masuk Ke Dashboard"}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-1 mt-6 text-gray-500 text-sm">
          <span>Butuh bantuan?</span>
          <button className="text-green-600 font-medium flex items-center gap-1 hover:underline">
            Hubungi IT Support
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}