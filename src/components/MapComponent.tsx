"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 

interface ReportType {
  _id: string;
  deskripsi: string;
  kategori: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai' | 'Darurat' | 'Siaga' | 'Waspada';
  lokasi: {
    coordinates: [number, number]; 
    alamat?: string;
  };
  pelapor: {
    _id: string;
    namaLengkap: string;
  };
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
  let color = '#94a3b8'; // slate-400 untuk Selesai/default
  
  if (status === 'Darurat' || status === 'Menunggu') {
    color = '#ef4444'; // red-500
  } else if (status === 'Siaga' || status === 'Ditangani') {
    color = '#f97316'; // orange-500
  } else if (status === 'Waspada') {
    color = '#facc15'; // yellow-400
  }

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
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleClaim = async (reportId: string) => {
    if (!confirm('Apakah Anda yakin ingin menangani laporan ini?')) return;
    setIsSubmitting(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/claim`, { method: 'PUT' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengklaim laporan.');
      alert('Laporan berhasil diklaim!');
      fetchReports(); // Ambil ulang data dari server
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleComplete = async (reportId: string) => {
    if (!confirm('Apakah Anda yakin bantuan telah selesai diterima?')) return;
    setIsSubmitting(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/complete`, { method: 'PUT' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyelesaikan laporan.');
      alert('Terima kasih! Laporan telah diselesaikan.');
      fetchReports(); // Ambil ulang data dari server
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(null);
    }
  };

  const filteredReports = reports.filter(report => 
    (selectedCategory === 'Semua' || report.kategori === selectedCategory) &&
    report.status !== 'Selesai'
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-slate-900"><p className="text-slate-400">Memuat data laporan...</p></div>;
  }

  return (
    <div className="relative h-[calc(100vh-80px)]"> {/* Sesuaikan tinggi dengan tinggi navbar */}
      {/* Panel Filter dengan Glassmorphism */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-800/50 backdrop-blur-md p-2 rounded-lg shadow-lg border border-white/10">
        <label className="text-sm mr-2 text-slate-300">Filter Kategori:</label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-white/20 rounded-md bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <MapContainer 
        center={[-6.9929, 110.4232]}
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* Menggunakan Tile Peta Dark Mode */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {filteredReports.map((report) => (
          <Marker 
            key={report._id} 
            position={[report.lokasi.coordinates[1], report.lokasi.coordinates[0]]}
            icon={getIconByStatus(report.status)}
          >
            <Popup>
              <div className="custom-popup">
                <strong>{report.kategori} ({report.status})</strong>
                <p>{report.deskripsi}</p>
                {report.lokasi.alamat && <p className="text-xs italic">"{report.lokasi.alamat}"</p>}
                <small>Pelapor: {report.pelapor.namaLengkap}</small>
                
                {userRole === 'Relawan' && report.status === 'Menunggu' && (
                  <button
                    onClick={() => handleClaim(report._id)}
                    disabled={isSubmitting === report._id}
                    className="w-full mt-3 bg-amber-500 text-black text-sm font-semibold py-2 px-4 rounded-lg hover:bg-amber-400 disabled:bg-slate-600"
                  >
                    {isSubmitting === report._id ? 'Memproses...' : 'Klaim Bantuan'}
                  </button>
                )}

                {report.pelapor._id === userId && report.status === 'Ditangani' && (
                  <button
                    onClick={() => handleComplete(report._id)}
                    disabled={isSubmitting === report._id}
                    className="w-full mt-3 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-slate-600"
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
        /* Styling untuk popup dark mode */
        .leaflet-popup-content-wrapper {
          background-color: #1e293b; /* bg-slate-800 */
          color: #e2e8f0; /* text-slate-200 */
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .leaflet-popup-tip {
          background-color: #1e293b;
        }
        .leaflet-popup-content strong {
          color: #fbbf24; /* text-amber-400 */
        }
        .leaflet-popup-content small {
          color: #94a3b8; /* text-slate-400 */
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #94a3b8 !important;
        }
      `}</style>
    </div>
  );
}
