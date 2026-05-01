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
import {
  updateClarityCode,
  updateFacebookPixel,
} from "@/app/admin/settings/actions";

type Props = {
  initialPixelCode: string;
  initialClarityCode: string;
  tenantSlug: string;
};

const FB_PLACEHOLDER = `<!-- Meta Pixel Code -->
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

const CLARITY_PLACEHOLDER = `<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "abc123def4");
</script>`;

export function SettingsForm({
  initialPixelCode,
  initialClarityCode,
  tenantSlug,
}: Props) {
  return (
    <div className="grid gap-6">
      {/* ===== Facebook Pixel ===== */}
      <PixelSection
        title="פיקסל פייסבוק"
        subtitle="עקוב אחרי גולשים, יצירת קמפיינים מפולחים וקהלי דמות (Lookalike)."
        labelText="קוד הפיקסל"
        helpText='הדבק את הקוד המלא מ-Meta Events Manager (כולל <script> ו-<noscript>). לחילופין: הזן רק Pixel ID של 15-16 ספרות.'
        helpUrl="https://www.facebook.com/business/help/952192354843755"
        helpLinkText="איפה מוצאים את קוד הפיקסל?"
        infoText="הקוד יוטמע אוטומטית בדף הציבורי שלך. נתונים יופיעו ב-Meta Events Manager תוך מספר דקות."
        placeholder={FB_PLACEHOLDER}
        initialCode={initialPixelCode}
        save={(code) => updateFacebookPixel(code)}
        detectId={(c) => {
          const m = c.match(/fbq\(['"]init['"],\s*['"](\d+)['"]/);
          return m?.[1] ?? null;
        }}
        brand={<FacebookIcon className="size-5" />}
        brandColor="#1877F2"
        tenantSlug={tenantSlug}
      />

      {/* ===== Microsoft Clarity ===== */}
      <PixelSection
        title="Microsoft Clarity"
        subtitle="הקלטות סשן, מפות חום, וניתוח התנהגות גולשים — חינמי מ-Microsoft."
        labelText="קוד Clarity"
        helpText="הדבק את הקוד המלא מ-clarity.microsoft.com → Settings → Setup. לחילופין: הזן רק את ה-Project ID."
        helpUrl="https://clarity.microsoft.com/"
        helpLinkText="איפה מוצאים את קוד Clarity?"
        infoText="לאחר התקנה, סשנים והתנהגות גולשים יופיעו ב-clarity.microsoft.com. תוכל לראות סרטוני הקלטה, מפות חום, וניתוח לחיצות בזמן אמת."
        placeholder={CLARITY_PLACEHOLDER}
        initialCode={initialClarityCode}
        save={(code) => updateClarityCode(code)}
        detectId={(c) => {
          const m = c.match(/['"]([a-z0-9]{8,16})['"]\s*\)\s*;?\s*$/);
          if (m) return m[1];
          if (/^[a-z0-9]{8,16}$/i.test(c.trim())) return c.trim();
          return null;
        }}
        brand={<ClarityIcon className="size-5" />}
        brandColor="#E81123"
        tenantSlug={tenantSlug}
      />
    </div>
  );
}

/* ============================================================
   PixelSection — קומפוננטה גנרית לכל אינטגרציה (FB, Clarity, ועוד)
   ============================================================ */

type SectionProps = {
  title: string;
  subtitle: string;
  labelText: string;
  helpText: string;
  helpUrl: string;
  helpLinkText: string;
  infoText: string;
  placeholder: string;
  initialCode: string;
  save: (code: string) => Promise<{ ok: true } | { ok: false; error?: string }>;
  detectId: (code: string) => string | null;
  brand: React.ReactNode;
  brandColor: string;
  tenantSlug: string;
};

function PixelSection({
  title,
  subtitle,
  labelText,
  helpText,
  helpUrl,
  helpLinkText,
  infoText,
  placeholder,
  initialCode,
  save,
  detectId,
  brand,
  brandColor,
  tenantSlug,
}: SectionProps) {
  const [code, setCode] = useState(initialCode);
  const [savedCode, setSavedCode] = useState(initialCode);
  const [isPending, startTransition] = useTransition();

  const isDirty = code.trim() !== savedCode.trim();
  const isConnected = savedCode.trim().length > 0;
  const detectedId = isConnected ? detectId(savedCode) : null;

  function handleSave() {
    startTransition(async () => {
      const result = await save(code);
      if (result.ok) {
        toast.success(code.trim() ? `${title} נשמר ופעיל` : `${title} הוסר`);
        setSavedCode(code.trim());
      } else {
        toast.error(("error" in result && result.error) || "שגיאה בשמירה");
      }
    });
  }

  function handleRemove() {
    if (!confirm(`להסיר את ${title} מהאתר?`)) return;
    setCode("");
    startTransition(async () => {
      const result = await save("");
      if (result.ok) {
        toast.success(`${title} הוסר`);
        setSavedCode("");
      } else {
        toast.error(("error" in result && result.error) || "שגיאה");
      }
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${brandColor}26`,
              color: brandColor,
            }}
          >
            {brand}
          </div>
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-0.5 text-sm text-white/55">{subtitle}</p>
          </div>
        </div>
        {isConnected && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <CheckCircleIcon className="size-3.5" />
            פעיל
            {detectedId && (
              <span className="font-mono text-[10px] opacity-75">
                · {detectedId}
              </span>
            )}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-2">
        <Label className="text-sm font-semibold text-white/85">
          {labelText}
        </Label>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
          rows={10}
          className="rounded-xl border-white/15 bg-zinc-950 font-mono text-[12px] leading-relaxed text-white placeholder:text-white/25 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30"
        />
        <p className="text-xs text-white/45">{helpText}</p>
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
            הסר
          </button>
        )}
        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-white/60 hover:text-[#C9A24A]"
        >
          {helpLinkText}
          <ExternalLinkIcon className="size-3" />
        </a>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.04] p-4">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-blue-300" />
        <div className="text-xs leading-relaxed text-white/70">
          <div className="font-bold text-white/90">איך זה עובד</div>
          <p className="mt-1">
            {infoText}{" "}
            <a
              href={`/sites/${tenantSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A24A] hover:underline"
            >
              צפה בדף הציבורי שלך
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============== Inline brand icons ============== */
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.48 17.52 2 12 2S2 6.48 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.8 8.43-4.94 8.43-9.94z" />
    </svg>
  );
}

function ClarityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4.5V2.5M12 21.5V19.5M19.5 12H21.5M2.5 12H4.5M17.66 6.34l1.41-1.41M4.93 19.07l1.41-1.41M17.66 17.66l1.41 1.41M4.93 4.93l1.41 1.41" />
    </svg>
  );
}
