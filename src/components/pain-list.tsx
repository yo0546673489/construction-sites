"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type PainItem = {
  /** ה‑icon מועבר כ‑ReactNode (JSX מוכן) — לא כ‑component reference,
   *  כדי שיהיה ניתן לסידור (serializable) דרך גבול ה‑Server→Client. */
  icon: ReactNode;
  text: string;
};

/**
 * רשימת כאבים שנכנסים בהדרגה מצד ימין כשהמשתמש גולל אליהם.
 * משתמש ב-IntersectionObserver כדי לחכות שהקטע ייכנס למסך.
 */
export function PainList({ items }: { items: PainItem[] }) {
  const containerRef = useRef<HTMLUListElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={containerRef} className="grid gap-3">
      {items.map((item, i) => (
        <li
          key={item.text}
          style={{ transitionDelay: `${i * 110}ms` }}
          className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-700 ease-out ${
            visible
              ? "translate-x-0 opacity-100"
              : "translate-x-16 opacity-0"
          }`}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#C9A24A]/15 text-[#C9A24A]">
            {item.icon}
          </span>
          <span className="text-base font-medium text-white/90 md:text-lg">
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
