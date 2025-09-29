"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Muat LocationPicker secara dinamis untuk menghindari error SSR
const LocationPicker = dynamic(
  () => import('@/components/LocationPicker'),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">Memuat peta...</div> 
  }
);

export default function LaporPage() {
  const router = useRouter();
  
  // State untuk form
  const [kategori, setKategori] = useState('Medis');
  const [deskripsi, setDeskripsi] = useState('');
  const [alamat, setAlamat] = useState('');
  // State untuk menyimpan koordinat dari peta
  const [lokasi, setLokasi] = useState<{ lat: number; lng: number } | null>(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi ini akan dipanggil oleh komponen LocationPicker setiap kali user mengklik peta
  const handleLocationSelect = (lat: number, lng: number) => {
    setLokasi({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lokasi) {
      setError('Silakan pilih lokasi di peta terlebih dahulu.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const reportData = {
        kategori,
        deskripsi,
        lokasi: {
          type: 'Point',
          coordinates: [lokasi.lng, lokasi.lat], // Format: [longitude, latitude]
          alamat: alamat,
        }
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengirim laporan.');
      }

      alert('Laporan berhasil dikirim!');
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
      <p className="text-gray-600 mb-8">Tandai lokasi di peta dan isi detail kejadian di bawah ini.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tandai Lokasi Kejadian di Peta</label>
          <LocationPicker onLocationSelect={handleLocationSelect} />
          {lokasi && (
            <p className="text-xs text-green-600 mt-1">✓ Lokasi dipilih: Lat {lokasi.lat.toFixed(5)}, Lon {lokasi.lng.toFixed(5)}</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori Laporan</label>
              <select id="kategori" value={kategori} onChange={e => setKategori(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                <option>Medis</option>
                <option>Evakuasi</option>
                <option>Kerusakan Properti</option>
                <option>Lainnya</option>
              </select>
            </div>
            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat Lengkap / Patokan</label>
              <input id="alamat" type="text" value={alamat} onChange={e => setAlamat(e.target.value)} placeholder="Contoh: Depan Indomaret Simpang Lima" required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi Singkat Kejadian</label>
              <textarea id="deskripsi" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} rows={3} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="Jelaskan apa yang terjadi..."></textarea>
            </div>
        </div>

        {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

        <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 disabled:bg-gray-400 transition-all">
          {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
      </form>
    </div>
  );
}