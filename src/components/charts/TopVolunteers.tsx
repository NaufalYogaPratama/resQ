"use client";

import { Trophy } from 'lucide-react';

export default function TopVolunteers({ data }) {
    if (!data || data.length === 0) return <p className="text-center text-slate-500">Belum ada data relawan.</p>;

    const medals = ['🥇', '🥈', '🥉'];

    return (
        <div className="space-y-4">
            {data.map((volunteer, index) => (
                <div key={volunteer._id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <span className="text-xl w-6 text-center">{medals[index] || `${index + 1}.`}</span>
                        <div>
                            <p className="font-semibold text-slate-800">{volunteer.namaLengkap}</p>
                            <p className="text-sm text-slate-500">{volunteer.poin || 0} Poin</p>
                        </div>
                    </div>
                    <Trophy className={`w-6 h-6 ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-slate-400' : 
                        index === 2 ? 'text-orange-500' : 'text-slate-300'
                    }`} />
                </div>
            ))}
        </div>
    );
}