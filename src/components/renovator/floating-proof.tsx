"use client";

import { useEffect, useState } from "react";
import { BellRingIcon, MessageCircleIcon } from "lucide-react";

type Props = {
  notificationText: string;
  whatsappText: string;
};

/**
 * FloatingProof — שני popups צפים ב-Hero:
 *  1. notification "לקוח חדש: שיפוץ דירה..." (עליון)
 *  2. WhatsApp message "שלום, צריך הצעת מחיר..." (תחתון)
 * מופיעים אחרי delay כדי לתת תחושת חיוּת.
 */
export function FloatingProof({ notificationText, whatsappText }: Props) {
  const [showNotification, setShowNotification] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowNotification(true), 2200);
    const t2 = setTimeout(() => setShowWhatsapp(true), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      {/* Notification - top left (RTL: top right visually) */}
      <div
        className={`pointer-events-none absolute z-20 max-w-[280px] transition-all duration-700 ${
          showNotification
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0"
        }`}
        style={{ top: "20%", left: "5%" }}
      >
        <div
          className="flex items-start gap-3 rounded-2xl border border-white/15 p-3 shadow-2xl backdrop-blur-md"
          style={{ background: "rgba(11,29,42,0.85)" }}
        >
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(200,164,93,0.2)", color: "#C8A45D" }}
          >
            <BellRingIcon className="size-4" />
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#C8A45D" }}>
              ליד חדש · עכשיו
            </div>
            <div className="mt-0.5 text-xs font-medium leading-tight text-white md:text-sm">
              {notificationText}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp - bottom right (RTL: bottom left visually) */}
      <div
        className={`pointer-events-none absolute z-20 max-w-[280px] transition-all duration-700 ${
          showWhatsapp
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        }`}
        style={{ bottom: "18%", right: "5%" }}
      >
        <div
          className="flex items-start gap-3 rounded-2xl p-3 shadow-2xl"
          style={{ background: "#FFFFFF" }}
        >
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: "#25D366" }}
          >
            <MessageCircleIcon className="size-4 fill-white text-white" />
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold" style={{ color: "#075E54" }}>
              WhatsApp · כעת
            </div>
            <div className="mt-0.5 text-xs font-medium leading-tight md:text-sm" style={{ color: "#1A1A1A" }}>
              {whatsappText}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
