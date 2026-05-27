// app/admin/reports/page.tsx
// דף "תזרים קמפיין" - השילוב הסופי בין הוצאות לתרומות
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { requireTenantUser } from '@/lib/auth-helpers';
import { parseDateRange } from '@/lib/date-range';
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
  const range = parseDateRange({
    from: typeof params?.from === 'string' ? params.from : undefined,
    to: typeof params?.to === 'string' ? params.to : undefined,
    range: typeof params?.range === 'string' ? params.range : undefined,
  });
  const days = range.days;

  const summary = await getCashflowSummary(tenant.id, {
    since: range.since,
    until: range.until,
  });

  // Header — common to all states
  const header = (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          <TrendingUp className="size-3" />
          תזרים
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          תזרים קמפיין
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          השוואה בין הוצאות שיווק לתרומות בפועל — נתונים מסונכרנים מ-Meta ו-Gmail.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ShareReportButton />
        <DateRangePicker currentRange={days} />
      </div>
    </div>
  );

  if (!summary) {
    return (
      <div className="space-y-8">
        {header}
        <div className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
              <AlertTriangle className="size-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                לא ניתן לחשב תזרים קמפיין
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                כדי לראות תזרים קמפיין, יש להגדיר חשבון פרסום Meta ולחבר Gmail.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {header}

      {/* KPIs - הוצאה / הכנסה / רווח / ROAS */}
      <CashflowKPIs summary={summary} />

      {/* גרף עיקרי */}
      <CashflowChart data={summary.daily} />

      {/* טבלת קמפיינים */}
      <CampaignRoasTable campaigns={summary.byCampaign} />

      {/* טבלת תזרים יומי */}
      <CashflowTable daily={summary.daily} />

      {/* Insights Panel - תובנות אוטומטיות בתחתית הדף */}
      {summary.insights.length > 0 && (
        <InsightsPanel insights={summary.insights} />
      )}
    </div>
  );
}
