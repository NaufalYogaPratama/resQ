"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Map, Users, BookOpen, HandHeart, ShieldCheck, ArrowRight } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Komponen baru untuk galeri foto di hero section
const HeroImageGallery = () => {
  const images = [
    'https://lokerpintar.id/wp-content/uploads/2022/09/Volunteer-Adalah-Arti-Manfaat-Alasan-dan-Cara-Menjadi-4-500x304.jpg',
    'https://www.teachforindonesia.org/wp-content/uploads/2020/01/WhatsApp-Image-2020-01-03-at-09.47.41.jpeg',
    'https://pmikotasemarang.or.id/wp-content/uploads/2023/03/WhatsApp-Image-2023-03-20-at-07.54.36-1-1024x768.jpeg',
    'https://asset.kompas.com/crops/m05jVt_LhrSi7wDTXuwm_HkymWs=/0x0:0x0/1200x800/data/photo/2024/03/14/65f2cc5c82060.jpg',
  ];

  return (
    <div className="relative w-full h-[500px]" data-aos="fade-left">
      {/* Background blobs for depth */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-slate-200 rounded-full blur-3xl"></div>
      
      {/* Image collage */}
      <div 
        className="absolute top-0 right-1/4 w-48 h-72 rounded-2xl shadow-2xl overflow-hidden transform -rotate-6 transition-transform hover:scale-105 hover:rotate-0"
        data-aos="zoom-in" data-aos-delay="200"
      >
        <img src={images[0]} alt="Gallery image 1" className="w-full h-full object-cover" />
      </div>
      <div 
        className="absolute top-1/4 left-0 w-56 h-80 rounded-2xl shadow-2xl overflow-hidden transform rotate-3 transition-transform hover:scale-105 hover:rotate-0"
        data-aos="zoom-in" data-aos-delay="100"
      >
        <img src={images[1]} alt="Gallery image 2" className="w-full h-full object-cover" />
      </div>
      <div 
        className="absolute bottom-0 left-1/4 w-48 h-64 rounded-2xl shadow-2xl overflow-hidden transform rotate-6 transition-transform hover:scale-105 hover:rotate-0"
        data-aos="zoom-in" data-aos-delay="300"
      >
        <img src={images[2]} alt="Gallery image 3" className="w-full h-full object-cover" />
      </div>
      <div 
        className="absolute bottom-10 right-0 w-52 h-72 rounded-2xl shadow-2xl overflow-hidden transform -rotate-3 transition-transform hover:scale-105 hover:rotate-0"
        data-aos="zoom-in" data-aos-delay="400"
      >
        <img src={images[3]} alt="Gallery image 4" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};


export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-10 h-10 text-[#4B5EAA]" />,
      title: "Lapor Cerdas (AI Chatbot)",
      description: "Laporkan darurat via chat. AI kami menyusun detailnya secara otomatis.",
    },
    {
      icon: <Map className="w-10 h-10 text-[#4B5EAA]" />,
      title: "Peta Respons Real-Time",
      description: "Visualisasikan laporan di peta interaktif dengan pin berkode warna sesuai prioritas.",
    },
    {
      icon: <Users className="w-10 h-10 text-[#4B5EAA]" />,
      title: "Bank Sumber Daya",
      description: "Petakan aset dan keahlian warga untuk mobilisasi cepat.",
    },
    {
      icon: <BookOpen className="w-10 h-10 text-[#4B5EAA]" />,
      title: "Pusat Edukasi",
      description: "Tingkatkan kesiapan Anda melalui panduan terkurasi.",
    },
  ];

  const roles = [
    {
      icon: <HandHeart className="w-8 h-8 text-[#4B5EAA]" />,
      title: "Warga",
      description: "Melaporkan & menawarkan bantuan.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#4B5EAA]" />,
      title: "Relawan",
      description: "Merespons & berkoordinasi di lapangan.",
    },
    {
      icon: <Users className="w-8 h-8 text-[#4B5EAA]" />,
      title: "Admin",
      description: "Mengelola & memverifikasi sistem.",
    },
  ];

  return (
    <div className="bg-white text-[#1E293B] font-sans">
      <nav 
        className={`transition-all duration-300 ease-in-out top-0 left-0 right-0 z-50 ${
          isScrolled 
            ? 'fixed bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm' 
            : 'absolute bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className={`text-3xl font-bold transition-colors ${isScrolled ? 'text-[#3A4D89]' : 'text-slate-800'}`}>
                ResQ
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#fitur" className={`font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-[#3A4D89]' : 'text-slate-700 hover:text-slate-900'}`}>Fitur</a>
              <a href="#tentang" className={`font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-[#3A4D89]' : 'text-slate-700 hover:text-slate-900'}`}>Tentang</a>
              <a href="#cara-kerja" className={`font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-[#3A4D89]' : 'text-slate-700 hover:text-slate-900'}`}>Cara Kerja</a>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login" className={`px-5 py-2 rounded-lg font-semibold transition-colors ${isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-700 hover:bg-slate-100'}`}>
                Masuk
              </Link>
              <Link href="/register" className={`px-6 py-2 rounded-lg font-semibold transition-all shadow-md ${isScrolled ? 'bg-[#4B5EAA] text-white hover:bg-[#3A4D89]' : 'bg-[#4B5EAA] text-white hover:bg-[#3A4D89]'}`}>
                Gabung Komunitas
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 overflow-hidden">
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-30 pb-32">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                {/* Left Content (UPDATED) */}
                <div className="text-left" data-aos="fade-right">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
                        Teknologi Menghubungkan <span className="text-[#4B5EAA]">Warga Menggerakkan.</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                        Saat bencana, waktu adalah segalanya. ResQ mengubah niat baik menjadi aksi bersama—cepat, terarah, dan berdampak.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 bg-[#4B5EAA] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#3A4D89] shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            Bergabung Jadi Relawan
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Right Illustration */}
                <div className="hidden lg:block">
                    <HeroImageGallery />
                </div>
            </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 md:h-40" style={{ transform: 'translateY(1px)' }}>
            <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0 64C240 160 480 160 720 160C960 160 1200 160 1440 64V160H0V64Z" fill="white"/>
            </svg>
        </div>
    </section>

        <section id="fitur" className="py-24 bg-white -mt-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={feature.title} data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="h-full bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8">
                    <div className="bg-[#E0E7FF] w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#1E293B] mb-3">{feature.title}</h3>
                    <p className="text-[#475569] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tentang" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div data-aos="fade-right">
                <p className="text-[#4B5EAA] font-semibold uppercase tracking-wide mb-3">TENTANG RESQ</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                  Mengubah Potensi Menjadi Aksi Nyata
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  ResQ lahir dari keyakinan bahwa kekuatan terbesar dalam menghadapi krisis adalah komunitas itu sendiri. Kami memberdayakan setiap warga untuk menjadi bagian dari solusi.
                </p>
              </div>
              <div className="space-y-8" data-aos="fade-left">
                {roles.map((role) => (
                  <div key={role.title} className="flex items-start gap-4">
                    <div className="bg-[#E0E7FF] w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{role.title}</h3>
                      <p className="text-slate-600">{role.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="cara-kerja" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Cara Kerja Gotong Royong
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Dari laporan hingga penanganan—semua terstruktur agar bantuan tepat sasaran dan tidak tumpang tindih.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#4B5EAA] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Lapor & Kumpulkan Info</h3>
                <p className="text-slate-600">
                  Warga melapor via AI Chatbot. Detail otomatis disusun agar mudah dipahami semua pihak.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#4B5EAA] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Pemetaan & Prioritas</h3>
                <p className="text-slate-600">
                  Laporan muncul di peta real-time dengan prioritas. Tim fokus ke titik paling kritis.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#4B5EAA] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Mobilisasi Bantuan</h3>
                <p className="text-slate-600">
                  Relawan & sumber daya warga diaktifkan, koordinasi lapangan tercatat rapi hingga selesai.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#E0E7FF]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-6">
              Ambil Peran Anda
            </h2>
            <p className="text-xl text-[#475569] mb-10">
              Setiap kontribusi berarti. Jadi pelapor, relawan, atau donatur—semua punya peran.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#4B5EAA] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#3A4D89] transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                Daftar Sekarang, Gratis!
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white text-slate-600 border-t border-slate-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} ResQ. Dibuat dengan semangat gotong royong.</p>
        </div>
      </footer>
    </div>
  );
}