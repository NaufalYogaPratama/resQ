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
  
  // State untuk mengelola input form
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

  // Fungsi untuk menghapus sumber daya
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Bank Sumber Daya Komunitas</h1>
      <p className="text-gray-600 mb-8">Daftarkan aset atau keahlian yang bisa Anda kontribusikan saat keadaan darurat.</p>
      
      {/* Form Pendaftaran */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Daftarkan Sumber Daya Baru</h2>
         <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="nama-sumber" className="block text-sm font-medium text-gray-700">Nama Aset/Keahlian</label>
                <input id="nama-sumber" type="text" value={namaSumberDaya} onChange={e => setNamaSumberDaya(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
                <label htmlFor="tipe-sumber" className="block text-sm font-medium text-gray-700">Tipe</label>
                <select id="tipe-sumber" value={tipe} onChange={e => setTipe(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                    <option>Aset</option>
                    <option>Keahlian</option>
                </select>
            </div>
         </div>
         <div className="mt-4">
            <label htmlFor="deskripsi-sumber" className="block text-sm font-medium text-gray-700">Deskripsi Singkat (Opsional)</label>
            <textarea id="deskripsi-sumber" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} rows={2} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
         </div>
         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
         <button type="submit" disabled={isSubmitting} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">
          {isSubmitting ? 'Menambahkan...' : 'Tambahkan'}
         </button>
      </form>

      {/* Daftar Sumber Daya Milik Anda */}
      <div>
        <h2 className="text-xl font-bold mb-4">Sumber Daya Milik Anda</h2>
        {isLoading ? <p>Memuat data sumber daya...</p> : (
          <ul className="space-y-3">
            {myResources.length > 0 ? myResources.map((res: ResourceType) => (
              <li key={res._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div className="flex items-center">
                  {res.tipe === 'Aset' ? <Package className="w-6 h-6 mr-4 text-green-600"/> : <Wrench className="w-6 h-6 mr-4 text-orange-600"/>}
                  <div>
                    <p className="font-bold text-gray-800">{res.namaSumberDaya}</p>
                    <p className="text-sm text-gray-500">{res.tipe}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(res._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                    <Trash2 className="w-5 h-5"/>
                </button>
              </li>
            )) : <p className="text-gray-500">Anda belum mendaftarkan sumber daya apapun.</p>}
          </ul>
        )}
      </div>
    </div>
  );
}