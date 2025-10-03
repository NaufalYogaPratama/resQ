// UNTUK ADMIN LAPORAN ID

"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';


interface StaticMapLoaderProps {
  position: [number, number];
}

export default function StaticMapLoader({ position }: StaticMapLoaderProps) {
  const StaticMap = useMemo(() => dynamic(
    () => import('@/components/StaticMapAdmin'), 
    { 
      ssr: false, 
      loading: () => <div className="bg-slate-200 h-full w-full animate-pulse rounded-2xl"></div>
    }

  ), [position]);

  return <StaticMap position={position} />;
}