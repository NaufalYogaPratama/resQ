"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Mic, MicOff, LocateFixed } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// konstanta (boleh di luar komponen)
const DESIRED_ACCURACY = 50; // meter
const MAX_WAIT_MS = 15000; // ms

const LocationPicker = dynamic(
  () => import("@/components/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        Memuat peta...
      </div>
    ),
  }
);

export default function LaporPage() {
  const router = useRouter();

  // ref untuk watchPosition (HARUS di dalam komponen)
  const watchIdRef = useRef<number | null>(null);

  // State untuk form
  const [kategori, setKategori] = useState("Medis");
  const [deskripsi, setDeskripsi] = useState("");
  const [alamat, setAlamat] = useState("");
  const [lokasi, setLokasi] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // HANDLE SPEECH
  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda tidak mendukung input suara. Silakan ketik manual.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDeskripsi((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  // cleanup refs saat unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // FUNGSIONAL: dipanggil dari LocationPicker (klik peta / drag marker)
  const handleLocationSelect = (lat: number, lng: number, accuracy?: number) => {
    setLokasi({ lat, lng, accuracy });
    setError("");
  };

  // GET CURRENT LOCATION with watchPosition untuk meningkatkan akurasi
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser Anda tidak mendukung geolokasi.");
      return;
    }

    setIsLocating(true);
    setError("");

    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: MAX_WAIT_MS,
    };

    let best: GeolocationPosition | null = null;
    const start = Date.now();

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;

      if (!best || (accuracy && accuracy < (best.coords.accuracy ?? Infinity))) {
        best = position;
        setLokasi({ lat: latitude, lng: longitude, accuracy });
      }

      const elapsed = Date.now() - start;
      if ((accuracy && accuracy <= DESIRED_ACCURACY) || elapsed >= MAX_WAIT_MS) {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        setIsLocating(false);

        if (!accuracy || accuracy > DESIRED_ACCURACY) {
          setError(
            `Lokasi ditemukan tetapi akurasi masih ±${Math.round(accuracy ?? 0)} m. Silakan geser marker jika perlu.`
          );
        }
      }
    };

    const errorCallback = (err: GeolocationPositionError) => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLocating(false);
      setError(`Gagal mendapatkan lokasi: ${err.message}`);
    };

    const id = navigator.geolocation.watchPosition(success, errorCallback, options);
    watchIdRef.current = id;

    // safety timeout (kadang opsi timeout tidak ter-trigger)
    setTimeout(() => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLocating(false);
      if (!best) {
        setError("Gagal mendapatkan lokasi yang cukup akurat. Silakan pilih lokasi di peta secara manual.");
      }
    }, MAX_WAIT_MS + 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lokasi) {
      setError("Silakan pilih lokasi di peta terlebih dahulu.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const reportData = {
        kategori,
        deskripsi,
        lokasi: {
          type: "Point",
          coordinates: [lokasi.lng, lokasi.lat],
          alamat: alamat,
        },
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // ignore non-json
      }

      if (!res.ok) {
        throw new Error((data && data.message) || "Gagal mengirim laporan.");
      }

      alert("Laporan berhasil dikirim!");
      router.push("/warga/dashboard");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Buat Laporan Darurat</h1>
      <p className="text-gray-600 mb-8">Tandai lokasi di peta dan isi detail kejadian di bawah ini.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tandai Lokasi Kejadian di Peta
          </label>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 mb-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <LocateFixed size={18} />
            {isLocating ? "Mencari Lokasi..." : "Gunakan Lokasi Saat Ini"}
          </button>

          <LocationPicker onLocationSelect={handleLocationSelect} initialPosition={lokasi} />

          {lokasi && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Lokasi dipilih: Lat {lokasi.lat.toFixed(5)}, Lon {lokasi.lng.toFixed(5)}
              {lokasi.accuracy ? ` — akurasi ±${Math.round(lokasi.accuracy)} m` : ""}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
              Kategori Laporan
            </label>
            <select
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
            >
              <option>Medis</option>
              <option>Evakuasi</option>
              <option>Kerusakan Properti</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
              Alamat Lengkap / Patokan
            </label>
            <input
              id="alamat"
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: Depan Indomaret Simpang Lima"
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
              Deskripsi Kejadian
            </label>
            <div className="mt-1 relative">
              <textarea
                id="deskripsi"
                rows={4}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm pr-12"
                placeholder="Contoh: Terjadi kebakaran di rumah Bapak RT. Butuh bantuan pemadam segera."
              />
              <button
                type="button"
                onClick={handleListen}
                className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                  isListening ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
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
          className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 disabled:bg-gray-400 transition-all"
        >
          {isLoading ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </form>
    </div>
  );
}