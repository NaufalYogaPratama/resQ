"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface ReportsByStatusChartProps {
  data: ChartData[];
}

export default function ReportsByStatusChart({ data }: ReportsByStatusChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-slate-500 py-10">Tidak ada data.</p>;
  }

  const statusOrder = ["Menunggu", "Ditangani", "Selesai"];

  // Gunakan spread agar data asli tidak berubah
  const sortedData = [...data].sort(
    (a, b) => statusOrder.indexOf(a.name) - statusOrder.indexOf(b.name)
  );

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <BarChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(value) => [`${value} Laporan`, "Jumlah"]} />
          <Bar dataKey="value" name="Jumlah" fill="#4F46E5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
