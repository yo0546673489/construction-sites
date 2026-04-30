"use client";

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  WidgetInstance,
  WidgetAlign,
  HeadingProps,
  TextProps,
  ImageProps,
  VideoProps,
  ButtonProps,
  DividerProps,
  SpacerProps,
  IconProps,
  IconBoxProps,
  GalleryProps,
  CounterProps,
  TestimonialProps,
  AlertProps,
  SocialIconsProps,
  AccordionProps,
  TabsProps,
  IconName,
  SocialName,
} from "@/lib/widgets";

const COLOR_PRESETS = [
  "#FFFFFF",
  "#000000",
  "#C9A24A",
  "#FF6B00",
  "#22C55E",
  "#EF4444",
  "#3B82F6",
  "#A1A1AA",
];

const ICON_NAMES: IconName[] = [
  "star",
  "heart",
  "check",
  "zap",
  "shield",
  "trophy",
  "rocket",
  "thumbs-up",
  "smile",
  "phone",
  "mail",
  "map-pin",
  "clock",
  "tag",
  "gift",
  "lightbulb",
];

const SOCIAL_NAMES: SocialName[] = [
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
  "twitter",
  "linkedin",
  "whatsapp",
];

type Props = {
  widget: WidgetInstance;
  onChange: (widget: WidgetInstance) => void;
};

/** פאנל הגדרות לפי סוג ווידג'ט. */
export function WidgetSettings({ widget, onChange }: Props) {
  function setProps<P>(patch: Partial<P>) {
    onChange({
      ...widget,
      props: { ...(widget.props as P), ...patch } as typeof widget.props,
    });
  }

  switch (widget.type) {
    case "heading":
      return (
        <HeadingSettings
          p={widget.props as HeadingProps}
          set={(patch) => setProps<HeadingProps>(patch)}
        />
      );
    case "text":
      return (
        <TextSettings
          p={widget.props as TextProps}
          set={(patch) => setProps<TextProps>(patch)}
        />
      );
    case "image":
      return (
        <ImageSettings
          p={widget.props as ImageProps}
          set={(patch) => setProps<ImageProps>(patch)}
        />
      );
    case "video":
      return (
        <VideoSettings
          p={widget.props as VideoProps}
          set={(patch) => setProps<VideoProps>(patch)}
        />
      );
    case "button":
      return (
        <ButtonSettings
          p={widget.props as ButtonProps}
          set={(patch) => setProps<ButtonProps>(patch)}
        />
      );
    case "divider":
      return (
        <DividerSettings
          p={widget.props as DividerProps}
          set={(patch) => setProps<DividerProps>(patch)}
        />
      );
    case "spacer":
      return (
        <SpacerSettings
          p={widget.props as SpacerProps}
          set={(patch) => setProps<SpacerProps>(patch)}
        />
      );
    case "icon":
      return (
        <IconSettings
          p={widget.props as IconProps}
          set={(patch) => setProps<IconProps>(patch)}
        />
      );
    case "icon-box":
      return (
        <IconBoxSettings
          p={widget.props as IconBoxProps}
          set={(patch) => setProps<IconBoxProps>(patch)}
        />
      );
    case "gallery":
      return (
        <GallerySettings
          p={widget.props as GalleryProps}
          set={(patch) => setProps<GalleryProps>(patch)}
        />
      );
    case "counter":
      return (
        <CounterSettings
          p={widget.props as CounterProps}
          set={(patch) => setProps<CounterProps>(patch)}
        />
      );
    case "testimonial":
      return (
        <TestimonialSettings
          p={widget.props as TestimonialProps}
          set={(patch) => setProps<TestimonialProps>(patch)}
        />
      );
    case "alert":
      return (
        <AlertSettings
          p={widget.props as AlertProps}
          set={(patch) => setProps<AlertProps>(patch)}
        />
      );
    case "social-icons":
      return (
        <SocialIconsSettings
          p={widget.props as SocialIconsProps}
          set={(patch) => setProps<SocialIconsProps>(patch)}
        />
      );
    case "accordion":
      return (
        <AccordionSettings
          p={widget.props as AccordionProps}
          set={(patch) => setProps<AccordionProps>(patch)}
        />
      );
    case "tabs":
      return (
        <TabsSettings
          p={widget.props as TabsProps}
          set={(patch) => setProps<TabsProps>(patch)}
        />
      );
    default:
      return null;
  }
}

