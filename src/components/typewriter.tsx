"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  text: string;
  /** השהיה לפני שמתחילים להקליד (ms) */
  delay?: number;
  /** זמן בין תווים (ms) */
  speed?: number;
  className?: string;
  /** סגנון inline נוסף — לדריסות עיצוב per-element */
  style?: CSSProperties;
};

/**
 * אפקט טייפרייטר — Zero-CLS implementation.
 *
 * חשוב: הטקסט המלא תמיד תופס את אותו שטח (גם בעת SSR), כך שאין layout shift
 * כשהאנימציה מתקדמת. אנחנו פשוט מחביאים תווים שעוד לא "הוקלדו" עם
 * `visibility: hidden` (תופס מקום אבל לא נראה).
 *
 * SSR מציג את הטקסט המלא כדי שגוגל/SEO יראו אותו ושה-LCP לא ייפגע.
 * ב-hydration אנחנו מאתחלים את count ל-0 ומתחילים את האנימציה.
 */
export function Typewriter({
  text,
  delay = 200,
  speed = 45,
  className,
  style,
}: Props) {
  const chars = Array.from(text);
  // SSR initial: full text visible (LCP-friendly).
  // Client mounts and useEffect resets to 0 + animates.
  const [count, setCount] = useState(chars.length);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCount(0);
    let cancelled = false;
    const startTimer = setTimeout(() => {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setCount(i);
        if (i < chars.length) setTimeout(tick, speed);
      };
      tick();
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const isDone = count >= chars.length;

  return (
    <span className={className} style={style} aria-label={text}>
      {/* כל תו תמיד תופס שטח. visibility: hidden מסתיר ללא קפיצת layout. */}
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            visibility:
              !isMounted || i < count ? "visible" : "hidden",
          }}
        >
          {c}
        </span>
      ))}
      <span
        className={`mr-0.5 inline-block w-[3px] translate-y-1 bg-current align-middle ${
          isDone ? "animate-pulse opacity-60" : "opacity-90"
        }`}
        style={{ height: "0.85em" }}
        aria-hidden="true"
      />
    </span>
  );
}
