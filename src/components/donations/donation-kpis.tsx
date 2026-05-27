// components/donations/donation-kpis.tsx
import { TrendingUp, Heart, Users, BarChart3 } from 'lucide-react';
import type { DonationSummary } from '@/lib/feature-types';

interface Props {
  summary: DonationSummary;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

const formatNumber = (n: number) => new Intl.NumberFormat('he-IL').format(n);

export function DonationKPIs({ summary }: Props) {
  const cards = [
    {
      label: 'סה"כ תרומות',
      value: formatCurrency(summary.totalAmount),
      subValue: `${summary.totalCount} תרומות`,
      icon: TrendingUp,
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      label: 'תורמים ייחודיים',
      value: formatNumber(summary.uniqueDonors),
      subValue: `מתוך ${summary.totalCount} תרומות`,
      icon: Users,
      gradient: 'from-sky-400 to-blue-500',
    },
    {
      label: 'תרומה ממוצעת',
      value: formatCurrency(summary.averageAmount),
      subValue: 'לתורם',
      icon: BarChart3,
      gradient: 'from-violet-400 to-purple-500',
    },
    {
      label: 'קמפיינים פעילים',
      value: formatNumber(summary.byCampaign.length),
      subValue:
        summary.byCampaign.length > 0
          ? `מוביל: ${summary.byCampaign[0].campaignName.substring(0, 20)}`
          : 'אין נתונים',
      icon: Heart,
      gradient: 'from-rose-400 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-300/20"
          >
            <div
              className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
            />
            <div className="relative">
              <div
                className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg shadow-slate-900/5`}
              >
                <Icon className="size-5 text-white" />
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">
                {card.label}
              </p>
              <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                {card.value}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-400">
                {card.subValue}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
