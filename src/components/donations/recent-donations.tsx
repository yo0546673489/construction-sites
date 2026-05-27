// components/donations/recent-donations.tsx
import type { DonationSummary } from '@/lib/feature-types';
import { Inbox } from 'lucide-react';

interface Props {
  donations: DonationSummary['recentDonations'];
  title?: string;
  limit?: number;
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

export function RecentDonations({
  donations,
  title = 'תרומות אחרונות',
  limit,
}: Props) {
  const list = limit ? donations.slice(0, limit) : donations;
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {donations.length === 0
              ? 'אין תרומות בטווח זה'
              : `${list.length} תרומות מתוך ${donations.length}`}
          </p>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="flex flex-col items-center gap-3 p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
            <Inbox className="size-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">אין תרומות בטווח זה</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">תורם</th>
                <th className="px-5 py-3 font-semibold">סכום</th>
                <th className="px-5 py-3 font-semibold">קמפיין</th>
                <th className="px-5 py-3 font-semibold">אמצעי תשלום</th>
                <th className="px-5 py-3 font-semibold">תאריך</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((d) => (
                <tr
                  key={d.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-bold text-emerald-700">
                        {d.donorName?.charAt(0) || '?'}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {d.donorName || (
                          <span className="font-normal text-slate-400">
                            לא ידוע
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-600">
                    {formatCurrency(d.amount)}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {d.campaignName || '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {d.paymentMethod ? (
                      <span className="inline-flex items-center gap-1.5">
                        {paymentMethodEmoji[d.paymentMethod] || '💰'}{' '}
                        {d.paymentMethod}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-400">
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
