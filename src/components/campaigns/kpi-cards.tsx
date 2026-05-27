// components/campaigns/kpi-cards.tsx
import { TrendingUp, Eye, MousePointerClick, Users } from 'lucide-react';
import type { AccountSummary } from '@/lib/feature-types';

interface Props {
  summary: AccountSummary;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

const formatNumber = (n: number) => new Intl.NumberFormat('he-IL').format(n);

export function KPICards({ summary }: Props) {
  const cards = [
    {
      label: 'סה"כ הוצאה',
      value: formatCurrency(summary.totalSpend),
      subValue: `CPC: ${formatCurrency(summary.averageCPC)}`,
      icon: TrendingUp,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'חשיפות',
      value: formatNumber(summary.totalImpressions),
      subValue: `CTR: ${summary.averageCTR.toFixed(2)}%`,
      icon: Eye,
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'קליקים',
      value: formatNumber(summary.totalClicks),
      subValue: `${summary.averageCTR.toFixed(2)}% מהחשיפות`,
      icon: MousePointerClick,
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'לידים',
      value: formatNumber(summary.totalLeads),
      subValue:
        summary.totalLeads > 0
          ? `עלות לליד: ${formatCurrency(summary.averageCPL)}`
          : 'אין לידים בטווח',
      icon: Users,
      bg: 'bg-orange-50',
      iconColor: 'text-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
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
