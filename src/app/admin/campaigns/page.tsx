// app/admin/campaigns/page.tsx
import Link from "next/link";
import { Target, Settings, Eye, MousePointer, TrendingUp, Users } from "lucide-react";
import { requireTenantUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getCampaigns } from "@/lib/meta-api";
import { parseDateRange, formatISODate } from "@/lib/date-range";
import { metaCampaignMatchesKeyword } from "@/lib/donations-service";
import { CampaignsTable } from "@/components/campaigns/campaigns-table";
import { SetupRequired } from "@/components/campaigns/setup-required";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { ErrorState } from "@/components/shared/error-state";
import type { CampaignSummary } from "@/lib/feature-types";

export const metadata = { title: "קמפיינים | פרו דיגיטל" };

export default async function CampaignsPage({
  searchParams,
}: PageProps<"/admin/campaigns">) {
  const { tenant } = await requireTenantUser();

  const params = await searchParams;
  const range = parseDateRange({
    from: typeof params?.from === "string" ? params.from : undefined,
    to: typeof params?.to === "string" ? params.to : undefined,
    range: typeof params?.range === "string" ? params.range : undefined,
  });
  const days = range.days;
  const dateRange = {
    since: formatISODate(range.since),
    until: formatISODate(range.until),
  };

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          <Target className="size-3" />
          פרסום
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          קמפיינים
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          רק קמפיינים מ-Meta ששמם תואם לקמפיין שהוגדר ב-{" "}
          <Link
            href="/admin/settings/donations"
            className="text-emerald-700 underline-offset-2 hover:underline"
          >
            הגדרות תרומות
          </Link>{" "}
          מופיעים כאן.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/settings/donations"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Settings className="size-4" />
          ניהול קמפיינים
        </Link>
        <DateRangePicker currentRange={days} />
      </div>
    </div>
  );

  if (!tenant.metaAdAccountId) {
    return (
      <div className="space-y-8">
        {header}
        <SetupRequired tenantName={tenant.name} />
      </div>
    );
  }

  const keywords = await prisma.donationKeyword.findMany({
    where: { tenantId: tenant.id, isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, campaignName: true, keyword: true, color: true },
  });

  let allCampaigns: CampaignSummary[] | undefined;
  let error: string | null = null;

  try {
    allCampaigns = await getCampaigns(tenant.metaAdAccountId, dateRange);
  } catch (e) {
    error = e instanceof Error ? e.message : "שגיאה בטעינת נתונים";
  }

  if (error || !allCampaigns) {
    return (
      <div className="space-y-8">
        {header}
        <ErrorState error={error || "שגיאה לא ידועה"} />
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="space-y-8">
        {header}
        <div className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            לא הוגדרו עדיין קמפיינים לעקיבה
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            הגדר קמפיינים בעמוד הגדרות התרומות. כל קמפיין שתוסיף ב-Meta ושמו
            יכיל את הטקסט שתגדיר — יופיע כאן עם הנתונים שלו.
          </p>
          <Link
            href="/admin/settings/donations"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/40"
          >
            <Settings className="size-4" />
            הגדר קמפיינים
          </Link>
        </div>
      </div>
    );
  }

  // קבץ Meta campaigns לפי keyword
  const groups = keywords.map((kw) => {
    // ההתאמה מתבססת קודם על מילת המפתח (למשל "מטרנה") שמופיעה בשם קמפיין המודעות,
    // ובנוסף על שם הקמפיין המלא — כך "קמפיין מטרנה מכירות" יתחבר לקמפיין "מטרנה".
    const linked = allCampaigns!.filter(
      (c) =>
        metaCampaignMatchesKeyword(c.name, kw.keyword) ||
        metaCampaignMatchesKeyword(c.name, kw.campaignName)
    );
    const spend = linked.reduce((s, c) => s + c.spend, 0);
    const clicks = linked.reduce((s, c) => s + c.clicks, 0);
    const impressions = linked.reduce((s, c) => s + c.impressions, 0);
    const leads = linked.reduce((s, c) => s + c.leads, 0);
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    return { keyword: kw, linked, spend, clicks, impressions, leads, ctr, cpc };
  });

  const totalLinkedCount = groups.reduce((n, g) => n + g.linked.length, 0);

  if (totalLinkedCount === 0) {
    return (
      <div className="space-y-8">
        {header}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            לא נמצאו קמפיינים תואמים ב-Meta
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            יש {keywords.length} קמפיינים מוגדרים בהגדרות, אבל אף קמפיין ב-Meta
            לא מכיל בשמו את אחד מהשמות הבאים:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <span
                key={k.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: k.color }}
                />
                {k.campaignName}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            ב-Meta יש {allCampaigns.length} קמפיינים בסך הכל בחשבון. שנה את שם
            הקמפיין ב-Meta כך שיכיל אחד מהשמות שלמעלה, או עדכן את שם הקמפיין
            בהגדרות התרומות שיתאים.
          </p>
        </div>
      </div>
    );
  }

  // סה"כ אגרגציה לכל הקבוצות
  const totalSpend = groups.reduce((s, g) => s + g.spend, 0);
  const totalClicks = groups.reduce((s, g) => s + g.clicks, 0);
  const totalImpressions = groups.reduce((s, g) => s + g.impressions, 0);
  const totalLeads = groups.reduce((s, g) => s + g.leads, 0);

  return (
    <div className="space-y-8">
      {header}

      {/* badge על מספר הקמפיינים שמוצגים */}
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        מציג {totalLinkedCount} קמפיינים מקושרים מתוך {allCampaigns.length}{" "}
        בחשבון, ב-{groups.filter((g) => g.linked.length > 0).length} קבוצות
      </div>

      {/* סיכום כללי */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
            סך הכל — כל הקמפיינים המקושרים
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryStat
            icon={TrendingUp}
            label="הוצאה"
            value={`₪ ${formatNumber(totalSpend)}`}
            tone="emerald"
          />
          <SummaryStat
            icon={Eye}
            label="חשיפות"
            value={formatNumber(totalImpressions)}
            tone="violet"
          />
          <SummaryStat
            icon={MousePointer}
            label="קליקים"
            value={formatNumber(totalClicks)}
            tone="emerald"
          />
          <SummaryStat
            icon={Users}
            label="לידים"
            value={formatNumber(totalLeads)}
            tone="amber"
          />
        </div>
      </div>

      {/* קבוצה לכל keyword */}
      <div className="space-y-6">
        {groups.map((group) => (
          <CampaignGroup key={group.keyword.id} {...group} />
        ))}
      </div>
    </div>
  );
}

