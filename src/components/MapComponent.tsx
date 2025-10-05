"use client";

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { Map } from 'leaflet';

// Tipe Data
interface ReportType {
  _id: string;
  deskripsi: string;
  gambarUrl?: string;
  kategori: string;
  status: 'Menunggu' | 'Ditangani' | 'Selesai';
  lokasi: { coordinates: [number, number]; alamat?: string };
  pelapor: { _id: string; namaLengkap: string };
  penolong?: { _id: string; namaLengkap: string };
}

interface VolunteerType {
    _id: string;
    namaLengkap: string;
}

interface MapComponentProps {
  userId?: string;
  userRole?: 'Warga' | 'Relawan' | 'Admin';
  volunteers?: VolunteerType[];
}

// FIX untuk ikon default Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Fungsi untuk menentukan warna pin
const getIconByStatus = (status: ReportType['status']) => {
    let color = '#10b981'; // Selesai (Hijau)
    if (status === 'Menunggu') color = '#dc2626'; // Menunggu (Merah)
    else if (status === 'Ditangani') color = '#f97316'; // Ditangani (Oranye)
    
    return L.divIcon({
        className: `custom-div-icon`,
        html: `<div style="background-color:${color};" class="marker-pin"></div>`,
        iconSize: [30, 42], 
        iconAnchor: [15, 42], 
    });
};

const CATEGORIES = ['Semua', 'Medis', 'Evakuasi', 'Kerusakan Properti', 'Lainnya'];
const STATUSES = ['Semua', 'Menunggu', 'Ditangani', 'Selesai'];

