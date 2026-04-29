"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  goal: number;
  raised: number;
  deadline: string;
};

/** Progress bar שמתמלא לאט כשהקטע נכנס למסך. */
export function UrgencyBar({ goal, raised, deadline }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const target = Math.min(100, Math.round((raised / goal) * 100));
  const remaining = Math.max(0, goal - raised);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // השהיה קטנה ואז מתמלא
            setTimeout(() => setWidth(target), 200);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex items-baseline justify-between text-white">
        <div>
          <div className="text-sm opacity-80">נאסף עד כה</div>
          <div className="text-3xl font-black md:text-4xl">
            ₪{raised.toLocaleString("he-IL")}
          </div>
        </div>
        <div className="text-left">
          <div className="text-sm opacity-80">יעד</div>
          <div className="text-2xl font-bold opacity-90">
            ₪{goal.toLocaleString("he-IL")}
          </div>
        </div>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-gradient-to-l from-[#F6B53D] to-[#FFE08A] transition-[width] duration-[1800ms] ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-white/90">
        <span>
          חסרים עוד <strong className="text-[#F6B53D]">
            ₪{remaining.toLocaleString("he-IL")}
          </strong>{" "}
          להשגת היעד
        </span>
        <span>עד {deadline}</span>
      </div>
    </div>
  );
}
