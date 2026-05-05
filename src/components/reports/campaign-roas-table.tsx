// components/reports/campaign-roas-table.tsx
import type { CampaignCashflow } from '@/lib/feature-types';

interface Props {
  campaigns: CampaignCashflow[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

const statusConfig = {
  star:   { emoji: '🔥', label: 'כוכב',    bg: 'bg-emerald-100', text: 'text-emerald-700' },
  good:   { emoji: '🟢', label: 'טוב',     bg: 'bg-green-100',   text: 'text-green-700' },
  weak:   { emoji: '⚠️', label: 'חלש',     bg: 'bg-yellow-100',  text: 'text-yellow-700' },
  losing: { emoji: '🔴', label: 'הפסד',    bg: 'bg-red-100',     text: 'text-red-700' },
};

export function CampaignRoasTable({ campaigns }: Props) {
  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">השוואת קמפיינים</h2>
        <div className="text-center py-12 text-gray-400">אין נתונים</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold">השוואת קמפיינים</h2>
        <p className="text-sm text-gray-500 mt-1">
          כל קמפיין עם הוצאה, הכנסה ו-ROAS שלו
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">קמפיין</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">הוצאה</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">תרומות</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">רווח</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">ROAS</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">סטטוס</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((c) => {
              const status = statusConfig[c.status];
              return (
                <tr key={c.campaignId} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900 max-w-xs truncate">
                      {c.campaignName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {c.donationsCount} תרומות
                    </div>
                  </td>
                  <td className="px-4 py-4 text-red-600 font-medium">
                    {c.metaSpend > 0 ? `-${formatCurrency(c.metaSpend)}` : '—'}
                  </td>
                  <td className="px-4 py-4 text-green-600 font-medium">
                    {c.donationsAmount > 0 ? `+${formatCurrency(c.donationsAmount)}` : '—'}
                  </td>
                  <td className={`px-4 py-4 font-bold ${
                    c.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {c.netProfit >= 0 ? '+' : ''}{formatCurrency(c.netProfit)}
                  </td>
                  <td className="px-4 py-4 font-bold text-purple-700">
                    {c.metaSpend > 0 ? `${c.roas.toFixed(1)}x` : '∞'}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.emoji} {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
