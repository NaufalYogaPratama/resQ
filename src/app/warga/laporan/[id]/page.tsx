import { verifyAuth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import User from "@/models/User";
import Link from "next/link";
import { ArrowLeft, MapPin, User as UserIcon, Calendar, Shield, CheckCircle, Phone, Tag } from "lucide-react";
import CompleteReportButton from "@/components/CompleteReportButton";
import ChatBox from "@/components/ChatBox";

// Tipe data untuk laporan
interface ReportDetailType {
  _id: string;
  deskripsi: string;
  kategori: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai';
  lokasi: { coordinates: [number, number]; alamat?: string; };
  gambarUrl?: string;
  createdAt: string;
  pelapor: { _id: string; namaLengkap: string; noWa?: string; };
  penolong?: { _id: string; namaLengkap: string; };
}

async function getReport(id: string): Promise<ReportDetailType | null> {
    await dbConnect();
    try {
        const report = await Report.findById(id)
            .populate('pelapor', 'namaLengkap noWa')
            .populate('penolong', 'namaLengkap');
        if (!report) return null;
        return JSON.parse(JSON.stringify(report));
    } catch (error) {
        return null;
    }
}

// PERBAIKAN: Fungsi komponen halaman harus 'async' untuk menggunakan 'await'
export default async function ReportDetailPageWarga({ params }: { params: { id: string } }) {
    // PERBAIKAN: Gunakan 'await' saat memanggil verifyAuth
    const user = await verifyAuth();
    if (!user) {
        redirect("/login");
    }

    const report = await getReport(params.id);

    if (!report) {
        notFound();
    }

    if (report.pelapor._id.toString() !== user.id && user.peran !== 'Admin') {
        redirect("/warga/dashboard?error=unauthorized");
    }

    const statusInfo = {
        Menunggu: { color: "bg-red-100 text-red-800", icon: <Shield className="w-5 h-5 mr-2" />, text: "Menunggu Respons" },
        Ditangani: { color: "bg-orange-100 text-orange-800", icon: <UserIcon className="w-5 h-5 mr-2" />, text: "Sedang Ditangani" },
        Selesai: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-5 h-5 mr-2" />, text: "Selesai" },
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/warga/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                    {report.gambarUrl && (
                        <img src={report.gambarUrl} alt={`Gambar untuk laporan ${report.kategori}`} className="w-full h-80 object-cover" />
                    )}
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusInfo[report.status].color}`}>
                                    {statusInfo[report.status].icon}
                                    {statusInfo[report.status].text}
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-900 mt-4">{report.deskripsi}</h1>
                            </div>
                            {report.status === 'Ditangani' && (
                                <CompleteReportButton reportId={report._id} />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">Detail Kejadian</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li className="flex items-center gap-3"><Tag className="w-5 h-5 text-indigo-500"/> <strong>Kategori:</strong> {report.kategori}</li>
                                    <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-indigo-500 mt-1"/> <strong>Alamat:</strong> {report.lokasi.alamat || 'Tidak ada alamat'}</li>
                                    <li className="flex items-center gap-3"><Calendar className="w-5 h-5 text-indigo-500"/> <strong>Waktu Lapor:</strong> {new Date(report.createdAt).toLocaleString('id-ID')}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">Informasi Pihak Terkait</h3>
                                <ul className="space-y-2 text-slate-600">
                                    {report.penolong ? (
                                        <li className="flex flex-col items-start gap-3">
                                            <div className="flex items-center"><Shield className="w-5 h-5 text-indigo-500 mr-3"/> <strong>Ditangani oleh:</strong> {report.penolong.namaLengkap}</div>
                                        
                                        </li>
                                    ) : (
                                        <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-indigo-500"/> <strong>Menunggu relawan...</strong></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {(report.status === 'Ditangani' || report.status === 'Selesai') && (
                    <div className="mt-8">
                        <ChatBox reportId={report._id} currentUserId={user.id} />
                    </div>
                )}
            </div>
        </div>
    );
}