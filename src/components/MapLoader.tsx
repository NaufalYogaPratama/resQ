"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';


interface VolunteerType {
    _id: string;
    namaLengkap: string;
}

interface MapLoaderProps {
  userId: string | undefined;
  userRole: 'Warga' | 'Relawan' | 'Admin' | undefined;
  volunteers?: VolunteerType[]; 
}

export default function MapLoader({ userId, userRole, volunteers }: MapLoaderProps) {
  const Map = useMemo(() => dynamic(
    () => import('@/components/MapComponent'), 
    { 
      ssr: false,
      loading: () => (
        <div className="flex justify-center items-center h-full bg-slate-100">
          <p className="text-slate-500">Memuat peta interaktif...</p>
        </div>
      )
    }
  ), []);

  return <Map userId={userId} userRole={userRole} volunteers={volunteers} />;
}