"use client";

import { useState, useEffect } from "react";
import { Package, Wrench, Trash2, Camera, Trophy, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

interface ResourceType {
  _id: string;
  namaSumberDaya: string;
  tipe: "Aset" | "Keahlian";
  deskripsi?: string;
  gambarUrl?: string;
}

export default function SumberDayaPage() {
  const [myResources, setMyResources] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [namaSumberDaya, setNamaSumberDaya] = useState("");
  const [tipe, setTipe] = useState<"Aset" | "Keahlian">("Aset");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardName, setRewardName] = useState('');

  const fetchMyResources = async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (data.success) {
        setMyResources(data.data);
      } else {
        throw new Error(data.message || "Gagal memuat sumber daya.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('namaSumberDaya', namaSumberDaya);
      formData.append('tipe', tipe);
      formData.append('deskripsi', deskripsi);
      if (gambar) formData.append('gambar', gambar);

      const res = await fetch("/api/resources", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan sumber daya.");
      }

    
      setMyResources(prev => [data.data, ...prev]);
      
    
      setNamaSumberDaya("");
      setTipe("Aset");
      setDeskripsi("");
      setGambar(null);
      const fileInput = document.getElementById('gambar-sumber') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      if (data.rewardAwarded) {
        setRewardName(data.rewardName);
        setShowRewardModal(true);
      }

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message); 
        } else {
            setError("Terjadi kesalahan yang tidak diketahui.");
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus sumber daya ini?")) {
      const originalResources = [...myResources];
      setMyResources(prev => prev.filter(res => res._id !== id));

      try {
        const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal menghapus sumber daya.");
        }
      } catch (err) {
          setMyResources(originalResources); 
          if (err instanceof Error) {
            setError(err.message);
          }
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div data-aos="fade-down" className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Bank Sumber Daya Komunitas</h1>
          <p className="mt-2 text-lg text-slate-600">Daftarkan aset atau keahlian yang dapat Anda kontribusikan saat darurat.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 sm:p-8" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Daftarkan Sumber Daya Baru</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nama-sumber" className="block text-sm font-semibold text-slate-700 mb-2">Nama Aset/Keahlian</label>
              <input id="nama-sumber" type="text" value={namaSumberDaya} onChange={(e) => setNamaSumberDaya(e.target.value)} required 
                className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600" 
                placeholder="Contoh: Genset Portabel"/>
            </div>
            <div>
              <label htmlFor="tipe-sumber" className="block text-sm font-semibold text-slate-700 mb-2">Tipe</label>
              <select id="tipe-sumber" value={tipe} onChange={(e) => setTipe(e.target.value as "Aset" | "Keahlian")}
                className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                <option value="Aset">Aset (Barang)</option>
                <option value="Keahlian">Keahlian (Jasa)</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="deskripsi-sumber" className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Singkat (Opsional)</label>
            <textarea id="deskripsi-sumber" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={3}
              className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Contoh: Genset 2200 watt, cukup untuk 1 rumah"></textarea>
          </div>
          <div className="mt-6">
            <label htmlFor="gambar-sumber" className="block text-sm font-semibold text-slate-700 mb-2">Foto Aset (Opsional)</label>
            <div className="mt-1 flex items-center border border-slate-300 rounded-lg p-2">
                <Camera className="w-5 h-5 text-slate-500"/>
                <input id="gambar-sumber" type="file" accept="image/*" onChange={(e) => setGambar(e.target.files ? e.target.files[0] : null)}
                    className="ml-4 text-sm text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4 font-semibold">{error}</p>}
          <button type="submit" disabled={isSubmitting}
            className="mt-6 w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-400 transition-colors shadow-md flex items-center justify-center gap-2">
             {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSubmitting ? "Menambahkan..." : "Tambahkan Sumber Daya"}
          </button>
        </form>

        <div className="mt-12" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Sumber Daya Milik Anda</h2>
          {isLoading ? <p className="text-slate-500 text-center py-10">Memuat data...</p> : (
            <div className="space-y-4">
              {myResources.length > 0 ? (
                myResources.map((res: ResourceType) => (
                  <li key={res._id} className="list-none bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow hover:shadow-md transition-shadow">
                    <Link href={`/warga/sumber-daya/${res._id}`} className="flex items-center gap-4 flex-grow">
                      {res.gambarUrl ? (
                        <Image src={res.gambarUrl} alt={res.namaSumberDaya} width={64} height={64} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          {res.tipe === "Aset" ? ( <Package className="w-8 h-8 text-indigo-600" /> ) : ( <Wrench className="w-8 h-8 text-indigo-600" /> )}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-lg text-slate-900">{res.namaSumberDaya}</p>
                        <p className="text-sm text-slate-500">{res.tipe}</p>
                      </div>
                    </Link>
                    <div className="flex items-center flex-shrink-0">
                      <button onClick={() => handleDelete(res._id)}
                        className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-100 transition-colors" title="Hapus">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                  <p className="text-slate-500">Anda belum mendaftarkan sumber daya apapun.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {showRewardModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-sm text-center p-8 relative" data-aos="zoom-in">
                    <button onClick={() => setShowRewardModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto animate-bounce"/>
                    <h2 className="text-2xl font-bold text-slate-900 mt-4">Pencapaian Baru!</h2>
                    <p className="text-slate-600 mt-2">Terima kasih atas kontribusinya! Anda mendapatkan:</p>
                    <p className="text-xl font-bold text-indigo-600 mt-2">{rewardName}</p>
                    <Link href="/warga/profil" className="mt-6 inline-block w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">
                        Lihat di Profil
                    </Link>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}