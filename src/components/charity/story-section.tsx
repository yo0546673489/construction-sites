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
  /** תמונת רקע parallax (אופציונלי). ריק = רק gradient רך. */
  bgImage?: string;
};

/**
 * Story — סקשן סיפור על העמותה.
 * רקע: תמונה ב-parallax fixed + dark overlay חזק → טקסט לבן עם text-shadow.
 * אם לא הוגדרה תמונה — fallback ל-gradient רך עם טקסט כהה.
 */
export function StorySection({
  kicker,
  paragraphs,
  cta,
  donationUrl,
  bgImage,
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

  const hasImage = !!bgImage;

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-28 md:py-40 ${
        hasImage ? "parallax-fixed" : ""
      }`}
      style={
        hasImage
          ? { backgroundImage: `url(${bgImage})` }
          : {
              background:
                "linear-gradient(180deg, #F9FBFF 0%, #FFFFFF 50%, #EEF3F8 100%)",
            }
      }
    >
      {/* dark overlay חזק כשיש תמונה — לקריאות הטקסט הלבן */}
      {hasImage && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,18,35,0.78) 0%, rgba(15,30,55,0.82) 50%, rgba(10,18,35,0.85) 100%)",
            }}
          />
          {/* radial accents */}
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(ellipse at 80% 30%, ${RED}33, transparent 50%), radial-gradient(ellipse at 15% 80%, ${YELLOW}22, transparent 50%)`,
            }}
          />
        </>
      )}

      {/* fallback decorative rays — בלי תמונה */}
      {!hasImage && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at 20% 30%, ${BLUE}15, transparent 50%), radial-gradient(ellipse at 80% 70%, ${YELLOW}15, transparent 50%)`,
          }}
        />
      )}

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md transition-all duration-700 sm:px-4 sm:text-xs ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={
            hasImage
              ? {
                  background: "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.25)",
                }
              : { background: `${BLUE}10`, color: BLUE }
          }
        >
          <HeartIcon className="size-3 sm:size-3.5" style={{ color: RED }} />
          {kicker}
        </div>

        <div className="mt-8 space-y-5 sm:mt-12 sm:space-y-7 md:mt-14 md:space-y-9">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-balance leading-[1.85] transition-all duration-700 ${
                i === 0
                  ? "text-xl font-black sm:text-2xl md:text-3xl lg:text-4xl"
                  : "text-base font-medium sm:text-lg md:text-xl lg:text-2xl"
              } ${
                revealed
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              } ${hasImage ? "text-shadow-soft" : ""}`}
              style={{
                color: hasImage
                  ? i === 0
                    ? "#FFFFFF"
                    : "rgba(255,255,255,0.92)"
                  : i === 0
                    ? "#1A1A1A"
                    : "#3A3A3A",
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
          className={`mt-10 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-black text-white shadow-2xl transition-all hover:scale-105 sm:mt-14 sm:px-9 sm:py-4 sm:text-base ${
            revealed
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
          style={{
            background: `linear-gradient(135deg, ${RED}, #C62828)`,
            boxShadow: `0 22px 55px -12px ${RED}80`,
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
