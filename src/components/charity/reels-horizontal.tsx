"use client";

import { useEffect, useRef } from "react";
import { ArrowLeftIcon, HeartIcon } from "lucide-react";

const RED = "#E53935";

type Item = {
  videoUrl: string;
  poster: string;
  overlayText: string;
  cta: string;
};

type Props = {
  items: Item[];
  donationUrl: string;
};

/**
 * Reels — סקרול אופקי עם snap mandatory.
 * כל card הוא וידאו אנכי 9:16 שמתנגן אוטומטית כשנכנס למסך.
 * CTA על גבי הכרטיס (למטה) — לא מתחת — לחיסכון בגובה.
 */
export function ReelsHorizontal({ items, donationUrl }: Props) {
  return (
    <div className="relative">
      <div
        className="flex gap-2 overflow-x-auto px-4 pb-4 snap-x snap-mandatory [scrollbar-width:thin] sm:px-6 sm:gap-3"
        style={{ scrollPaddingInline: "1rem" }}
      >
        {items.map((item, i) => (
          <ReelCard
            key={`${item.videoUrl}-${i}`}
            item={item}
            donationUrl={donationUrl}
          />
        ))}
      </div>
    </div>
  );
}

function ReelCard({ item, donationUrl }: { item: Item; donationUrl: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: [0, 0.5, 0.8] }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="group relative w-[260px] shrink-0 snap-start sm:w-[300px] md:w-[340px] lg:w-[360px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-black/50 ring-1 ring-white/10 transition-all duration-500 group-hover:scale-[1.04] group-hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)]">
        {item.videoUrl ? (
          <video
            ref={ref}
            loop
            muted
            playsInline
            poster={item.poster}
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          >
            <source src={item.videoUrl} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.poster}
            alt={item.overlayText}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        {/* gradient overlay חזק לתחתית — לקריאות הטקסט והכפתור */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* טקסט תחתון */}
        <div className="absolute right-4 bottom-20 left-4">
          <p className="text-base font-black leading-tight text-white text-shadow-soft md:text-lg">
            {item.overlayText}
          </p>
        </div>

        {/* CTA על הכרטיס */}
        <a
          href={donationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 bottom-4 left-4 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white shadow-lg backdrop-blur-md transition-all hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${RED}E6, #C62828E6)`,
          }}
        >
          <HeartIcon className="size-4 fill-white" />
          {item.cta}
          <ArrowLeftIcon className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
