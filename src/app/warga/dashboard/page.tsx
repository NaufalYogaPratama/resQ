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
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="mb-10 text-center lg:text-left" data-aos="fade-down">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Selamat Datang, <span className="text-indigo-600">{user.nama}</span>!
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Siap membantu sesama? Mari bersama kita jaga lingkungan tetap aman.
          </p>
        </div>

        {/* --- Layout Utama Dua Kolom --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri (Konten Utama) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Kartu Aksi Utama: Buat Laporan */}
            <div data-aos="fade-up" 
              className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col md:flex-row items-center gap-6">
              
              <div className="bg-indigo-100 p-5 rounded-full">
                <AlertTriangle className="w-10 h-10 text-indigo-600" />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900">Laporkan Keadaan Darurat</h2>
                <p className="text-slate-600 mt-1">
                  Lihat atau alami kejadian darurat? Jangan ragu, segera laporkan agar cepat ditangani.
                </p>
              </div>
              
              <Link 
                href="/warga/lapor" 
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-colors w-full md:w-auto text-center shadow-md">
                Buat Laporan
              </Link>
            </div>

            {/* Kartu Laporan Terakhir Anda */}
            <div data-aos="fade-up" data-aos-delay="100" 
              className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6">
              
              <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
                <List className="w-5 h-5 mr-2 text-indigo-600"/> 
                Laporan Terakhir Anda
              </h3>
              
              <div className="text-center py-10 border-2 border-dashed rounded-xl border-slate-200 bg-slate-50">
                <p className="text-slate-500">Anda belum membuat laporan apapun.</p>
              </div>
            </div>

          </div>

          {/* Kolom Kanan (Sidebar Widget) */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Widget Cuaca */}
            <div data-aos="fade-left" data-aos-delay="200" 
              className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6">
              <WeatherWidget />
            </div>

            {/* Kartu Akses Cepat */}
            <div data-aos="fade-left" data-aos-delay="300" 
              className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Akses Cepat</h3>
              <ul className="space-y-2">
                {quickAccessLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} 
                      className="flex items-center p-3 rounded-xl hover:bg-indigo-50 transition-colors">
                      <link.icon className="w-6 h-6 text-indigo-600 mr-4" />
                      <span className="font-semibold text-slate-700">{link.label}</span>
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
