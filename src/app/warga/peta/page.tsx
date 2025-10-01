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
      loading: () => (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900">
          <p className="text-gray-400">Memuat peta interaktif...</p>
        </div>
      )
    }
  ), []);

  return <Map userId={userId} userRole={userRole} />;
}