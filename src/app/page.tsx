
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, Map, BookOpen, HandHeart, MessageCircle, ArrowRight } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-12 h-12 text-indigo-600" />,
      title: "Lapor Cerdas (AI Chatbot)",
      description: "Laporkan darurat via chat. Biarkan AI kami menyusun detailnya secara otomatis.",
    },
    {
      icon: <Map className="w-12 h-12 text-indigo-600" />,
      title: "Peta Respons Real-Time",
      description: "Visualisasikan laporan di peta interaktif dengan pin berkode warna sesuai prioritas.",
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-600" />,
      title: "Bank Sumber Daya",
      description: "Petakan aset dan keahlian warga untuk mobilisasi cepat.",
    },
    {
      icon: <BookOpen className="w-12 h-12 text-indigo-600" />,
      title: "Pusat Edukasi",
      description: "Tingkatkan kesiapan Anda melalui panduan terkurasi.",
    },
  ];

  const roles = [
    {
      icon: <HandHeart className="w-8 h-8 text-indigo-600" />,
      title: "Warga",
      description: "Melaporkan & menawarkan bantuan.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
      title: "Relawan",
      description: "Merespons & berkoordinasi di lapangan.",
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Admin",
      description: "Mengelola & memverifikasi sistem.",
    },
  ];

  return (
    <div className="bg-white text-slate-800 font-sans">
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-indigo-700">
                ResQ
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#fitur" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Fitur</a>
              <a href="#tentang" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Tentang</a>
              <a href="#cara-kerja" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Cara Kerja</a>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login" className="text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all">
                Gabung Komunitas
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://cdn.antaranews.com/cache/800x533/2021/02/06/banjir-kota-lama.jpg"
              alt="Komunitas bergotong royong"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-white/90"></div>
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full inline-block">
              PLATFORM GOTONG ROYONG DIGITAL
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-slate-900">
              Teknologi Menghubungkan <span className="text-indigo-600">Warga Menggerakkan</span>.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Saat bencana, waktu adalah segalanya. ResQ mengubah niat baik menjadi aksi bersama—cepat, terarah, dan berdampak.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Bergabung Jadi Relawan
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#fitur"
                className="inline-flex items-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-all"
              >
                Lihat Fitur
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mt-12">
              <div className="p-4 rounded-lg bg-indigo-50 border border-slate-200 text-center">
                <div className="text-2xl font-bold text-indigo-700">3</div>
                <div className="text-xs text-slate-600">Peran Inti</div>
              </div>
              <div className="p-4 rounded-lg bg-indigo-50 border border-slate-200 text-center">
                <div className="text-2xl font-bold text-indigo-700">10+</div>
                <div className="text-xs text-slate-600">Fitur</div>
              </div>
              <div className="p-4 rounded-lg bg-indigo-50 border border-slate-200 text-center">
                <div className="text-2xl font-bold text-indigo-700">100%</div>
                <div className="text-xs text-slate-600">Komunitas</div>
              </div>
              <div className="p-4 rounded-lg bg-indigo-50 border border-slate-200 text-center">
                <div className="text-2xl font-bold text-indigo-700">24/7</div>
                <div className="text-xs text-slate-600">Siaga</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="fitur" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Fitur Unggulan ResQ
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Fitur sederhana yang memperkuat gotong royong dari pelaporan hingga koordinasi.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={feature.title} className="hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- About Section --- */}
        <section id="tentang" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Tentang ResQ
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                ResQ diciptakan untuk memberdayakan komunitas dalam menghadapi krisis dengan solusi terstruktur.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((role, index) => (
                <Card key={role.title} className="hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      {role.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{role.title}</h3>
                    <p className="text-slate-600 text-sm">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- How It Works --- */}
        <section id="cara-kerja" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Cara Kerja Gotong Royong
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Dari laporan hingga penanganan, semua dirancang untuk efisiensi maksimal.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center text-indigo-600 font-bold text-2xl">1</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Lapor & Kumpulkan Info</h3>
                  <p className="text-slate-600 text-sm">Warga melapor via AI Chatbot dengan detail otomatis.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center text-indigo-600 font-bold text-2xl">2</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Pemetaan & Prioritas</h3>
                  <p className="text-slate-600 text-sm">Laporan ditampilkan di peta real-time dengan prioritas.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center text-indigo-600 font-bold text-2xl">3</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Mobilisasi Bantuan</h3>
                  <p className="text-slate-600 text-sm">Relawan diaktifkan dengan koordinasi terstruktur.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-16 bg-indigo-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ambil Peran Anda dalam Membangun Komunitas Tangguh
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Setiap kontribusi berarti. Jadi pelapor, relawan, atau donatur—semua punya peran.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Daftar Sekarang, Gratis!
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#cara-kerja"
                className="inline-flex items-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-all"
              >
                Lihat Cara Kerja
              </Link>
              <Link
                href="/donasi"
                className="inline-flex items-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-all"
              >
                Donasi
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-100 text-slate-600">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} ResQ. Dibuat dengan semangat gotong royong.</p>
        </div>
      </footer>
    </div>
  );
}
