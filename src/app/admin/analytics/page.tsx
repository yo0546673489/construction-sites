import Link from "next/link";
import { ExternalLinkIcon, KeyIcon, BarChart3Icon } from "lucide-react";
import { requireTenantUser } from "@/lib/auth-helpers";
import { fetchClarityInsights, summarizeInsights } from "@/lib/clarity-api";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export const metadata = { title: "אנליטיקות — דשבורד" };

// יוצא revalidate=3600 כדי שגם ל-Next.js fetch cache + RSC cache יחפיפו
export const revalidate = 3600;

export default async function AnalyticsPage({
  searchParams,
}: PageProps<"/admin/analytics">) {
  const { tenant } = await requireTenantUser();
  const params = await searchParams;
  const days = (() => {
    const v = Number(params?.days ?? 1);
    return v === 2 || v === 3 ? (v as 2 | 3) : 1;
  })();

  /* ============ אם אין token — מסך הסבר ============ */
  if (!tenant.clarityApiToken) {
    return <NoTokenView />;
  }

  /* ============ קוראים ל-API ============ */
  const result = await fetchClarityInsights(tenant.clarityApiToken, days);

  if (!result.ok) {
    return <ErrorView error={result.error} />;
  }

  const summary = summarizeInsights(result.data);
  const hasData = summary.totalSessions > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            ניתוח התנהגות
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
            אנליטיקות
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            נתונים חיים מ-Microsoft Clarity. מתעדכן כל שעה.
          </p>
        </div>
        <a
          href="https://clarity.microsoft.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-600"
        >
          פתח Clarity Dashboard
          <ExternalLinkIcon className="size-3" />
        </a>
      </div>

      {/* Range selector */}
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
        {([1, 2, 3] as const).map((d) => (
          <Link
            key={d}
            href={`/admin/analytics?days=${d}`}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              days === d
                ? "bg-emerald-500 text-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {d === 1 ? "יום אחד" : `${d} ימים`}
          </Link>
        ))}
      </div>

      {!hasData ? (
        <EmptyDataView slug={tenant.slug} />
      ) : (
        <AnalyticsDashboard summary={summary} />
      )}
    </div>
  );
}

/* ============================================================
   Sub-views
   ============================================================ */

function NoTokenView() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
          ניתוח התנהגות
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
          אנליטיקות
        </h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-700">
          <KeyIcon className="size-6" />
        </div>
        <h2 className="mt-5 text-xl font-bold">צריך לחבר API token</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
          כדי להציג נתונים חיים בדשבורד, נדרש Clarity API token. הוא יוצר
          ב-clarity.microsoft.com → Settings → Data Export → Generate new API
          token.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-white"
          >
            <KeyIcon className="size-4" />
            עבור להגדרות
          </Link>
          <a
            href="https://clarity.microsoft.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-600"
          >
            פתח Clarity
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorView({ error }: { error: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">אנליטיקות</h1>
      <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-6">
        <div className="font-bold text-red-700">שגיאה בקריאה ל-Clarity API</div>
        <div className="mt-2 text-sm text-slate-700">{error}</div>
        <Link
          href="/admin/settings"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline"
        >
          לבדיקת ה-API token →
        </Link>
      </div>
    </div>
  );
}

function EmptyDataView({ slug }: { slug: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <BarChart3Icon className="size-6" />
      </div>
      <h2 className="mt-5 text-lg font-bold">אין עדיין נתונים</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        אם רק עכשיו התקנת את Clarity — ייקח ל-Microsoft כשעה לאסוף ולעבד
        סשנים. וודא שהסקריפט מותקן בדף הציבורי שלך.
      </p>
      <Link
        href={`/sites/${slug}`}
        target="_blank"
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
      >
        פתח דף ציבורי לבדיקה
        <ExternalLinkIcon className="size-3" />
      </Link>
    </div>
  );
}
