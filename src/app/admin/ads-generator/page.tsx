import { requireTenantUser } from "@/lib/auth-helpers";
import { AdsGeneratorForm } from "@/components/admin/ads-generator-form";
import { SparklesIcon } from "lucide-react";

export const metadata = { title: "מחולל מודעות | פרו דיגיטל" };

export default async function AdsGeneratorPage() {
  await requireTenantUser();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">
          <SparklesIcon className="size-3" />
          AI
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          מחולל מודעות
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          הזן תיאור של העסק שלך וה-AI יצור תמונות פרסומיות מקצועיות עבורך
          דרך ChatGPT.
        </p>
      </div>

      {/* How it works */}
      <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-violet-50/60 via-white to-white p-5 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 mb-3">
          איך זה עובד?
        </div>
        <ol className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
              1
            </span>
            תאר את העסק שלך — סוג העסק, שירותים, קהל יעד
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
              2
            </span>
            בחר כמה תמונות תרצה (1–5)
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
              3
            </span>
            הכנס את ה-Cookies של ChatGPT (צריך חשבון ChatGPT פעיל)
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
              4
            </span>
            המערכת תתחבר ל-ChatGPT ותייצר את התמונות אוטומטית
          </li>
        </ol>
      </div>

      {/* Form */}
      <AdsGeneratorForm />
    </div>
  );
}
