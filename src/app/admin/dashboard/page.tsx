import { verifyAuth } from "@/lib/auth";
import Link from 'next/link';
import { Users, FileText, Package } from 'lucide-react';
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";       
import Report from "@/models/Report";   
import Resource from "@/models/Resource";

async function getDashboardStats() {
  try {
    await dbConnect();

    const userCount = await User.countDocuments({});
    const reportCount = await Report.countDocuments({});
    const resourceCount = await Resource.countDocuments({});

    return {
      totalUsers: userCount,
      totalReports: reportCount,
      totalResources: resourceCount,
    };
  } catch (error) {
    console.error("Gagal mengambil statistik dashboard:", error);
    return { totalUsers: 0, totalReports: 0, totalResources: 0 };
  }
}

export default async function DashboardAdminPage() {
  const user = verifyAuth();
  
  const stats = await getDashboardStats();

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
            {/* Gunakan data dari stats */}
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-gray-500">Total Pengguna</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <FileText className="w-8 h-8 text-red-500 mb-2"/>
            {/* Gunakan data dari stats */}
            <p className="text-3xl font-bold">{stats.totalReports}</p>
            <p className="text-gray-500">Total Laporan</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Package className="w-8 h-8 text-green-500 mb-2"/>
            {/* Gunakan data dari stats */}
            <p className="text-3xl font-bold">{stats.totalResources}</p>
            <p className="text-gray-500">Total Sumber Daya</p>
        </div>
      </div>
    </div>
  );
}