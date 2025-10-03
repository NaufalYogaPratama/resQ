"use client";

import { useState, useEffect } from 'react';
import { Package, Search } from 'lucide-react';

interface ResourceType {
  _id: string;
  namaSumberDaya: string;
  tipe: 'Aset' | 'Keahlian';
  pemilik: { namaLengkap: string; };
}

export default function ManageResourcesPage() {
    const [resources, setResources] = useState<ResourceType[]>([]);
    // ... (state lain untuk loading, error, filter)

    useEffect(() => {
        const fetchAllResources = async () => {
            // Anda perlu membuat API baru `/api/resources/all` yang hanya bisa diakses Admin
            const res = await fetch('/api/resources/all'); 
            // ... logika fetch
        };
        fetchAllResources();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
                    <Package className="w-10 h-10 mr-4 text-indigo-600"/> Manajemen Sumber Daya
                </h1>
                <p className="mt-2 text-lg text-slate-600">Lihat semua aset dan keahlian yang terdaftar di komunitas.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-md">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-slate-900">Daftar Sumber Daya Komunitas</h2>
                </div>
                <div className="overflow-x-auto">
                    {/* Tabel untuk menampilkan semua sumber daya */}
                </div>
            </div>
        </div>
    );
}