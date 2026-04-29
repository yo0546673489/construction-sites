"use client";

import Image from "next/image";
import { ArrowDownIcon, ArrowLeftIcon, PlayCircleIcon } from "lucide-react";
import { HeroTypewriter } from "./hero-typewriter";
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
  /** Typewriter */
  typewriterPhase1: string;
  typewriterPhase2: string;
  typewriterPhase3: string;
  /** CTA */
  primaryCta: string;
  secondaryCta: string;
  donationUrl: string;
};

/**
 * Hero Split — חלוקת מסך לשני חצאים:
 *  - שמאל: מדיה (תמונה או וידאו), עם blur עדין + parallax
 *  - ימין: לוגו, badge, typewriter sequence, כפתורים
 */
export function HeroSplit({
  brandName,
  brandTagline,
  sideMedia,
  sideMediaType,
  sideMediaPoster,
  typewriterPhase1,
  typewriterPhase2,
  typewriterPhase3,
  primaryCta,
  secondaryCta,
  donationUrl,
}: Props) {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F9FBFF 0%, #EEF3F8 100%)",
      }}
    >
      {/* רקע — חלקיקים עדינים */}
      <FloatingParticles />

      {/* Grid 2 columns */}
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-14 md:py-20">
        {/* MEDIA — שמאל */}
        <div className="relative order-2 md:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-blue-900/20 md:aspect-[5/6]">
            {sideMediaType === "video" ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={sideMediaPoster}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={sideMedia} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={sideMedia || sideMediaPoster}
                alt={brandName}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            {/* gradient overlay עדין */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${BLUE}22 0%, transparent 60%)`,
              }}
            />
            {/* מסגרת זהב עדינה */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset"
              style={{ borderColor: `${YELLOW}66` }}
            />
          </div>

          {/* Decorative element — נקודה צהובה */}
          <div
            className="absolute -bottom-3 -left-3 hidden size-16 rounded-full opacity-90 blur-xl md:block"
            style={{ background: YELLOW }}
          />
        </div>

        {/* CONTENT — ימין */}
        <div className="order-1 md:order-2">
          {/* Badge */}
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest"
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
            {brandName} · {brandTagline}
          </div>

          {/* Typewriter */}
          <h1
            className="text-balance text-3xl font-black leading-[1.15] tracking-tight md:text-5xl lg:text-6xl"
            style={{ color: "#1A1A1A" }}
          >
            <HeroTypewriter
              phase1={typewriterPhase1}
              phase2={typewriterPhase2}
              phase3={typewriterPhase3}
            />
          </h1>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group cta-pulse relative inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-base font-black text-white shadow-xl transition-all hover:scale-[1.03]"
              style={{
                background: `linear-gradient(135deg, ${RED}, #C62828)`,
                boxShadow: `0 18px 45px -10px ${RED}55`,
              }}
            >
              {primaryCta}
              <ArrowLeftIcon className="size-5 transition-transform group-hover:-translate-x-1" />
            </a>
            <a
              href="#reels"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-bold transition-colors hover:bg-white"
              style={{
                color: BLUE,
                borderColor: `${BLUE}40`,
              }}
            >
              <PlayCircleIcon className="size-5" />
              {secondaryCta}
            </a>
          </div>

          {/* Mini stats row */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm" style={{ color: BLUE }}>
            <div>
              <div className="text-2xl font-black md:text-3xl">250</div>
              <div className="text-xs opacity-70">משפחות בשבוע</div>
            </div>
            <div className="h-10 w-px bg-zinc-300" />
            <div>
              <div className="text-2xl font-black md:text-3xl">5</div>
              <div className="text-xs opacity-70">שנות פעילות</div>
            </div>
            <div className="h-10 w-px bg-zinc-300" />
            <div>
              <div className="text-2xl font-black md:text-3xl">100%</div>
              <div className="text-xs opacity-70">התנדבות</div>
            </div>
          </div>
        </div>
      </div>

      {/* חץ scroll */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <ArrowDownIcon
          className="size-5 animate-bounce"
          style={{ color: BLUE, opacity: 0.5 }}
        />
      </div>
    </section>
  );
}
