"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mereset kata sandi.');
      }
      
      setMessage('Kata sandi berhasil diubah! Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);

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
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Atur Ulang Kata Sandi
          </h2>
          <p className="text-slate-600 mb-8">Masukkan kata sandi baru Anda di bawah ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EAA] focus:border-transparent transition duration-200 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EAA] focus:border-transparent transition duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center font-semibold">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center font-semibold">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading || !!message}
              className="w-full px-4 py-3 font-semibold text-white bg-[#4B5EAA] rounded-lg hover:bg-[#3A4D89] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B5EAA] disabled:bg-[#4B5EAA]/70 shadow-md transition duration-200"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}