"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyBanner() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchEmergencyStatus = async () => {
      try {
        const res = await fetch('/api/settings/emergency-mode');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setIsEmergency(data.isEmergency);
          }
        }
      } catch (error) {

        console.error("Gagal mengambil status mode darurat:", error);
        setIsEmergency(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencyStatus();

    const intervalId = setInterval(fetchEmergencyStatus, 30000);

    return () => clearInterval(intervalId);
  }, []); 


  if (isLoading || !isEmergency) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white p-3 text-center flex items-center justify-center gap-3 animate-pulse">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <p className="font-semibold text-sm">
        MODE DARURAT DIAKTIFKAN. Harap tetap waspada dan laporkan kondisi darurat di sekitar Anda.
      </p>
    </div>
  );
}

