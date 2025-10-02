import Link from 'next/link';
import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Map, List, Package, Bell, Shield } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';

// Tipe data untuk tugas/laporan
interface TaskType {
  _id: string;
  deskripsi: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai';
}

// Fungsi untuk mengambil data ringkasan laporan
async function getReportSummary() {
  await dbConnect();
  try {
    const waiting = await Report.countDocuments({ status: 'Menunggu' });
    const inProgress = await Report.countDocuments({ status: 'Ditangani' });
    return { waiting, inProgress };
  } catch (error) {
    return { waiting: 0, inProgress: 0 };
  }
}

// Fungsi untuk mengambil laporan yang ditugaskan kepada relawan
async function getMyTasks(userId: string): Promise<TaskType[]> {
    await dbConnect();
    try {
        const tasks = await Report.find({ penolong: userId, status: 'Ditangani' }).sort({ updatedAt: -1 }).limit(3);
        return JSON.parse(JSON.stringify(tasks));
    } catch (error) {
        return [];
    }
}

export default async function DashboardRelawanPage() {
  const user = verifyAuth();
  if (!user || user.peran !== 'Relawan') {
    redirect("/login");
  }

  const summary = await getReportSummary();
  const myTasks = await getMyTasks(user.id);

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10" data-aos="fade-down">
          <h1 className="text-4xl font-extrabold text-slate-900">Dashboard Relawan Siaga</h1>
          <p className="mt-2 text-lg text-slate-600">Selamat bertugas, {user?.nama}! Terima kasih atas dedikasimu.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Konten Utama */}
            <div className="lg:col-span-2 space-y-8">
                {/* Ringkasan Laporan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-aos="fade-up">
                    <div className="bg-red-100 border border-red-200 rounded-2xl p-6 text-center shadow-sm">
                        <p className="text-5xl font-extrabold text-red-600">{summary.waiting}</p>
                        <p className="mt-1 font-semibold text-red-800">Laporan Butuh Respons</p>
                    </div>
                    <div className="bg-orange-100 border border-orange-200 rounded-2xl p-6 text-center shadow-sm">
                        <p className="text-5xl font-extrabold text-orange-600">{summary.inProgress}</p>
                        <p className="mt-1 font-semibold text-orange-800">Laporan Sedang Ditangani</p>
                    </div>
                </div>

                {/* Daftar Tugas Saya */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center text-slate-900">
                        <Shield className="w-6 h-6 mr-3 text-green-600"/> 
                        Tugas Aktif Saya
                    </h3>
                    <div className="space-y-4">
                        {myTasks.length > 0 ? (
                            myTasks.map((task: TaskType) => (
                                <div key={task._id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
                                    <div>
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-700">{task.status}</span>
                                        <p className="font-semibold text-slate-800 mt-1">{task.deskripsi}</p>
                                    </div>
                                    <Link href={`/relawan/laporan/${task._id}`} className="text-sm font-semibold text-green-600 hover:underline">
                                        Update
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed rounded-xl border-slate-200">
                                <p className="text-slate-500">Anda sedang tidak menangani laporan apapun.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Kolom Kanan: Aksi Cepat */}
            <div className="lg:col-span-1 space-y-8">
                <div data-aos="fade-left" data-aos-delay="100" className="bg-green-600 text-white p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-lg shadow-green-500/20">
                    <Map className="w-12 h-12 mb-2"/>
                    <h3 className="text-xl font-bold">Peta Respons</h3>
                    <p className="text-sm text-green-200 mb-4">Lihat sebaran laporan terkini</p>
                    <Link href="/relawan/peta" className="bg-white text-green-600 font-semibold px-6 py-2 rounded-lg hover:bg-green-50 transition-colors">
                        Buka Peta
                    </Link>
                </div>
                {/* Bisa tambahkan kartu lain di sini jika perlu */}
            </div>
        </div>
      </div>
    </div>
  );
}