"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "zoom";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  delayMs?: number;
  className?: string;
  /** סף intersection ratio לקבוע נחשף */
  threshold?: number;
  /** האם רק פעם אחת (default: true) */
  once?: boolean;
  as?: "div" | "section" | "article" | "figure" | "li";
};

/**
 * Reveal — wrapper שמפעיל אנימציה כשהאלמנט נכנס ל-viewport.
 * משתמש ב-utility classes `.reveal` / `.reveal-zoom` + `.is-visible` מ-globals.css.
 */
export function Reveal({
  children,
  variant = "up",
  delayMs = 0,
  className = "",
  threshold = 0.15,
  once = true,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > threshold) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: [0, threshold, 0.3, 0.5] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  const base = variant === "zoom" ? "reveal-zoom" : "reveal";

  // callback ref — תואם לכל HTMLElement subtype בלי בעיות variance
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  return (
    <Tag
      ref={setRef}
      className={`${base} ${visible ? "is-visible" : ""} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
