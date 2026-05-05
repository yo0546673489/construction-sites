// components/reports/cashflow-kpis.tsx
import { TrendingDown, TrendingUp, Wallet, Zap } from 'lucide-react';
import type { CashflowSummary } from '@/lib/feature-types';

interface Props {
  summary: CashflowSummary;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

export function CashflowKPIs({ summary }: Props) {
  const isPositive = summary.netProfit > 0;
  const roasStatus = 
    summary.roas >= 5 ? '🔥 מצוין' :
    summary.roas >= 2 ? '✅ טוב' :
    summary.roas >= 1 ? '⚠️ חלש' : '🔴 הפסד';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* הוצאה */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <TrendingDown className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-sm text-gray-500">💸 הוצאה</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {formatCurrency(summary.totalSpend)}
        </p>
        <p className="text-xs text-gray-400 mt-1">פייסבוק / Meta Ads</p>
      </div>

      {/* הכנסה */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-sm text-gray-500">💰 הכנסה</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {formatCurrency(summary.totalDonations)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          תרומות בפועל מ-{summary.byCampaign.length} קמפיינים
        </p>
      </div>

      {/* רווח */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
          isPositive ? 'bg-white' : 'bg-white'
        }`}>
          <Wallet className={`w-6 h-6 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`} />
        </div>
        <p className="text-sm text-gray-700">💎 רווח נטו</p>
        <p className={`text-3xl font-bold mt-1 ${
          isPositive ? 'text-emerald-700' : 'text-red-700'
        }`}>
          {isPositive ? '+' : ''}{formatCurrency(summary.netProfit)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {summary.profitPercentage > 0 && `${summary.profitPercentage.toFixed(1)}% רווחיות`}
        </p>
      </div>

      {/* ROAS */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <Zap className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-sm text-gray-700">⚡ ROAS</p>
        <p className="text-3xl font-bold text-purple-700 mt-1">
          {summary.roas.toFixed(1)}x
        </p>
        <p className="text-xs text-gray-600 mt-1">{roasStatus}</p>
      </div>
    </div>
  );
}
