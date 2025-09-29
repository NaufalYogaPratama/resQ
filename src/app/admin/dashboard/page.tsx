import { verifyAuth } from "@/lib/auth";
import Link from 'next/link';
import { Users, FileText, Package } from 'lucide-react';

export default async function DashboardAdminPage() {
  const user = verifyAuth();
  
  // Nanti di sini Anda akan mengambil data agregat dari database
  const totalUsers = 0;
  const totalReports = 0;
  const totalResources = 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="mt-1 text-md text-gray-600">Selamat datang, {user?.nama}.</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="w-8 h-8 text-blue-500 mb-2"/>
            <p className="text-3xl font-bold">{totalUsers}</p>
            <p className="text-gray-500">Total Pengguna</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <FileText className="w-8 h-8 text-red-500 mb-2"/>
            <p className="text-3xl font-bold">{totalReports}</p>
            <p className="text-gray-500">Total Laporan</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Package className="w-8 h-8 text-green-500 mb-2"/>
            <p className="text-3xl font-bold">{totalResources}</p>
            <p className="text-gray-500">Total Sumber Daya</p>
        </div>
      </div>
    </div>
  );
}