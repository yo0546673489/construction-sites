"use client";

import { Edit3Icon } from "lucide-react";
import type { ReactNode, CSSProperties } from "react";

type Props = {
  /** מפתח האלמנט (TextElementKey או SectionElementKey) */
  elementKey: string;
  /** האם האלמנט הזה נבחר כעת */
  selected: boolean;
  onSelect: (key: string) => void;
  /** style נוסף ל-wrapper (יוחל על המסגרת, לא על הילדים) */
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  /** mode קומפקטי לאלמנטים קטנים (badges, footer) */
  compact?: boolean;
  /** האם להפוך את הילדים ללא אינטראקטיביים (ברירת מחדל true בעורך) */
  disableInner?: boolean;
};

/**
 * עוטף אלמנט בעורך הוויזואלי.
 *  - פנסיל זהוב מופיע בפינה (תמיד נראה במצב editing).
 *  - לחיצה על האלמנט או על הפנסיל בוחרת אותו לעריכה.
 *  - hover מציג מסגרת זהב עדינה.
 *  - selected מציג מסגרת זהב מלאה.
 */
export function EditableElement({
  elementKey,
  selected,
  onSelect,
  style,
  className,
  children,
  compact = false,
  disableInner = true,
}: Props) {
  const ringClass = selected
    ? "ring-2 ring-[#C9A24A] ring-offset-2 ring-offset-black z-10"
    : "ring-1 ring-[#C9A24A]/20 hover:ring-2 hover:ring-[#C9A24A]/70 hover:ring-offset-2 hover:ring-offset-black hover:z-10";

  const pencilSize = compact ? "size-5" : "size-6";
  const pencilIcon = compact ? "size-2.5" : "size-3";
  const pencilOffset = compact ? "-top-1.5 -right-1.5" : "-top-2 -right-2";

  return (
    <div
      className={`group/elem relative isolate cursor-pointer rounded-md transition-all ${ringClass} ${className ?? ""}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(elementKey);
      }}
    >
      {/* התוכן עצמו — בלי אינטראקטיביות פנימית בעת עריכה */}
      <div style={disableInner ? { pointerEvents: "none" } : undefined}>
        {children}
      </div>

      {/* פנסיל — תמיד נראה (חצי-שקוף), על hover/selected מלא */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(elementKey);
        }}
        className={`absolute z-30 flex ${pencilSize} ${pencilOffset} items-center justify-center rounded-full bg-[#C9A24A] text-black shadow-lg ring-2 ring-black/20 transition-opacity ${
          selected
            ? "opacity-100"
            : "opacity-50 group-hover/elem:opacity-100"
        }`}
        aria-label="ערוך"
      >
        <Edit3Icon className={pencilIcon} />
      </button>
    </div>
  );
}