export default function MapComponent({ userId, userRole, volunteers = [] }: MapComponentProps) {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const mapRef = useRef<Map | null>(null);

  // --- SEMUA FUNGSI HANDLER DI DEKLARASIKAN DI SINI ---

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

  const handleClaim = async (reportId: string) => {
    if (!confirm('Apakah Anda yakin ingin menangani laporan ini?')) return;
    setIsSubmitting(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/claim`, { method: 'PUT' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengklaim laporan.');
      alert('Laporan berhasil diklaim!');
      fetchReports(); 
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
      fetchReports();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(null);
    }
  };
  
  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    setIsSubmitting(`status-${reportId}`);
    try {
        const res = await fetch(`/api/reports/${reportId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert('Status berhasil diperbarui!');
        fetchReports();
    } catch (err: any) {
        alert(`Error: ${err.message}`);
    } finally {
        setIsSubmitting(null);
    }
  };

  const handleAssignVolunteer = async (reportId: string, volunteerId: string) => {
    setIsSubmitting(`assign-${reportId}`);
    try {
        if (!volunteerId) throw new Error("Pilih relawan terlebih dahulu.");
        const res = await fetch(`/api/reports/${reportId}/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ volunteerId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert('Relawan berhasil ditugaskan!');
        fetchReports();
    } catch (err: any) {
        alert(`Error: ${err.message}`);
    } finally {
        setIsSubmitting(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
      if (!confirm('PERINGATAN: Anda akan menghapus laporan ini secara permanen. Lanjutkan?')) return;
      setIsSubmitting(`delete-${reportId}`);
      try {
          const res = await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          alert('Laporan berhasil dihapus.');
          fetchReports();
      } catch (err: any) {
          alert(`Error: ${err.message}`);
      } finally {
          setIsSubmitting(null);
      }
  };

  useEffect(() => {
    fetchReports();
  }, []);
  
  useEffect(() => {
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
  }, []);

  // Filter laporan berdasarkan role
  const filteredReports = reports.filter(report => {
    const categoryMatch = selectedCategory === 'Semua' || report.kategori === selectedCategory;
    if (userRole === 'Admin') {
        const statusMatch = selectedStatus === 'Semua' || report.status === selectedStatus;
        return categoryMatch && statusMatch;
    }
    // Warga dan Relawan hanya melihat yang belum selesai
    return categoryMatch && report.status !== 'Selesai';
  });

  if (loading) {
    return <div className="flex justify-center items-center h-full bg-slate-50"><p className="text-slate-500">Memuat data laporan...</p></div>;
  }

  return (
    <div className="relative h-full">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 backdrop-blur-md p-2 rounded-lg shadow-lg border border-slate-200 flex gap-4 items-center">
            <div>
                <label className="text-xs mr-2 text-slate-600">Kategori:</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            {userRole === 'Admin' && (
                <div>
                    <label className="text-xs mr-2 text-slate-600">Status:</label>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                        className="p-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
                        {STATUSES.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                    </select>
                </div>
            )}
        </div>

        <MapContainer center={[-6.9929, 110.4232]} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            
            {filteredReports.map((report) => (
                <Marker key={report._id} position={[report.lokasi.coordinates[1], report.lokasi.coordinates[0]]} icon={getIconByStatus(report.status)}>
                    <Popup>
                        <div className="w-72">
                            <h2 className={`text-lg font-bold ${report.status === 'Menunggu' ? 'text-red-700' : 'text-teal-800'}`}>{report.kategori} ({report.status})</h2>
                            {report.gambarUrl && <img src={report.gambarUrl} alt="Kejadian" className="w-full h-32 object-cover rounded-lg my-2"/>}
                            <p className="text-slate-700 text-sm mt-2">{report.deskripsi}</p>
                            <p className="text-xs text-slate-500 mt-2 border-t pt-2">
                                Pelapor: {report.pelapor?.namaLengkap ?? 'Pengguna Dihapus'}
                            </p>
                            {report.penolong && (
                                <p className="text-xs text-slate-500">
                                    Ditangani oleh: {report.penolong?.namaLengkap ?? 'Relawan Dihapus'}
                                </p>
                            )}
                            
                            {/* Tombol untuk Relawan */}
                            {userRole === 'Relawan' && report.status === 'Menunggu' && (
                              <button onClick={() => handleClaim(report._id)} disabled={!!isSubmitting}
                                className="w-full mt-2 bg-teal-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 disabled:bg-slate-400">
                                {isSubmitting === report._id ? 'Memproses...' : 'Ambil Tugas Ini'}
                              </button>
                            )}

                            {/* Tombol untuk Warga (Pelapor) */}
                            {report.pelapor?._id === userId && report.status === 'Ditangani' && (
                              <button onClick={() => handleComplete(report._id)} disabled={!!isSubmitting}
                                className="w-full mt-2 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-slate-400">
                                {isSubmitting === report._id ? 'Memproses...' : 'Tandai Selesai'}
                              </button>
                            )}
                            
                            {/* Kontrol untuk Admin */}
                            {userRole === 'Admin' && (
                                <div className="mt-4 pt-4 border-t space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Ubah Status</label>
                                        <select defaultValue={report.status} onChange={(e) => handleUpdateStatus(report._id, e.target.value)}
                                            className="w-full mt-1 p-1 border border-slate-300 rounded text-sm">
                                            <option value="Menunggu">Menunggu</option>
                                            <option value="Ditangani">Ditangani</option>
                                            <option value="Selesai">Selesai</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Tugaskan Relawan</label>
                                        <select defaultValue={report.penolong?._id} disabled={report.status === 'Selesai'}
                                            onChange={(e) => handleAssignVolunteer(report._id, e.target.value)}
                                            className="w-full mt-1 p-1 border border-slate-300 rounded text-sm disabled:bg-slate-100">
                                            <option value="">-- Pilih Relawan --</option>
                                            {volunteers.map(v => <option key={v._id} value={v._id}>{v.namaLengkap}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={() => handleDeleteReport(report._id)}
                                        className="w-full mt-2 text-xs text-red-600 hover:text-red-800 font-semibold text-center">
                                        Hapus Laporan Ini
                                    </button>
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
        
        <style jsx global>{`
          .marker-pin {
            width: 25px;
            height: 25px;
            border-radius: 50% 50% 50% 0;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.4);
            position: absolute;
            transform: rotate(-45deg);
            left: 50%;
            top: 50%;
            margin: -12.5px 0 0 -12.5px;
          }
        `}</style>
    </div>
  );
}