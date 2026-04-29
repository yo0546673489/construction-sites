"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "lucide-react";

type Props = {
  donationUrl: string;
  ctaText: string;
};

/**
 * כפתור תרומה דביק תחתון —
 * מופיע רק אחרי גלילה ראשונית (כדי לא להפריע ב-Hero).
 */
export function StickyDonate({ donationUrl, ctaText }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition-all duration-500 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={donationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-l from-[#B82C3F] to-[#D63B52] px-6 py-4 text-base font-bold text-white shadow-2xl shadow-[#B82C3F]/40"
      >
        <HeartIcon className="size-5 fill-white" />
        {ctaText}
      </a>
    </div>
  );
}
