"use client";

import { useMemo, useState } from "react";
import {
  TypeIcon,
  AlignRightIcon,
  ImageIcon,
  PlayIcon,
  MousePointerClickIcon,
  MinusIcon,
  MoveVerticalIcon,
  StarIcon,
  SquareStackIcon,
  LayoutGridIcon,
  HashIcon,
  QuoteIcon,
  InfoIcon,
  Share2Icon,
  ChevronsDownIcon,
  RectangleHorizontalIcon,
  SearchIcon,
} from "lucide-react";
import {
  WIDGET_REGISTRY,
  CATEGORY_LABELS,
  type WidgetCategory,
  type WidgetMeta,
  type WidgetType,
} from "@/lib/widgets";

const ICON_MAP: Record<string, typeof TypeIcon> = {
  type: TypeIcon,
  "align-right": AlignRightIcon,
  image: ImageIcon,
  play: PlayIcon,
  "mouse-pointer": MousePointerClickIcon,
  minus: MinusIcon,
  "move-vertical": MoveVerticalIcon,
  star: StarIcon,
  "square-stack": SquareStackIcon,
  "layout-grid": LayoutGridIcon,
  hash: HashIcon,
  quote: QuoteIcon,
  info: InfoIcon,
  "share-2": Share2Icon,
  "chevrons-down": ChevronsDownIcon,
  "rectangle-horizontal": RectangleHorizontalIcon,
};

type Props = {
  onAdd: (type: WidgetType) => void;
};

const CATEGORY_ORDER: WidgetCategory[] = [
  "basic",
  "media",
  "content",
  "general",
];

/** ספריית הווידג'טים — בסגנון אלמנטור.
 *  פאנל קבוע משמאל עם חיפוש + רשת של ווידג'טים מקובצים בקטגוריות. */
export function WidgetLibrary({ onAdd }: Props) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = Object.values(WIDGET_REGISTRY);
    const filtered = q
      ? all.filter(
          (w) => w.label.toLowerCase().includes(q) || w.type.includes(q)
        )
      : all;
    const map: Record<WidgetCategory, WidgetMeta[]> = {
      basic: [],
      media: [],
      content: [],
      general: [],
    };
    for (const w of filtered) map[w.category].push(w);
    return CATEGORY_ORDER.map((c) => ({
      category: c,
      label: CATEGORY_LABELS[c],
      items: map[c],
    })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <aside className="flex h-full w-full flex-col bg-slate-50">
      <div className="border-b border-slate-200 px-4 py-3.5">
        <h2 className="text-center text-sm font-bold text-slate-900">אלמנטים</h2>
      </div>

      <div className="border-b border-slate-200 px-3 py-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="חיפוש ווידג'ט..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-9 pl-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.length === 0 && (
          <div className="px-2 py-8 text-center text-sm text-slate-400">
            לא נמצאו ווידג'טים תואמים
          </div>
        )}
        {groups.map((g) => (
          <div key={g.category}>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {g.label}
              </span>
              <span className="text-xs text-slate-300">{g.items.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {g.items.map((w) => (
                <WidgetCard key={w.type} meta={w} onAdd={onAdd} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-center text-[11px] text-slate-400">
        לחץ על ווידג'ט כדי להוסיפו לעמוד
      </div>
    </aside>
  );
}

function WidgetCard({
  meta,
  onAdd,
}: {
  meta: WidgetMeta;
  onAdd: (type: WidgetType) => void;
}) {
  const Icon = ICON_MAP[meta.iconKey] ?? StarIcon;
  return (
    <button
      type="button"
      onClick={() => onAdd(meta.type)}
      className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white shadow-sm p-3 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-500/[0.06] hover:shadow-lg hover:shadow-[#C9A24A]/10"
    >
      <Icon className="size-7 text-slate-600 transition-colors group-hover:text-emerald-600" />
      <span className="text-center text-[12px] font-medium leading-tight text-slate-700 group-hover:text-slate-900">
        {meta.label}
      </span>
    </button>
  );
}