/* ====================== Sub-components ====================== */

function CampaignGroup({
  keyword,
  linked,
  spend,
  clicks,
  impressions,
  leads,
  ctr,
  cpc,
}: {
  keyword: { id: string; campaignName: string; keyword: string; color: string };
  linked: CampaignSummary[];
  spend: number;
  clicks: number;
  impressions: number;
  leads: number;
  ctr: number;
  cpc: number;
}) {
  const cpl = leads > 0 ? spend / leads : 0;

  if (linked.length === 0) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <div
          className="h-1 w-full"
          style={{ backgroundColor: keyword.color }}
        />
        <div className="flex items-start justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <div
              className="size-10 shrink-0 rounded-2xl shadow-sm"
              style={{ backgroundColor: keyword.color }}
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {keyword.campaignName}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                לא נמצאו קמפיינים תואמים ב-Meta
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
      <div
        className="h-1 w-full"
        style={{ backgroundColor: keyword.color }}
      />
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="size-10 shrink-0 rounded-2xl shadow-sm"
              style={{ backgroundColor: keyword.color }}
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {keyword.campaignName}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {linked.length} {linked.length === 1 ? "קמפיין" : "קמפיינים"} מ-Meta
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          <MiniStat label="הוצאה" value={`₪${formatNumber(spend)}`} />
          <MiniStat label="חשיפות" value={formatNumber(impressions)} />
          <MiniStat label="קליקים" value={formatNumber(clicks)} />
          <MiniStat label="CTR" value={`${ctr.toFixed(2)}%`} />
          <MiniStat
            label={leads > 0 ? "מחיר לליד" : "CPC"}
            value={leads > 0 ? `₪${cpl.toFixed(2)}` : `₪${cpc.toFixed(2)}`}
          />
        </div>
      </div>

      <CampaignsTable campaigns={linked} />
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "emerald" | "violet" | "amber";
}) {
  const tones = {
    emerald: "bg-gradient-to-br from-emerald-400 to-teal-500",
    violet: "bg-gradient-to-br from-violet-400 to-purple-500",
    amber: "bg-gradient-to-br from-amber-400 to-orange-500",
  };
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-9 items-center justify-center rounded-xl shadow-sm ${tones[tone]}`}
        >
          <Icon className="size-4 text-white" />
        </div>
        <div className="text-xs font-medium text-slate-500">{label}</div>
      </div>
      <div className="mt-3 text-2xl font-black tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 px-3 py-2.5">
      <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-0.5 text-base font-bold text-slate-900">{value}</div>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1000) return n.toLocaleString("he-IL", { maximumFractionDigits: 0 });
  return n.toFixed(n < 10 ? 2 : 0);
}
