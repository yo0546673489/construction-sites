// app/admin/reports/page.tsx
// דף "תזרים קמפיין" - השילוב הסופי בין הוצאות לתרומות
import { requireTenantUser } from '@/lib/auth-helpers';
import { getCashflowSummary } from '@/lib/cashflow-service';
import { CashflowKPIs } from '@/components/reports/cashflow-kpis';
import { CashflowChart } from '@/components/reports/cashflow-chart';
import { CampaignRoasTable } from '@/components/reports/campaign-roas-table';
import { CashflowTable } from '@/components/reports/cashflow-table';
import { InsightsPanel } from '@/components/reports/insights-panel';
import { ShareReportButton } from '@/components/reports/share-report-button';
import { DateRangePicker } from '@/components/shared/date-range-picker';

export const metadata = { title: 'תזרים קמפיין | פרו דיגיטל' };

export default async function ReportsPage({
  searchParams,
}: PageProps<'/admin/reports'>) {
  const { tenant } = await requireTenantUser();

  const params = await searchParams;
  const days = parseInt(
    typeof params?.range === 'string' ? params.range : '30',
    10
  );

  const summary = await getCashflowSummary(tenant.id, days);

  if (!summary) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">📊 תזרים קמפיין</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <p className="text-yellow-800">
            כדי לראות תזרים קמפיין, יש להגדיר חשבון פרסום Meta ולחבר Gmail.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">📊 תזרים קמפיין</h1>
          <p className="text-sm text-gray-500 mt-1">
            השוואה בין הוצאות שיווק לתרומות בפועל
          </p>
        </div>
        <div className="flex gap-2">
          <ShareReportButton />
          <DateRangePicker currentRange={days} />
        </div>
      </div>

      {/* Insights Panel - תובנות אוטומטיות */}
      {summary.insights.length > 0 && (
        <InsightsPanel insights={summary.insights} />
      )}

      {/* KPIs - הוצאה / הכנסה / רווח / ROAS */}
      <CashflowKPIs summary={summary} />

      {/* גרף עיקרי */}
      <CashflowChart data={summary.daily} />

      {/* טבלת קמפיינים */}
      <CampaignRoasTable campaigns={summary.byCampaign} />

      {/* טבלת תזרים יומי */}
      <CashflowTable daily={summary.daily} />
    </div>
  );
}
