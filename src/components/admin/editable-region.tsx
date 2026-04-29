"use client";

import { Edit3Icon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  /** מזהה ייחודי של האזור — לדוגמה: "hero", "pain", ... */
  regionId: string;
  /** התווית המוצגת על תג ה-edit */
  label: string;
  /** האם זה האזור הנבחר כעת */
  selected: boolean;
  /** קולבק להודעה למצב שאזור זה נבחר */
  onSelect: (regionId: string) => void;
  /** התוכן עצמו */
  children: ReactNode;
  /** className נוסף ל-wrapper */
  className?: string;
};

/**
 * עוטף אזור בתצוגה המקדימה כך שניתן לבחור אותו לעריכה.
 * הילדים נטולי אינטראקטיביות (pointer-events: none) — כל לחיצה נופלת על ה-wrapper.
 */
export function EditableRegion({
  regionId,
  label,
  selected,
  onSelect,
  children,
  className,
}: Props) {
  const ringClass = selected
    ? "ring-2 ring-[#C9A24A] ring-offset-4 ring-offset-black"
    : "ring-0 ring-transparent hover:ring-2 hover:ring-[#C9A24A]/50 hover:ring-offset-4 hover:ring-offset-black";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(regionId);
      }}
      className={`group/edit relative cursor-pointer rounded-sm transition-all ${ringClass} ${
        className ?? ""
      }`}
    >
      {/* Edit badge */}
      <div
        className={`pointer-events-none absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-[#C9A24A] px-2.5 py-1 text-xs font-bold text-black shadow-lg transition-opacity ${
          selected ? "opacity-100" : "opacity-0 group-hover/edit:opacity-100"
        }`}
      >
        <Edit3Icon className="size-3" />
        {label}
      </div>

      {/* התוכן עצמו — בלי אינטראקטיביות פנימית */}
      <div style={{ pointerEvents: "none" }}>{children}</div>
    </div>
  );
}
