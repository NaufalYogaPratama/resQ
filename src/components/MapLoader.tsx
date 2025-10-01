"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface MapLoaderProps {
  userId: string | undefined;
  userRole: 'Warga' | 'Relawan' | 'Admin' | undefined;
}

export default function MapLoader({ userId, userRole }: MapLoaderProps) {
  const Map = useMemo(() => dynamic(
    () => import('@/components/MapComponent'), 
    { 
      ssr: false,
      // Diperbarui agar sesuai tema gelap
      loading: () => (
        <div className="flex justify-center items-center h-screen bg-slate-900">
          <p className="text-slate-400">Memuat peta interaktif...</p>
        </div>
      )
    }
  ), []);

  return <Map userId={userId} userRole={userRole} />;
}
