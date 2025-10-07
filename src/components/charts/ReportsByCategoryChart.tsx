"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

interface ChartProps {
  data: ChartData[];
}

const COLORS = ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981"];

export default function ReportsByCategoryChart({ data }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-slate-500 py-10">
        Tidak ada data untuk ditampilkan.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={(props) => {
            const { name, percent } = props as { name: string; percent?: number };
            return `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`;
          }}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} Laporan`, "Jumlah"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
