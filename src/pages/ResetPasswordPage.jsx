import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, KeyRound, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Tautan reset kata sandi tidak valid atau tidak lengkap.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    
    if (password.length < 6) {
      setError("Kata sandi minimal harus 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const { API_BASE } = await import('../services/api');
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 3000);
      } else {
        setError(data.detail || "Gagal mengatur ulang kata sandi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-12 sm:p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Buat Sandi Baru</h2>
          <p className="text-gray-500 text-sm text-center">
            Silakan masukkan kata sandi baru untuk akun Anda.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h2>
            <p className="text-gray-500 mb-6">
              Kata sandi Anda telah berhasil diperbarui. Anda akan diarahkan ke halaman login dalam 3 detik...
            </p>
            <button 
              onClick={() => navigate("/")}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
            >
              Kembali ke Login Sekarang
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!token ? (
              <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-gray-700 text-sm font-medium">Kata Sandi Baru</label>
                  <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi baru"
                      className="flex-1 bg-transparent border-none text-gray-700 text-sm focus:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 text-sm font-medium">Konfirmasi Kata Sandi Baru</label>
                  <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-3">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi kata sandi"
                      className="flex-1 bg-transparent border-none text-gray-700 text-sm focus:outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-base font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>Simpan Kata Sandi</span>
                  )}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
