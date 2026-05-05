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
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'תורמים ייחודיים',
      value: formatNumber(summary.uniqueDonors),
      subValue: `מתוך ${summary.totalCount} תרומות`,
      icon: Users,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'תרומה ממוצעת',
      value: formatCurrency(summary.averageAmount),
      subValue: 'לתורם',
      icon: BarChart3,
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'קמפיינים פעילים',
      value: formatNumber(summary.byCampaign.length),
      subValue:
        summary.byCampaign.length > 0
          ? `מוביל: ${summary.byCampaign[0].campaignName.substring(0, 20)}`
          : 'אין נתונים',
      icon: Heart,
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className={`${card.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.subValue}</p>
          </div>
        );
      })}
    </div>
  );
}
