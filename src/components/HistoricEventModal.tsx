"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { HistoricEvent } from "@/types";

interface ModalProps {
  event: HistoricEvent | null;
  onClose: () => void;
  onSave: () => void;
}

export default function HistoricEventModal({ event, onClose, onSave }: ModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    eventType: 'Banjir',
    source: '',
  });
  const [coordinates, setCoordinates] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0], // Format YYYY-MM-DD
        eventType: event.eventType,
        source: event.source || '',
      });
      const coordsString = event.impactedAreas?.coordinates.map(p => p.join(',')).join('\n');
      setCoordinates(coordsString || '');
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
        const coordinatesArray = coordinates.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const parts = line.split(',').map(Number);
                if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
                    throw new Error('Format koordinat tidak valid. Gunakan format: longitude,latitude');
                }
                return [parts[0], parts[1]] as [number, number];
            });

        const submissionData = {
            ...formData,
            impactedAreas: {
                type: 'MultiPoint',
                coordinates: coordinatesArray,
            }
        };

      const url = event?._id ? `/api/historic-events/${event._id}` : '/api/historic-events';
      const method = event?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menyimpan data.");
      }
      
      onSave(); 
      onClose();
      alert(`Data histori berhasil ${event?._id ? 'diperbarui' : 'ditambahkan'}!`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto" data-aos="fade-up">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{event ? 'Edit Histori Bencana' : 'Tambah Histori Bencana'}</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
          <X className="w-6 h-6" />
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-600">Judul Kejadian</label>
            <input id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required className="w-full mt-1 p-2 border border-slate-300 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-600">Tanggal</label>
                <input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required className="w-full mt-1 p-2 border border-slate-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-slate-600">Tipe Bencana</label>
              <select id="eventType" name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full mt-1 p-2 border border-slate-300 rounded-md bg-white">
                <option>Banjir</option>
                <option>Tanah Longsor</option>
                <option>Gempa Bumi</option>
                <option>Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-600">Deskripsi</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={4} className="w-full mt-1 p-2 border border-slate-300 rounded-md"></textarea>
          </div>
          
          <div>
            <label htmlFor="coordinates" className="block text-sm font-medium text-slate-600">Koordinat Area Terdampak</label>
            <textarea id="coordinates" value={coordinates} onChange={(e) => setCoordinates(e.target.value)} required rows={4} className="w-full mt-1 p-2 border border-slate-300 rounded-md font-mono text-sm" placeholder="Satu koordinat per baris, format: longitude,latitude&#10;Contoh:&#10;110.4393,-6.9634&#10;110.4465,-6.9718"></textarea>
          </div>

          <div>
            <label htmlFor="source" className="block text-sm font-medium text-slate-600">Sumber Data</label>
            <input id="source" name="source" type="text" value={formData.source} onChange={handleInputChange} className="w-full mt-1 p-2 border border-slate-300 rounded-md" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}