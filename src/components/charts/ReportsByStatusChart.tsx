"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ReportsByStatusChart({ data }) {
    if (!data || data.length === 0) return <p className="text-center text-slate-500">Tidak ada data.</p>;

    const statusOrder = ['Menunggu', 'Ditangani', 'Selesai'];
    const sortedData = data.sort((a, b) => statusOrder.indexOf(a.name) - statusOrder.indexOf(b.name));
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Jumlah" fill="#4F46E5" />
            </BarChart>
        </ResponsiveContainer>
    );
}