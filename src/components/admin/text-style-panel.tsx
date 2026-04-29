"use client";

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  RotateCcwIcon,
  TypeIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type SiteContent,
  type TextStyle,
  type FontSize,
  type FontWeight,
  type TextAlign,
} from "@/lib/content";
import {
  TEXT_ELEMENTS,
  type TextElementKey,
  getText,
  setText,
  getStyle,
  setStyle,
} from "@/lib/element-registry";

type Props = {
  elementKey: TextElementKey;
  content: SiteContent;
  onChange: (next: SiteContent) => void;
};

const SIZES: { value: FontSize; label: string }[] = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "S" },
  { value: "base", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
  { value: "4xl", label: "4XL" },
  { value: "5xl", label: "5XL" },
  { value: "6xl", label: "6XL" },
  { value: "7xl", label: "7XL" },
];

const WEIGHTS: { value: FontWeight; label: string }[] = [
  { value: "normal", label: "רגיל" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semi" },
  { value: "bold", label: "Bold" },
  { value: "black", label: "Black" },
];

const COLOR_PRESETS = [
  { value: "#FFFFFF", label: "לבן" },
  { value: "#C9A24A", label: "זהב" },
  { value: "#000000", label: "שחור" },
  { value: "#FF6B00", label: "כתום" },
  { value: "#22C55E", label: "ירוק" },
  { value: "#EF4444", label: "אדום" },
  { value: "#3B82F6", label: "כחול" },
  { value: "#A1A1AA", label: "אפור" },
];

export function TextStylePanel({ elementKey, content, onChange }: Props) {
  const meta = TEXT_ELEMENTS[elementKey];
  const text = getText(content, elementKey);
  const style = getStyle(content, elementKey);

  function updateText(value: string) {
    onChange(setText(content, elementKey, value));
  }
  function updateStyle(patch: Partial<TextStyle>) {
    onChange(setStyle(content, elementKey, { ...style, ...patch }));
  }
  function clearOverride<K extends keyof TextStyle>(field: K) {
    const next = { ...style };
    delete next[field];
    onChange(setStyle(content, elementKey, next));
  }
  function resetAll() {
    onChange(setStyle(content, elementKey, {}));
  }

  const hasOverrides = Object.keys(style).length > 0;

  return (
    <div className="grid gap-6">
      {/* ============== TEXT ============== */}
      <Section title="תוכן">
        <Label className="text-sm font-medium text-white/85">
          {meta.label}
        </Label>
        {meta.inputType === "textarea" ? (
          <Textarea
            value={text}
            onChange={(e) => updateText(e.target.value)}
            rows={4}
            className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30"
          />
        ) : (
          <Input
            value={text}
            onChange={(e) => updateText(e.target.value)}
            className="h-11 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30"
          />
        )}
      </Section>

      {/* ============== FONT SIZE ============== */}
      <Section
        title="גודל פונט"
        onReset={style.size ? () => clearOverride("size") : undefined}
        isOverridden={!!style.size}
      >
        <div className="grid grid-cols-6 gap-1.5">
          {SIZES.map((s) => {
            const active = style.size === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => updateStyle({ size: s.value })}
                className={`rounded-lg border px-2 py-2 text-xs font-bold transition-colors ${
                  active
                    ? "border-[#C9A24A] bg-[#C9A24A] text-black"
                    : "border-white/15 bg-white/5 text-white/75 hover:border-[#C9A24A]/40 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ============== FONT WEIGHT ============== */}
      <Section
        title="משקל"
        onReset={style.weight ? () => clearOverride("weight") : undefined}
        isOverridden={!!style.weight}
      >
        <div className="grid grid-cols-5 gap-1.5">
          {WEIGHTS.map((w) => {
            const active = style.weight === w.value;
            return (
              <button
                key={w.value}
                type="button"
                onClick={() => updateStyle({ weight: w.value })}
                className={`rounded-lg border px-2 py-2 text-[11px] transition-colors ${
                  active
                    ? "border-[#C9A24A] bg-[#C9A24A] text-black"
                    : "border-white/15 bg-white/5 text-white/75 hover:border-[#C9A24A]/40 hover:text-white"
                }`}
                style={{ fontWeight: w.value === "normal" ? 400 : w.value === "medium" ? 500 : w.value === "semibold" ? 600 : w.value === "bold" ? 700 : 900 }}
              >
                {w.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ============== COLOR ============== */}
      <Section
        title="צבע טקסט"
        onReset={style.color ? () => clearOverride("color") : undefined}
        isOverridden={!!style.color}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-8 gap-1.5">
            {COLOR_PRESETS.map((c) => {
              const active = style.color === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => updateStyle({ color: c.value })}
                  title={c.label}
                  className={`relative size-8 rounded-lg border-2 transition-all ${
                    active
                      ? "border-[#C9A24A] ring-2 ring-[#C9A24A]/30"
                      : "border-white/15 hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.label}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.color ?? "#FFFFFF"}
              onChange={(e) => updateStyle({ color: e.target.value })}
              className="size-10 cursor-pointer rounded-lg border border-white/15 bg-transparent"
            />
            <Input
              value={style.color ?? ""}
              placeholder="#FFFFFF"
              onChange={(e) => updateStyle({ color: e.target.value })}
              className="h-10 flex-1 rounded-lg border-white/15 bg-white/5 font-mono text-sm text-white"
              dir="ltr"
            />
          </div>
        </div>
      </Section>

      {/* ============== ALIGNMENT ============== */}
      <Section
        title="יישור"
        onReset={style.align ? () => clearOverride("align") : undefined}
        isOverridden={!!style.align}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { value: "right", icon: AlignRightIcon, label: "ימין" },
              { value: "center", icon: AlignCenterIcon, label: "מרכז" },
              { value: "left", icon: AlignLeftIcon, label: "שמאל" },
            ] as { value: TextAlign; icon: typeof TypeIcon; label: string }[]
          ).map((a) => {
            const active = style.align === a.value;
            return (
              <button
                key={a.value}
                type="button"
                onClick={() => updateStyle({ align: a.value })}
                className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs transition-colors ${
                  active
                    ? "border-[#C9A24A] bg-[#C9A24A] text-black"
                    : "border-white/15 bg-white/5 text-white/75 hover:border-[#C9A24A]/40 hover:text-white"
                }`}
              >
                <a.icon className="size-4" />
                {a.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ============== RESET ALL ============== */}
      {hasOverrides && (
        <button
          type="button"
          onClick={resetAll}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-2.5 text-sm text-white/60 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-300"
        >
          <RotateCcwIcon className="size-4" />
          אפס את כל דריסות העיצוב לאלמנט זה
        </button>
      )}
    </div>
  );
}

/* ---------- Section helper (קבוצה של פקדים עם כותרת) ---------- */
function Section({
  title,
  onReset,
  isOverridden,
  children,
}: {
  title: string;
  onReset?: () => void;
  isOverridden?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-widest text-white/45">
          {title}
        </Label>
        {isOverridden && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] font-medium text-white/40 hover:text-[#C9A24A]"
          >
            <RotateCcwIcon className="size-2.5" />
            אפס
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
