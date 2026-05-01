/**
 * Microsoft Clarity Data Export API helpers.
 *
 * Endpoint: https://www.clarity.ms/export-data/api/v1/project-live-insights
 * תיעוד רשמי: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api
 *
 * מגבלות tier חינמי:
 *  - 10 בקשות API ליום, פר project
 *  - מקסימום 3 ימים של היסטוריה בכל בקשה
 *
 * לכן: אנחנו משתמשים ב-Next.js fetch cache עם revalidate=3600 (1h)
 * — מקסימום 24 בקשות ליום, גם תחת שימוש כבד בדשבורד.
 */

export type ClarityMetric = {
  metricName: string;
  information: Array<Record<string, string>>;
};

export type ClarityInsights = ClarityMetric[];

export type ClarityFetchResult =
  | { ok: true; data: ClarityInsights; cached: boolean }
  | { ok: false; error: string; status?: number };

/**
 * מושך נתוני live-insights מ-Clarity.
 *
 * @param token  API token שיוצר המשתמש ב-Clarity Settings → Data Export
 * @param numOfDays  1, 2, או 3 — כמה ימים אחורה
 */
export async function fetchClarityInsights(
  token: string,
  numOfDays: 1 | 2 | 3 = 1
): Promise<ClarityFetchResult> {
  if (!token || !token.trim()) {
    return { ok: false, error: "API token חסר" };
  }

  const url = `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=${numOfDays}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: "application/json",
      },
      // cache עד שעה — חוסך quota של ה-API
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        status: res.status,
        error:
          res.status === 401
            ? "API token שגוי או פג תוקף"
            : res.status === 429
              ? "חרגת ממכסת הבקשות היומית של Clarity (10 ליום). נסה שוב מחר."
              : `שגיאת Clarity (${res.status}): ${text.slice(0, 200)}`,
      };
    }

    const data = (await res.json()) as ClarityInsights;
    return { ok: true, data, cached: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `שגיאת רשת: ${msg}` };
  }
}

/* ============================================================
   Helpers — extract typed numbers from insights
   ============================================================ */

function findMetric(
  insights: ClarityInsights,
  name: string
): Record<string, string> | null {
  const m = insights.find((x) => x.metricName === name);
  if (!m || !m.information.length) return null;
  return m.information[0];
}

function num(v: string | undefined): number {
  if (!v) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export type ClaritySummary = {
  totalSessions: number;
  botSessions: number;
  distinctUsers: number;
  pagesPerSession: number;
  scrollDepthPct: number;
  engagementSeconds: number;
  rageClicks: number;
  deadClicks: number;
  quickBacks: number;
  excessiveScrolls: number;
  jsErrorsTotal: number;
  topUrls: Array<{ name: string; sessions: number }>;
  topBrowsers: Array<{ name: string; sessions: number }>;
  topCountries: Array<{ name: string; sessions: number }>;
  topDevices: Array<{ name: string; sessions: number }>;
};

/** מסכם את הקריאה ל-Clarity לאובייקט נוח לתצוגה. */
export function summarizeInsights(insights: ClarityInsights): ClaritySummary {
  const traffic = findMetric(insights, "Traffic");
  const engaged = findMetric(insights, "EngagedSessions");
  const popular = insights.find((x) => x.metricName === "PopularPages");
  const browsers = insights.find((x) => x.metricName === "Browser");
  const countries = insights.find((x) => x.metricName === "Country");
  const devices = insights.find((x) => x.metricName === "Device");
  const rage = findMetric(insights, "RageClickCount");
  const dead = findMetric(insights, "DeadClickCount");
  const quick = findMetric(insights, "QuickbackClick");
  const excessive = findMetric(insights, "ExcessiveScroll");
  const jsError = findMetric(insights, "ScriptErrorCount");

  return {
    totalSessions: num(traffic?.totalSessionCount),
    botSessions: num(traffic?.totalBotSessionCount),
    distinctUsers: num(traffic?.distinctUserCount),
    pagesPerSession: num(traffic?.PagesPerSessionPercentage ?? engaged?.pagesPerSessionPercentage),
    scrollDepthPct: num(engaged?.averageScrollDepth),
    engagementSeconds: num(engaged?.activeTimeSpent ?? engaged?.totalTime),
    rageClicks: num(rage?.subTotal ?? rage?.totalSessionsWithMetric),
    deadClicks: num(dead?.subTotal ?? dead?.totalSessionsWithMetric),
    quickBacks: num(quick?.subTotal ?? quick?.totalSessionsWithMetric),
    excessiveScrolls: num(excessive?.subTotal ?? excessive?.totalSessionsWithMetric),
    jsErrorsTotal: num(jsError?.subTotal ?? jsError?.totalSessionsWithMetric),
    topUrls: extractTopList(popular, "url"),
    topBrowsers: extractTopList(browsers, "browser"),
    topCountries: extractTopList(countries, "country"),
    topDevices: extractTopList(devices, "device"),
  };
}

function extractTopList(
  metric: ClarityMetric | undefined,
  nameKey: string,
  limit = 5
): Array<{ name: string; sessions: number }> {
  if (!metric) return [];
  return metric.information.slice(0, limit).map((row) => {
    const name =
      row[nameKey] ??
      row.url ??
      row.browser ??
      row.country ??
      row.device ??
      row.os ??
      "—";
    const sessions = num(
      row.totalSessionCount ?? row.sessionsCount ?? row.sessionsCount
    );
    return { name, sessions };
  });
}
