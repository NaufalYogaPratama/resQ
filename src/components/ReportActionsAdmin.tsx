"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

// Definisikan tipe data untuk properti 'report'
interface Report {
    _id: string;
    status: 'Menunggu' | 'Ditangani' | 'Selesai';
}

// PERBAIKAN: Berikan tipe data 'Report' pada props 'report'
export default function ReportActionsAdmin({ report }: { report: Report }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm(`Anda yakin ingin mengubah status laporan menjadi "${newStatus}"?`)) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/reports/${report._id}/status`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Gagal mengubah status.');
            alert('Status laporan berhasil diubah.');
            router.refresh();
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Anda yakin ingin menghapus laporan ini secara permanen?")) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/reports/${report._id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Gagal menghapus laporan.');
            alert("Laporan berhasil dihapus.");
            router.push("/admin/laporan");
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">Aksi Moderasi</h3>
            <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-slate-500">Ubah Status:</p>
                <button onClick={() => handleStatusChange("Menunggu")} disabled={isSubmitting || report.status === 'Menunggu'} className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-md disabled:opacity-50 hover:bg-red-200">Menunggu</button>
                <button onClick={() => handleStatusChange("Ditangani")} disabled={isSubmitting || report.status === 'Ditangani'} className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-md disabled:opacity-50 hover:bg-orange-200">Ditangani</button>
                <button onClick={() => handleStatusChange("Selesai")} disabled={isSubmitting || report.status === 'Selesai'} className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-md disabled:opacity-50 hover:bg-green-200">Selesai</button>
                <button onClick={handleDelete} disabled={isSubmitting} className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-slate-400">
                    <Trash2 className="w-4 h-4" /> Hapus
                </button>
            </div>
        </div>
    );
}