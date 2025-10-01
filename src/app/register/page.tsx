"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [noWa, setNoWa] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namaLengkap, email, kataSandi, noWa }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat mendaftar.');
      }
      
      // Menggunakan custom modal/toast di masa depan akan lebih baik daripada alert
      alert('Pendaftaran berhasil! Anda akan diarahkan ke halaman login.');
      router.push('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f14] p-4 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg">
        
        <Link href="/" className="text-amber-400 hover:text-amber-300 flex items-center text-sm font-medium mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
        
        <div className="text-center space-y-2">
            <div className="mx-auto flex items-center justify-center bg-amber-500/10 p-4 rounded-full w-20 h-20">
              <UserPlus className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Buat Akun Baru</h1>
            <p className="text-slate-300">Bergabunglah dengan komunitas ResQ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="namaLengkap" className="block text-sm font-medium text-slate-300 mb-2">
              Nama Lengkap
            </label>
            <input
              id="namaLengkap"
              name="namaLengkap"
              type="text"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="noWa" className="block text-sm font-medium text-slate-300 mb-2">
              Nomor WhatsApp
            </label>
            <input
              id="noWa"
              name="noWa"
              type="tel"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={noWa}
              onChange={(e) => setNoWa(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="kataSandi" className="block text-sm font-medium text-slate-300 mb-2">
              Kata Sandi
            </label>
            <input
              id="kataSandi"
              name="kataSandi"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center font-semibold">{error}</p>}
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-black bg-amber-500 rounded-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0f14] focus:ring-amber-500 disabled:bg-amber-400/50 transition-colors"
            >
              {isLoading ? 'Mendaftarkan...' : 'Daftar'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-400 pt-4">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-amber-400 hover:underline">
                Masuk di sini
            </Link>
        </p>
      </div>
    </div>
  );
}
