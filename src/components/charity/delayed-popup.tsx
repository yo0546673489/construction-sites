"use client";

import { useEffect, useState } from "react";
import { ArrowLeftIcon, HeartIcon, XIcon } from "lucide-react";

const RED = "#E53935";
const BLUE = "#2F5D8C";

type Props = {
  delaySeconds: number;
  title: string;
  text: string;
  cta: string;
  donationUrl: string;
};

const STORAGE_KEY = "charity-popup-shown";

/**
 * Popup שמופיע אחרי X שניות — רק פעם אחת בסשן.
 * נסגר אוטומטית עם sessionStorage flag.
 */
export function DelayedPopup({
  delaySeconds,
  title,
  text,
  cta,
  donationUrl,
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // אם כבר הוצג בסשן — לא להציג שוב
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [delaySeconds]);

  function handleClose() {
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 md:items-center"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="סגור"
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.3s ease both" }}
      />

      {/* dialog */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="סגור"
          className="absolute top-3 left-3 z-10 flex size-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          <XIcon className="size-5" />
        </button>

        {/* header — gradient */}
        <div
          className="px-7 pt-12 pb-8 text-white"
          style={{
            background: `linear-gradient(135deg, ${BLUE}, #1F3F60)`,
          }}
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <HeartIcon className="size-7 fill-white text-white" />
          </div>
          <h2 className="mt-5 text-2xl font-black leading-tight md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed opacity-95 md:text-base">
            {text}
          </p>
        </div>

        {/* body */}
        <div className="space-y-3 p-6">
          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-black text-white shadow-lg transition-transform hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${RED}, #C62828)`,
              boxShadow: `0 14px 35px -8px ${RED}55`,
            }}
          >
            <HeartIcon className="size-4 fill-white" />
            {cta}
            <ArrowLeftIcon className="size-4" />
          </a>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-2xl py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            לא תודה, אולי בפעם אחרת
          </button>
        </div>
      </div>
    </div>
  );
}
