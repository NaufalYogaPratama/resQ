"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function CompleteReportButton({ reportId }: { reportId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    if (!confirm('Apakah Anda yakin bantuan telah selesai diterima dan ingin menyelesaikan laporan ini?')) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/complete`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyelesaikan laporan.');
      }
      alert('Terima kasih! Laporan telah diselesaikan.');
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
          alert(`Error: ${err.message}`);
      } else {
          alert("Terjadi kesalahan yang tidak diketahui.");
      }
  } finally {
    setIsSubmitting(false);
  }
  };

  return (
    <button
      onClick={handleComplete}
      disabled={isSubmitting}
      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-400 transition-colors flex-shrink-0"
    >
      <CheckCircle className="w-5 h-5" />
      {isSubmitting ? 'Memproses...' : 'Tandai Selesai'}
    </button>
  );
}