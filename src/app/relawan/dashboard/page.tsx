import { verifyAuth } from "@/lib/auth";
import Link from 'next/link';
import { Map, Bell, Package } from 'lucide-react';

export default async function DashboardRelawanPage() {
  const user = verifyAuth();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Relawan Siaga</h1>
        <p className="mt-1 text-md text-gray-600">Selamat bertugas, {user?.nama}! Terima kasih atas dedikasimu.</p>
      </div>
      
      {/* Kartu Aksi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Laporan Darurat Aktif</h2>
            <div className="text-center py-8">
                {/* Nanti di sini akan ada daftar laporan */}
                <Bell className="w-12 h-12 mx-auto text-gray-300"/>
                <p className="mt-4 text-gray-500">Belum ada laporan darurat yang masuk.</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold mb-4">Akses Cepat</h2>
                <ul className="space-y-3">
                    <li>
                        <Link href="/relawan/peta" className="flex items-center text-blue-600 font-semibold hover:underline">
                            <Map className="w-5 h-5 mr-2"/> Lihat Peta Respons
                        </Link>
                    </li>
                    <li>
                        <Link href="/relawan/sumber-daya" className="flex items-center text-blue-600 font-semibold hover:underline">
                            <Package className="w-5 h-5 mr-2"/> Cek Sumber Daya
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}