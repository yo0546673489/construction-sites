"use client";

import { ArrowLeftIcon, QuoteIcon, TrendingUpIcon } from "lucide-react";

type Props = {
  name: string;
  area: string;
  quote: string;
  before: string;
  after: string;
};

/**
 * כרטיס המלצה — שיפוצניק עם ציטוט + מספר before/after מודגש.
 * מותאם לרקע בהיר.
 */
export function TestimonialCard({ name, area, quote, before, after }: Props) {
  return (
    <div className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:border-[#C9A24A]/40 hover:shadow-xl md:p-7">
      {/* Quote icon ברקע */}
      <QuoteIcon className="absolute top-5 left-5 size-12 text-zinc-100 transition-colors group-hover:text-[#C9A24A]/15" />

      {/* Quote */}
      <blockquote className="relative z-10 text-base leading-relaxed text-zinc-900 md:text-lg">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Before/After numbers */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            לפני
          </div>
          <div className="mt-1 text-3xl font-black text-zinc-400 line-through decoration-2 md:text-4xl">
            {before}
          </div>
          <div className="text-[10px] text-zinc-500">פניות בחודש</div>
        </div>
        <ArrowLeftIcon className="size-5 text-[#C9A24A]" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#C9A24A]">
            אחרי
            <TrendingUpIcon className="size-3" />
          </div>
          <div className="mt-1 text-3xl font-black text-[#C9A24A] md:text-4xl">
            {after}
          </div>
          <div className="text-[10px] text-zinc-500">פניות בחודש</div>
        </div>
      </div>

      {/* Name + area */}
      <div className="mt-auto flex items-center gap-3 border-t border-zinc-100 pt-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 font-black text-[#C9A24A]">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-black text-zinc-900">{name}</div>
          <div className="text-xs text-zinc-500">{area}</div>
        </div>
      </div>
    </div>
  );
}
