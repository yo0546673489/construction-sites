"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  backgroundImage: string;
  line1: string;
  line2: string;
};

/**
 * Emotional break — section מלא עם רקע פאראלקס
 * + שתי שורות שמופיעות ברצף עם fade + blur.
 */
export function EmotionalBreak({ backgroundImage, line1, line2 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.3) {
            setStage(1);
            setTimeout(() => setStage(2), 1500);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.3, 0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-900 text-white"
    >
      {/* פאראלקס */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      {/* שכבה כהה לקריאות */}
      <div className="absolute inset-0 bg-zinc-950/80" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(220,38,38,0.18) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p
          className={`text-balance whitespace-pre-line text-3xl font-black leading-[1.2] tracking-tight transition-all duration-1500 md:text-5xl lg:text-6xl ${
            stage >= 1
              ? "translate-y-0 opacity-100 blur-0"
              : "translate-y-8 opacity-0 blur-md"
          }`}
        >
          {line1}
        </p>
        <p
          className={`mt-10 text-balance text-3xl font-black leading-[1.2] tracking-tight transition-all duration-[2000ms] md:text-5xl ${
            stage >= 2
              ? "translate-y-0 opacity-100 blur-0"
              : "translate-y-8 opacity-0 blur-md"
          }`}
          style={{ color: "#F59E0B" }}
        >
          {line2}
        </p>
      </div>
    </section>
  );
}
