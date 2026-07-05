import React, { useState } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Masukkan alamat email yang valid.');
      return;
    }

    setLoading(true);

    try {
      const { API_BASE } = await import('../services/api');
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.detail || "Gagal mengirim permintaan reset kata sandi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {success ? (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
      <CheckCircle className="w-8 h-8 text-green-600" />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">📱 Cek WhatsApp Anda!</h2>
    <p className="text-gray-500 mb-6">
      Kami telah mengirimkan tautan reset kata sandi ke nomor WhatsApp yang terdaftar untuk akun <strong>{email}</strong>. 
      Silakan periksa pesan masuk WhatsApp Anda.
    </p>
    <button 
      onClick={handleClose}
      className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
    >
      Kembali ke Login
    </button>
  </div>
) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Kata Sandi?</h2>
                <p className="text-gray-500 text-sm">
                  Masukkan email yang terdaftar pada akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: nama@email.com"
                      className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-600'} rounded-lg focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Kirim Tautan Reset"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
