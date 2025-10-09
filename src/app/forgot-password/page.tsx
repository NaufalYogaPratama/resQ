"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim permintaan.');
      }
      
      setMessage('Jika email Anda terdaftar, Anda akan menerima link untuk reset kata sandi.');
      setEmail('');

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Terjadi kesalahan yang tidak diketahui.");
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12 relative">
        <Link
          href="/login"
          className="absolute top-6 left-6 flex items-center gap-2 text-[#4B5EAA] hover:text-[#3A4D89] transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Login</span>
        </Link>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mt-10 mb-2">
            Lupa Kata Sandi?
          </h2>
          <p className="text-slate-600 mb-8">Jangan khawatir! Masukkan email Anda di bawah ini untuk menerima link reset.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EAA] focus:border-transparent transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500 text-center font-semibold">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center font-semibold">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white bg-[#4B5EAA] rounded-lg hover:bg-[#3A4D89] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B5EAA] disabled:bg-[#4B5EAA]/70 shadow-md transition duration-200"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}