"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToggleRight, Loader2, Bell } from 'lucide-react';

export default function AdminHeader() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/settings/emergency-mode', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setIsEmergency(data.isEmergency);
                }
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
    if (!confirm(`Anda yakin ingin mengubah Mode Darurat menjadi ${isEmergency ? 'NONAKTIF' : 'AKTIF'}?`)) {
      return;
    }
    
    try {
      const res = await fetch('/api/settings/emergency-mode', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsEmergency(data.isEmergency);
        alert(`Mode Darurat sekarang: ${data.isEmergency ? 'AKTIF' : 'NONAKTIF'}`);
        router.refresh(); 
      } else {
        throw new Error(data.message || "Gagal mengubah status.");
      }
    } catch (error: any) {
      alert(`Gagal mengubah mode darurat: ${error.message}`);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between h-20 px-8">
            <div></div>
            
            {isLoading ? (
                <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Memuat status...</span>
                </div>
            ) : (
                <button
                    onClick={handleToggleEmergency}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        isEmergency 
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20' 
                        : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    }`}
                    >
                    <ToggleRight className="w-5 h-5 mr-2"/> 
                    Mode Darurat: {isEmergency ? 'ON' : 'OFF'}
                </button>
            )}
        </div>
    </header>
  );
}