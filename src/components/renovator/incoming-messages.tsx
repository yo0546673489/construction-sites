"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCheckIcon } from "lucide-react";

type IncomingMessage = {
  name: string;
  text: string;
  time: string;
};

type Props = {
  messages: IncomingMessage[];
};

/**
 * IncomingMessages — בועות WhatsApp נכנסות בזו אחר זו.
 * נראה כמו "תראה איך נראה היום שלך עם המערכת":
 *   הודעה 1 → השהיה → הודעה 2 → השהיה → הודעה 3.
 * האנימציה מתחילה כשהקומפוננטה נכנסת לתוך ה-viewport (IntersectionObserver),
 * ככה שהמשתמש לא מפספס את ה-effect אם הוא גולל מהר.
 */
export function IncomingMessages({ messages }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Trigger animation only when section enters viewport
  useEffect(() => {
    const node = ref.current;
    if (!node || hasStarted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Reveal messages one by one once started
  useEffect(() => {
    if (!hasStarted) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    messages.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), 600 + i * 1100)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [hasStarted, messages]);

  return (
    <div
      ref={ref}
      className="mx-auto max-w-md space-y-3 rounded-3xl border border-white/10 bg-[#0B1D2A]/60 p-5 shadow-2xl backdrop-blur-sm"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23C8A45D' fill-opacity='0.04' d='M50 10 L60 30 L40 30 Z'/%3E%3C/svg%3E\")",
        backgroundSize: "60px 60px",
      }}
    >
      {messages.map((msg, i) => {
        const isVisible = i < visibleCount;
        return (
          <div
            key={i}
            className={`flex items-end gap-2 transition-all duration-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            aria-hidden={!isVisible}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "#25D366" }}
            >
              {msg.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="rounded-2xl rounded-tr-md bg-white px-4 py-2.5 text-right text-zinc-900 shadow-md">
                <div className="text-[11px] font-bold" style={{ color: "#075E54" }}>
                  {msg.name}
                </div>
                <p className="mt-0.5 text-sm leading-relaxed md:text-base">
                  {msg.text}
                </p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-zinc-500">
                  <span>{msg.time}</span>
                  <CheckCheckIcon className="size-3 text-[#34B7F1]" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator while waiting for the next message */}
      {hasStarted && visibleCount < messages.length && (
        <div className="flex items-center gap-2 pt-1 pr-12">
          <div className="flex gap-1 rounded-full bg-white/10 px-3 py-2">
            <span
              className="size-1.5 animate-bounce rounded-full bg-white/70"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="size-1.5 animate-bounce rounded-full bg-white/70"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="size-1.5 animate-bounce rounded-full bg-white/70"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
