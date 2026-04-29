"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, HeartIcon } from "lucide-react";

const BLUE = "#2F5D8C";
const RED = "#E53935";
const YELLOW = "#F4C542";

type Props = {
  kicker: string;
  paragraphs: string[];
  cta: string;
  donationUrl: string;
};

/**
 * Story — סקשן סיפור על העמותה.
 * רקע gradient רך + פסקאות שמופיעות אחת אחרי השנייה ב-fade-up.
 */
export function StorySection({ kicker, paragraphs, cta, donationUrl }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.2) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.2, 0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #F9FBFF 0%, #FFFFFF 50%, #EEF3F8 100%)",
      }}
    >
      {/* Decorative rays */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at 20% 30%, ${BLUE}15, transparent 50%), radial-gradient(ellipse at 80% 70%, ${YELLOW}15, transparent 50%)`,
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-all duration-700 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{
            background: `${BLUE}10`,
            color: BLUE,
          }}
        >
          <HeartIcon className="size-3.5" style={{ color: RED }} />
          {kicker}
        </div>

        <div className="mt-10 space-y-7 md:mt-12 md:space-y-9">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-balance text-lg leading-[1.8] transition-all duration-700 md:text-xl lg:text-2xl ${
                revealed
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              } ${i === 0 ? "font-black" : "font-medium"}`}
              style={{
                color: i === 0 ? "#1A1A1A" : "#3A3A3A",
                transitionDelay: `${300 + i * 250}ms`,
              }}
            >
              {p}
            </p>
          ))}
        </div>

        <a
          href={donationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-12 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-black text-white shadow-xl transition-all hover:scale-105 ${
            revealed
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
          style={{
            background: `linear-gradient(135deg, ${RED}, #C62828)`,
            boxShadow: `0 18px 45px -10px ${RED}55`,
            transitionDelay: "1100ms",
          }}
        >
          <HeartIcon className="size-4 fill-white" />
          {cta}
          <ArrowLeftIcon className="size-4" />
        </a>
      </div>
    </section>
  );
}
