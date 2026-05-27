// app/admin/settings/donations/page.tsx
// הגדרות מערכת התרומות - חיבור Gmail וניהול מילות מפתח

import { requireTenantUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/db';
import { GmailConnectionCard } from '@/components/donations/gmail-connection-card';
import { KeywordsManager } from '@/components/donations/keywords-manager';
import { ConnectionStatus } from '@/components/donations/connection-status';
import { Settings2 } from 'lucide-react';

export const metadata = { title: 'הגדרות תרומות | פרו דיגיטל' };

export default async function DonationsSettingsPage({
  searchParams,
}: PageProps<'/admin/settings/donations'>) {
  const { tenant } = await requireTenantUser();

  const params = await searchParams;
  const successParam =
    typeof params?.success === 'string' ? params.success : undefined;
  const errorParam =
    typeof params?.error === 'string' ? params.error : undefined;

  const [connection, keywords] = await Promise.all([
    prisma.gmailConnection.findUnique({
      where: { tenantId: tenant.id },
    }),
    prisma.donationKeyword.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          <Settings2 className="size-3" />
          הגדרות
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          הגדרות תרומות
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          חבר את חשבון ה-Gmail של העמותה והגדר מילות מפתח לזיהוי קמפיינים אוטומטי.
        </p>
      </div>

      {/* הודעות מ-OAuth flow */}
      {successParam && (
        <ConnectionStatus type="success" message="Gmail חובר בהצלחה!" />
      )}
      {errorParam && (
        <ConnectionStatus
          type="error"
          message={`שגיאה: ${decodeURIComponent(errorParam)}`}
        />
      )}

      {/* חיבור Gmail */}
      <GmailConnectionCard connection={connection} />

      {/* ניהול מילות מפתח */}
      {connection && (
        <KeywordsManager tenantId={tenant.id} keywords={keywords} />
      )}
    </div>
  );
}
