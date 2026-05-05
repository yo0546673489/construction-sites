// app/admin/campaigns/page.tsx
import { requireTenantUser } from "@/lib/auth-helpers";
import {
  getCampaigns,
  getAccountSummary,
  getDateRange,
} from "@/lib/meta-api";
import { KPICards } from "@/components/campaigns/kpi-cards";
import { SpendChart } from "@/components/campaigns/spend-chart";
import { CampaignsTable } from "@/components/campaigns/campaigns-table";
import { SetupRequired } from "@/components/campaigns/setup-required";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { ErrorState } from "@/components/shared/error-state";
import type {
  CampaignSummary,
  AccountSummary,
} from "@/lib/feature-types";

export const metadata = { title: "קמפיינים | פרו דיגיטל" };

export default async function CampaignsPage({
  searchParams,
}: PageProps<"/admin/campaigns">) {
  const { tenant } = await requireTenantUser();

  const params = await searchParams;
  const days = parseInt(
    typeof params?.range === "string" ? params.range : "30",
    10
  );
  const dateRange = getDateRange(days);

  if (!tenant.metaAdAccountId) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">🎯 קמפיינים</h1>
        <SetupRequired tenantName={tenant.name} />
      </div>
    );
  }

  let campaigns: CampaignSummary[] | undefined;
  let summary: AccountSummary | undefined;
  let error: string | null = null;

  try {
    [campaigns, summary] = await Promise.all([
      getCampaigns(tenant.metaAdAccountId, dateRange),
      getAccountSummary(tenant.metaAdAccountId, dateRange),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "שגיאה בטעינת נתונים";
  }

  if (error || !campaigns || !summary) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">🎯 קמפיינים</h1>
        <ErrorState error={error || "שגיאה לא ידועה"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">🎯 קמפיינים</h1>
          {tenant.metaAdAccountName && (
            <p className="text-sm text-white/55 mt-1">
              חשבון: {tenant.metaAdAccountName}
            </p>
          )}
        </div>
        <DateRangePicker currentRange={days} />
      </div>

      <KPICards summary={summary} />
      <SpendChart data={summary.dailyData} />
      <CampaignsTable campaigns={campaigns} />
    </div>
  );
}
