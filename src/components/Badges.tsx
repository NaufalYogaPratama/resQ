"use client";

import { Shield, Star, Award, Gem } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

interface BadgeProps {
  name: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  requiredPoints: number;
  color: string;
  description: string;
}

const badgeTiers: BadgeProps[] = [
  {
    name: "Relawan Sigap",
    icon: Shield,
    requiredPoints: 10, 
    color: "text-amber-600",
    description: "Mendapatkan 10 Poin dari aksi pertama.",
  },
  {
    name: "Pelindung Warga",
    icon: Star,
    requiredPoints: 50, 
    color: "text-slate-500",
    description: "Mencapai 50 Poin Reputasi.",
  },
  {
    name: "Garda Tangguh",
    icon: Award,
    requiredPoints: 100, 
    color: "text-yellow-500",
    description: "Mencapai 100 Poin Reputasi.",
  },
  {
    name: "Pilar Komunitas",
    icon: Gem,
    requiredPoints: 200, 
    color: "text-indigo-500",
    description: "Mencapai 200 Poin Reputasi.",
  },
];


export default function Badges({ points }: { points: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Lencana Garda Tangguh</h2>
      <p className="text-sm text-slate-500 mb-6">Dapatkan lencana dengan menyelesaikan laporan dan mengumpulkan poin.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {badgeTiers.map((badge) => {
          const isUnlocked = points >= badge.requiredPoints;
          return (
            <div 
              key={badge.name}
              className={`relative group flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-300 ${isUnlocked ? 'bg-white shadow-sm' : 'bg-slate-100'}`}
              title={`${badge.name}: ${badge.description}`}
            >
              <div className={`transition-all duration-300 ${isUnlocked ? badge.color : 'text-slate-400 opacity-60'}`}>
                <badge.icon className="w-12 h-12" />
              </div>
              <p className={`mt-2 text-sm font-semibold text-center transition-colors ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
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