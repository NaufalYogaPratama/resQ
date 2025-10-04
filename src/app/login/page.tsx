"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

// Ilustrasi untuk panel kiri
const LoginIllustration = () => (
  <div className="w-full h-full bg-[#4B5EAA] text-white flex flex-col justify-center px-10 py-12 rounded-r-[4rem]">
    <h1 className="text-3xl font-bold mb-6">Selamat Datang di ResQ</h1>
    <p className="text-white/90 mb-10 max-w-md">
      Platform gotong royong digital untuk keamanan dan bantuan masyarakat secara cepat, aman, dan terhubung.
    </p>

    <div className="space-y-6">
      {[
        {
          title: "Lapor Cerdas (AI Chatbot)",
          desc: "Laporkan darurat via chat. AI kami menyusun detailnya secara otomatis.",
        },
        {
          title: "Peta Respons",
          desc: "Visualisasikan laporan di peta interaktif dengan pin berkode warna sesuai prioritas.",
        },
        {
          title: "Bank Sumber Daya",
          desc: "Petakan aset dan keahlian warga untuk mobilisasi cepat.",
        },
        {
          title: "Pusat Edukasi",
          desc: "Tingkatkan kesiapan Anda melalui panduan terkurasi.",
        },
      ].map((item, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5" 
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-white/80 text-sm">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        body: JSON.stringify({ email, kataSandi: password }),
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
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Section (Illustration) - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-center bg-[#4B5EAA] rounded-r-[4rem]">
          <LoginIllustration />
        </div>

        {/* Right Section (Login Form) */}
        <div className="w-full p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
        <a
            href="/"
            className="absolute top-6 left-6 flex items-center gap-2 text-[#4B5EAA] hover:text-[#3A4D89] transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Beranda</span>
          </a>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Masuk ke Akun Anda
          </h2>
          <p className="text-slate-600 mb-8">Selamat datang kembali! Silakan masukkan detail Anda.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EAA] focus:border-transparent transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
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
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end text-sm">
              <Link href="/forgot-password" className="font-medium text-[#4B5EAA] hover:text-[#3A4D89] hover:underline">
                Lupa Kata Sandi?
              </Link>
            </div>

            {error && <p className="text-sm text-red-500 text-center font-semibold">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 font-semibold text-white bg-[#4B5EAA] rounded-lg hover:bg-[#3A4D89] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#4B5EAA] disabled:bg-[#4B5EAA]/70 shadow-md transition duration-200"
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <p className="text-center text-sm text-slate-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-semibold text-[#4B5EAA] hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}