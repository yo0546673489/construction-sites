// components/campaigns/spend-chart.tsx
'use client';

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

interface Props {
  data: Array<{
    date: string;
    spend: number;
    leads: number;
    clicks: number;
    impressions: number;
  }>;
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

export function SpendChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold mb-4">הוצאה ולידים יומיים</h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="dateLabel" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              reversed
            />
            <YAxis 
              yAxisId="spend"
              tick={{ fontSize: 12, fill: '#3b82f6' }}
              tickFormatter={(v) => `₪${v}`}
            />
            <YAxis 
              yAxisId="leads"
              orientation="right"
              tick={{ fontSize: 12, fill: '#f97316' }}
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
                if (name === 'הוצאה') return formatCurrency(num);
                return String(num);
              }}
              labelFormatter={(l) => `תאריך: ${l}`}
            />
            <Legend wrapperStyle={{ direction: 'rtl' }} />
            <Line 
              yAxisId="spend"
              type="monotone" 
              dataKey="spend" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="הוצאה"
            />
            <Line 
              yAxisId="leads"
              type="monotone" 
              dataKey="leads" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="לידים"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
