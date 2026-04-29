import { MessageCircleIcon } from "lucide-react";

type Props = {
  /** מספר וואטסאפ בפורמט בינלאומי, ללא + (למשל: 972500000000) */
  number: string;
  /** ההודעה הדיפולטית */
  message: string;
};

export function WhatsAppButton({ number, message }: Props) {
  const cleanNumber = number.replace(/\D/g, "");
  const href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="דבר איתי עכשיו בוואטסאפ"
      className="group fixed bottom-6 left-6 z-50 flex items-center gap-2.5 rounded-full bg-black px-5 py-3.5 text-sm font-semibold text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] ring-1 ring-black/10 transition-all hover:shadow-[0_25px_70px_-15px_rgba(201,162,74,0.45)] hover:ring-[#C9A24A]/40"
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-[#25D366] transition-transform group-hover:scale-110">
        <MessageCircleIcon className="size-4 text-white" />
      </span>
      <span className="hidden pr-1 sm:inline">דבר איתי עכשיו</span>
    </a>
  );
}
