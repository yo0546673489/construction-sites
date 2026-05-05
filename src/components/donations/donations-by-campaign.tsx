// components/donations/donations-by-campaign.tsx
import type { DonationSummary } from '@/lib/feature-types';

interface Props {
  campaigns: DonationSummary['byCampaign'];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

export function DonationsByCampaign({ campaigns }: Props) {
  const total = campaigns.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold mb-4">תרומות לפי קמפיין</h2>
      
      {campaigns.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          אין תרומות בטווח זה
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => {
            const percentage = total > 0 ? (c.amount / total) * 100 : 0;
            return (
              <div key={c.keywordId}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="font-medium text-gray-900">
                      {c.campaignName}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({c.keyword})
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{formatCurrency(c.amount)}</div>
                    <div className="text-xs text-gray-500">
                      {c.count} תרומות
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: c.color,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {percentage.toFixed(1)}% מסה"כ
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
