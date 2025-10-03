"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyBanner() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencyStatus = async () => {
      try {
        const res = await fetch('/api/settings/emergency-mode', { cache: 'no-store' });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {

            setIsEmergency(prev => prev !== data.isEmergency ? data.isEmergency : prev);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil status mode darurat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencyStatus();
    
    const intervalId = setInterval(fetchEmergencyStatus, 10000); 

    return () => clearInterval(intervalId);
  }, []);


  if (!isEmergency) {
    return null;
  }
  
  return (
    <div className="bg-red-600 text-white p-3 text-center flex items-center justify-center gap-3 animate-pulse">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <p className="font-semibold text-sm">
        MODE DARURAT DIAKTIFKAN. Harap tetap waspada.
      </p>
    </div>
  );
}