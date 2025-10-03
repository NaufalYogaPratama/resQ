import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BarChart3, PieChart, Users } from 'lucide-react';
import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import User from "@/models/User";
import ReportsByCategoryChart from '@/components/charts/ReportsByCategoryChart';
import ReportsByStatusChart from '@/components/charts/ReportsByStatusChart';
import TopVolunteers from '@/components/charts/TopVolunteers';

// --- FUNGSI PENGOLAHAN DATA DI SERVER ---

// 1. Mengambil data laporan per kategori
async function getReportsByCategory() {
    await dbConnect();
    const data = await Report.aggregate([
        { $group: { _id: '$kategori', value: { $sum: 1 } } },
        { $project: { name: '$_id', value: 1, _id: 0 } },
        { $sort: { value: -1 } }
    ]);
    return data;
}

// 2. Mengambil data laporan per status
async function getReportsByStatus() {
    await dbConnect();
    const data = await Report.aggregate([
        { $group: { _id: '$status', value: { $sum: 1 } } },
        { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);
    return data;
}

// 3. Mengambil data relawan paling aktif
async function getTopVolunteers() {
    await dbConnect();
    const data = await User.find({ peran: 'Relawan' }).sort({ poin: -1 }).limit(5).select('namaLengkap poin');
    return JSON.parse(JSON.stringify(data));
}

// --- KOMPONEN HALAMAN UTAMA ---
export default async function AnalyticsPage() {
  const user = await verifyAuth();
  if (!user || user.peran !== 'Admin') {
    redirect('/login');
  }

  // Ambil semua data analitik secara paralel
  const [byCategoryData, byStatusData, topVolunteersData] = await Promise.all([
    getReportsByCategory(),
    getReportsByStatus(),
    getTopVolunteers()
  ]);

  return (
    <div className="space-y-8">
      <div data-aos="fade-down">
        <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
            <BarChart3 className="w-10 h-10 mr-4 text-indigo-600"/>
            Dasbor Analitik
        </h1>
        <p className="mt-2 text-lg text-slate-600">Wawasan dari data laporan dan aktivitas komunitas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Kolom Kiri: Grafik Utama */}
        <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center mb-4">
                    <PieChart className="w-6 h-6 mr-3 text-indigo-600"/>
                    Laporan per Kategori
                </h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ReportsByCategoryChart data={byCategoryData} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md" data-aos="fade-up" data-aos-delay="200">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center mb-4">
                    Laporan per Status
                </h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ReportsByStatusChart data={byStatusData} />
                </div>
            </div>
        </div>

        {/* Kolom Kanan: Papan Peringkat */}
        <div className="lg:col-span-2" data-aos="fade-left" data-aos-delay="100">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center mb-4">
                    <Users className="w-6 h-6 mr-3 text-indigo-600"/>
                    Relawan Paling Aktif
                </h2>
                <TopVolunteers data={topVolunteersData} />
            </div>
        </div>

      </div>
    </div>
  );
}