"use client";

import { useState, useEffect } from 'react';
import { Package, Wrench, Trash2 } from 'lucide-react';

interface ResourceType {
  _id: string;
  namaSumberDaya: string;
  tipe: 'Aset' | 'Keahlian';
  deskripsi?: string;
}

export default function SumberDayaPage() {
  const [myResources, setMyResources] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [namaSumberDaya, setNamaSumberDaya] = useState('');
  const [tipe, setTipe] = useState('Aset');
  const [deskripsi, setDeskripsi] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyResources = async () => {
    try {
      const res = await fetch('/api/resources');
      const data = await res.json();
      if (data.success) {
        setMyResources(data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data sumber daya:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namaSumberDaya, tipe, deskripsi }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan sumber daya.');
      }
      
      fetchMyResources(); 
      setNamaSumberDaya('');
      setTipe('Aset');
      setDeskripsi('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus sumber daya ini?')) {
      try {
        const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error('Gagal menghapus sumber daya.');
        }
        fetchMyResources(); 
    } catch (err: any) { 
        setError(err.message);
      }
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div data-aos="fade-down">
          <h1 className="text-4xl font-bold">Bank Sumber Daya Komunitas</h1>
          <p className="mt-2 text-lg text-slate-400">Daftarkan aset atau keahlian yang dapat Anda kontribusikan saat darurat.</p>
        </div>

        {/* Form Pendaftaran dengan Glassmorphism */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg p-6 mt-10" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-6 text-white">Daftarkan Sumber Daya Baru</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="nama-sumber" className="block text-sm font-medium text-slate-300 mb-2">Nama Aset/Keahlian</label>
                <input id="nama-sumber" type="text" value={namaSumberDaya} onChange={e => setNamaSumberDaya(e.target.value)} required 
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400"/>
            </div>
            <div>
                <label htmlFor="tipe-sumber" className="block text-sm font-medium text-slate-300 mb-2">Tipe</label>
                <select id="tipe-sumber" value={tipe} onChange={e => setTipe(e.target.value)} 
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                    <option className="bg-slate-800">Aset</option>
                    <option className="bg-slate-800">Keahlian</option>
                </select>
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="deskripsi-sumber" className="block text-sm font-medium text-slate-300 mb-2">Deskripsi Singkat (Opsional)</label>
            <textarea id="deskripsi-sumber" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} rows={3} 
              className="w-full p-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400"></textarea>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="mt-6 w-full md:w-auto bg-amber-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-amber-400 disabled:bg-slate-600 transition-colors">
            {isSubmitting ? 'Menambahkan...' : 'Tambahkan Sumber Daya'}
          </button>
        </form>

        {/* Daftar Sumber Daya Milik Anda */}
        <div className="mt-12" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-2xl font-bold mb-6">Sumber Daya Milik Anda</h2>
          {isLoading ? <p className="text-slate-400">Memuat data...</p> : (
            <ul className="space-y-4">
              {myResources.length > 0 ? myResources.map((res: ResourceType) => (
                <li key={res._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-lg">
                  <div className="flex items-center">
                    {res.tipe === 'Aset' ? <Package className="w-8 h-8 mr-4 text-amber-400"/> : <Wrench className="w-8 h-8 mr-4 text-amber-400"/>}
                    <div>
                      <p className="font-bold text-lg text-white">{res.namaSumberDaya}</p>
                      <p className="text-sm text-slate-400">{res.tipe}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(res._id)} className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-5 h-5"/>
                  </button>
                </li>
              )) : (
                <div className="text-center py-10 bg-white/5 border border-dashed border-white/20 rounded-xl">
                  <p className="text-slate-400">Anda belum mendaftarkan sumber daya apapun.</p>
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
