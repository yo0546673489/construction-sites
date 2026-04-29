"use client";

import Image from "next/image";

type Props = {
  before: string;
  after: string;
  label: string;
};

/**
 * Before / After comparison — שתי תמונות בכרטיס אחד עם תוויות.
 * Hover על "אחרי" — overlay זהב עם "AFTER" badge.
 */
export function BeforeAfter({ before, after, label }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg shadow-zinc-900/5 transition-shadow hover:shadow-2xl hover:shadow-zinc-900/10">
      <div className="grid grid-cols-2 gap-1 bg-zinc-200">
        {/* BEFORE */}
        <div className="group relative aspect-[4/5] overflow-hidden bg-zinc-300">
          <Image
            src={before}
            alt={`לפני - ${label}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
          <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-widest text-zinc-700 backdrop-blur">
            לפני
          </div>
        </div>

        {/* AFTER */}
        <div className="group relative aspect-[4/5] overflow-hidden bg-zinc-300">
          <Image
            src={after}
            alt={`אחרי - ${label}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#C9A24A]/40 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 rounded-full bg-[#C9A24A] px-3 py-1 text-xs font-black uppercase tracking-widest text-black shadow-lg">
            אחרי
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center gap-2 p-4 md:p-5">
        <span className="size-1.5 shrink-0 rounded-full bg-[#C9A24A]" />
        <span className="text-sm font-bold text-zinc-900 md:text-base">
          {label}
        </span>
      </div>
    </div>
  );
}
