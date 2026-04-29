"use client";

import { useRef, useState } from "react";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from "lucide-react";

const BLUE = "#2F5D8C";

type Props = {
  videoUrl: string;
  poster: string;
};

/**
 * Big Video — וידאו ענק רוחב מלא עם play overlay.
 * מתחיל כ-poster + play button. בלחיצה: ניגון עם סאונד.
 */
export function BigVideo({ videoUrl, poster }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  function togglePlay() {
    const video = ref.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.muted = false;
      setMuted(false);
      video.play().catch(() => {
        // אם autoplay חסום עם sound — ננגן muted
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

      {/* gradient overlay כהה כל עוד לא מנגן */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/30 transition-opacity ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Play button גדול במרכז */}
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

      {/* בקרות תחתונות (כשמנגן) */}
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
