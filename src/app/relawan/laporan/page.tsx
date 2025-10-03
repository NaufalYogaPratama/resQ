import Link from 'next/link';
import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { List, ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';
import User from '@/models/User'; 

// Tipe data untuk laporan
interface ReportType {
  _id: string;
  deskripsi: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai';
  kategori: string;
  createdAt: string;
  pelapor: {
    namaLengkap: string;
  };
}


async function getActiveReports(): Promise<ReportType[]> {
  await dbConnect();
  try {
    const reports = await Report.find({ status: { $ne: 'Selesai' } })
      .sort({ createdAt: -1 })
      .populate('pelapor', 'namaLengkap');
    return JSON.parse(JSON.stringify(reports));
  } catch (error) {
    console.error("Gagal mengambil laporan aktif:", error);
    return [];
  }
}

export default async function DaftarLaporanPage() {
  const user = await verifyAuth();
  if (!user || user.peran !== 'Relawan') {
    redirect("/login");
  }


  const reports = await getActiveReports();

  const statusColors = {
    Menunggu: "bg-red-100 text-red-800",
    Ditangani: "bg-orange-100 text-orange-800",
    Selesai: "bg-green-100 text-green-800",
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8" data-aos="fade-down">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
            <List className="w-10 h-10 mr-4 text-green-600"/>
            Daftar Laporan Aktif
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Berikut adalah semua laporan yang membutuhkan perhatian di komunitas.
          </p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md" data-aos="fade-up">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Deskripsi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Kategori</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Pelapor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Waktu Lapor</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status] || 'bg-gray-100 text-gray-800'}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 font-medium truncate max-w-xs">{report.deskripsi}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.kategori}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.pelapor.namaLengkap}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(report.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/relawan/laporan/${report._id}`} className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-semibold">
                          Lihat Detail <ArrowRight className="w-4 h-4"/>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Tidak ada laporan aktif saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}