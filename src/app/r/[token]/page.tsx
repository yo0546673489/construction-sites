// app/r/[token]/page.tsx
// דוח ציבורי לצפייה בלבד - שולחים את הקישור ללקוח
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCashflowSummary } from '@/lib/cashflow-service';
import { PublicReportView } from '@/components/reports/public-report-view';
import { PasswordPrompt } from '@/components/reports/password-prompt';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // cache 5 דקות

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ pwd?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  const report = await prisma.shareableReport.findUnique({
    where: { token },
    select: { title: true, tenant: { select: { name: true } } },
  });

  if (!report) return { title: 'דוח לא נמצא' };

  return {
    title: `${report.title} | ${report.tenant.name}`,
    robots: { index: false, follow: false }, // אל תאנדקס דוחות פרטיים
  };
}

export default async function PublicReportPage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { pwd } = await searchParams;

  const report = await prisma.shareableReport.findUnique({
    where: { token },
    include: {
      tenant: {
        select: { name: true, id: true },
      },
    },
  });

  if (!report || !report.isActive) {
    notFound();
  }

  // בדיקת תאריך תפוגה
  if (report.expiresAt && report.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">⏰ הדוח פג תוקף</h1>
          <p className="text-gray-600">
            הקישור לדוח זה כבר לא פעיל. צור קשר עם השולח לקבלת קישור חדש.
          </p>
        </div>
      </div>
    );
  }

  // בדיקת סיסמה
  if (report.password && report.password !== pwd) {
    return <PasswordPrompt token={token} hasError={pwd !== undefined} />;
  }

  // עדכן את מספר הצפיות
  await prisma.shareableReport.update({
    where: { id: report.id },
    data: {
      viewCount: { increment: 1 },
      lastViewedAt: new Date(),
    },
  });

  // שלוף את הנתונים
  const summary = await getCashflowSummary(report.tenant.id, report.dateRangeDays);

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-gray-500">לא נמצאו נתונים להצגה</div>
      </div>
    );
  }

  return (
    <PublicReportView
      report={{
        title: report.title,
        tenantName: report.tenant.name,
        showSpend: report.showSpend,
        showDonations: report.showDonations,
        showRoas: report.showRoas,
        showCampaigns: report.showCampaigns,
        dateRangeDays: report.dateRangeDays,
      }}
      summary={summary}
    />
  );
}
