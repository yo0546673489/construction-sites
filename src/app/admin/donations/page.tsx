// app/admin/donations/page.tsx
import { requireTenantUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/db';
import { parseDateRange } from '@/lib/date-range';
import {
  getDonationSummary,
  getDonationSummaryByKeyword,
  type KeywordDonationSummary,
} from '@/lib/donations-service';
import { DonationKPIs } from '@/components/donations/donation-kpis';
import { DonationsByDayChart } from '@/components/donations/donations-by-day-chart';
import { RecentDonations } from '@/components/donations/recent-donations';
import { GmailNotConnected } from '@/components/donations/gmail-not-connected';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import { SyncButton } from '@/components/donations/sync-button';
import Link from 'next/link';
import {
  Settings,
  HeartHandshake,
  AlertTriangle,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react';

export const metadata = { title: 'תרומות | פרו דיגיטל' };

export default async function DonationsPage({
  searchParams,
}: PageProps<'/admin/donations'>) {
  const { tenant } = await requireTenantUser();

  const params = await searchParams;
  const dateRange = parseDateRange({
    from: typeof params?.from === 'string' ? params.from : undefined,
    to: typeof params?.to === 'string' ? params.to : undefined,
    range: typeof params?.range === 'string' ? params.range : undefined,
  });
  const days = dateRange.days;

  const gmailConnection = await prisma.gmailConnection.findUnique({
    where: { tenantId: tenant.id },
    select: {
      email: true,
      lastSyncAt: true,
      syncEnabled: true,
      lastSyncError: true,
    },
  });

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          <HeartHandshake className="size-3" />
          תרומות
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          תרומות
        </h1>
        {gmailConnection?.syncEnabled && (
          <p className="mt-2 text-sm text-slate-500">
            מחובר ל-
            <span className="font-semibold text-slate-700">
              {gmailConnection.email}
            </span>
            {gmailConnection.lastSyncAt && (
              <span className="ms-2 inline-flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-emerald-500" />
                סנכרון אחרון: {formatRelativeTime(gmailConnection.lastSyncAt)}
              </span>
            )}
          </p>
        )}
      </div>
      <Link
        href="/admin/settings/donations"
        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md hover:shadow-emerald-500/10"
      >
        <Settings className="size-4" />
        הגדרות תרומות
      </Link>
    </div>
  );

  if (!gmailConnection || !gmailConnection.syncEnabled) {
    return (
      <div className="space-y-8">
        {header}
        <GmailNotConnected error={gmailConnection?.lastSyncError} />
      </div>
    );
  }

  const keywordsCount = await prisma.donationKeyword.count({
    where: { tenantId: tenant.id, isActive: true },
  });

  if (keywordsCount === 0) {
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
                עדיין לא הוגדרו מילות מפתח
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                כדי לעקוב אחר תרומות, צריך להגדיר מילות מפתח שיופיעו במיילים של
                הקמפיין (כמו &quot;פרויקט 36&quot;). המערכת תחפש את המיילים האלה
                ב-Gmail ותחלץ את פרטי התרומות אוטומטית.
              </p>
              <Link
                href="/admin/settings/donations"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/40"
              >
                <Settings className="size-4" />
                הגדר מילות מפתח
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [summary, byKeyword] = await Promise.all([
    getDonationSummary(tenant.id, { since: dateRange.since, until: dateRange.until }),
    getDonationSummaryByKeyword(tenant.id, { since: dateRange.since, until: dateRange.until }),
  ]);

  return (
    <div className="space-y-8">
      {header}

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <SyncButton daysBack={days} />
        <DateRangePicker currentRange={days} />
      </div>

      {/* Overall KPIs */}
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
          סך הכל — כל הקמפיינים
        </h2>
        <DonationKPIs summary={summary} />
      </div>

      {/* Per-keyword sections */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
            פירוט לפי קמפיין
          </h2>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            {byKeyword.length}
          </span>
        </div>
        {byKeyword.map((k) => (
          <KeywordSection key={k.keyword.id} data={k} />
        ))}
      </div>
    </div>
  );
}

/* ====================== KeywordSection ====================== */

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n);

const formatNumber = (n: number) => new Intl.NumberFormat('he-IL').format(n);

function KeywordSection({ data }: { data: KeywordDonationSummary }) {
  const { keyword } = data;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
      {/* Color stripe */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: keyword.color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-2xl text-white shadow-md"
            style={{ backgroundColor: keyword.color }}
          >
            <HeartHandshake className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              {keyword.campaignName}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="text-slate-400">מילת מפתח:</span>
              <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">
                {keyword.keyword}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 gap-3 border-b border-slate-100 p-6 md:grid-cols-4">
        <MiniKpi
          icon={TrendingUp}
          label='סה"כ'
          value={formatCurrency(data.totalAmount)}
          color={keyword.color}
        />
        <MiniKpi
          icon={HeartHandshake}
          label="תרומות"
          value={formatNumber(data.totalCount)}
          color={keyword.color}
        />
        <MiniKpi
          icon={BarChart3}
          label="ממוצע"
          value={formatCurrency(data.averageAmount)}
          color={keyword.color}
        />
        <MiniKpi
          icon={Users}
          label="תורמים"
          value={formatNumber(data.uniqueDonors)}
          color={keyword.color}
        />
      </div>

      {/* Chart + Recent grid */}
      {data.totalCount === 0 ? (
        <div className="p-12 text-center text-sm text-slate-400">
          אין תרומות לקמפיין זה בטווח שנבחר
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          {/* Chart — takes 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-bold tracking-tight text-slate-700">
              תרומות יומיות
            </h4>
            <DonationsByDayChart
              data={data.dailyData}
              color={keyword.color}
              compact
              height={220}
            />
          </div>

          {/* Recent donations list — 1 col */}
          <div>
            <h4 className="mb-3 text-sm font-bold tracking-tight text-slate-700">
              5 תרומות אחרונות
            </h4>
            <ul className="space-y-2">
              {data.recentDonations.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/40 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {d.donorName || (
                        <span className="font-normal text-slate-400">
                          לא ידוע
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(d.emailDate).toLocaleDateString('he-IL', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </div>
                  </div>
                  <div
                    className="text-base font-bold"
                    style={{ color: keyword.color }}
                  >
                    {formatCurrency(d.amount)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniKpi({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/40 p-3">
      <div className="flex items-center gap-2">
        <div
          className="flex size-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: color + '20', color }}
        >
          <Icon className="size-3.5" />
        </div>
        <div className="text-[11px] font-medium text-slate-500">{label}</div>
      </div>
      <div className="mt-1.5 text-lg font-black tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'הרגע';
  if (minutes < 60) return `לפני ${minutes} דקות`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שעות`;

  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}
