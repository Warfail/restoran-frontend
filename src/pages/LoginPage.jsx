import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const u = username.trim().toLowerCase();
      const p = password.trim();

      // HARDCODED MOCK LOGINS
      if (u === "admin" && p === "admin123") {
        sessionStorage.setItem("token", "dummy-token-123");
        sessionStorage.setItem("role", "admin");
        sessionStorage.setItem("user", JSON.stringify({ userId: "admin", username: "admin", fullName: "Admin Sistem", role: "admin", profilePicture: "" }));
        if (rememberMe) localStorage.setItem("rememberedUser", username);
        navigate("/admin");
        return;
      } else if (u === "kasir" && p === "kasir123") {
        sessionStorage.setItem("token", "kasir-token-123");
        sessionStorage.setItem("role", "kasir");
        sessionStorage.setItem("user", JSON.stringify({ userId: "kasir", username: "kasir", fullName: "Kasir", role: "kasir", profilePicture: "" }));
        if (rememberMe) localStorage.setItem("rememberedUser", username);
        navigate("/cashier");
        return;
      } else if (u === "kitchen" && p === "kitchen123") {
        sessionStorage.setItem("token", "kitchen-token-123");
        sessionStorage.setItem("role", "kitchen");
        sessionStorage.setItem("user", JSON.stringify({ userId: "kitchen", username: "kitchen", fullName: "Kitchen", role: "kitchen", profilePicture: "" }));
        if (rememberMe) localStorage.setItem("rememberedUser", username);
        navigate("/kitchen/dashboard");
        return;
      }

      // API LOGIN (Untuk Karyawan Baru)
      const response = await api.login(username.trim(), password.trim());
      if (response.success) {
        const rawRole = response.role || "";
        const normalizedRole = rawRole.toLowerCase() === "cashier" ? "kasir" : rawRole.toLowerCase();

        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("role", normalizedRole);
        sessionStorage.setItem("user", JSON.stringify(response.user));
        if (rememberMe) localStorage.setItem("rememberedUser", username);
        
        if (normalizedRole === "admin") {
          navigate("/admin");
        } else if (normalizedRole === "kasir") {
          navigate("/cashier");
        } else if (normalizedRole === "kitchen") {
          navigate("/kitchen/dashboard");
        } else {
          navigate("/"); // fallback
        }
      } else {
        setError(response.detail || "Username atau password salah");
      }
    } catch (err) {
      setError(err.message || "Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-[420px] px-6 sm:px-10 py-8 sm:py-10 flex flex-col items-center">
          
          <div className="mb-5">
            <div className="w-[72px] h-[72px] rounded-full border-2 border-red-600 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <h1 className="text-green-800 text-2xl font-bold text-center tracking-tight mb-2">
            Singkong Keju D9
          </h1>
          
          <p className="text-gray-800 text-xl font-semibold text-center mb-1">
            Selamat Datang
          </p>
          
          <p className="text-gray-500 text-sm text-center mb-7">
            Silakan masuk ke akun Anda
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="w-full mb-4">
              <label className="text-gray-700 text-[13px] font-medium mb-1.5 block">
                Username
              </label>
              <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2.5 gap-2 focus-within:border-green-800 transition-colors">
                <UserIcon className="w-5 h-5 text-gray-400" />
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

            <div className="w-full mb-5">
              <label className="text-gray-700 text-[13px] font-medium mb-1.5 block">
                Kata Sandi
              </label>
              <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2.5 gap-2 focus-within:border-green-800 transition-colors">
                <LockClosedIcon className="w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  className="flex-1 bg-transparent border-none text-gray-700 text-sm focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="w-full flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-green-800 focus:ring-green-800 cursor-pointer"
                />
                <span className="text-gray-700 text-[13px]">Ingat saya</span>
              </label>
              <button type="button" className="text-green-800 text-[13px] font-medium hover:underline">
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
              className="w-full flex items-center justify-center gap-2 bg-green-800 hover:bg-green-900 text-white text-[15px] font-semibold rounded-lg py-3 px-6 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              <span>{loading ? "Memproses..." : "Masuk Ke Dashboard"}</span>
            </button>
          </form>

          <div className="mt-5 text-gray-500 text-[13px] text-center">
            <span>Butuh bantuan? </span>
            <button type="button" className="text-green-800 font-medium hover:underline">
              Hubungi IT Support
            </button>
            <span> ℹ</span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 py-5 border-t border-gray-200 bg-white gap-3 sm:gap-0">
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="text-green-800 text-[13px] font-semibold">Singkong Keju D9</span>
          <span className="text-gray-500 text-[13px]">• © 2024 Singkong Keju D9. Keamanan Terjamin.</span>
        </div>
        <div className="flex items-center gap-5">
          <button type="button" className="text-gray-700 text-[13px] hover:text-green-800">Bantuan</button>
          <button type="button" className="text-gray-700 text-[13px] hover:text-green-800">Privasi</button>
          <button type="button" className="text-green-800 text-[13px] font-medium hover:underline">Syarat & Ketentuan</button>
        </div>
      </div>
    </div>
  );
}