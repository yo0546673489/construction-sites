"use client";

import { CheckCheckIcon, MessageCircleIcon } from "lucide-react";

type Message = {
  name: string;
  text: string;
  time: string;
};

type Props = {
  messages: Message[];
};

/**
 * WhatsApp chat mockup — נראה כמו צילום מסך אמיתי של וואטסאפ.
 * רקע ירוק עדין, בועות צ'אט, סימני "נקרא".
 */
export function WhatsAppChat({ messages }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          {/* Header — נראה כמו וואטסאפ */}
          <div className="flex items-center gap-3 border-b border-zinc-100 bg-[#075E54] px-4 py-3 text-white">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/15 font-bold">
              {msg.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{msg.name}</div>
              <div className="text-[10px] opacity-80">מקוון</div>
            </div>
            <MessageCircleIcon className="size-5 opacity-70" />
          </div>

          {/* Body — bubble על רקע WhatsApp */}
          <div
            className="space-y-2 px-4 py-5"
            style={{
              background:
                "linear-gradient(180deg, #ECE5DD 0%, #DCD3C4 100%)",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23000' fill-opacity='0.03' d='M50 10 L60 30 L40 30 Z'/%3E%3C/svg%3E\")",
              backgroundSize: "60px 60px",
            }}
          >
            <div className="ml-auto max-w-[85%]">
              <div className="relative rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm">
                <p className="leading-relaxed">{msg.text}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-zinc-500">
                  <span>{msg.time}</span>
                  <CheckCheckIcon className="size-3 text-[#34B7F1]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
