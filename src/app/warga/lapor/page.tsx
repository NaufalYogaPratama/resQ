'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LaporPage() {
  const [kategori, setKategori] = useState('Medis');
  const [deskripsi, setDeskripsi] = useState('');
  const [alamat, setAlamat] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lon) || isNaN(lat)) {
      setError('Longitude dan Latitude harus berupa angka.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kategori,
          deskripsi,
          lokasi: {
            type: 'Point',
            coordinates: [lon, lat], // Format: [longitude, latitude]
            alamat: alamat,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengirim laporan.');
      }

      alert('Laporan berhasil dikirim! Terima kasih atas partisipasi Anda.');
      router.push('/warga/dashboard');
    
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Buat Laporan Darurat</h1>
      <p className="text-gray-600 mb-8">Isi formulir di bawah ini dengan detail kejadian. Laporan Anda akan sangat berarti.</p>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori Laporan</label>
          <select 
            id="kategori" 
            value={kategori} 
            onChange={(e) => setKategori(e.target.value)} 
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm bg-white"
          >
            <option>Medis</option>
            <option>Evakuasi</option>
            <option>Kerusakan Properti</option>
            <option>Lainnya</option>
          </select>
        </div>

        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi Kejadian</label>
          <textarea 
            id="deskripsi" 
            rows={4} 
            value={deskripsi} 
            onChange={(e) => setDeskripsi(e.target.value)} 
            required 
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" 
            placeholder="Contoh: Terjadi kebakaran di rumah Bapak RT. Butuh bantuan pemadam segera."
          />
        </div>

        <div>
          <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat Lengkap / Patokan</label>
          <input 
            id="alamat" 
            type="text" 
            value={alamat} 
            onChange={(e) => setAlamat(e.target.value)} 
            required 
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Contoh: Jl. Pahlawan No. 1, Semarang"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
            <input 
              id="longitude" 
              type="text" 
              value={longitude} 
              onChange={(e) => setLongitude(e.target.value)} 
              required 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Contoh: 110.4384"
            />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
            <input 
              id="latitude" 
              type="text" 
              value={latitude} 
              onChange={(e) => setLatitude(e.target.value)} 
              required 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Contoh: -6.9902"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">Anda bisa mendapatkan koordinat dari Google Maps.</p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-all disabled:bg-gray-400"
        >
          {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
      </form>
    </div>
  );
}