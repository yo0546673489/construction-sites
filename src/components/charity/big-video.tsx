"use client";

import { useRef, useState } from "react";
import {
  ArrowLeftIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";

const BLUE = "#2F5D8C";
const RED = "#E53935";

type Props = {
  videoUrl: string;
  poster: string;
  /** מצב full-width: 100vw + 60vh + overlay text במרכז */
  fullWidth?: boolean;
  overlayTitle?: string;
  overlaySubtitle?: string;
  overlayCta?: string;
  donationUrl?: string;
};

/**
 * Big Video — וידאו ענק עם play overlay.
 * רגיל: aspect-video עם play button גדול.
 * fullWidth: 60vh edge-to-edge עם overlay טקסט + CTA.
 */
export function BigVideo({
  videoUrl,
  poster,
  fullWidth = false,
  overlayTitle,
  overlaySubtitle,
  overlayCta,
  donationUrl,
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  function togglePlay(e?: React.MouseEvent) {
    e?.stopPropagation();
    const video = ref.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.muted = false;
      setMuted(false);
      video.play().catch(() => {
        video.muted = true;
        setMuted(true);
        video.play().catch(() => {});
      });
      setPlaying(true);
    }
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const video = ref.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  }

  if (fullWidth) {
    return (
      <div
        className="group relative w-full cursor-pointer overflow-hidden bg-black"
        style={{ height: "min(60vh, 720px)" }}
        onClick={togglePlay}
      >
        <video
          ref={ref}
          loop
          playsInline
          poster={poster}
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          style={{
            transform: playing ? "scale(1)" : "scale(1.05)",
            transition: "transform 8s ease-out",
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/* dark overlay חזק כשלא מנגן */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            playing ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* overlay טקסט במרכז */}
        {!playing && (overlayTitle || overlayCta) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            {overlayTitle && (
              <h2 className="max-w-4xl text-balance text-3xl font-black leading-[1.15] tracking-tight text-shadow-strong md:text-5xl lg:text-6xl">
                {overlayTitle}
              </h2>
            )}
            {overlaySubtitle && (
              <p className="mt-4 max-w-2xl text-balance text-base font-medium opacity-95 text-shadow-soft md:text-xl">
                {overlaySubtitle}
              </p>
            )}

            {/* play button חצי-שקוף עם פעימה */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label="הפעל וידאו"
              className="cta-pulse mt-8 flex size-20 items-center justify-center rounded-full text-white shadow-2xl transition-transform group-hover:scale-110 md:size-24"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, #1F3F60)`,
              }}
            >
              <PlayIcon className="size-9 fill-white md:size-11" />
            </button>

            {/* CTA */}
            {overlayCta && donationUrl && (
              <a
                href={donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-black text-white shadow-xl transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${RED}, #C62828)`,
                  boxShadow: `0 18px 45px -10px ${RED}66`,
                }}
              >
                <HeartIcon className="size-4 fill-white" />
                {overlayCta}
                <ArrowLeftIcon className="size-4" />
              </a>
            )}
          </div>
        )}

        {/* בקרות תחתונות (כשמנגן) */}
        {playing && (
          <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between text-white">
            <button
              type="button"
              onClick={togglePlay}
              className="flex size-12 items-center justify-center rounded-full bg-black/50 backdrop-blur transition-colors hover:bg-black/70"
              aria-label="השהה"
            >
              <PauseIcon className="size-5 fill-white" />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="flex size-12 items-center justify-center rounded-full bg-black/50 backdrop-blur transition-colors hover:bg-black/70"
              aria-label={muted ? "הפעל סאונד" : "השתק"}
            >
              {muted ? (
                <VolumeXIcon className="size-5" />
              ) : (
                <Volume2Icon className="size-5" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* === מצב רגיל (aspect-video, מוגבל לרוחב הדף) === */
  return (
    <div
      className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl"
      onClick={togglePlay}
    >
      <video
        ref={ref}
        loop
        playsInline
        poster={poster}
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/30 transition-opacity ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="cta-pulse flex size-24 items-center justify-center rounded-full text-white shadow-2xl transition-transform group-hover:scale-110 md:size-28"
            style={{
              background: `linear-gradient(135deg, ${BLUE}, #1F3F60)`,
            }}
          >
            <PlayIcon className="size-10 fill-white" />
          </div>
        </div>
      )}

      {playing && (
        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between text-white">
          <button
            type="button"
            onClick={togglePlay}
            className="flex size-10 items-center justify-center rounded-full bg-black/40 backdrop-blur transition-colors hover:bg-black/60"
            aria-label="השהה"
          >
            <PauseIcon className="size-4 fill-white" />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="flex size-10 items-center justify-center rounded-full bg-black/40 backdrop-blur transition-colors hover:bg-black/60"
            aria-label={muted ? "הפעל סאונד" : "השתק"}
          >
            {muted ? (
              <VolumeXIcon className="size-4" />
            ) : (
              <Volume2Icon className="size-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
