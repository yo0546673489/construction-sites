"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  CheckCircleIcon,
  ExternalLinkIcon,
  InfoIcon,
  SaveIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateFacebookPixel } from "@/app/admin/settings/actions";

type Props = {
  initialPixelCode: string;
  tenantSlug: string;
};

const PLACEHOLDER = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
...
fbq('init', '1234567890123456');
fbq('track', 'PageView');
</script>
<noscript>...</noscript>
<!-- End Meta Pixel Code -->`;

export function SettingsForm({ initialPixelCode, tenantSlug }: Props) {
  const [code, setCode] = useState(initialPixelCode);
  const [savedCode, setSavedCode] = useState(initialPixelCode);
  const [isPending, startTransition] = useTransition();

  const isDirty = code.trim() !== savedCode.trim();
  const isConnected = savedCode.trim().length > 0;

  /** ניסיון לחלץ את ה-Pixel ID מהקוד לתצוגה בלבד */
  const detectedPixelId = (() => {
    const m = savedCode.match(/fbq\(['"]init['"],\s*['"](\d+)['"]/);
    return m?.[1] ?? null;
  })();

  function handleSave() {
    startTransition(async () => {
      const result = await updateFacebookPixel(code);
      if (result.ok) {
        toast.success(code.trim() ? "הפיקסל נשמר ופעיל" : "הפיקסל הוסר");
        setSavedCode(code.trim());
      } else {
        toast.error(result.error ?? "שגיאה בשמירה");
      }
    });
  }

  function handleRemove() {
    if (!confirm("להסיר את פיקסל הפייסבוק מהאתר?")) return;
    setCode("");
    startTransition(async () => {
      const result = await updateFacebookPixel("");
      if (result.ok) {
        toast.success("הפיקסל הוסר");
        setSavedCode("");
      } else {
        toast.error(result.error ?? "שגיאה");
      }
    });
  }

  return (
    <div className="grid gap-6">
      {/* ============ Facebook Pixel ============ */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1877F2]/15 text-[#5b8ef2]">
              <FacebookIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">פיקסל פייסבוק</h2>
              <p className="mt-0.5 text-sm text-white/55">
                הדבק את קוד הפיקסל המלא כפי שפייסבוק נותן ב-Events Manager.
              </p>
            </div>
          </div>
          {isConnected && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
              <CheckCircleIcon className="size-3.5" />
              פעיל
              {detectedPixelId && (
                <span className="font-mono text-[10px] opacity-75">
                  · {detectedPixelId}
                </span>
              )}
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-2">
          <Label className="text-sm font-semibold text-white/85">
            קוד הפיקסל
          </Label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={PLACEHOLDER}
            dir="ltr"
            rows={12}
            className="rounded-xl border-white/15 bg-zinc-950 font-mono text-[12px] leading-relaxed text-white placeholder:text-white/25 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30"
          />
          <p className="text-xs text-white/45">
            הדבק את הקוד המלא (כולל
            <code className="mx-1 rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">
              &lt;script&gt;
            </code>
            ו-
            <code className="mx-1 rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">
              &lt;noscript&gt;
            </code>
            ). לחילופין — ניתן להזין רק את ה-Pixel ID (מספר 15-16 ספרות) ונארוז את הקוד אוטומטית.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isPending || !isDirty}
            className="h-10 rounded-xl bg-[#C9A24A] px-5 text-sm font-bold text-black hover:bg-white disabled:opacity-50"
          >
            <SaveIcon className="size-4" />
            {isPending ? "שומר..." : "שמור"}
          </Button>
          {isConnected && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="h-10 rounded-xl border border-red-500/30 bg-red-500/5 px-4 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              הסר פיקסל
            </button>
          )}
          <a
            href="https://www.facebook.com/business/help/952192354843755"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-white/60 hover:text-[#C9A24A]"
          >
            איפה מוצאים את קוד הפיקסל?
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>

        {/* הודעת מידע */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.04] p-4">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-blue-300" />
          <div className="text-xs leading-relaxed text-white/70">
            <div className="font-bold text-white/90">איך זה עובד</div>
            <p className="mt-1">
              לאחר שמירה — הקוד יוטמע באופן אוטומטי בדף הציבורי שלך (
              <a
                href={`/sites/${tenantSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A24A] hover:underline"
              >
                /sites/{tenantSlug}
              </a>
              ). הסקריפט יתחיל לעקוב אחרי PageView ופעולות נוספות שהגדרת. נתונים
              יופיעו ב-Meta Events Manager תוך מספר דקות.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============== Inline Facebook brand icon ============== */
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.48 17.52 2 12 2S2 6.48 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.8 8.43-4.94 8.43-9.94z" />
    </svg>
  );
}
