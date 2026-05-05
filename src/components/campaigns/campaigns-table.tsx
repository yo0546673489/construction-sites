// components/campaigns/campaigns-table.tsx
import type { CampaignSummary } from '@/lib/feature-types';

interface Props {
  campaigns: CampaignSummary[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

const formatNumber = (n: number) => new Intl.NumberFormat('he-IL').format(n);

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE:   { bg: 'bg-green-100',  text: 'text-green-700',  label: 'פעיל' },
  PAUSED:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'מושהה' },
  DELETED:  { bg: 'bg-red-100',    text: 'text-red-700',    label: 'מחוק' },
  ARCHIVED: { bg: 'bg-gray-100',   text: 'text-gray-700',   label: 'בארכיון' },
};

export function CampaignsTable({ campaigns }: Props) {
  // מיון: ACTIVE קודם, אחרי זה לפי הוצאה גבוהה
  const sorted = [...campaigns].sort((a, b) => {
    if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
    if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
    return b.spend - a.spend;
  });

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">קמפיינים</h2>
        <div className="text-center py-12 text-gray-400">אין קמפיינים בטווח זה</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold">קמפיינים</h2>
        <p className="text-sm text-gray-500 mt-1">
          {sorted.length} קמפיינים, ממוין לפי הוצאה
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">קמפיין</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">סטטוס</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">הוצאה</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">חשיפות</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">קליקים</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">CTR</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">CPC</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">לידים</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">CPL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((c) => {
              const status = statusConfig[c.status] || statusConfig.ARCHIVED;
              return (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900 max-w-xs truncate" title={c.name}>
                      {c.name}
                    </div>
                    {c.dailyBudget > 0 && (
                      <div className="text-xs text-gray-500">
                        תקציב יומי: {formatCurrency(c.dailyBudget)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium">{formatCurrency(c.spend)}</td>
                  <td className="px-4 py-4 text-gray-600">{formatNumber(c.impressions)}</td>
                  <td className="px-4 py-4 text-gray-600">{formatNumber(c.clicks)}</td>
                  <td className="px-4 py-4 text-gray-600">{c.ctr.toFixed(2)}%</td>
                  <td className="px-4 py-4 text-gray-600">{formatCurrency(c.cpc)}</td>
                  <td className="px-4 py-4 font-medium text-orange-600">
                    {c.leads > 0 ? formatNumber(c.leads) : '—'}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {c.costPerLead > 0 ? formatCurrency(c.costPerLead) : '—'}
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
