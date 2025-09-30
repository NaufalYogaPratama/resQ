"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface MapLoaderProps {
  userRole: 'Warga' | 'Relawan' | 'Admin' | undefined;
}

export default function MapLoader({ userRole }: MapLoaderProps) {
  const Map = useMemo(() => dynamic(
    () => import('@/components/MapComponent'), 
    { 
      ssr: false,
      loading: () => <div className="flex justify-center items-center h-screen"><p>Memuat peta...</p></div>
    }
  ), []);

  return <Map userRole={userRole} />;
}