/* ============================================================
   Shared UI primitives
   ============================================================ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-bold uppercase tracking-widest text-white/45">
        {title}
      </Label>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-sm font-medium text-white/85">{children}</Label>;
}

function TInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { full?: boolean }
) {
  const { full, className, ...rest } = props;
  return (
    <Input
      {...rest}
      className={`h-10 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30 ${
        full ? "w-full" : ""
      } ${className ?? ""}`}
    />
  );
}

function TArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Textarea
      {...props}
      className={`rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30 ${
        props.className ?? ""
      }`}
    />
  );
}

function ColorRow({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-8 gap-1.5">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`relative size-7 rounded-md border-2 transition-all ${
              value === c
                ? "border-[#C9A24A] ring-2 ring-[#C9A24A]/30"
                : "border-white/15 hover:scale-110"
            }`}
            style={{ backgroundColor: c }}
            aria-label={c}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 cursor-pointer rounded-lg border border-white/15 bg-transparent"
        />
        <TInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          className="flex-1 font-mono text-xs"
        />
      </div>
    </div>
  );
}

function AlignRow({
  value,
  onChange,
}: {
  value: WidgetAlign;
  onChange: (v: WidgetAlign) => void;
}) {
  const opts: { v: WidgetAlign; Icon: typeof AlignRightIcon; label: string }[] =
    [
      { v: "right", Icon: AlignRightIcon, label: "ימין" },
      { v: "center", Icon: AlignCenterIcon, label: "מרכז" },
      { v: "left", Icon: AlignLeftIcon, label: "שמאל" },
    ];
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {opts.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs transition-colors ${
              active
                ? "border-[#C9A24A] bg-[#C9A24A] text-black"
                : "border-white/15 bg-white/5 text-white/70 hover:border-[#C9A24A]/40 hover:text-white"
            }`}
          >
            <o.Icon className="size-3.5" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ChipRow<T extends string | number>({
  value,
  options,
  onChange,
  cols = 4,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  cols?: number;
}) {
  return (
    <div
      className={`grid gap-1.5`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-lg border px-2 py-2 text-xs font-bold transition-colors ${
              active
                ? "border-[#C9A24A] bg-[#C9A24A] text-black"
                : "border-white/15 bg-white/5 text-white/75 hover:border-[#C9A24A]/40 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   Per-type settings
   ============================================================ */

type S<P> = { p: P; set: (patch: Partial<P>) => void };

function HeadingSettings({ p, set }: S<HeadingProps>) {
  return (
    <div className="grid gap-5">
      <Section title="תוכן">
        <FieldLabel>טקסט הכותרת</FieldLabel>
        <TInput value={p.text} onChange={(e) => set({ text: e.target.value })} />
      </Section>
      <Section title="רמת כותרת">
        <ChipRow
          value={p.level}
          onChange={(v) => set({ level: v })}
          options={[
            { value: "h1", label: "H1" },
            { value: "h2", label: "H2" },
            { value: "h3", label: "H3" },
            { value: "h4", label: "H4" },
          ]}
        />
      </Section>
      <Section title="גודל">
        <ChipRow
          value={p.size}
          onChange={(v) => set({ size: v })}
          cols={3}
          options={[
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
            { value: "xl", label: "XL" },
            { value: "2xl", label: "2XL" },
            { value: "3xl", label: "3XL" },
          ]}
        />
      </Section>
      <Section title="יישור">
        <AlignRow value={p.align} onChange={(v) => set({ align: v })} />
      </Section>
      <Section title="צבע">
        <ColorRow value={p.color} onChange={(v) => set({ color: v })} />
      </Section>
    </div>
  );
}

function TextSettings({ p, set }: S<TextProps>) {
  return (
    <div className="grid gap-5">
      <Section title="תוכן">
        <FieldLabel>הטקסט</FieldLabel>
        <TArea
          value={p.text}
          rows={5}
          onChange={(e) => set({ text: e.target.value })}
        />
      </Section>
      <Section title="גודל">
        <ChipRow
          value={p.size}
          onChange={(v) => set({ size: v })}
          cols={3}
          options={[
            { value: "sm", label: "קטן" },
            { value: "base", label: "רגיל" },
            { value: "lg", label: "גדול" },
          ]}
        />
      </Section>
      <Section title="יישור">
        <AlignRow value={p.align} onChange={(v) => set({ align: v })} />
      </Section>
      <Section title="צבע">
        <ColorRow value={p.color} onChange={(v) => set({ color: v })} />
      </Section>
    </div>
  );
}

