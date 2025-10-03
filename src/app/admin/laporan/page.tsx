"use client";

import { useState, useEffect } from 'react';
import { ListChecks, Search, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

// Tipe data untuk laporan
interface ReportType {
  _id: string;
  deskripsi: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai';
  kategori: string;
  createdAt: string;
  pelapor: { namaLengkap: string; };
  penolong?: { namaLengkap: string; };
}

export default function ManageReportsPage() {
    const [reports, setReports] = useState<ReportType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/reports/all'); // Panggil API baru
            const data = await res.json();
            if (data.success) {
                setReports(data.data);
            } else {
                throw new Error(data.message || 'Gagal mengambil data laporan.');
            }
        } catch (err: any) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchReports();
    }, []);
    
    const handleDelete = async (reportId: string) => {
        if (!confirm("Anda yakin ingin menghapus laporan ini secara permanen?")) return;
        
        try {
            const res = await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Gagal menghapus laporan.");
            
            // Hapus dari state untuk update UI instan
            setReports(prev => prev.filter(r => r._id !== reportId));
            alert("Laporan berhasil dihapus.");
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesStatus = statusFilter === 'Semua' || report.status === statusFilter;
        const matchesSearch = report.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              report.pelapor.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusColors = {
        Menunggu: "bg-red-100 text-red-800",
        Ditangani: "bg-orange-100 text-orange-800",
        Selesai: "bg-green-100 text-green-800",
    };

    return (
        <div className="space-y-8">
            <div data-aos="fade-down">
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
                    <ListChecks className="w-10 h-10 mr-4 text-indigo-600"/>
                    Manajemen Laporan
                </h1>
                <p className="mt-2 text-lg text-slate-600">Lihat, kelola, dan moderasi semua laporan yang masuk ke sistem.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-md" data-aos="fade-up">
                <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari deskripsi, pelapor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-full sm:w-80"
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                            <option value="Semua">Semua Status</option>
                            <option value="Menunggu">Menunggu</option>
                            <option value="Ditangani">Ditangani</option>
                            <option value="Selesai">Selesai</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Deskripsi</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Pelapor</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Penolong</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-6 text-center text-slate-500">Memuat data laporan...</td></tr>
                            ) : filteredReports.map(report => (
                                <tr key={report._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status] || 'bg-gray-100'}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800 truncate max-w-xs">{report.deskripsi}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{report.pelapor.namaLengkap}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{report.penolong?.namaLengkap || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(report.createdAt).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                        <Link href={`/admin/laporan/${report._id}`} className="text-indigo-600 hover:text-indigo-800" title="Lihat Detail">Detail</Link>
                                        <button onClick={() => handleDelete(report._id)} className="text-red-600 hover:text-red-800" title="Hapus Laporan">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}