// components/shared/date-range-picker.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  formatHebrewDate,
  formatISODate,
  parseDateRange,
} from '@/lib/date-range';

const HE_MONTH_NAMES = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];
const HE_DAY_HEAD = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

interface Props {
  /** ימים אחורה — fallback לדיפולט אם אין ב-URL */
  currentRange?: number;
}

interface DraftRange {
  start: Date | null;
  end: Date | null;
}

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function inRange(d: Date, start: Date, end: Date): boolean {
  const t = d.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

const PRESETS = [
  { id: 'today', label: 'היום' },
  { id: 'yest', label: 'אתמול' },
  { id: '7d', label: '7 הימים האחרונים' },
  { id: '14d', label: '14 הימים האחרונים' },
  { id: '30d', label: '30 הימים האחרונים' },
  { id: '90d', label: '90 הימים האחרונים' },
  { id: 'mtd', label: 'החודש הזה' },
  { id: 'lastm', label: 'החודש שעבר' },
];

function presetToRange(presetId: string): { start: Date; end: Date } {
  const today = startOfDay(new Date());
  if (presetId === 'today') return { start: today, end: today };
  if (presetId === 'yest') {
    const y = new Date(today);
    y.setDate(today.getDate() - 1);
    return { start: y, end: y };
  }
  if (presetId === 'mtd') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start, end: today };
  }
  if (presetId === 'lastm') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);
    return { start, end };
  }
  const n = parseInt(presetId.replace('d', ''));
  const start = new Date(today);
  start.setDate(today.getDate() - (n - 1));
  return { start, end: today };
}

