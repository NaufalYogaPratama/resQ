"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

interface ApplyButtonProps {
    totalResources: number;
    currentStatus: 'None' | 'Diajukan' | 'Diterima';
}

export default function ApplyVolunteerButton({ totalResources, currentStatus }: ApplyButtonProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleApply = async () => {
        if (!confirm("Anda akan mengajukan diri untuk diverifikasi sebagai Relawan Siaga. Lanjutkan?")) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/user/apply-volunteer', { method: 'POST' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal mengajukan diri.");
            }
            setStatus('Diajukan');
            alert("Pengajuan berhasil! Admin akan segera meninjau permohonan Anda.");
        } catch (err) {
    
            if (err instanceof Error) {
                alert(`Error: ${err.message}`);
            } else {
                alert("Terjadi kesalahan yang tidak diketahui.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'Diterima') {
        return <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="font-bold text-green-800">Selamat! Anda sudah menjadi Relawan Siaga.</p>
        </div>;
    }
    
    if (status === 'Diajukan') {
        return <div className="text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-800">Pengajuan Anda sedang ditinjau oleh Admin.</p>
        </div>;
    }

    if (totalResources < 3) {
        return <div className="text-center bg-slate-100 p-4 rounded-lg">
            <p className="text-slate-600">Daftarkan minimal <strong>3</strong> sumber daya untuk dapat mengajukan diri menjadi Relawan.</p>
            <p className="font-bold text-slate-800 mt-1">{totalResources} / 3 Sumber Daya Terdaftar</p>
        </div>;
    }

    return (
        <button onClick={handleApply} disabled={isLoading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-slate-400">
            <Shield />
            {isLoading ? "Mengirim Pengajuan..." : "Ajukan Diri Jadi Relawan"}
        </button>
    );
}