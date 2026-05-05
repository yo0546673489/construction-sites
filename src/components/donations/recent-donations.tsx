// components/donations/recent-donations.tsx
import type { DonationSummary } from '@/lib/feature-types';

interface Props {
  donations: DonationSummary['recentDonations'];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(n);

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const paymentMethodEmoji: Record<string, string> = {
  ביט: '📱',
  אשראי: '💳',
  PayPal: '🌐',
  'הוראת קבע': '🔄',
  'צ ק': '📝',
  העברה: '🏦',
  מזומן: '💵',
};

export function RecentDonations({ donations }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold">תרומות אחרונות</h2>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          אין תרומות בטווח זה
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  תורם
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  סכום
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  קמפיין
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  אמצעי תשלום
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  תאריך
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium">
                    {d.donorName || <span className="text-gray-400">לא ידוע</span>}
                  </td>
                  <td className="px-4 py-4 font-bold text-green-600">
                    {formatCurrency(d.amount)}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {d.campaignName || '—'}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {d.paymentMethod ? (
                      <>
                        {paymentMethodEmoji[d.paymentMethod] || '💰'} {d.paymentMethod}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-sm">
                    {formatDate(d.emailDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
