"use client";

import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Edit } from 'lucide-react';
import { HistoricEvent } from '@/types';
import HistoricEventModal from '@/components/HistoricEventModal';

export default function ManageHistoricEventsPage() {
    const [events, setEvents] = useState<HistoricEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<HistoricEvent | null>(null);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/historic-events');
            const data = await res.json();
            if (data.success) {
                setEvents(data.data);
            } else {
                throw new Error(data.message || "Gagal mengambil data histori.");
            }
        } catch (err) { 
            console.error("Gagal mengambil data histori:", err); 
        } finally { 
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);
    
    const handleDelete = async (eventId: string) => {
        if (!confirm("Anda yakin ingin menghapus data histori ini?")) return;
        
        try {
            const res = await fetch(`/api/historic-events/${eventId}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal menghapus data.");
            }

            setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
            alert("Data berhasil dihapus.");
        } catch (err) {
            if (err instanceof Error) {
                alert(`Gagal menghapus data: ${err.message}`);
            } else {
                alert("Gagal menghapus data karena kesalahan tidak dikenal.");
            }
        }
    };

    return (
        <div className="space-y-8">
            <div data-aos="fade-down">
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
                    <Clock className="w-10 h-10 mr-4 text-indigo-600"/>
                    Manajemen Histori Bencana
                </h1>

                <p className="mt-2 text-lg text-slate-600">Kelola data untuk modul interaktif &apos;Belajar dari Krisis Lalu&apos;.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-md" data-aos="fade-up">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">Daftar Kejadian</h2>
                    <button
                        onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                    >
                        <Plus className="w-5 h-5" /> Tambah Data
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Judul</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tipe</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-6 text-center text-slate-500">Memuat data...</td></tr>
                            ) : events.map(event => (
                                <tr key={event._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{event.title}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{event.eventType}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(event.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                        <button 
                                          onClick={() => { setSelectedEvent(event); setIsModalOpen(true); }} 
                                          className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100" title="Edit">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100" title="Hapus">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && (
                <HistoricEventModal
                    event={selectedEvent}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchEvents}
                />
            )}
        </div>
    );
}

