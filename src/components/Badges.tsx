"use client";

import Image from 'next/image';
import React from 'react';

interface BadgeProps {
  name: string;
  imageSrc: string; 
  requiredPoints: number;
  description: string;
}

const badgeTiers: BadgeProps[] = [
  {
    name: "Relawan Sigap",
    imageSrc: "/relawan-sigap.png",
    requiredPoints: 10,
    description: "Mendapatkan 10 Poin dari aksi pertama.",
  },
  {
    name: "Pelindung Warga",
    imageSrc: "/pelindung-warga.png",
    requiredPoints: 50,
    description: "Mencapai 50 Poin Reputasi.",
  },
  {
    name: "Garda Tangguh",
    imageSrc: "/garda-tangguh.png",
    requiredPoints: 100,
    description: "Mencapai 100 Poin Reputasi.",
  },
  {
    name: "Pilar Komunitas",
    imageSrc: "/pilar-komunitas.png",
    requiredPoints: 200,
    description: "Mencapai 200 Poin Reputasi.",
  },
];


export default function Badges({ points }: { points: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Lencana Garda Tangguh</h2>
      <p className="text-sm text-slate-500 mb-6">Dapatkan lencana dengan menyelesaikan laporan dan mengumpulkan poin.</p>
      {/* Ganti gap untuk memberi jarak lebih antar lencana */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {badgeTiers.map((badge) => {
          const isUnlocked = points >= badge.requiredPoints;
          return (
            <div
              key={badge.name}
              // Tambahkan padding internal (misal: p-6)
              className={`relative group flex flex-col items-center justify-center p-6 border rounded-xl transition-all duration-300 ${isUnlocked ? 'bg-white shadow-sm' : 'bg-slate-100'}`}
              title={`${badge.name}: ${badge.description}`}
            >
              <div className={`transition-all duration-300 ${isUnlocked ? '' : 'grayscale opacity-60'}`}>
                {/* Perbesar ukuran Image (misal: 64x64) */}
                <Image
                  src={badge.imageSrc}
                  alt={`Lencana ${badge.name}`}
                  width={64} // sebelumnya 48
                  height={64} // sebelumnya 48
                />
              </div>
              {/* Perbesar ukuran font dan jarak atas (mt) */}
              <p className={`mt-4 text-base font-semibold text-center transition-colors ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                {badge.name}
              </p>
              {/* Tooltip for desktop */}
              <div className="absolute bottom-full mb-2 w-max px-3 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {badge.description}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}