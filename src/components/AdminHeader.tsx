"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToggleRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminHeader() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/settings/emergency-mode", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success) setIsEmergency(data.isEmergency);
        }
      } catch (error) {
        console.error("Gagal fetch status darurat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleToggleEmergency = async () => {
    if (!confirm(`Ubah Mode Darurat ke ${isEmergency ? "NONAKTIF" : "AKTIF"}?`)) return;
    try {
      const res = await fetch("/api/settings/emergency-mode", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIsEmergency(data.isEmergency);
        alert(`Mode Darurat sekarang: ${data.isEmergency ? "AKTIF" : "NONAKTIF"}`);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
          alert(`Gagal mengubah mode darurat: ${error.message}`);
      } else {
          alert("Gagal mengubah mode darurat karena kesalahan tidak dikenal.");
      }
  } finally {
      setIsLoading(false);
  }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between h-20 px-8">
        <div className="flex items-center gap-2">
        <Image
            src="/ResQlogo.png"
            alt="ResQ Logo"
            width={200}
            height={200}
            className="h-7 w-auto transition-transform duration-300"
            priority
          />
          <span className="text-sm bg-blue-600 text-white px-2 py-0.5 rounded-md font-semibold">
            Admin
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat status...</span>
          </div>
        ) : (
          <button
            onClick={handleToggleEmergency}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm ${
              isEmergency
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-red-500/30"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
            }`}
          >
            <ToggleRight className="w-5 h-5" />
            Mode Darurat: {isEmergency ? "ON" : "OFF"}
          </button>
        )}
      </div>
    </header>
  );
}
