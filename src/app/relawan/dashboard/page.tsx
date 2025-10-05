// File: src/app/relawan/dashboard/page.tsx (Disesuaikan dengan Tema Navbar Biru Modern)

import Link from 'next/link';
import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Map, List, Shield, Activity, Award, Package } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';
import User from '@/models/User';
import Badges from '@/components/Badges';

// ========================
// Tipe Data
// ========================
interface TaskType {
  _id: string;
  deskripsi: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai';
  kategori: string;
}

interface UserDataType {
  nama: string;
  poin: number;
  lencana: string[];
}

// ========================
// Mengambil data ringkasan laporan
// ========================
async function getReportSummary() {
  await dbConnect();
  try {
    const waiting = await Report.countDocuments({ status: 'Menunggu' });
    const inProgress = await Report.countDocuments({ status: 'Ditangani' });
    return { waiting, inProgress };
  } catch (error) {
    console.error('Gagal mengambil ringkasan laporan:', error);
    return { waiting: 0, inProgress: 0 };
  }
}

// ========================
// Mengambil tugas aktif relawan
// ========================
async function getMyTasks(userId: string): Promise<TaskType[]> {
  await dbConnect();
  try {
    const tasks = await Report.find({ penolong: userId, status: 'Ditangani' })
      .sort({ updatedAt: -1 })
      .limit(3);
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.error('Gagal mengambil tugas:', error);
    return [];
  }
}

// ========================
// Mengambil data user
// ========================
async function getUserData(userId: string): Promise<UserDataType | null> {
  await dbConnect();
  try {
    const user = await User.findById(userId).select('nama poin lencana').lean();
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Gagal mengambil data user:', error);
    return null;
  }
}

// ========================
// Komponen Utama
// ========================
export default async function DashboardRelawanPage() {
  const session = await verifyAuth();
  if (!session || session.peran !== 'Relawan') redirect('/login');

  const summary = await getReportSummary();
  const myTasks = await getMyTasks(session.id);
  const userData = await getUserData(session.id);
  if (!userData) return <div>Gagal memuat data relawan.</div>;

  return (
    <div className="bg-white min-h-screen p-4 sm:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10" data-aos="fade-down">
          <h1 className="text-4xl font-extrabold text-[#1E1E3A]">
            Dashboard Relawan Siaga
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Selamat bertugas, {userData.nama}! Terima kasih atas dedikasimu.
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-md hover:shadow-lg transition-all"
            data-aos="fade-up"
          >
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-red-600">{summary.waiting}</p>
              <p className="text-sm font-semibold text-slate-500">Butuh Respons Cepat</p>
            </div>
          </div>

          <div
            className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-md hover:shadow-lg transition-all"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-amber-600">
                {summary.inProgress}
              </p>
              <p className="text-sm font-semibold text-slate-500">Sedang Ditangani</p>
            </div>
          </div>

          <div
            className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-md hover:shadow-lg transition-all"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#1E1E3A]">{userData.poin || 0}</p>
              <p className="text-sm font-semibold text-slate-500">Poin Reputasi</p>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 text-center flex flex-col justify-center items-center text-white shadow-lg shadow-blue-300/30 bg-gradient-to-r from-[#1E1E3A] via-[#2A3B7A] to-[#2D89C3] hover:shadow-xl hover:-translate-y-1 transition-all"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Link href="/relawan/peta" className="flex flex-col items-center">
              <Map className="w-10 h-10 mb-2" />
              <h3 className="text-xl font-bold">Buka Peta Respons</h3>
            </Link>
          </div>
        </div>

        {/* Konten utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom kiri - Tugas Aktif */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-md p-6"
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center text-[#1E1E3A]">
              <Shield className="w-6 h-6 mr-3 text-[#2A3B7A]" /> Tugas Aktif Saya
            </h3>
            <div className="space-y-4">
              {myTasks.length > 0 ? (
                myTasks.map((task: TaskType) => (
                  <div
                    key={task._id}
                    className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200 hover:shadow-sm transition-all"
                  >
                    <div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          task.kategori === 'Banjir'
                            ? 'bg-blue-100 text-blue-800'
                            : task.kategori === 'Gempa Bumi'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {task.kategori}
                      </span>
                      <p className="font-semibold text-slate-800 mt-1">
                        {task.deskripsi}
                      </p>
                    </div>
                    <Link
                      href={`/relawan/laporan/${task._id}`}
                      className="text-sm font-semibold text-[#2A3B7A] hover:underline"
                    >
                      Update
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-xl border-slate-200">
                  <p className="text-slate-500">
                    Anda sedang tidak menangani laporan apapun.
                  </p>
                  <Link
                    href="/relawan/laporan"
                    className="mt-4 inline-block bg-[#2A3B7A]/10 text-[#2A3B7A] font-semibold py-2 px-4 rounded-lg hover:bg-[#2A3B7A]/20"
                  >
                    Lihat Laporan Tersedia
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Kolom kanan */}
          <div className="space-y-8">
            <div data-aos="fade-left" data-aos-delay="500">
              <Badges points={userData.poin || 0} />
            </div>

            <div
              data-aos="fade-left"
              data-aos-delay="600"
              className="bg-white border border-slate-200 rounded-2xl shadow-md p-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center text-[#1E1E3A]">
                <Activity className="w-6 h-6 mr-3 text-[#2A3B7A]" /> Aksi Cepat
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/relawan/laporan"
                    className="flex items-center p-3 rounded-xl hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
                  >
                    <List className="w-5 h-5 mr-3 text-[#2A3B7A]" />
                    Lihat Semua Laporan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/relawan/sumber-daya"
                    className="flex items-center p-3 rounded-xl hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
                  >
                    <Package className="w-5 h-5 mr-3 text-[#2A3B7A]" />
                    Cek Bank Sumber Daya
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
