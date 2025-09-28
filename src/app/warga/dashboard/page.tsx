import Link from 'next/link';
import { AlertTriangle, BookOpen, Map, Package } from 'lucide-react';
import { verifyAuth } from '@/lib/auth'; 
import { redirect } from 'next/navigation';

export default async function DashboardWargaPage() {
  const user = verifyAuth(); 

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          {/* PERBAIKI: Gunakan 'user.nama' sesuai payload JWT Anda, bukan 'user.name' */}
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, {user.nama}!</h1>
          <p className="mt-1 text-md text-gray-600">Anda berada di dashboard Warga. Mari bersama kita jaga lingkungan tetap aman.</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4"><AlertTriangle className="w-8 h-8" /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Laporkan Keadaan Darurat</h2>
              <p className="text-gray-500">Lihat atau alami kejadian darurat? Segera laporkan.</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">Laporan Anda akan langsung terkirim ke relawan terdekat untuk mendapatkan penanganan cepat.</p>
          <Link href="/warga/lapor" className="inline-block w-full text-center bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-all">
            Buat Laporan Baru
          </Link>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Akses Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Link href="/warga/peta" className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <Map className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-bold text-lg">Peta Respon</h4>
            <p className="text-sm text-gray-500">Lihat situasi terkini di sekitar Anda.</p>
          </Link>
          <Link href="/warga/sumber-daya" className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <Package className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-bold text-lg">Bank Sumber Daya</h4>
            <p className="text-sm text-gray-500">Daftarkan aset atau keahlian Anda.</p>
          </Link>
          <Link href="/warga/edukasi" className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-bold text-lg">Pusat Edukasi</h4>
            <p className="text-sm text-gray-500">Tingkatkan kesiapsiagaan Anda.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}