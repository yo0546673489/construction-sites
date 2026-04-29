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
 * אפקט טייפרייטר — מציג טקסט תו אחרי תו.
 * משתמש ב-IME-safe slicing (Array.from) כדי לטפל נכון בעברית.
 */
export function Typewriter({
  text,
  delay = 200,
  speed = 45,
  className,
  style,
}: Props) {
  const [count, setCount] = useState(0);
  const chars = Array.from(text);

  useEffect(() => {
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

  const visible = chars.slice(0, count).join("");
  const isDone = count >= chars.length;

  return (
    <span className={className} style={style} aria-label={text}>
      {visible}
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
