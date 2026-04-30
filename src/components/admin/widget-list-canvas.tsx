"use client";

import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CopyIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { WidgetLibrary } from "./widget-library";
import { WidgetRenderer } from "./widget-renderer";
import {
  createWidget,
  type WidgetInstance,
  type WidgetType,
} from "@/lib/widgets";

type WidgetsUpdater =
  | WidgetInstance[]
  | ((prev: WidgetInstance[]) => WidgetInstance[]);

type Props = {
  widgets: WidgetInstance[];
  onChange: (next: WidgetsUpdater) => void;
  /** ID של ווידג'ט נבחר (כדי להציג ring + toolbar) */
  selectedWidgetId: string | null;
  /** קורה כאשר משתמש לוחץ על ווידג'ט / מבטל בחירה */
  onSelect: (id: string | null) => void;
};

/**
 * רשימת ווידג'טים מותאמים בתוך תצוגת הדף + כפתור "+" בסוף שפותח את הספרייה.
 * משולב בתוך LandingPreview של עורך התוכן הקיים — מצב מאוחד אחד.
 */
export function WidgetListCanvas({
  widgets,
  onChange,
  selectedWidgetId,
  onSelect,
}: Props) {
  const [libraryOpen, setLibraryOpen] = useState(false);

  function add(type: WidgetType) {
    const w = createWidget(type);
    onChange((prev) => [...prev, w]);
    onSelect(w.id);
    setLibraryOpen(false);
  }

  function remove(id: string) {
    onChange((prev) => prev.filter((w) => w.id !== id));
    if (selectedWidgetId === id) onSelect(null);
  }

  function duplicate(id: string) {
    let copyId: string | null = null;
    onChange((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      if (idx < 0) return prev;
      const original = prev[idx];
      const copy = createWidget(original.type);
      copy.props = JSON.parse(JSON.stringify(original.props));
      copyId = copy.id;
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    if (copyId) onSelect(copyId);
  }

  function move(id: string, dir: -1 | 1) {
    onChange((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      if (idx < 0) return prev;
      const nextIdx = idx + dir;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(nextIdx, 0, item);
      return next;
    });
  }

  return (
    <>
      {/* רשימת הווידג'טים שהמשתמש הוסיף — בתוך תצוגת הדף */}
      {widgets.length > 0 && (
        <div
          dir="rtl"
          className="space-y-4 border-t border-white/10 bg-black px-6 py-8 md:px-10"
        >
          <div className="mx-auto max-w-3xl space-y-4">
            {widgets.map((w) => (
              <CanvasItem
                key={w.id}
                widget={w}
                selected={selectedWidgetId === w.id}
                onSelect={onSelect}
                onDelete={remove}
                onDuplicate={duplicate}
                onMoveUp={() => move(w.id, -1)}
                onMoveDown={() => move(w.id, 1)}
              />
            ))}
          </div>
        </div>
      )}

      {/* כפתור "+" — בסוף הדף, תמיד נראה */}
      <div
        dir="rtl"
        className="border-t border-dashed border-white/15 bg-zinc-950/50 px-6 py-10 md:px-10"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLibraryOpen(true);
          }}
          className="group mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] py-6 text-sm font-bold text-white/65 transition-all hover:-translate-y-0.5 hover:border-[#C9A24A] hover:bg-[#C9A24A]/5 hover:text-[#C9A24A] hover:shadow-lg hover:shadow-[#C9A24A]/10"
        >
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-current">
            <PlusIcon className="size-5" />
          </span>
          הוסף אלמנט חדש
        </button>
        {widgets.length === 0 && (
          <p className="mt-4 text-center text-xs text-white/40">
            טקסט · תמונה · וידאו · כפתור · גלריה · המלצה ועוד 10 סוגי ווידג'טים
          </p>
        )}
      </div>

      {/* Overlay — ספריית הווידג'טים */}
      {libraryOpen && (
        <LibraryOverlay
          onClose={() => setLibraryOpen(false)}
          onAdd={add}
        />
      )}
    </>
  );
}

/* ============================================================
   CanvasItem — ווידג'ט בודד עם controls
   ============================================================ */

function CanvasItem({
  widget,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: {
  widget: WidgetInstance;
  selected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(widget.id);
      }}
      className={`group relative cursor-pointer rounded-xl transition-all ${
        selected
          ? "ring-2 ring-[#C9A24A]"
          : "ring-1 ring-transparent hover:ring-1 hover:ring-[#C9A24A]/40"
      }`}
    >
      <div
        className={`absolute -top-3 left-2 z-20 flex items-center gap-1 rounded-full bg-zinc-950 px-1 py-1 shadow-lg shadow-black/50 ring-1 ring-white/10 transition-opacity ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <ToolbarBtn label="הזז למעלה" onClick={onMoveUp}>
          <ArrowUpIcon className="size-3.5" />
        </ToolbarBtn>
        <ToolbarBtn label="הזז למטה" onClick={onMoveDown}>
          <ArrowDownIcon className="size-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="ערוך"
          highlight
          onClick={(e) => {
            e.stopPropagation();
            onSelect(widget.id);
          }}
        >
          <PencilIcon className="size-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="שכפל"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(widget.id);
          }}
        >
          <CopyIcon className="size-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="מחק"
          danger
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("למחוק את הווידג'ט הזה?")) onDelete(widget.id);
          }}
        >
          <Trash2Icon className="size-3.5" />
        </ToolbarBtn>
      </div>
      <div className="p-2">
        <WidgetRenderer widget={widget} />
      </div>
    </div>
  );
}

function ToolbarBtn({
  label,
  onClick,
  children,
  highlight,
  danger,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  highlight?: boolean;
  danger?: boolean;
}) {
  const cls = highlight
    ? "text-[#C9A24A] hover:bg-[#C9A24A]/10"
    : danger
      ? "text-red-300 hover:bg-red-500/10"
      : "text-white/65 hover:bg-white/10 hover:text-white";
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex size-7 items-center justify-center rounded-full transition-colors ${cls}`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   LibraryOverlay — modal סגנון אלמנטור עם ספריית הווידג'טים
   ============================================================ */

function LibraryOverlay({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (type: WidgetType) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel slides from right (RTL — visually from edge) */}
      <div
        className="relative ml-auto h-full w-[360px] shrink-0 border-l border-white/10 bg-zinc-950 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — מעל הכותרת */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-2 top-2 z-10 flex size-9 items-center justify-center rounded-lg text-white/55 hover:bg-white/5 hover:text-white"
          aria-label="סגור"
        >
          <XIcon className="size-4" />
        </button>
        <WidgetLibrary onAdd={onAdd} />
      </div>
    </div>
  );
}
