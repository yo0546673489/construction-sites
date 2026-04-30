"use client";

import Image from "next/image";
import { ArrowDownIcon, ArrowLeftIcon, HeartIcon } from "lucide-react";
import { FloatingParticles } from "./floating-particles";

const BLUE = "#2F5D8C";
const RED = "#E53935";
const YELLOW = "#F4C542";

type Props = {
  brandName: string;
  brandTagline: string;
  /** מדיה בצד */
  sideMedia: string;
  sideMediaType: "image" | "video";
  sideMediaPoster: string;
  /** Typewriter (לא בשימוש בעיצוב הנוכחי, נשמר כדי לא לשבור props) */
  typewriterPhase1: string;
  typewriterPhase2: string;
  typewriterPhase3: string;
  /** CTA */
  primaryCta: string;
  secondaryCta: string;
  donationUrl: string;
};

/**
 * Hero — Kicker + 85% width / 60vh video + overlay + CTA
 *  - שורת badge קטנה
 *  - 2 שורות kicker מודגשות
 *  - וידאו ממורכז 85% רוחב, 60vh גובה
 *  - על הוידאו: כותרת + כפתור CTA
 *  - סטטיסטיקות מתחת
 */
export function HeroSplit({
  brandName,
  brandTagline,
  sideMedia,
  sideMediaType,
  sideMediaPoster,
  primaryCta,
  donationUrl,
}: Props) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F9FBFF 0%, #EEF3F8 100%)",
      }}
    >
      <FloatingParticles />

      {/* רקע מטושטש בעומק */}
      {sideMediaType === "image" ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${sideMedia || sideMediaPoster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(60px) saturate(1.1)",
            transform: "scale(1.2)",
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${sideMediaPoster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(60px) saturate(1.1)",
            transform: "scale(1.2)",
          }}
        />
      )}

      {/* ========== KICKER TEXT (above video) ========== */}
      <div className="relative mx-auto max-w-4xl px-4 pt-12 pb-8 text-center sm:px-6 sm:pt-16 sm:pb-10 md:pt-20">
        {/* Badge */}
        <div
          className="mb-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest sm:text-xs"
          style={{
            background: `${BLUE}10`,
            color: BLUE,
            border: `1px solid ${BLUE}25`,
          }}
        >
          <span
            className="size-1.5 animate-pulse rounded-full"
            style={{ background: RED }}
          />
          <span>{brandName}</span>
          <span className="opacity-50">·</span>
          <span>{brandTagline}</span>
        </div>

        {/* Kicker headlines (replaced typewriter with static strong copy) */}
        <h1
          className="text-balance text-2xl font-black leading-[1.2] tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
          style={{
            color: "#0F1B2D",
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
          }}
        >
          פותחים את הלב בהובלת הנוער
        </h1>
        <p
          className="mt-3 text-balance text-base font-semibold leading-relaxed sm:text-lg md:text-xl lg:text-2xl"
          style={{ color: BLUE }}
        >
          מסייעים למאות משפחות בכל שבוע
        </p>
      </div>

      {/* ========== VIDEO BLOCK — 85% width, aspect 16:9 (no crop) ========== */}
      <div className="relative px-4 pb-10 sm:px-6 sm:pb-12">
        <div className="mx-auto" style={{ width: "min(85%, 1280px)" }}>
          <div
            className="relative w-full overflow-hidden rounded-3xl shadow-2xl shadow-blue-900/30"
            style={{ aspectRatio: "16 / 9" }}
          >
            {sideMediaType === "video" ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={sideMediaPoster}
                className="absolute inset-0 h-full w-full object-contain bg-black"
              >
                <source src={sideMedia} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={sideMedia || sideMediaPoster}
                alt={brandName}
                fill
                priority
                sizes="(max-width: 1280px) 85vw, 1280px"
                className="object-contain bg-black"
              />
            )}

            {/* dark overlay לקריאות הטקסט שעל הוידאו */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.7) 100%)",
              }}
            />
            {/* tint כחול עדין לזהות מותגית */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${BLUE}1F 0%, transparent 60%)`,
              }}
            />

            {/* כותרת overlay במרכז */}
            <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-10 text-center sm:px-6 sm:pb-14 md:pb-16">
              <h2 className="text-shadow-strong text-balance text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl md:text-5xl lg:text-6xl">
                כך נראית החלוקה האמיתית בשטח
              </h2>
              <a
                href={donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sweep cta-pulse relative mt-5 inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-sm font-black text-white shadow-2xl transition-transform hover:scale-105 sm:mt-7 sm:px-9 sm:py-4 sm:text-base md:text-lg"
                style={{
                  background: `linear-gradient(135deg, ${RED}, #C62828)`,
                  boxShadow: `0 22px 55px -12px ${RED}80`,
                }}
              >
                <HeartIcon className="size-4 fill-white sm:size-5" />
                גם אני רוצה להיות חלק ❤️
                <ArrowLeftIcon className="size-4 sm:size-5" />
              </a>
            </div>

            {/* מסגרת זהב עדינה */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset"
              style={{ borderColor: `${YELLOW}66` }}
            />
          </div>

          {/* Decorative element — נקודה צהובה */}
          <div
            className="absolute -bottom-4 -left-4 hidden size-20 rounded-full opacity-90 blur-xl md:block"
            style={{ background: YELLOW }}
          />
        </div>
      </div>

      {/* ========== STATS ROW ========== */}
      <div
        className="relative flex flex-wrap items-center justify-center gap-4 px-4 pb-12 text-sm sm:gap-6 sm:px-6 sm:pb-14 md:pb-16"
        style={{ color: BLUE }}
      >
        <div className="text-center">
          <div className="text-2xl font-black md:text-3xl">250</div>
          <div className="text-[10px] opacity-70 sm:text-xs">משפחות בשבוע</div>
        </div>
        <div className="h-9 w-px bg-zinc-300" />
        <div className="text-center">
          <div className="text-2xl font-black md:text-3xl">5,000+</div>
          <div className="text-[10px] opacity-70 sm:text-xs">סלים חולקו</div>
        </div>
        <div className="h-9 w-px bg-zinc-300" />
        <div className="text-center">
          <div className="text-2xl font-black md:text-3xl">100%</div>
          <div className="text-[10px] opacity-70 sm:text-xs">התנדבות</div>
        </div>
      </div>

      <div className="relative flex justify-center pb-6">
        <ArrowDownIcon
          className="size-5 animate-bounce"
          style={{ color: BLUE, opacity: 0.5 }}
        />
      </div>

      {/* primaryCta נשאר בשימוש פנימי — מועבר ל-CTA הראשי בכפתור על הוידאו */}
      <span className="hidden">{primaryCta}</span>
    </section>
  );
}
