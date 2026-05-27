// components/donations/donations-by-day-chart.tsx
'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface Props {
  data: Array<{ date: string; amount: number; count: number }>;
  title?: string;
  color?: string;
  height?: number;
  compact?: boolean;
}

const formatDate = (s: string) => {
  const d = new Date(s);
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

export function DonationsByDayChart({
  data,
  title = 'תרומות יומיות',
  color = '#10b981',
  height = 256,
  compact = false,
}: Props) {
  const formatted = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }));

  const inner = (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formatted}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 11, fill: '#64748b' }}
            reversed
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => `₪${v}`}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              direction: 'rtl',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value, name) => {
              const num =
                typeof value === 'number' ? value : Number(value) || 0;
              if (name === 'תרומות') return formatCurrency(num);
              return String(num);
            }}
            labelFormatter={(l) => `תאריך: ${l}`}
            cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }}
          />
          <Bar
            dataKey="amount"
            fill={color}
            name="תרומות"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (compact) {
    return inner;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {inner}
    </div>
  );
}
