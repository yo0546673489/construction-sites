// app/admin/settings/donations/page.tsx
// הגדרות מערכת התרומות - חיבור Gmail וניהול מילות מפתח

import { requireTenantUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/db';
import { GmailConnectionCard } from '@/components/donations/gmail-connection-card';
import { KeywordsManager } from '@/components/donations/keywords-manager';
import { ConnectionStatus } from '@/components/donations/connection-status';

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
    <div className="container mx-auto p-6 space-y-6 max-w-4xl" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold">⚙️ הגדרות תרומות</h1>
        <p className="text-white/55 mt-1">
          חבר את חשבון ה-Gmail של העמותה והגדר מילות מפתח לזיהוי קמפיינים
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
        <KeywordsManager
          tenantId={tenant.id}
          keywords={keywords}
          hasMetaAccount={!!tenant.metaAdAccountId}
        />
      )}
    </div>
  );
}
