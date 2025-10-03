import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resource from '@/models/Resource';
import Report from '@/models/Report';
import mongoose from 'mongoose';
import EditProfileModal from '@/components/EditProfileModal';
import { 
    User as UserIcon, Mail, Phone, Edit, FileText, Package, Wrench
} from 'lucide-react';
import Link from 'next/link';

// Definisikan tipe data untuk item di dalam resourceList
interface ResourceListItem {
    _id: string;
    namaSumberDaya: string;
    tipe: 'Aset' | 'Keahlian';
}

async function getUserData(userId: string) {
    await dbConnect();
    try {
        const userData = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'reports', 
                    localField: '_id',
                    foreignField: 'pelapor',
                    as: 'reports'
                }
            },
            {
                $lookup: {
                    from: 'resources', 
                    localField: '_id',
                    foreignField: 'pemilik',
                    as: 'resources'
                }
            },
            {
                $project: {
                    namaLengkap: 1,
                    email: 1,
                    noWa: 1,
                    peran: 1,
                    totalReports: { $size: '$reports' },
                    totalResources: { $size: '$resources' },
                    resourceList: { $slice: ['$resources', -3] } 
                }
            }
        ]);
        
        if (!userData || userData.length === 0) return null;
        return JSON.parse(JSON.stringify(userData[0]));
    } catch (error) {
        console.error("Gagal mengambil data user:", error);
        return null;
    }
}

export default async function ProfilWargaPage() {
    const session = await verifyAuth();
    if (!session) {
        redirect('/login');
    }

    const user = await getUserData(session.id);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Gagal memuat data pengguna. Silakan coba lagi nanti.</p>
            </div>
        );
    }
    
    if (user.peran !== 'Warga') {
        redirect('/'); 
    }
    
    const stats = [
        { label: "Laporan Dibuat", value: user.totalReports, icon: FileText },
        { label: "Sumber Daya Terdaftar", value: user.totalResources, icon: Package },
    ];

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div data-aos="fade-down" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 sm:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center">
                                <UserIcon className="w-12 h-12 text-slate-500" />
                            </div>
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-slate-900">{user.namaLengkap}</h1>
                            <p className="text-md text-[#4B5EAA] font-semibold">{user.peran}</p>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto">
                           {/* --- PERUBAHAN DI SINI --- */}
                           <EditProfileModal user={user} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div data-aos="fade-up" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Statistik Kontribusi Anda</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                                        <div className="bg-indigo-100 p-3 rounded-lg">
                                          <stat.icon className="w-6 h-6 text-[#4B5EAA]" />
                                        </div>
                                        <div>
                                          <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                          <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="100" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-900">Sumber Daya Terdaftar</h2>
                                <Link href="/warga/sumber-daya" className="text-sm font-semibold text-[#4B5EAA] hover:underline">Lihat Semua</Link>
                            </div>
                            <div className="space-y-3">
                                {user.resourceList && user.resourceList.length > 0 ? (
                                    // --- PERBAIKAN DI SINI ---
                                    user.resourceList.map((res: ResourceListItem) => (
                                        <Link key={res._id} href={`/warga/sumber-daya/${res._id}`} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {res.tipe === 'Aset' ? <Package className="w-6 h-6 text-[#4B5EAA]" /> : <Wrench className="w-6 h-6 text-[#4B5EAA]" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{res.namaSumberDaya}</p>
                                                <p className="text-sm text-slate-500">{res.tipe}</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-center text-slate-500 py-4">Anda belum mendaftarkan sumber daya apapun.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 lg:col-span-1">
                         <div data-aos="fade-left" data-aos-delay="200" className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Informasi Kontak</h2>
                             <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <Mail className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-500">Email</p>
                                        <p className="font-semibold text-slate-800 break-all">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-500">Nomor WhatsApp</p>
                                        <p className="font-semibold text-slate-800">{user.noWa}</p>
                                    </div>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}