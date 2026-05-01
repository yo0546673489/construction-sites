import {
  ActivityIcon,
  AlertTriangleIcon,
  ChevronLeftIcon,
  ClockIcon,
  EyeIcon,
  GlobeIcon,
  MonitorIcon,
  MousePointerClickIcon,
  RefreshCwIcon,
  ScrollIcon,
  SmartphoneIcon,
  TrendingDownIcon,
  UsersIcon,
} from "lucide-react";
import type { ClaritySummary } from "@/lib/clarity-api";

type Props = {
  summary: ClaritySummary;
};

/**
 * Analytics Dashboard — מסכם ויזואלית את הנתונים מ-Clarity API.
 * Server Component (אין state, רק תצוגה).
 */
export function AnalyticsDashboard({ summary }: Props) {
  const engagementMin = Math.round(summary.engagementSeconds / 60);
  const botPct =
    summary.totalSessions > 0
      ? Math.round((summary.botSessions / summary.totalSessions) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* ============ KPI cards ============ */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={EyeIcon}
          label="סה״כ סשנים"
          value={summary.totalSessions.toLocaleString("he-IL")}
          tone="primary"
          hint={`${summary.botSessions} מהם בוטים (${botPct}%)`}
        />
        <KpiCard
          icon={UsersIcon}
          label="גולשים ייחודיים"
          value={summary.distinctUsers.toLocaleString("he-IL")}
          tone="neutral"
        />
        <KpiCard
          icon={ClockIcon}
          label="ממוצע זמן באתר"
          value={`${engagementMin}m`}
          tone="neutral"
          hint={`${summary.engagementSeconds}s סך הכל`}
        />
        <KpiCard
          icon={ScrollIcon}
          label="עומק גלילה ממוצע"
          value={`${Math.round(summary.scrollDepthPct)}%`}
          tone="neutral"
        />
      </div>

      {/* ============ Quality / UX issues ============ */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/55">
          איכות חוויה (כל לחיצה = הזדמנות לשיפור)
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            icon={AlertTriangleIcon}
            label="Rage Clicks"
            value={summary.rageClicks.toLocaleString("he-IL")}
            tone={summary.rageClicks > 0 ? "warning" : "success"}
            hint="לחיצות תסכול"
          />
          <KpiCard
            icon={MousePointerClickIcon}
            label="Dead Clicks"
            value={summary.deadClicks.toLocaleString("he-IL")}
            tone={summary.deadClicks > 0 ? "warning" : "success"}
            hint="לחיצות על אלמנט לא-קליקבילי"
          />
          <KpiCard
            icon={TrendingDownIcon}
            label="Quick Backs"
            value={summary.quickBacks.toLocaleString("he-IL")}
            tone={summary.quickBacks > 0 ? "warning" : "success"}
            hint="חזרות מהירות לדף קודם"
          />
          <KpiCard
            icon={ScrollIcon}
            label="גלילות מוגזמות"
            value={summary.excessiveScrolls.toLocaleString("he-IL")}
            tone={summary.excessiveScrolls > 0 ? "warning" : "success"}
            hint="גולשים שגללו הרבה ללא מציאה"
          />
          <KpiCard
            icon={ActivityIcon}
            label="JS Errors"
            value={summary.jsErrorsTotal.toLocaleString("he-IL")}
            tone={summary.jsErrorsTotal > 0 ? "danger" : "success"}
            hint="שגיאות JavaScript"
          />
        </div>
      </section>

      {/* ============ Top lists ============ */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TopList
          title="הדפים הפופולריים"
          icon={EyeIcon}
          items={summary.topUrls}
          unit="סשנים"
        />
        <TopList
          title="דפדפנים"
          icon={GlobeIcon}
          items={summary.topBrowsers}
          unit="סשנים"
        />
        <TopList
          title="מדינות"
          icon={GlobeIcon}
          items={summary.topCountries}
          unit="סשנים"
        />
        <TopList
          title="סוג מכשיר"
          icon={SmartphoneIcon}
          items={summary.topDevices}
          unit="סשנים"
        />
      </div>

      {/* ============ Footer hint ============ */}
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <RefreshCwIcon className="mt-0.5 size-4 shrink-0 text-white/45" />
        <div className="text-xs leading-relaxed text-white/65">
          הנתונים נשמרים ב-cache למשך שעה. לרענון מהיר — רענן את הדף לאחר 60
          דקות. לסרטוני הקלטה ומפות חום ויזואליות —{" "}
          <a
            href="https://clarity.microsoft.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9A24A] hover:underline"
          >
            פתח את Clarity Dashboard
          </a>
          .
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Sub-components
   ============================================================ */

type Tone = "primary" | "neutral" | "success" | "warning" | "danger";

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: typeof EyeIcon;
  label: string;
  value: string;
  tone: Tone;
  hint?: string;
}) {
  const toneCls: Record<Tone, string> = {
    primary: "border-[#C9A24A]/30 bg-[#C9A24A]/[0.06] text-[#C9A24A]",
    neutral: "border-white/10 bg-white/[0.03] text-white/85",
    success: "border-emerald-500/25 bg-emerald-500/[0.05] text-emerald-300",
    warning: "border-amber-500/25 bg-amber-500/[0.05] text-amber-300",
    danger: "border-red-500/30 bg-red-500/[0.06] text-red-300",
  };
  return (
    <div className={`rounded-2xl border p-4 ${toneCls[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-75">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="mt-2 text-3xl font-black leading-none">{value}</div>
      {hint && <div className="mt-1 text-[11px] opacity-65">{hint}</div>}
    </div>
  );
}

function TopList({
  title,
  icon: Icon,
  items,
  unit,
}: {
  title: string;
  icon: typeof EyeIcon;
  items: Array<{ name: string; sessions: number }>;
  unit: string;
}) {
  const max = Math.max(...items.map((i) => i.sessions), 1);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white/85">
        <Icon className="size-4 text-[#C9A24A]" />
        {title}
      </div>
      {items.length === 0 ? (
        <div className="py-3 text-xs text-white/45">אין נתונים זמינים</div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => {
            const pct = (item.sessions / max) * 100;
            return (
              <li
                key={`${item.name}-${i}`}
                className="grid grid-cols-[1fr_auto] items-center gap-3"
              >
                <div className="min-w-0">
                  <div
                    className="truncate text-sm text-white/85"
                    title={item.name}
                  >
                    <ChevronLeftIcon className="ml-1 inline size-3 text-white/30" />
                    {item.name || "—"}
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#C9A24A]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs font-bold tabular-nums text-white/75">
                  {item.sessions.toLocaleString("he-IL")}{" "}
                  <span className="text-white/45">{unit}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* unused but kept to keep MonitorIcon type referenced if needed */
void MonitorIcon;
