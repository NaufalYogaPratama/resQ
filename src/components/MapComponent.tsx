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
    namaLengkap: string;
  };
}

interface MapComponentProps {
  userRole: 'Warga' | 'Relawan' | 'Admin' | undefined;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getIconByStatus = (status: ReportType['status']) => {
  let color = 'gray'; 
  if (status === 'Darurat' || status === 'Menunggu') {
    color = 'red';
  } else if (status === 'Siaga' || status === 'Ditangani') {
    color = 'orange';
  } else if (status === 'Waspada') {
    color = 'yellow';
  }
  return L.divIcon({
    className: `custom-div-icon`,
    html: `<div style="background-color:${color};" class="marker-pin"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const CATEGORIES = ['Semua', 'Medis', 'Evakuasi', 'Kerusakan Properti', 'Lainnya'];

export default function MapComponent({ userRole }: MapComponentProps) {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
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
    fetchReports();
  }, []);

  const handleClaim = async (reportId: string) => {
    if (!confirm('Apakah Anda yakin ingin menangani laporan ini?')) {
      return;
    }
    alert(`Fitur klaim untuk laporan ID: ${reportId} belum diimplementasikan di API.`);
  };

  const filteredReports = selectedCategory === 'Semua' 
    ? reports 
    : reports.filter(report => report.kategori === selectedCategory);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Memuat data laporan...</p></div>;
  }

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white p-2 rounded-lg shadow-lg">
        <label className="text-sm mr-2">Filter Kategori:</label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <MapContainer 
        center={[-6.9929, 110.4232]}
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredReports.map((report) => (
          <Marker 
            key={report._id} 
            position={[report.lokasi.coordinates[1], report.lokasi.coordinates[0]]}
            icon={getIconByStatus(report.status)}
          >
            <Popup>
              <strong>{report.kategori} ({report.status})</strong><br/>
              {report.deskripsi}<br/>
              <small>Pelapor: {report.pelapor.namaLengkap}</small>
              
              {userRole === 'Relawan' && report.status === 'Menunggu' && (
                <button
                  onClick={() => handleClaim(report._id)}
                  className="w-full mt-3 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                >
                  Klaim Bantuan
                </button>
              )}
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