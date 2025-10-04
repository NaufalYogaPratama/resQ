import { verifyAuth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import User from "@/models/User";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";

async function getReportDetails(id: string) {
    await dbConnect();
    const report = await Report.findById(id)
        .populate('pelapor', 'namaLengkap')
        .populate('penolong', 'namaLengkap');
    if (!report) return null;
    return JSON.parse(JSON.stringify(report));
}

export default async function ReportAnalyticsPage({ params }: { params: { reportId: string } }) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        redirect("/login");
    }

    const report = await getReportDetails(params.reportId);
    if (!report) {
        notFound();
    }

    const timeToHandle = report.penolong ? (new Date(report.updatedAt).getTime() - new Date(report.createdAt).getTime()) / (1000 * 60) : 0; // dalam menit

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <Link href="/admin/analitik" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Dasbor Analitik
                </Link>
            </div>

            <div data-aos="fade-down">
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
                    <BarChart3 className="w-10 h-10 mr-4 text-indigo-600"/>
                    Analitik Laporan: {report.kategori}
                </h1>
                <p className="mt-2 text-lg text-slate-600">Detail laporan oleh {report.pelapor.namaLengkap} pada {new Date(report.createdAt).toLocaleDateString('id-ID')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Waktu Respons</p>
                    <p className="text-4xl font-extrabold text-slate-900 mt-2">{timeToHandle.toFixed(0)} <span className="text-2xl">menit</span></p>
                    <p className="text-xs text-slate-400">Dari laporan dibuat hingga diklaim</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Relawan Bertugas</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{report.penolong ? report.penolong.namaLengkap : 'N/A'}</p>
                </div>
                 <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Status Akhir</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{report.status}</p>
                </div>
            </div>

             <div className="bg-white p-6 rounded-2xl border shadow-sm" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Ringkasan Kejadian</h2>
                <p className="text-slate-700">{report.deskripsi}</p>
            </div>
        </div>
    );
}