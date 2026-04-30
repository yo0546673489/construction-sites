"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, HeartIcon } from "lucide-react";

const RED = "#E53935";
const YELLOW = "#F4C542";

type Props = {
  title: string;
  subtitle: string;
  cta: string;
  bgImage: string;
  donationUrl: string;
};

/**
 * EmotionalSection — סקשן רגשי עם תמונה ענקית, dark overlay חזק וטקסט גדול.
 * אנימציית fade-up בכניסה. כפתור CTA אדום כבד.
 */
export function EmotionalSection({
  title,
  subtitle,
  cta,
  bgImage,
  donationUrl,
}: Props) {
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
      className="parallax-fixed relative overflow-hidden py-24 text-white sm:py-32 md:py-44"
      style={{ backgroundImage: `url(${bgImage})` }}
      aria-label="emotional"
    >
      {/* dark overlay חזק — עם נטייה אדומה לדרמה */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(8,12,20,0.88) 0%, rgba(20,15,15,0.85) 50%, rgba(40,10,15,0.9) 100%)",
        }}
      />
      {/* radial accent אדום במרכז — מושך לכפתור */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${RED}44 0%, transparent 55%), radial-gradient(ellipse at 10% 20%, ${YELLOW}1A, transparent 50%)`,
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        {/* badge עליון */}
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest backdrop-blur-md transition-all duration-700 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{
            background: "rgba(255,255,255,0.12)",
            color: "#FFF",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <HeartIcon className="size-3.5" style={{ color: RED }} />
          הם סומכים עליך
        </div>

        {/* Title גדול */}
        <h2
          className={`mt-7 text-balance text-3xl font-black leading-[1.15] tracking-tight text-shadow-strong transition-all duration-700 sm:text-4xl md:text-5xl lg:text-6xl ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p
          className={`mt-5 text-balance text-lg font-medium opacity-95 text-shadow-soft transition-all duration-700 sm:text-xl md:text-2xl ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {subtitle}
        </p>

        {/* CTA */}
        <a
          href={donationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`sweep cta-pulse relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full px-9 py-4 text-base font-black text-white shadow-2xl transition-all hover:scale-105 sm:mt-14 sm:px-12 sm:py-5 sm:text-lg md:text-xl ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{
            background: `linear-gradient(135deg, ${RED}, #C62828)`,
            boxShadow: `0 25px 70px -15px ${RED}AA`,
            transitionDelay: "650ms",
          }}
        >
          <HeartIcon className="size-5 fill-white" />
          {cta}
          <ArrowLeftIcon className="size-5" />
        </a>
      </div>
    </section>
  );
}
