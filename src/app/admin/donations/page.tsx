// app/admin/donations/page.tsx
import { requireTenantUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/db';
import { getDonationSummary } from '@/lib/donations-service';
import { DonationKPIs } from '@/components/donations/donation-kpis';
import { DonationsByDayChart } from '@/components/donations/donations-by-day-chart';
import { DonationsByCampaign } from '@/components/donations/donations-by-campaign';
import { RecentDonations } from '@/components/donations/recent-donations';
import { GmailNotConnected } from '@/components/donations/gmail-not-connected';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import { SyncButton } from '@/components/donations/sync-button';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export const metadata = { title: 'תרומות | פרו דיגיטל' };

export default async function DonationsPage({
  searchParams,
}: PageProps<'/admin/donations'>) {
  const { tenant } = await requireTenantUser();

  const params = await searchParams;
  const days = parseInt(
    typeof params?.range === 'string' ? params.range : '30',
    10
  );

  // בדיקה אם Gmail מחובר
  const gmailConnection = await prisma.gmailConnection.findUnique({
    where: { tenantId: tenant.id },
    select: {
      email: true,
      lastSyncAt: true,
      syncEnabled: true,
      lastSyncError: true,
    },
  });

  if (!gmailConnection || !gmailConnection.syncEnabled) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">💰 תרומות</h1>
        <GmailNotConnected error={gmailConnection?.lastSyncError} />
      </div>
    );
  }

  // בדיקה אם יש מילות מפתח
  const keywordsCount = await prisma.donationKeyword.count({
    where: { tenantId: tenant.id, isActive: true },
  });

  if (keywordsCount === 0) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir="rtl">
        <h1 className="text-3xl font-bold">💰 תרומות</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="font-bold text-yellow-900 mb-2">
            עדיין לא הוגדרו מילות מפתח
          </h2>
          <p className="text-yellow-800 mb-4">
            כדי לעקוב אחר תרומות, צריך להגדיר מילות מפתח שיופיעו במיילים של
            הקמפיין (כמו "פרויקט 36"). המערכת תחפש את המיילים האלה ב-Gmail
            ותחלץ את פרטי התרומות אוטומטית.
          </p>
          <Link
            href="/admin/settings/donations"
            className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            הגדר מילות מפתח
          </Link>
        </div>
      </div>
    );
  }

  const summary = await getDonationSummary(tenant.id, days);

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">💰 תרומות</h1>
          <p className="text-sm text-gray-500 mt-1">
            מחובר ל-{gmailConnection.email}
            {gmailConnection.lastSyncAt && (
              <span className="mx-2">
                • סנכרון אחרון: {formatRelativeTime(gmailConnection.lastSyncAt)}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <SyncButton />
          <DateRangePicker currentRange={days} />
        </div>
      </div>

      {/* KPIs */}
      <DonationKPIs summary={summary} />

      {/* Chart + Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonationsByDayChart data={summary.dailyData} />
        <DonationsByCampaign campaigns={summary.byCampaign} />
      </div>

      {/* Recent */}
      <RecentDonations donations={summary.recentDonations} />
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