function ImageSettings({ p, set }: S<ImageProps>) {
  return (
    <div className="grid gap-5">
      <Section title="כתובת תמונה (URL)">
        <TInput
          value={p.src}
          dir="ltr"
          onChange={(e) => set({ src: e.target.value })}
          placeholder="https://..."
        />
      </Section>
      <Section title="טקסט חלופי (alt)">
        <TInput value={p.alt} onChange={(e) => set({ alt: e.target.value })} />
      </Section>
      <Section title="קישור (אופציונלי)">
        <TInput
          value={p.link}
          dir="ltr"
          onChange={(e) => set({ link: e.target.value })}
          placeholder="https://..."
        />
      </Section>
      <Section title="עיגול פינות">
        <ChipRow
          value={p.rounded}
          onChange={(v) => set({ rounded: v })}
          cols={5}
          options={[
            { value: "none", label: "אין" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
            { value: "full", label: "עיגול" },
          ]}
        />
      </Section>
      <Section title="רוחב">
        <ChipRow
          value={p.width}
          onChange={(v) => set({ width: v })}
          cols={2}
          options={[
            { value: "auto", label: "אוטומטי" },
            { value: "full", label: "מלא" },
          ]}
        />
      </Section>
      <Section title="יישור">
        <AlignRow value={p.align} onChange={(v) => set({ align: v })} />
      </Section>
    </div>
  );
}

function VideoSettings({ p, set }: S<VideoProps>) {
  return (
    <div className="grid gap-5">
      <Section title="כתובת הוידאו (YouTube/Vimeo)">
        <TInput
          value={p.url}
          dir="ltr"
          onChange={(e) => set({ url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-[11px] text-white/40">
          תומך ב-YouTube ו-Vimeo. ההמרה לפורמט embed היא אוטומטית.
        </p>
      </Section>
      <Section title="יחס מסך">
        <ChipRow
          value={p.ratio}
          onChange={(v) => set({ ratio: v })}
          cols={3}
          options={[
            { value: "16:9", label: "16:9" },
            { value: "4:3", label: "4:3" },
            { value: "1:1", label: "1:1" },
          ]}
        />
      </Section>
      <Section title="הפעלה אוטומטית">
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
          <span className="text-sm text-white/85">Autoplay (ללא קול)</span>
          <input
            type="checkbox"
            checked={p.autoplay}
            onChange={(e) => set({ autoplay: e.target.checked })}
            className="size-4 accent-[#C9A24A]"
          />
        </label>
      </Section>
    </div>
  );
}

function ButtonSettings({ p, set }: S<ButtonProps>) {
  return (
    <div className="grid gap-5">
      <Section title="טקסט">
        <TInput value={p.text} onChange={(e) => set({ text: e.target.value })} />
      </Section>
      <Section title="קישור">
        <TInput
          value={p.link}
          dir="ltr"
          onChange={(e) => set({ link: e.target.value })}
          placeholder="https://... או #section"
        />
      </Section>
      <Section title="סגנון">
        <ChipRow
          value={p.style}
          onChange={(v) => set({ style: v })}
          cols={3}
          options={[
            { value: "solid", label: "מלא" },
            { value: "outline", label: "מסגרת" },
            { value: "ghost", label: "שקוף" },
          ]}
        />
      </Section>
      <Section title="גודל">
        <ChipRow
          value={p.size}
          onChange={(v) => set({ size: v })}
          cols={3}
          options={[
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
        />
      </Section>
      <Section title="יישור">
        <AlignRow value={p.align} onChange={(v) => set({ align: v })} />
      </Section>
      <Section title="צבע רקע / מסגרת">
        <ColorRow value={p.bgColor} onChange={(v) => set({ bgColor: v })} />
      </Section>
      <Section title="צבע טקסט">
        <ColorRow value={p.textColor} onChange={(v) => set({ textColor: v })} />
      </Section>
      <Section title="רוחב">
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
          <span className="text-sm text-white/85">רוחב מלא</span>
          <input
            type="checkbox"
            checked={p.fullWidth}
            onChange={(e) => set({ fullWidth: e.target.checked })}
            className="size-4 accent-[#C9A24A]"
          />
        </label>
      </Section>
    </div>
  );
}

function DividerSettings({ p, set }: S<DividerProps>) {
  return (
    <div className="grid gap-5">
      <Section title="צבע">
        <ColorRow value={p.color} onChange={(v) => set({ color: v })} />
      </Section>
      <Section title="עובי">
        <ChipRow
          value={p.thickness}
          onChange={(v) => set({ thickness: v })}
          cols={3}
          options={[
            { value: "thin", label: "דק" },
            { value: "medium", label: "בינוני" },
            { value: "thick", label: "עבה" },
          ]}
        />
      </Section>
      <Section title="רוחב">
        <ChipRow
          value={p.width}
          onChange={(v) => set({ width: v })}
          cols={3}
          options={[
            { value: "short", label: "קצר" },
            { value: "medium", label: "בינוני" },
            { value: "full", label: "מלא" },
          ]}
        />
      </Section>
    </div>
  );
}

function SpacerSettings({ p, set }: S<SpacerProps>) {
  return (
    <div className="grid gap-5">
      <Section title={`גובה (${p.height}px)`}>
        <input
          type="range"
          min={8}
          max={200}
          value={p.height}
          onChange={(e) => set({ height: Number(e.target.value) })}
          className="w-full accent-[#C9A24A]"
        />
        <TInput
          type="number"
          value={p.height}
          onChange={(e) => set({ height: Number(e.target.value) || 0 })}
          dir="ltr"
        />
      </Section>
    </div>
  );
}

function IconSettings({ p, set }: S<IconProps>) {
  return (
    <div className="grid gap-5">
      <Section title="אייקון">
        <div className="grid grid-cols-4 gap-1.5">
          {ICON_NAMES.map((name) => {
            const active = p.iconName === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => set({ iconName: name })}
                className={`rounded-lg border px-2 py-2.5 text-[10px] font-medium transition-colors ${
                  active
                    ? "border-[#C9A24A] bg-[#C9A24A]/10 text-[#C9A24A]"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-[#C9A24A]/40 hover:text-white"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </Section>
      <Section title="גודל">
        <ChipRow
          value={p.size}
          onChange={(v) => set({ size: v })}
          cols={4}
          options={[
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
            { value: "xl", label: "XL" },
          ]}
        />
      </Section>
      <Section title="יישור">
        <AlignRow value={p.align} onChange={(v) => set({ align: v })} />
      </Section>
      <Section title="צבע">
        <ColorRow value={p.color} onChange={(v) => set({ color: v })} />
      </Section>
    </div>
  );
}

function IconBoxSettings({ p, set }: S<IconBoxProps>) {
  return (
    <div className="grid gap-5">
      <Section title="אייקון">
        <div className="grid grid-cols-4 gap-1.5">
          {ICON_NAMES.map((name) => {
            const active = p.iconName === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => set({ iconName: name })}
                className={`rounded-lg border px-2 py-2.5 text-[10px] font-medium transition-colors ${
                  active
                    ? "border-[#C9A24A] bg-[#C9A24A]/10 text-[#C9A24A]"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-[#C9A24A]/40 hover:text-white"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </Section>
      <Section title="צבע אייקון">
        <ColorRow
          value={p.iconColor}
          onChange={(v) => set({ iconColor: v })}
        />
      </Section>
      <Section title="כותרת">
        <TInput
          value={p.title}
          onChange={(e) => set({ title: e.target.value })}
        />
      </Section>
      <Section title="תיאור">
        <TArea
          rows={3}
          value={p.description}
          onChange={(e) => set({ description: e.target.value })}
        />
      </Section>
      <Section title="יישור">
        <AlignRow value={p.align} onChange={(v) => set({ align: v })} />
      </Section>
    </div>
  );
}

function GallerySettings({ p, set }: S<GalleryProps>) {
  function update(idx: number, field: "src" | "alt", value: string) {
    const items = [...p.items];
    items[idx] = { ...items[idx], [field]: value };
    set({ items });
  }
  function add() {
    set({
      items: [
        ...p.items,
        {
          src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
          alt: `תמונה ${p.items.length + 1}`,
        },
      ],
    });
  }
  function remove(idx: number) {
    set({ items: p.items.filter((_, i) => i !== idx) });
  }

  return (
    <div className="grid gap-5">
      <Section title="עמודות">
        <ChipRow
          value={p.columns}
          onChange={(v) => set({ columns: v })}
          cols={3}
          options={[
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
          ]}
        />
      </Section>
      <Section title="מרווח">
        <ChipRow
          value={p.gap}
          onChange={(v) => set({ gap: v })}
          cols={3}
          options={[
            { value: "sm", label: "קטן" },
            { value: "md", label: "בינוני" },
            { value: "lg", label: "גדול" },
          ]}
        />
      </Section>
      <Section title="עיגול פינות">
        <ChipRow
          value={p.rounded}
          onChange={(v) => set({ rounded: v })}
          cols={3}
          options={[
            { value: "none", label: "אין" },
            { value: "md", label: "בינוני" },
            { value: "lg", label: "מעוגל" },
          ]}
        />
      </Section>
      <Section title="תמונות">
        <div className="grid gap-2">
          {p.items.map((it, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">
                  תמונה {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-white/35 hover:text-red-400"
                  aria-label="הסר"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>
              <TInput
                value={it.src}
                placeholder="כתובת תמונה"
                dir="ltr"
                onChange={(e) => update(idx, "src", e.target.value)}
                className="mb-1.5 h-9 text-xs"
              />
              <TInput
                value={it.alt}
                placeholder="טקסט חלופי"
                onChange={(e) => update(idx, "alt", e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={add}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] py-2.5 text-xs text-white/65 hover:border-[#C9A24A]/40 hover:text-[#C9A24A]"
        >
          <PlusIcon className="size-3.5" />
          הוסף תמונה
        </button>
      </Section>
    </div>
  );
}

function CounterSettings({ p, set }: S<CounterProps>) {
  return (
    <div className="grid gap-5">
      <Section title="ערך">
        <TInput
          type="number"
          dir="ltr"
          value={p.value}
          onChange={(e) => set({ value: Number(e.target.value) || 0 })}
        />
      </Section>
      <Section title="קידומת / סופית">
        <div className="grid grid-cols-2 gap-2">
          <TInput
            value={p.prefix}
            placeholder="קידומת"
            onChange={(e) => set({ prefix: e.target.value })}
          />
          <TInput
            value={p.suffix}
            placeholder="סופית"
            onChange={(e) => set({ suffix: e.target.value })}
          />
        </div>
      </Section>
      <Section title="טקסט">
        <TInput
          value={p.label}
          onChange={(e) => set({ label: e.target.value })}
        />
      </Section>
      <Section title="צבע מספר">
        <ColorRow value={p.color} onChange={(v) => set({ color: v })} />
      </Section>
    </div>
  );
}

function TestimonialSettings({ p, set }: S<TestimonialProps>) {
  return (
    <div className="grid gap-5">
      <Section title="ציטוט">
        <TArea
          rows={4}
          value={p.quote}
          onChange={(e) => set({ quote: e.target.value })}
        />
      </Section>
      <Section title="שם המעיד">
        <TInput
          value={p.author}
          onChange={(e) => set({ author: e.target.value })}
        />
      </Section>
      <Section title="תפקיד">
        <TInput
          value={p.role}
          onChange={(e) => set({ role: e.target.value })}
        />
      </Section>
      <Section title="תמונה (URL)">
        <TInput
          value={p.avatar}
          dir="ltr"
          onChange={(e) => set({ avatar: e.target.value })}
          placeholder="אופציונלי"
        />
      </Section>
      <Section title="דירוג כוכבים">
        <ChipRow
          value={p.rating}
          onChange={(v) => set({ rating: v })}
          cols={5}
          options={[
            { value: 1, label: "★" },
            { value: 2, label: "★★" },
            { value: 3, label: "★★★" },
            { value: 4, label: "★★★★" },
            { value: 5, label: "★★★★★" },
          ]}
        />
      </Section>
    </div>
  );
}

function AlertSettings({ p, set }: S<AlertProps>) {
  return (
    <div className="grid gap-5">
      <Section title="סוג">
        <ChipRow
          value={p.variant}
          onChange={(v) => set({ variant: v })}
          cols={4}
          options={[
            { value: "info", label: "מידע" },
            { value: "success", label: "הצלחה" },
            { value: "warning", label: "אזהרה" },
            { value: "error", label: "שגיאה" },
          ]}
        />
      </Section>
      <Section title="כותרת">
        <TInput
          value={p.title}
          onChange={(e) => set({ title: e.target.value })}
        />
      </Section>
      <Section title="תוכן">
        <TArea
          rows={3}
          value={p.text}
          onChange={(e) => set({ text: e.target.value })}
        />
      </Section>
    </div>
  );
}

function SocialIconsSettings({ p, set }: S<SocialIconsProps>) {
  function update(idx: number, field: "network" | "url", value: string) {
    const items = [...p.items];
    items[idx] = { ...items[idx], [field]: value as never };
    set({ items });
  }
  function add() {
    set({
      items: [...p.items, { network: "facebook", url: "https://facebook.com" }],
    });
  }
  function remove(idx: number) {
    set({ items: p.items.filter((_, i) => i !== idx) });
  }

  return (
    <div className="grid gap-5">
      <Section title="גודל">
        <ChipRow
          value={p.size}
          onChange={(v) => set({ size: v })}
          cols={3}
          options={[
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
        />
      </Section>
      <Section title="צורה">
        <ChipRow
          value={p.shape}
          onChange={(v) => set({ shape: v })}
          cols={3}
          options={[
            { value: "circle", label: "עיגול" },
            { value: "rounded", label: "מעוגל" },
            { value: "square", label: "ריבוע" },
          ]}
        />
      </Section>
      <Section title="יישור">
        <AlignRow value={p.align} onChange={(v) => set({ align: v })} />
      </Section>
      <Section title="רשתות">
        <div className="grid gap-2">
          {p.items.map((it, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">
                  פריט {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-white/35 hover:text-red-400"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>
              <select
                value={it.network}
                onChange={(e) => update(idx, "network", e.target.value)}
                className="mb-1.5 h-9 w-full rounded-md border border-white/15 bg-white/5 px-2 text-xs text-white"
              >
                {SOCIAL_NAMES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <TInput
                value={it.url}
                placeholder="כתובת"
                dir="ltr"
                onChange={(e) => update(idx, "url", e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={add}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] py-2.5 text-xs text-white/65 hover:border-[#C9A24A]/40 hover:text-[#C9A24A]"
        >
          <PlusIcon className="size-3.5" />
          הוסף רשת
        </button>
      </Section>
    </div>
  );
}

function AccordionSettings({ p, set }: S<AccordionProps>) {
  return (
    <ListPairSettings
      items={p.items}
      titleLabel="כותרת"
      contentLabel="תוכן"
      onChange={(items) => set({ items })}
      addLabel="הוסף שאלה"
      defaultItem={{ title: "שאלה חדשה?", content: "תשובה." }}
    />
  );
}

function TabsSettings({ p, set }: S<TabsProps>) {
  return (
    <ListPairSettings
      items={p.items}
      titleLabel="שם הלשונית"
      contentLabel="תוכן הלשונית"
      onChange={(items) => set({ items })}
      addLabel="הוסף לשונית"
      defaultItem={{ title: "לשונית חדשה", content: "תוכן..." }}
    />
  );
}

function ListPairSettings({
  items,
  titleLabel,
  contentLabel,
  onChange,
  addLabel,
  defaultItem,
}: {
  items: { title: string; content: string }[];
  titleLabel: string;
  contentLabel: string;
  addLabel: string;
  defaultItem: { title: string; content: string };
  onChange: (items: { title: string; content: string }[]) => void;
}) {
  function update(idx: number, field: "title" | "content", value: string) {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  }
  function add() {
    onChange([...items, { ...defaultItem }]);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div className="grid gap-2">
      {items.map((it, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">
              פריט {idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-white/35 hover:text-red-400"
            >
              <Trash2Icon className="size-3.5" />
            </button>
          </div>
          <FieldLabel>{titleLabel}</FieldLabel>
          <TInput
            value={it.title}
            onChange={(e) => update(idx, "title", e.target.value)}
            className="mb-2 h-9 text-xs"
          />
          <FieldLabel>{contentLabel}</FieldLabel>
          <TArea
            rows={3}
            value={it.content}
            onChange={(e) => update(idx, "content", e.target.value)}
            className="text-xs"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] py-2.5 text-xs text-white/65 hover:border-[#C9A24A]/40 hover:text-[#C9A24A]"
      >
        <PlusIcon className="size-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
