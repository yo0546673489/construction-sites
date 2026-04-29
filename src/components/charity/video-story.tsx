"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, HeartIcon } from "lucide-react";

type Props = {
  videoUrl: string;
  poster: string;
  overlayText: string;
  cta: string;
  donationUrl: string;
  /** Section index — לבחירת רקע (משתנה כל סקשן) */
  index: number;
};

/**
 * Vertical video story — וידאו אנכי שמתנגן אוטומטית כשנכנס למסך.
 * הטקסט והכפתור מופיעים עם fade-up.
 */
export function VideoStory({
  videoUrl,
  poster,
  overlayText,
  cta,
  donationUrl,
  index,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            video.play().catch(() => {
              // אוטוmaticplay חסום (שכיח במובייל) — מתעלמים
            });
            setRevealed(true);
          } else {
            video.pause();
          }
        }
      },
      { threshold: [0, 0.4, 0.8] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // רקע משתנה לסירוגין
  const bgGradient =
    index % 2 === 0
      ? "bg-gradient-to-b from-white via-zinc-50 to-white"
      : "bg-gradient-to-b from-zinc-50 via-white to-zinc-50";

  return (
    <section
      ref={sectionRef}
      className={`relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6 py-16 ${bgGradient}`}
    >
      <div className="grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* טקסט */}
        <div
          className={`order-2 transition-all duration-1000 md:order-1 ${
            revealed
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-600">
            <span className="size-1.5 rounded-full bg-[#DC2626]" />
            סיפור אמיתי {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="text-balance text-3xl font-black leading-[1.1] text-zinc-900 md:text-5xl">
            {overlayText}
          </h3>

          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#DC2626] px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-[#DC2626]/25 transition-all hover:scale-105 hover:bg-[#B91C1C]"
          >
            <HeartIcon className="size-4 fill-white" />
            {cta}
            <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />
          </a>
        </div>

        {/* וידאו אנכי */}
        <div
          className={`order-1 mx-auto w-full max-w-sm transition-all duration-1000 md:order-2 ${
            revealed
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-black shadow-2xl shadow-zinc-900/30">
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              poster={poster}
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            {/* gradient דק לקריאות */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
