"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Mic, MicOff, LocateFixed, Camera, Bot, Loader2 } from "lucide-react";
import WaraChatbot from "@/components/WaraChatbot";

// --- PERBAIKAN 1: Deklarasikan tipe data global & SpeechRecognition ---
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
// Definisikan tipe event secara manual untuk SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

const LocationPicker = dynamic(
  () => import("@/components/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-slate-200 flex items-center justify-center rounded-lg text-slate-500">
        <Loader2 className="animate-spin mr-2" /> Memuat peta...
      </div>
    ),
  }
);

export default function LaporPage() {
  const router = useRouter();
  const watchIdRef = useRef<number | null>(null);

  const [kategori, setKategori] = useState("Medis");
  const [deskripsi, setDeskripsi] = useState("");
  const [alamat, setAlamat] = useState("");
  const [lokasi, setLokasi] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [foto, setFoto] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [showWara, setShowWara] = useState(false);

  const handleWaraComplete = (data: { kategori: string; deskripsi: string; }) => {
    if (data.kategori) setKategori(data.kategori);
    if (data.deskripsi) setDeskripsi(data.deskripsi);
    setShowWara(false);
  };

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        setAlamat(data.display_name);
      } else {
        setAlamat("Tidak dapat menemukan nama alamat.");
      }
    } catch (err) {
        if (err instanceof Error) {
            console.error("Gagal mengambil alamat:", err.message);
        }
    }
  };

  const handleLocationSelect = (lat: number, lng: number, accuracy?: number) => {
    setLokasi({ lat, lng, accuracy });
    setError("");
    fetchAddress(lat, lng);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser Anda tidak mendukung geolokasi.");
      return;
    }
    setIsLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        handleLocationSelect(latitude, longitude, accuracy);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setError(`Gagal mendapatkan lokasi: ${err.message}`);
      }
    );
  };

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda tidak mendukung input suara.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognitionRef.current = recognition;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    // --- PERBAIKAN 2: Gunakan tipe data yang sudah kita definisikan ---
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => console.error("Speech error:", event.error);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setDeskripsi(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.start();
  };

  useEffect(() => {
    const recognition = recognitionRef.current;
    const watchId = watchIdRef.current;
    return () => {
      recognition?.stop();
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lokasi) {
      setError("Silakan pilih lokasi di peta terlebih dahulu.");
      return;
    }
    setError("");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("kategori", kategori);
    formData.append("deskripsi", deskripsi);
    formData.append("lokasi", JSON.stringify({
      coordinates: [lokasi.lng, lokasi.lat], 
      alamat: alamat,
    }));
    
    if (foto) formData.append("gambar", foto);
    try {
      const res = await fetch("/api/reports", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim laporan.");
      alert("Laporan berhasil dikirim!");
      router.push("/warga/dashboard");
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message || "Terjadi kesalahan.");
        } else {
            setError("Terjadi kesalahan yang tidak diketahui.");
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showWara && <WaraChatbot onComplete={handleWaraComplete} onClose={() => setShowWara(false)} />}

      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-slate-900">Buat Laporan Darurat</h1>
              <p className="mt-2 text-lg text-slate-600">Isi detail kejadian secara manual, atau gunakan asisten AI kami untuk bantuan.</p>
          </div>

          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowWara(true)}
              className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
            >
              <Bot size={22} />
              <span className="text-lg font-bold">Gunakan Asisten Cerdas WARA</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            <div className="space-y-4 h-[70vh] lg:h-auto flex flex-col">
              <label className="block text-lg font-semibold text-gray-800">1. Tandai Lokasi Kejadian</label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {isLocating ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
                {isLocating ? "Mencari Lokasi..." : "Gunakan Lokasi Saat Ini"}
              </button>
              <div className="flex-grow rounded-lg overflow-hidden shadow-md">
                  <LocationPicker onLocationSelect={handleLocationSelect} initialPosition={lokasi} />
              </div>
              {lokasi && (
                <p className="text-xs text-green-600">
                  ✓ Lokasi dipilih: Lat {lokasi.lat.toFixed(5)}, Lon {lokasi.lng.toFixed(5)}
                  {lokasi.accuracy ? ` — akurasi ±${Math.round(lokasi.accuracy)} m` : ""}
                </p>
              )}
            </div>
            
            <div className="space-y-6">
                <label className="block text-lg font-semibold text-gray-800">2. Isi Detail Laporan</label>
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4 border">
                  <div>
                    <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori Laporan</label>
                    <select
                      id="kategori"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      required
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Medis">Medis</option>
                      <option value="Evakuasi">Evakuasi</option>
                      <option value="Kerusakan Properti">Kerusakan Properti</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat Lengkap / Patokan (Otomatis)</label>
                    <input
                      id="alamat"
                      type="text"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Akan terisi setelah memilih lokasi..."
                      required
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="foto" className="block text-sm font-medium text-gray-700">Unggah Foto (Opsional)</label>
                    <div className="mt-1 flex items-center border border-gray-300 rounded-md p-2">
                        <Camera className="w-5 h-5 text-gray-500" />
                        <input
                          id="foto"
                          type="file"
                          accept="image/*"
                          onChange={handleFotoChange}
                          className="ml-4 text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                    {foto && <p className="text-xs text-green-600 mt-1">✓ Foto terpilih: {foto.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi Kejadian</label>
                    <div className="mt-1 relative">
                      <textarea
                        id="deskripsi"
                        rows={4}
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm pr-12 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Contoh: Terjadi kebakaran di rumah Bapak RT..."
                      />
                      <button
                        type="button"
                        onClick={handleListen}
                        className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        title={isListening ? "Berhenti Merekam" : "Mulai Merekam Suara"}
                      >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="animate-spin" />}
                  {isLoading ? "Mengirim..." : "Kirim Laporan"}
                </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}