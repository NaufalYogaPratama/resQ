"use client";

import { useState, useEffect } from 'react';
import { Package, Search, Trash2, ArrowRight } from 'lucide-react'; // Tambah ArrowRight
import Link from 'next/link';

// Tipe data untuk sumber daya
interface ResourceType {
  _id: string;
  namaSumberDaya: string;
  tipe: 'Aset' | 'Keahlian';
  pemilik: { namaLengkap: string; };
  createdAt: string;
}

export default function ManageResourcesPage() {
    const [resources, setResources] = useState<ResourceType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Semua');

    useEffect(() => {
        const fetchAllResources = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/resources/all');
                const data = await res.json();
                if (data.success) setResources(data.data);
                else throw new Error(data.message);
            } catch (err: any) { setError(err.message); } 
            finally { setIsLoading(false); }
        };
        fetchAllResources();
    }, []);

    const handleDelete = async (resourceId: string) => {
        if (!confirm("Anda yakin ingin menghapus sumber daya ini?")) return;
        try {
            const res = await fetch(`/api/resources/${resourceId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Gagal menghapus sumber daya.");
            setResources(prev => prev.filter(r => r._id !== resourceId));
            alert("Sumber daya berhasil dihapus.");
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesType = filterType === 'Semua' || res.tipe === filterType;
        const matchesSearch = res.namaSumberDaya.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (res.pemilik && res.pemilik.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div data-aos="fade-down">
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
                    <Package className="w-10 h-10 mr-4 text-indigo-600"/>
                    Manajemen Sumber Daya
                </h1>
                <p className="mt-2 text-lg text-slate-600">Lihat semua aset dan keahlian yang terdaftar di komunitas.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-md" data-aos="fade-up">
                <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Cari aset, keahlian, atau pemilik..." value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-full sm:w-80" />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value as 'Semua' | 'Aset' | 'Keahlian')}
                            className="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                            <option value="Semua">Semua Tipe</option>
                            <option value="Aset">Aset</option>
                            <option value="Keahlian">Keahlian</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Nama Sumber Daya</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tipe</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Pemilik</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-6 text-center text-slate-500">Memuat data...</td></tr>
                            ) : filteredResources.map(res => (
                                <tr key={res._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{res.namaSumberDaya}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            res.tipe === 'Aset' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                        }`}>{res.tipe}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{res.pemilik?.namaLengkap || 'N/A'}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium flex justify-end items-center gap-2">
                                        <Link href={`/admin/sumber-daya/${res._id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold" title="Lihat Detail & Edit">
                                            Detail
                                        </Link>
                                        <button onClick={() => handleDelete(res._id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100" title="Hapus">
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
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