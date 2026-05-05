// components/donations/donations-by-day-chart.tsx
'use client';

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';

interface Props {
  data: Array<{ date: string; amount: number; count: number }>;
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

export function DonationsByDayChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold mb-4">תרומות יומיות</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="dateLabel" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              reversed
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(v) => `₪${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                direction: 'rtl',
              }}
              formatter={(value, name) => {
                const num = typeof value === 'number' ? value : Number(value) || 0;
                if (name === 'תרומות') return formatCurrency(num);
                return String(num);
              }}
              labelFormatter={(l) => `תאריך: ${l}`}
            />
            <Bar dataKey="amount" fill="#10b981" name="תרומות" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
