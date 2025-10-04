"use client";

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HistoricEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  eventType: string;
  impactedAreas: {
    coordinates: [number, number][];
  };
}

export default function HistoriPage() {
  const MapView = useMemo(() => dynamic(
    () => import('@/components/HistoricMap'),
    {
      ssr: false,
      loading: () => <div className="bg-slate-200 h-full w-full animate-pulse rounded-2xl flex items-center justify-center"><p>Memuat peta...</p></div>
    }
  ), []);

  const [events, setEvents] = useState<HistoricEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HistoricEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/historic-events');
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
          if (data.data.length > 0) {
            setSelectedEvent(data.data[0]);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data histori:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /> <span className="ml-2">Memuat Histori Bencana...</span></div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="mb-6">
            <Link href="/warga/edukasi" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Pusat Edukasi
            </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900">Belajar dari Krisis Lalu</h1>
          <p className="mt-2 text-lg text-slate-600">Visualisasi dampak bencana historis di Semarang.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Timeline (Kiri) */}
          <div className="lg:col-span-1 h-[70vh] overflow-y-auto pr-4 space-y-4">
            {events.map(event => (
              <button
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedEvent?._id === event._id ? 'bg-white border-indigo-500 shadow-md' : 'bg-white border-transparent hover:border-indigo-300'}`}
              >
                <p className="font-bold text-slate-800">{event.title}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </button>
            ))}
          </div>

          {/* Kolom Peta & Detail (Kanan) */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                <div className="h-96 rounded-t-2xl overflow-hidden">
                  <MapView
                    key={selectedEvent._id}
                    center={selectedEvent.impactedAreas.coordinates[0].slice().reverse() as [number, number]}
                    points={selectedEvent.impactedAreas.coordinates}
                  />
                </div>
                <div className="p-6">
                  <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">{selectedEvent.eventType}</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-4">{selectedEvent.title}</h2>
                  <p className="text-slate-600 mt-2">{selectedEvent.description}</p>
                </div>
              </div>
            ) : (
              <p>Tidak ada data untuk ditampilkan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}