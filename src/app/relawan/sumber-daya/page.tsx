"use client";

import { useState, useEffect } from "react";
import { Package, Phone, User, Wrench } from "lucide-react"; 
import Image from 'next/image';

interface ResourceType {
  _id: string;
  namaSumberDaya: string;
  tipe: "Aset" | "Keahlian";
  deskripsi?: string;
  gambarUrl?: string;
  pemilik: {
      _id: string;
      namaLengkap: string;
      noWa?: string;
  } | null; 
}

export default function SumberDayaRelawanPage() {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'Semua' | 'Aset' | 'Keahlian'>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/resources");
        const data = await res.json();
        if (data.success) {
          setResources(data.data);
          setIsEmergency(data.isEmergency); 
        }
      } catch (error) {
        console.error("Gagal mengambil data sumber daya:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(res => {
      const matchesFilter = filter === 'Semua' || res.tipe === filter;
      const matchesSearch = res.namaSumberDaya.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (res.pemilik ? res.pemilik.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) : false);
      return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div data-aos="fade-down" className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
            <Package className="w-10 h-10 mr-4 text-teal-600"/>
            {isEmergency ? "Bank Sumber Daya Komunitas" : "Sumber Daya Milik Anda"}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
             {isEmergency 
               ? "Daftar aset dan keahlian yang tersedia untuk respons darurat."
               : "Berikut adalah sumber daya yang telah Anda daftarkan. Ini akan dapat dilihat relawan lain saat Mode Darurat aktif."
            }
          </p>
        </div>
        
        <div data-aos="fade-up" className="flex flex-col md:flex-row gap-4 mb-8 sticky top-24 z-40 bg-slate-50/80 backdrop-blur-md p-4 rounded-xl border">
            <div className="flex-1">
                <label className="text-sm font-medium text-slate-600">Cari Sumber Daya</label>
                <input 
                    type="text" 
                    placeholder="Cari nama aset, keahlian, atau pemilik..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
            </div>
            <div className="w-full md:w-48">
                <label className="text-sm font-medium text-slate-600">Filter Tipe</label>
                <select 
                    value={filter}
                    onChange={e => setFilter(e.target.value as 'Semua' | 'Aset' | 'Keahlian')}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg bg-white"
                >
                    <option value="Semua">Semua</option>
                    <option value="Aset">Aset</option>
                    <option value="Keahlian">Keahlian</option>
                </select>
            </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="100">
          {isLoading ? (
            <p className="text-slate-500 text-center py-10">Memuat data sumber daya...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.length > 0 ? (
                filteredResources.map((res: ResourceType) => (
                  <div key={res._id} className="bg-white border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                    {res.gambarUrl ? (
                        <Image src={res.gambarUrl} alt={res.namaSumberDaya} width={1000} height={1000} className="w-full h-40 object-cover" />
                    ) : (
                        <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                           {res.tipe === "Aset" ? <Package className="w-16 h-16 text-slate-300" /> : <Wrench className="w-16 h-16 text-slate-300" />}
                        </div>
                    )}
                    <div className="p-5 flex flex-col flex-grow">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full self-start ${ res.tipe === 'Aset' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800' }`}>{res.tipe}</span>
                      <h3 className="mt-3 text-xl font-bold text-slate-900">{res.namaSumberDaya}</h3>
                      {res.deskripsi && <p className="mt-1 text-sm text-slate-600 h-10 line-clamp-2 flex-grow">{res.deskripsi}</p>}
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500"/>
                            {res.pemilik?.namaLengkap ?? 'Pengguna Dihapus'}
                        </p>
                        {res.pemilik?.noWa && isEmergency && (
                          <a href={`https://wa.me/${res.pemilik.noWa.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-green-600 font-semibold hover:underline">
                            <Phone className="w-4 h-4"/> Hubungi via WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white border-2 border-dashed border-slate-300 rounded-xl">
                  <Package className="w-16 h-16 mx-auto text-slate-300"/>
                  <p className="mt-4 text-slate-600 font-semibold">
                    {searchTerm || filter !== 'Semua' ? "Tidak Ada Sumber Daya yang Cocok" : "Bank Sumber Daya Belum Terbuka"}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {searchTerm || filter !== 'Semua'
                      ? "Coba ubah filter atau kata kunci pencarian Anda."
                      : "Sumber daya milik warga akan muncul di sini saat Mode Darurat diaktifkan oleh Admin."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}