"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/reports/${id}`);
      const data = await res.json();
      if (data.success) {
        setReport(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.data);
        alert("Status berhasil diperbarui.");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus laporan ini?")) return;
    try {
      await fetch(`/api/reports/${id}`, { method: "DELETE" });
      alert("Laporan dihapus.");
      router.push("/admin/laporan");
    } catch (err: any) {
      alert("Gagal menghapus laporan.");
    }
  };

  if (isLoading) return <p className="p-6">Memuat detail laporan...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
      </button>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Detail Laporan</h2>
        <p><span className="font-semibold">Deskripsi:</span> {report.deskripsi}</p>
        <p><span className="font-semibold">Kategori:</span> {report.kategori}</p>
        <p><span className="font-semibold">Status:</span> {report.status}</p>
        <p><span className="font-semibold">Pelapor:</span> {report.pelapor?.namaLengkap}</p>
        <p><span className="font-semibold">Penolong:</span> {report.penolong?.namaLengkap || "-"}</p>
        <p><span className="font-semibold">Tanggal:</span> {new Date(report.createdAt).toLocaleString("id-ID")}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleStatusChange("Menunggu")}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg"
        >
          Tandai Menunggu
        </button>
        <button
          onClick={() => handleStatusChange("Ditangani")}
          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg"
        >
          Tandai Ditangani
        </button>
        <button
          onClick={() => handleStatusChange("Selesai")}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg"
        >
          Tandai Selesai
        </button>
        <button
          onClick={handleDelete}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4" /> Hapus
        </button>
      </div>
    </div>
  );
}
