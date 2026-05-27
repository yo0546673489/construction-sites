// lib/date-range.ts
// Helper לפענוח טווח תאריכים מ-URLSearchParams.
// תומך בשני פורמטים:
//   ?from=YYYY-MM-DD&to=YYYY-MM-DD  (טווח מדויק)
//   ?range=N                         (N הימים האחרונים)
// אם אף אחד מהם — דיפולט 30 ימים אחרונים.

export interface DateRange {
  /** תחילת הטווח, 00:00:00 */
  since: Date;
  /** סוף הטווח, 23:59:59.999 */
  until: Date;
  /** מספר ימים בטווח (מעוגל מעלה) */
  days: number;
  /** מחרוזת קצרה לתצוגה: "30 הימים האחרונים" או "5 באפריל - 4 במאי" */
  label: string;
  /** האם זה preset של "N ימים אחרונים" שמסתיים היום */
  isLastN: boolean;
}

const HE_MONTHS = [
  'ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני',
  'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳',
];

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function endOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(23, 59, 59, 999);
  return out;
}

function diffInDays(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function parseISODate(s: string): Date | null {
  // YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
  if (isNaN(d.getTime())) return null;
  return d;
}

export function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatHebrewDate(d: Date): string {
  return `${d.getDate()} ב${HE_MONTHS[d.getMonth()]}`;
}

export function buildLabel(since: Date, until: Date, isLastN: boolean): string {
  if (isLastN) {
    const days = diffInDays(since, until);
    return `${days} הימים האחרונים`;
  }
  return `${formatHebrewDate(since)} - ${formatHebrewDate(until)}`;
}

/**
 * Parse from URLSearchParams or plain object. Falls back to last 30 days.
 */
export function parseDateRange(
  params: { from?: string; to?: string; range?: string } | URLSearchParams
): DateRange {
  const get = (k: 'from' | 'to' | 'range'): string | undefined => {
    if (params instanceof URLSearchParams) {
      return params.get(k) ?? undefined;
    }
    const v = params[k];
    return typeof v === 'string' ? v : undefined;
  };

  const fromStr = get('from');
  const toStr = get('to');

  if (fromStr && toStr) {
    const from = parseISODate(fromStr);
    const to = parseISODate(toStr);
    if (from && to && from <= to) {
      const today = startOfDay(new Date());
      const isLastN = isSameDay(to, today);
      const since = startOfDay(from);
      const until = endOfDay(to);
      return {
        since,
        until,
        days: diffInDays(since, until),
        label: buildLabel(since, until, isLastN),
        isLastN,
      };
    }
  }

  // Fallback: ?range=N
  const rangeStr = get('range');
  const days = rangeStr && /^\d+$/.test(rangeStr) ? parseInt(rangeStr) : 30;
  const today = new Date();
  const since = startOfDay(new Date(today.getTime() - (days - 1) * 86400000));
  const until = endOfDay(today);
  return {
    since,
    until,
    days,
    label: `${days} הימים האחרונים`,
    isLastN: true,
  };
}

/** Builds query params for a date range — to use with router.push */
export function dateRangeToQueryParams(
  from: Date,
  to: Date
): { from: string; to: string } {
  return {
    from: formatISODate(from),
    to: formatISODate(to),
  };
}
