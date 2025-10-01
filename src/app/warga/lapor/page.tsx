"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Camera, MapPin, FileText } from 'lucide-react';

const LocationPicker = dynamic(
  () => import('@/components/LocationPicker'),
  { 
    ssr: false,
    loading: () => <div className="h-80 bg-slate-800 flex items-center justify-center rounded-lg text-slate-400">Memuat peta...</div> 
  }
);

export default function LaporPage() {
  const router = useRouter();
  
  const [kategori, setKategori] = useState('Medis');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState<{ lat: number; lng: number } | null>(null);
  const [alamat, setAlamat] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLokasi({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lokasi) {
      setError('Silakan pilih atau cari lokasi di peta terlebih dahulu.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('kategori', kategori);
      formData.append('deskripsi', deskripsi);
      formData.append('lokasi', JSON.stringify({
        type: 'Point',
        coordinates: [lokasi.lng, lokasi.lat],
        alamat: alamat
      }));
      if (gambar) formData.append('gambar', gambar);

      const res = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim laporan.');

      alert('Laporan berhasil dikirim!');
      router.push('/warga/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-8 font-sans">
        <div className="max-w-4xl mx-auto">
            <div data-aos="fade-down">
                <h1 className="text-4xl font-bold">Buat Laporan Darurat</h1>
                <p className="mt-2 text-lg text-slate-400">Laporan Anda akan diverifikasi dan diteruskan ke relawan terdekat.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                <div data-aos="fade-up" data-aos-delay="100">
                    <label className="block text-xl font-semibold text-white mb-2 flex items-center">
                        <MapPin className="w-6 h-6 mr-3 text-amber-400"/> 1. Cari atau Tandai Lokasi Kejadian
                    </label>
                    <p className="text-sm text-slate-400 mb-4">Gunakan bar pencarian atau klik pada peta untuk menandai lokasi yang akurat.</p>
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                    {lokasi && (
                        <p className="text-xs text-green-400 mt-2">✓ Lokasi dipilih: Lat {lokasi.lat.toFixed(5)}, Lon {lokasi.lng.toFixed(5)}</p>
                    )}
                </div>

                {/* --- STRUKTUR DIPERBAIKI DI SINI --- */}
                <div data-aos="fade-up" data-aos-delay="200" className="space-y-6">
                    <label className="block text-xl font-semibold text-white flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-amber-400"/> 2. Berikan Detail Laporan
                    </label>
                    
                    {/* Kartu Detail Laporan */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-lg">
                        <div>
                            <label htmlFor="kategori" className="block text-sm font-medium text-slate-300">Kategori Laporan</label>
                            <select id="kategori" value={kategori} onChange={e => setKategori(e.target.value)} required 
                                className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                                <option className="bg-slate-800">Medis</option>
                                <option className="bg-slate-800">Evakuasi</option>
                                <option className="bg-slate-800">Kerusakan Properti</option>
                                <option className="bg-slate-800">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="alamat" className="block text-sm font-medium text-slate-300">Alamat/Detail Lokasi</label>
                            <input id="alamat" type="text" value={alamat} onChange={e => setAlamat(e.target.value)} placeholder="Contoh: Depan Indomaret Simpang Lima" required 
                                className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400"/>
                        </div>
                        <div>
                            <label htmlFor="deskripsi" className="block text-sm font-medium text-slate-300">Deskripsi Singkat Kejadian</label>
                            <textarea id="deskripsi" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} rows={3} required 
                                className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="Jelaskan apa yang terjadi..."></textarea>
                        </div>
                        <div>
                            <label htmlFor="gambar" className="block text-sm font-medium text-slate-300">Upload Foto (Opsional)</label>
                            <div className="mt-1 flex items-center bg-white/5 border border-white/20 rounded-md p-2">
                                <Camera className="w-5 h-5 text-slate-400"/>
                                <input id="gambar" type="file" accept="image/*"
                                onChange={(e) => setGambar(e.target.files ? e.target.files[0] : null)}
                                className="ml-4 text-sm text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-300 hover:file:bg-amber-500/20"/>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-center font-semibold">{error}</p>}
                    
                    {/* Tombol Kirim Laporan dipindahkan ke sini */}
                    <div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 text-black font-bold py-4 px-6 rounded-lg text-lg hover:bg-amber-400 disabled:bg-slate-600 transition-all">
                            {isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}
