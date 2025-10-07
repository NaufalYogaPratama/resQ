import Link from 'next/link';
import { AlertTriangle, BookOpen, Map, Package, List, Trophy, ClipboardList, ClipboardCheck } from 'lucide-react';
import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import WeatherWidget from "@/components/WeatherWidget";
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';
import Checklist from '@/models/Checklist'; 
import { checklistItems } from '@/lib/checklistItems';

interface ReportType {
  _id: string;
  deskripsi: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai';
  kategori: string;
  createdAt: string;
  pelapor: {
    _id: string;
  } | null;
}

type SummaryItem = {
  _id: 'Menunggu' | 'Ditangani';
  count: number;
}


type ReportSummaryMap = {
    Menunggu: number;
    Ditangani: number;
}


async function getReportSummary(): Promise<ReportSummaryMap> {
  await dbConnect();
  const summary: SummaryItem[] = await Report.aggregate([
    { $match: { status: { $in: ['Menunggu', 'Ditangani'] } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const summaryMap: ReportSummaryMap = { Menunggu: 0, Ditangani: 0 };
  
  summary.forEach(item => {
    summaryMap[item._id] = item.count;
  });
  return summaryMap;
}

async function getRecentReports(userId: string): Promise<ReportType[]> {
  await dbConnect();
  
  const reports = await Report.find({
    status: { $in: ['Menunggu', 'Ditangani'] } 
  })
  .sort({ createdAt: -1 })
  .limit(10)
  .populate('pelapor', '_id')

  reports.sort((a, b) => {
    const aIsOwner = a.pelapor?._id.toString() === userId;
    const bIsOwner = b.pelapor?._id.toString() === userId;
    if (aIsOwner && !bIsOwner) return -1;
    if (!aIsOwner && bIsOwner) return 1;
    return 0;
  });

  return JSON.parse(JSON.stringify(reports.slice(0, 3)));
}

async function getChecklistProgress(userId: string) {
  await dbConnect();
  const userChecklist = await Checklist.findOne({ user: userId }); 
  const totalItems = checklistItems.length;
  const completedItems = userChecklist ? userChecklist.checkedItems.length : 0;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return { completedItems, totalItems, progress };
}



export default async function DashboardWargaPage() {
 
  const user = await verifyAuth(); 
  if (!user) {
    redirect("/login");
  }

  const [recentReports, reportSummary, checklistProgress] = await Promise.all([
    getRecentReports(user.id),
    getReportSummary(),
    getChecklistProgress(user.id)
])

  const quickAccessLinks = [
    { href: "/warga/peta", icon: Map, label: "Peta Respons" },
    { href: "/warga/sumber-daya", icon: Package, label: "Bank Sumber Daya" },
    { href: "/warga/edukasi", icon: BookOpen, label: "Pusat Edukasi" },
    { href: "/warga/checklist", icon: ClipboardList, label: "Checklist Siaga" }, 
];

  const statusColors = {
    Menunggu: "bg-red-100 text-red-700",
    Ditangani: "bg-orange-100 text-orange-700",
    Selesai: "bg-green-100 text-green-700",
  };
  
 


  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-center lg:text-left" data-aos="fade-down">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Selamat Datang, <span className="text-[#4B5EAA]">{user.nama}</span>!
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div data-aos="fade-up" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-red-100 p-5 rounded-full"><AlertTriangle className="w-10 h-10 text-red-600" /></div>
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900">Laporkan Keadaan Darurat</h2>
                <p className="text-slate-600 mt-1">Lihat atau alami kejadian darurat? Laporkan segera.</p>
              </div>
              <Link href="/warga/laporan" className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 w-full md:w-auto text-center">Buat Laporan</Link>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="100" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900"><List className="w-5 h-5 mr-2 text-[#4B5EAA]"/> Ringkasan Laporan Komunitas</h3>
              <div className="flex space-x-4">
                <div className="flex-1 bg-red-100 text-red-700 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{reportSummary.Menunggu}</p>
                  <p className="text-sm font-semibold">Menunggu</p>
                </div>
                <div className="flex-1 bg-orange-100 text-orange-700 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{reportSummary.Ditangani}</p>
                  <p className="text-sm font-semibold">Ditangani</p>
                </div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">Laporan Komunitas Terkini</h3>
              <div className="space-y-4">
                {recentReports.length > 0 ? (
                  recentReports.map(report => (
                    <div key={report._id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border">
                      <div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[report.status]}`}>
                          {report.status}
                        </span>
                        <p className="font-semibold text-slate-800 mt-1">{report.deskripsi}</p>
                      </div>
                      <Link href={`/warga/laporan/${report._id}`} className="text-sm font-semibold text-[#4B5EAA] hover:underline">Lihat</Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-xl"><p className="text-slate-500">Tidak ada laporan darurat aktif saat ini.</p></div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div data-aos="fade-left" data-aos-delay="100"><WeatherWidget /></div>

            {/* --- KARTU BARU: CHECKLIST KESIAPSIAGAAN --- */}
            <div data-aos="fade-left" data-aos-delay="200" 
              className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
                <ClipboardCheck className="w-6 h-6 mr-3 text-[#4B5EAA]"/>
                Kesiapsiagaan Anda
              </h3>
              
              {checklistProgress.progress === 100 ? (
                <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
                    <Trophy className="w-12 h-12 text-green-500 mx-auto"/>
                    <p className="mt-2 font-bold text-green-800">Lencana Siaga Diraih!</p>
                    <p className="text-sm text-green-700">Tas Siaga Bencana Anda sudah lengkap.</p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-slate-700">Tas Siaga Bencana</p>
                      <p className="text-sm font-bold text-indigo-600">{checklistProgress.progress}%</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${checklistProgress.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                      {checklistProgress.completedItems} dari {checklistProgress.totalItems} item siap.
                  </p>
                  <Link href="/warga/checklist" className="mt-4 inline-block w-full text-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">
                      Lengkapi Sekarang
                  </Link>
                </div>
              )}
            </div>

            
            
            <div data-aos="fade-left" data-aos-delay="400" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 text-slate-900">Akses Cepat</h3>
                <ul className="space-y-2">
                    {quickAccessLinks.map(link => (
                    <li key={link.href}><Link href={link.href} className="flex items-center p-3 rounded-xl hover:bg-slate-100"><link.icon className="w-6 h-6 text-[#4B5EAA] mr-4" /> <span className="font-semibold text-slate-700">{link.label}</span></Link></li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}