import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, FileText, Package, ListChecks, AlertTriangle } from 'lucide-react';
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";       
import Report from "@/models/Report";   
import Resource from "@/models/Resource";

interface ReportType {
  _id: string;
  deskripsi: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai';
  createdAt: string;
  pelapor: {
      namaLengkap: string;
  } | null; 
}

async function getDashboardStats() {
  try {
    await dbConnect();
    const userCount = await User.countDocuments({});
    const reportCount = await Report.countDocuments({});
    const resourceCount = await Resource.countDocuments({});
    const pendingReports = await Report.countDocuments({ status: 'Menunggu' });
    return { 
      totalUsers: userCount, 
      totalReports: reportCount, 
      totalResources: resourceCount,
      pendingReports: pendingReports
    };
  } catch (error) {
    console.error("Gagal mengambil statistik:", error);
    return { totalUsers: 0, totalReports: 0, totalResources: 0, pendingReports: 0 };
  }
}


async function getRecentReports() {
    try {
        await dbConnect();
        const reports = await Report.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('pelapor', 'namaLengkap');
        return JSON.parse(JSON.stringify(reports));
    } catch (error) {
        console.error("Gagal mengambil laporan terbaru:", error);
        return [];
    }
}

export default async function DashboardAdminPage() {
  const user = await verifyAuth();
  if (!user || user.peran !== 'Admin') {
    redirect('/login');
  }
  
  const stats = await getDashboardStats();
  const recentReports = await getRecentReports();

  const statCards = [
      { label: "Total Pengguna", value: stats.totalUsers, icon: Users, color: "text-blue-600 bg-blue-100" },
      { label: "Total Sumber Daya", value: stats.totalResources, icon: Package, color: "text-green-600 bg-green-100" },
      { label: "Total Laporan", value: stats.totalReports, icon: FileText, color: "text-slate-600 bg-slate-100" },
  ];

  return (
    <div className="space-y-8">

      <div data-aos="fade-down">
        <h1 className="text-4xl font-extrabold text-slate-900">Dashboard Admin</h1>
        <p className="mt-2 text-lg text-slate-600">Selamat datang, {user?.nama}. Berikut adalah ringkasan sistem ResQ saat ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up">

        {statCards.map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6"/>
                </div>
                <p className="text-4xl font-extrabold text-slate-900 mt-4">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
        ))}
   
        <div data-aos-delay="100" className="bg-red-600 text-white p-6 rounded-2xl shadow-lg shadow-red-500/20 flex flex-col justify-between">
            <div>
                <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6"/>
                </div>
                <p className="text-4xl font-extrabold mt-4">{stats.pendingReports}</p>
                <p className="text-sm font-medium text-red-200">Laporan Butuh Respons</p>
            </div>
            <Link href="/admin/peta" className="mt-4 inline-block bg-white text-red-600 font-bold px-4 py-2 rounded-lg text-sm text-center hover:bg-red-50">
                Buka Peta Respons
            </Link>
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="200" className="bg-white border border-slate-200 rounded-2xl shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <ListChecks className="w-6 h-6 mr-3 text-indigo-600"/> Laporan Terbaru
            </h2>
            <Link href="/admin/laporan" className="text-sm font-semibold text-indigo-600 hover:underline">Lihat Semua Laporan</Link>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Deskripsi</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Pelapor</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tanggal</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                      {recentReports.map((report: ReportType) => (
                        <tr key={report._id} className="hover:bg-slate-50">
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ report.status === 'Menunggu' ? 'bg-red-100 text-red-700' : report.status === 'Ditangani' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700' }`}>{report.status}</span></td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-800 truncate max-w-sm">{report.deskripsi}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                                        {report.pelapor?.namaLengkap ?? 'Pengguna Dihapus'}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{new Date(report.createdAt).toLocaleDateString('id-ID')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}