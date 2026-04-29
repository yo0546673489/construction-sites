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
 * Reels — סקרול אופקי עם snap.
 * כל card הוא וידאו אנכי 9:16 שמתנגן אוטומטית כשנכנס למסך.
 * Mobile: native swipe.
 */
export function ReelsHorizontal({ items, donationUrl }: Props) {
  return (
    <div className="relative">
      <div
        className="flex gap-4 overflow-x-auto px-6 pb-6 snap-x snap-mandatory [scrollbar-width:thin]"
        style={{ scrollPaddingInline: "1.5rem" }}
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
    <div className="group relative w-[260px] shrink-0 snap-start md:w-[290px]">
      {/* Video card */}
      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-zinc-900 shadow-xl shadow-zinc-900/15 transition-transform group-hover:scale-[1.02]">
        {item.videoUrl ? (
          <video
            ref={ref}
            loop
            muted
            playsInline
            poster={item.poster}
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={item.videoUrl} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.poster}
            alt={item.overlayText}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        {/* טקסט תחתון */}
        <div className="absolute right-4 bottom-4 left-4 text-white">
          <p className="text-base font-black leading-tight">
            {item.overlayText}
          </p>
        </div>
      </div>

      {/* CTA תחתון */}
      <a
        href={donationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02]"
        style={{ background: RED }}
      >
        <HeartIcon className="size-4 fill-white" />
        {item.cta}
        <ArrowLeftIcon className="size-3.5" />
      </a>
    </div>
  );
}