export function DateRangePicker({ currentRange = 30 }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = useMemo(() => {
    const params: { from?: string; to?: string; range?: string } = {};
    const f = searchParams.get('from');
    const t = searchParams.get('to');
    const r = searchParams.get('range');
    if (f) params.from = f;
    if (t) params.to = t;
    if (r) params.range = r;
    if (!f && !t && !r) params.range = String(currentRange);
    return parseDateRange(params);
  }, [searchParams, currentRange]);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftRange>({
    start: current.since,
    end: new Date(
      current.until.getFullYear(),
      current.until.getMonth(),
      current.until.getDate()
    ),
  });
  const [viewBaseMonth, setViewBaseMonth] = useState(
    () => new Date(current.until.getFullYear(), current.until.getMonth(), 1)
  );

  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setDraft({
        start: current.since,
        end: new Date(
          current.until.getFullYear(),
          current.until.getMonth(),
          current.until.getDate()
        ),
      });
      setViewBaseMonth(
        new Date(current.until.getFullYear(), current.until.getMonth(), 1)
      );
    }
  }, [open, current.since, current.until]);

  const apply = (start: Date, end: Date) => {
    const params = new URLSearchParams(searchParams);
    params.delete('range');
    params.set('from', formatISODate(start));
    params.set('to', formatISODate(end));
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const handleApply = () => {
    if (!draft.start || !draft.end) return;
    const [s, e] =
      draft.start <= draft.end
        ? [draft.start, draft.end]
        : [draft.end, draft.start];
    apply(s, e);
  };

  const handlePreset = (presetId: string) => {
    const { start, end } = presetToRange(presetId);
    setDraft({ start, end });
    apply(start, end);
  };

  const handleDateClick = (d: Date) => {
    setDraft((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: d, end: null };
      }
      if (d < prev.start) {
        return { start: d, end: prev.start };
      }
      return { start: prev.start, end: d };
    });
  };

  const activePresetId = useMemo(() => {
    for (const p of PRESETS) {
      const { start, end } = presetToRange(p.id);
      if (
        isSameDay(start, current.since) &&
        isSameDay(
          end,
          new Date(
            current.until.getFullYear(),
            current.until.getMonth(),
            current.until.getDate()
          )
        )
      ) {
        return p.id;
      }
    }
    return null;
  }, [current.since, current.until]);

  const draftLabel = useMemo(() => {
    if (!draft.start || !draft.end) {
      return draft.start
        ? `${formatHebrewDate(draft.start)} - בחר תאריך סיום`
        : 'בחר טווח';
    }
    const [s, e] =
      draft.start <= draft.end
        ? [draft.start, draft.end]
        : [draft.end, draft.start];
    return `${formatHebrewDate(s)} - ${formatHebrewDate(e)}`;
  }, [draft.start, draft.end]);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md hover:shadow-emerald-500/10"
      >
        <CalendarIcon className="size-4 text-emerald-600" />
        <span className="font-bold">{current.label}</span>
        <span className="hidden text-slate-400 md:inline">
          · {formatHebrewDate(current.since)} - {formatHebrewDate(current.until)}
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          {/* Centered modal */}
          <div
            ref={popoverRef}
            dir="rtl"
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 w-[min(95vw,720px)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
          >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="text-sm font-bold text-slate-900">
              בחר טווח תאריכים
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="סגור"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="w-full shrink-0 border-b border-slate-100 p-3 md:w-48 md:border-b-0 md:border-l">
              <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                בחירה מהירה
              </div>
              <ul className="grid grid-cols-2 gap-0.5 md:block md:space-y-0.5">
                {PRESETS.map((p) => {
                  const active = p.id === activePresetId;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => handlePreset(p.id)}
                        className={`w-full rounded-xl px-3 py-2 text-right text-sm font-medium transition-colors ${
                          active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {p.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex-1 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Calendar
                  monthDate={addMonths(viewBaseMonth, -1)}
                  draft={draft}
                  onClick={handleDateClick}
                  showPrevButton
                  onPrev={() => setViewBaseMonth((m) => addMonths(m, -1))}
                />
                <Calendar
                  monthDate={viewBaseMonth}
                  draft={draft}
                  onClick={handleDateClick}
                  showNextButton
                  onNext={() => setViewBaseMonth((m) => addMonths(m, 1))}
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="text-sm">
                  <span className="text-slate-500">נבחר: </span>
                  <span className="font-semibold text-slate-900">
                    {draftLabel}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={!draft.start || !draft.end}
                    className="rounded-full bg-gradient-to-l from-emerald-500 to-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/40 disabled:opacity-50 disabled:shadow-none"
                  >
                    עדכן
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
}

interface CalendarProps {
  monthDate: Date;
  draft: DraftRange;
  onClick: (d: Date) => void;
  showPrevButton?: boolean;
  showNextButton?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

function Calendar({
  monthDate,
  draft,
  onClick,
  showPrevButton,
  showNextButton,
  onPrev,
  onNext,
}: CalendarProps) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const today = startOfDay(new Date());

  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const [rs, re] = (() => {
    if (!draft.start) return [null, null];
    if (!draft.end) return [draft.start, draft.start];
    if (draft.start <= draft.end) return [draft.start, draft.end];
    return [draft.end, draft.start];
  })();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        {showPrevButton ? (
          <button
            type="button"
            onClick={onPrev}
            className="flex size-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="חודש קודם"
          >
            <ChevronRight className="size-4" />
          </button>
        ) : (
          <div className="size-7" />
        )}
        <div className="text-sm font-bold text-slate-900">
          {HE_MONTH_NAMES[month]} {year}
        </div>
        {showNextButton ? (
          <button
            type="button"
            onClick={onNext}
            className="flex size-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="חודש הבא"
          >
            <ChevronLeft className="size-4" />
          </button>
        ) : (
          <div className="size-7" />
        )}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] font-bold text-slate-400">
        {HE_DAY_HEAD.map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;

          const isStart = rs && isSameDay(d, rs);
          const isEnd = re && isSameDay(d, re);
          const inSelected = rs && re && inRange(d, rs, re);
          const isToday = isSameDay(d, today);
          const isFuture = d > today;

          let cls =
            'relative h-8 text-sm font-medium transition-colors flex items-center justify-center';
          if (isStart || isEnd) {
            cls += ' bg-emerald-500 text-white font-bold rounded-lg';
          } else if (inSelected) {
            cls += ' bg-emerald-100 text-emerald-700';
          } else if (isFuture) {
            cls += ' text-slate-300';
          } else {
            cls += ' text-slate-700 hover:bg-slate-100 rounded-lg';
          }
          if (isToday && !isStart && !isEnd) {
            cls += ' ring-1 ring-emerald-300 rounded-lg';
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => !isFuture && onClick(d)}
              disabled={isFuture}
              className={cls}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
