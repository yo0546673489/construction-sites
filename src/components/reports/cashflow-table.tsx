// components/reports/cashflow-table.tsx
import type { DailyCashflow } from '@/lib/feature-types';

interface Props {
  daily: DailyCashflow[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (s: string) => {
  const d = new Date(s);
  return d.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    weekday: 'short',
  });
};

export function CashflowTable({ daily }: Props) {
  // הצג רק ימים עם פעילות, או 30 ימים אחרונים
  const filtered = daily
    .filter((d) => d.metaSpend > 0 || d.donationsAmount > 0)
    .slice(-30)
    .reverse();

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">תזרים יומי</h2>
        <div className="text-center py-8 text-gray-400">אין פעילות בטווח זה</div>
      </div>
    );
  }

  // סיכומים
  const totals = filtered.reduce(
    (acc, d) => ({
      spend: acc.spend + d.metaSpend,
      donations: acc.donations + d.donationsAmount,
      profit: acc.profit + d.netProfit,
    }),
    { spend: 0, donations: 0, profit: 0 }
  );
  const avgRoas = totals.spend > 0 ? totals.donations / totals.spend : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold">תזרים יומי</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">תאריך</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">הוצאה</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">תרומות</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">רווח</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr 
                key={d.date}
                className={d.isPositive ? 'hover:bg-green-50' : 'hover:bg-red-50'}
              >
                <td className="px-4 py-3 text-gray-700">{formatDate(d.date)}</td>
                <td className="px-4 py-3 text-red-600">
                  {d.metaSpend > 0 ? `-${formatCurrency(d.metaSpend)}` : '—'}
                </td>
                <td className="px-4 py-3 text-green-600">
                  {d.donationsAmount > 0 
                    ? `+${formatCurrency(d.donationsAmount)} (${d.donationsCount})` 
                    : '—'
                  }
                </td>
                <td className={`px-4 py-3 font-medium ${
                  d.isPositive ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {d.netProfit !== 0 && (d.isPositive ? '+' : '')}{formatCurrency(d.netProfit)}
                </td>
                <td className="px-4 py-3 font-medium text-purple-700">
                  {d.metaSpend > 0 ? `${d.roas.toFixed(1)}x` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-bold">
            <tr>
              <td className="px-4 py-3">סה"כ ({filtered.length} ימים)</td>
              <td className="px-4 py-3 text-red-700">-{formatCurrency(totals.spend)}</td>
              <td className="px-4 py-3 text-green-700">+{formatCurrency(totals.donations)}</td>
              <td className={`px-4 py-3 ${totals.profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {totals.profit >= 0 ? '+' : ''}{formatCurrency(totals.profit)}
              </td>
              <td className="px-4 py-3 text-purple-700">{avgRoas.toFixed(2)}x</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
