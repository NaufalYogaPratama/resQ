"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kataSandi }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal login.');
      }
      
      const role = data.user.peran;

      if (role === 'Warga') {
        router.push('/warga/dashboard');
      } else if (role === 'Relawan') { 
        router.push('/relawan/dashboard');
      } else if (role === 'Admin') { 
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-lg">
        
        {/* Logo / Judul */}
        <div className="text-center">
            <Link href="/" className="text-4xl font-bold text-white mb-2 inline-block">
              ResQ
            </Link>
            <p className="text-indigo-200">Masuk untuk melanjutkan</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-indigo-200">
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/20 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="kataSandi" className="block text-sm font-medium text-indigo-200">
              Kata Sandi
            </label>
            <input
              id="kataSandi"
              name="kataSandi"
              type="password"
              required
              className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/20 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-400 text-center font-semibold">{error}</p>}

          {/* Tombol Login */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-900 focus:ring-indigo-400 disabled:bg-indigo-600/50 shadow-md"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </form>

        {/* Link Register */}
        <p className="text-center text-sm text-indigo-200">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
                Daftar di sini
            </Link>
        </p>
      </div>
    </div>
  );
}
