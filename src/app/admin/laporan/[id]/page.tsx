import { verifyAuth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import Link from "next/link";
import { ArrowLeft, MapPin, User as UserIcon,  Shield, CheckCircle, Tag } from "lucide-react";
import ReportActionsAdmin from "@/components/ReportActionsAdmin";
import Image from 'next/image';
import StaticMapLoader from "@/components/StaticMapLoader";

interface ReportDetailType {
    _id: string; deskripsi: string; kategori: string; status: 'Menunggu' | 'Ditangani' | 'Selesai';
    lokasi: { coordinates: [number, number]; alamat?: string; }; gambarUrl?: string; createdAt: string;
    pelapor: { _id: string; namaLengkap: string; noWa?: string; };
    penolong?: { _id: string; namaLengkap: string; };
}



async function getReport(id: string): Promise<ReportDetailType | null> {
    await dbConnect();
    try {
        const report = await Report.findById(id).populate('pelapor', 'namaLengkap noWa').populate('penolong', 'namaLengkap');
        if (!report) return null;
        return JSON.parse(JSON.stringify(report));
    } catch (error) {
        console.error("Gagal mengambil detail laporan:", error);
        return null;
    }
}

export default async function ReportDetailPageAdmin({ params }: { params: { id: string } }) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        redirect("/login");
    }

    const report = await getReport(params.id);
    if (!report) notFound();

    const statusInfo = {
        Menunggu: { color: "bg-red-100 text-red-800", icon: <Shield className="w-5 h-5" />, text: "Menunggu" },
        Ditangani: { color: "bg-orange-100 text-orange-800", icon: <UserIcon className="w-5 h-5" />, text: "Ditangani" },
        Selesai: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-5 h-5" />, text: "Selesai" },
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Link href="/admin/laporan" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Manajemen Laporan
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        {report.gambarUrl && (
                             <Image src={report.gambarUrl} 
                             alt="Foto laporan" 
                             width={1000} 
                             height={1000} 
                             className="w-full h-64 object-cover rounded-2xl shadow-md border" 
                             />
                        )}
                        <div className="h-80 rounded-2xl overflow-hidden shadow-md border">
                            <StaticMapLoader position={[report.lokasi.coordinates[1], report.lokasi.coordinates[0]]} />
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border">

                        <div className="flex justify-between items-start mb-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${statusInfo[report.status].color}`}>
                                {statusInfo[report.status].icon}
                                {statusInfo[report.status].text}
                            </div>
                            <span className="text-sm text-slate-500">{new Date(report.createdAt).toLocaleString('id-ID')}</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900">{report.kategori}</h1>
                        <p className="mt-4 text-lg text-slate-600">{report.deskripsi}</p>

                        <div className="mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">Detail Kejadian</h3>
                                <ul className="space-y-3 text-slate-600">
                                    <li className="flex items-start gap-3"><Tag className="w-5 h-5 text-slate-400 mt-1"/> <strong>Kategori:</strong> {report.kategori}</li>
                                    <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-slate-400 mt-1"/> <strong>Alamat:</strong> {report.lokasi.alamat || 'Tidak ada alamat'}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">Pihak Terkait</h3>
                                <ul className="space-y-3 text-slate-600">
                                    <li className="flex items-start gap-3"><UserIcon className="w-5 h-5 text-slate-400 mt-1"/> <strong>Pelapor:</strong> {report.pelapor.namaLengkap}</li>
                                    <li className="flex items-start gap-3"><Shield className="w-5 h-5 text-slate-400 mt-1"/> <strong>Ditangani Oleh:</strong> {report.penolong?.namaLengkap || 'Belum ada'}</li>
                                </ul>
                            </div>
                        </div>
                        
                        <ReportActionsAdmin report={report} />
                    </div>
                </div>
            </div>
        </div>
    );
}