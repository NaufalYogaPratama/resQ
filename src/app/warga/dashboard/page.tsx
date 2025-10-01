import Link from 'next/link';
import { AlertTriangle, BookOpen, Map, Package, List } from 'lucide-react';
import { verifyAuth } from '@/lib/auth'; 
import { redirect } from 'next/navigation';
import WeatherWidget from "@/components/WeatherWidget";

export default async function DashboardWargaPage() {
  const user = verifyAuth(); 

  if (!user) {
    redirect("/login");
  }

  const quickAccessLinks = [
      { href: "/warga/peta", icon: Map, label: "Peta Respons" },
      { href: "/warga/sumber-daya", icon: Package, label: "Bank Sumber Daya" },
      { href: "/warga/edukasi", icon: BookOpen, label: "Pusat Edukasi" },
  ];

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-10" data-aos="fade-down">
          <h1 className="text-4xl font-bold">Selamat Datang, {user.nama}!</h1>
          <p className="mt-2 text-lg text-slate-400">Siap membantu sesama? Mari bersama kita jaga lingkungan tetap aman.</p>
        </div>

        {/* --- Layout Utama Dua Kolom --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri (Konten Utama) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Kartu Aksi Utama: Buat Laporan */}
            <div data-aos="fade-up" className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-amber-500/10 p-4 rounded-full">
                <AlertTriangle className="w-10 h-10 text-amber-400" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-bold">Laporkan Keadaan Darurat</h2>
                <p className="text-slate-400 mt-1">Lihat atau alami kejadian darurat? Jangan ragu, segera laporkan agar cepat ditangani.</p>
              </div>
              <Link href="/warga/lapor" className="bg-amber-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-amber-400 transition-colors w-full md:w-auto text-center">
                Buat Laporan
              </Link>
            </div>

            {/* Kartu Laporan Terakhir Anda */}
            <div data-aos="fade-up" data-aos-delay="100" className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center"><List className="w-5 h-5 mr-2 text-amber-400"/> Laporan Terakhir Anda</h3>
              <div className="text-center py-10">
                {/* Di masa depan, bagian ini akan menampilkan daftar laporan */}
                <p className="text-slate-500">Anda belum membuat laporan apapun.</p>
              </div>
            </div>

          </div>

          {/* Kolom Kanan (Sidebar Widget) */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Widget Cuaca */}
            <div data-aos="fade-left" data-aos-delay="200">
              <WeatherWidget />
            </div>

            {/* Kartu Akses Cepat */}
            <div data-aos="fade-left" data-aos-delay="300" className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg p-6">
              <h3 className="text-xl font-bold mb-4">Akses Cepat</h3>
              <ul className="space-y-3">
                {quickAccessLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors">
                      <link.icon className="w-6 h-6 text-amber-400 mr-4" />
                      <span className="font-semibold">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}