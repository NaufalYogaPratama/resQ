"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function MapLoader() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/MapComponent'), 
    { 
      ssr: false,
      loading: () => <div className="flex justify-center items-center h-screen"><p>Memuat peta...</p></div>
    }
  ), []);

  return <Map />;
}