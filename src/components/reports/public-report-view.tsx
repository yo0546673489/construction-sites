// components/reports/public-report-view.tsx
import type { CashflowSummary } from '@/lib/feature-types';
import { CashflowKPIs } from './cashflow-kpis';
import { CashflowChart } from './cashflow-chart';
import { CampaignRoasTable } from './campaign-roas-table';
import { InsightsPanel } from './insights-panel';

interface Props {
  report: {
    title: string;
    tenantName: string;
    showSpend: boolean;
    showDonations: boolean;
    showRoas: boolean;
    showCampaigns: boolean;
    dateRangeDays: number;
  };
  summary: CashflowSummary;
}

export function PublicReportView({ report, summary }: Props) {
  // אם לא מציגים הוצאה - הסתר אותה (הצג רק תרומות)
  const filteredSummary = {
    ...summary,
    totalSpend: report.showSpend ? summary.totalSpend : 0,
    daily: summary.daily.map((d) => ({
      ...d,
      metaSpend: report.showSpend ? d.metaSpend : 0,
      netProfit: report.showSpend ? d.netProfit : d.donationsAmount,
      roas: report.showSpend ? d.roas : 0,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">דוח קמפיין</p>
              <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {report.tenantName} • {report.dateRangeDays} ימים אחרונים
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* תובנות */}
        {summary.insights.length > 0 && (
          <InsightsPanel insights={summary.insights} />
        )}

        {/* KPIs */}
        <CashflowKPIs summary={filteredSummary} />

        {/* גרף */}
        <CashflowChart data={filteredSummary.daily} />

        {/* קמפיינים */}
        {report.showCampaigns && (
          <CampaignRoasTable campaigns={summary.byCampaign} />
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-gray-400">
            דוח שנוצר על ידי{' '}
            <a 
              href="https://pro-digital.org" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              פרו דיגיטל
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
