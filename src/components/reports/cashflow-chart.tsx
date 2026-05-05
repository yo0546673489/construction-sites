// components/reports/cashflow-chart.tsx
'use client';

import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import type { DailyCashflow } from '@/lib/feature-types';

interface Props {
  data: DailyCashflow[];
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

export function CashflowChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
    spendNegative: -d.metaSpend, // הוצאה כשלילית בגרף
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold">תזרים יומי - הוצאות vs הכנסות</h2>
        <p className="text-sm text-gray-500 mt-1">
          🟢 ירוק = תרומות (הכנסה) | 🔴 אדום = הוצאה | 💜 קו = ROAS
        </p>
      </div>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="dateLabel"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              reversed
            />
            <YAxis
              yAxisId="amount"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(v) => `₪${Math.abs(v)}`}
            />
            <YAxis
              yAxisId="roas"
              orientation="right"
              tick={{ fontSize: 12, fill: '#8b5cf6' }}
              tickFormatter={(v) => `${v.toFixed(1)}x`}
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
                if (name === 'הוצאה') return formatCurrency(Math.abs(num));
                if (name === 'תרומות') return formatCurrency(num);
                if (name === 'ROAS') return `${num.toFixed(2)}x`;
                return String(num);
              }}
              labelFormatter={(l) => `תאריך: ${l}`}
            />
            <Legend wrapperStyle={{ direction: 'rtl' }} />
            <Bar 
              yAxisId="amount"
              dataKey="donationsAmount" 
              fill="#10b981" 
              name="תרומות" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              yAxisId="amount"
              dataKey="spendNegative" 
              fill="#ef4444" 
              name="הוצאה" 
              radius={[0, 0, 4, 4]}
            />
            <Line 
              yAxisId="roas"
              type="monotone" 
              dataKey="roas" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="ROAS"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
