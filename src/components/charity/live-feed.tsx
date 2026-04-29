"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "lucide-react";

type Item = {
  name: string;
  city: string;
  amount: number;
};

type Props = {
  items: Item[];
};

/**
 * Live donation feed — popup צף בפינה השמאלית-תחתונה.
 * מציג תרומות "אמיתיות" (מהקונטנט) בלולאה כל ~7 שניות.
 */
export function LiveDonationFeed({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    // הופעה ראשונית אחרי 5 שניות
    const initial = setTimeout(() => setVisible(true), 5000);

    // החלפה כל 7 שניות
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 350);
    }, 7000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[index];

  return (
    <div
      className={`fixed bottom-24 left-4 z-40 max-w-[280px] rounded-2xl border border-black/5 bg-white p-3 shadow-2xl transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      } md:bottom-6`}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#B82C3F]/10 text-[#B82C3F]">
          <HeartIcon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-zinc-500">תרומה זה עתה</div>
          <div className="truncate text-sm font-bold text-zinc-900">
            {item.name} מ{item.city}
          </div>
          <div className="text-xs font-semibold text-[#B82C3F]">
            ₪{item.amount.toLocaleString("he-IL")}
          </div>
        </div>
      </div>
    </div>
  );
}
