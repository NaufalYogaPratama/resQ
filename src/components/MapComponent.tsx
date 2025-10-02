"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 

interface ReportType {
  _id: string;
  deskripsi: string;
  gambarUrl?: string;
  kategori: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai' | 'Darurat' | 'Siaga' | 'Waspada';
  lokasi: { coordinates: [number, number]; alamat?: string };
  pelapor: { _id: string; namaLengkap: string };
}

interface MapComponentProps {
  userId: string | undefined;
  userRole: 'Warga' | 'Relawan' | 'Admin' | undefined;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getIconByStatus = (status: ReportType['status']) => {
  let color = '#64748b';
  if (status === 'Darurat' || status === 'Menunggu') color = '#dc2626';
  else if (status === 'Siaga' || status === 'Ditangani') color = '#f97316';
  else if (status === 'Waspada') color = '#f59e0b';

  return L.divIcon({
    className: `custom-div-icon`,
    html: `<div style="background-color:${color};" class="marker-pin"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const CATEGORIES = ['Semua', 'Medis', 'Evakuasi', 'Kerusakan Properti', 'Lainnya'];

export default function MapComponent({ userId, userRole }: MapComponentProps) {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) setReports(data.data);
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleClaim = async (reportId: string) => {
    if (!confirm('Apakah Anda yakin ingin menangani laporan ini?')) return;
    setIsSubmitting(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/claim`, { method: 'PUT' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengklaim laporan.');
      alert('Laporan berhasil diklaim!');
      fetchReports();
    } catch (err: any) { alert(`Error: ${err.message}`); }
    finally { setIsSubmitting(null); }
  };

  const handleComplete = async (reportId: string) => {
    if (!confirm('Apakah Anda yakin bantuan telah selesai diterima?')) return;
    setIsSubmitting(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/complete`, { method: 'PUT' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyelesaikan laporan.');
      alert('Terima kasih! Laporan telah diselesaikan.');
      fetchReports();
    } catch (err: any) { alert(`Error: ${err.message}`); }
    finally { setIsSubmitting(null); }
  };

  const filteredReports = reports.filter(report => 
    (selectedCategory === 'Semua' || report.kategori === selectedCategory) &&
    report.status !== 'Selesai'
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-slate-50"><p className="text-slate-500">Memuat data laporan...</p></div>;
  }

  return (
    <div className="relative h-[calc(100vh-80px)]">
      {/* Filter kategori */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 backdrop-blur-md p-2 rounded-lg shadow-lg border border-slate-200">
        <label className="text-sm mr-2 text-slate-600">Filter:</label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Peta */}
      <MapContainer 
        center={[-6.9929, 110.4232]}
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {filteredReports.map((report) => (
          <Marker 
            key={report._id} 
            position={[report.lokasi.coordinates[1], report.lokasi.coordinates[0]]}
            icon={getIconByStatus(report.status)}
          >
            <Popup>
              <div className="w-64">
                <h2 className="text-lg font-bold text-indigo-800">
                  {report.kategori} ({report.status})
                </h2>

                {report.gambarUrl ? (
                  <img
                    src={report.gambarUrl}
                    alt="Kejadian"
                    className="w-full h-32 object-cover rounded-lg my-2"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-lg my-2">
                    <span className="text-gray-400 text-sm">Tidak ada foto</span>
                  </div>
                )}

                <p className="text-gray-700 text-sm">{report.deskripsi}</p>
                {report.lokasi.alamat && (
                  <p className="text-xs text-gray-500 italic">Lokasi: {report.lokasi.alamat}</p>
                )}
                <p className="text-xs text-gray-500">Pelapor: {report.pelapor.namaLengkap}</p>

                {/* Tombol Relawan */}
                {userRole === 'Relawan' && report.status === 'Menunggu' && (
                  <button
                    onClick={() => handleClaim(report._id)}
                    disabled={isSubmitting === report._id}
                    className="w-full mt-2 bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-slate-400 transition-colors"
                  >
                    {isSubmitting === report._id ? 'Memproses...' : 'Klaim Bantuan'}
                  </button>
                )}

                {/* Tombol Pelapor */}
                {report.pelapor._id === userId && report.status === 'Ditangani' && (
                  <button
                    onClick={() => handleComplete(report._id)}
                    disabled={isSubmitting === report._id}
                    className="w-full mt-2 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors"
                  >
                    {isSubmitting === report._id ? 'Memproses...' : 'Tandai Selesai'}
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .marker-pin {
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid white;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -10px 0 0 -10px;
        }
      `}</style>
    </div>
  );
}
