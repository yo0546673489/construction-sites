"use client";

import { useState } from "react";
import {
  StarIcon,
  HeartIcon,
  CheckIcon,
  ZapIcon,
  ShieldIcon,
  TrophyIcon,
  RocketIcon,
  ThumbsUpIcon,
  SmileIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
  GiftIcon,
  LightbulbIcon,
  ChevronDownIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
} from "lucide-react";
import type {
  IconName,
  SocialName,
  WidgetInstance,
  WidgetAlign,
  AccordionProps,
  TabsProps,
} from "@/lib/widgets";
import { toYouTubeEmbed } from "@/lib/widgets";

/* ===== Inline brand SVGs — לוגואים של רשתות חברתיות ===== */
function FacebookBrand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.48 17.52 2 12 2S2 6.48 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.8 8.43-4.94 8.43-9.94z" />
    </svg>
  );
}
function InstagramBrand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 5.5a4.34 4.34 0 1 0 0 8.68 4.34 4.34 0 0 0 0-8.68zm0 7.16a2.82 2.82 0 1 1 0-5.64 2.82 2.82 0 0 1 0 5.64zm5.52-7.34a1.02 1.02 0 1 1-2.04 0 1.02 1.02 0 0 1 2.04 0z" />
    </svg>
  );
}
function YoutubeBrand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}
function TiktokBrand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.6 6.7a4.6 4.6 0 0 1-2.8-1 4.6 4.6 0 0 1-1.7-3.2H11v13.5a2.7 2.7 0 1 1-1.9-2.6V9.6a6.3 6.3 0 1 0 5.4 6.2V9.5a7.6 7.6 0 0 0 4.4 1.4V6.7h.7z" />
    </svg>
  );
}
function TwitterBrand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function LinkedinBrand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.7a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zM20 19h-3v-5.6c0-1.34-.5-2.1-1.6-2.1-1.2 0-1.9.8-1.9 2.1V19h-3V8h2.9v1.27c.6-.9 1.6-1.5 2.9-1.5 2.2 0 3.7 1.34 3.7 4V19z" />
    </svg>
  );
}
function WhatsappBrand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.514 5.26l-.999 3.648 3.974-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}

const ICON_MAP: Record<IconName, typeof StarIcon> = {
  star: StarIcon,
  heart: HeartIcon,
  check: CheckIcon,
  zap: ZapIcon,
  shield: ShieldIcon,
  trophy: TrophyIcon,
  rocket: RocketIcon,
  "thumbs-up": ThumbsUpIcon,
  smile: SmileIcon,
  phone: PhoneIcon,
  mail: MailIcon,
  "map-pin": MapPinIcon,
  clock: ClockIcon,
  tag: TagIcon,
  gift: GiftIcon,
  lightbulb: LightbulbIcon,
};

type BrandIcon = (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;

const SOCIAL_MAP: Record<
  SocialName,
  { icon: BrandIcon; brandColor: string; label: string }
> = {
  facebook: { icon: FacebookBrand, brandColor: "#1877F2", label: "Facebook" },
  instagram: { icon: InstagramBrand, brandColor: "#E4405F", label: "Instagram" },
  youtube: { icon: YoutubeBrand, brandColor: "#FF0000", label: "YouTube" },
  tiktok: { icon: TiktokBrand, brandColor: "#000000", label: "TikTok" },
  twitter: { icon: TwitterBrand, brandColor: "#000000", label: "Twitter / X" },
  linkedin: { icon: LinkedinBrand, brandColor: "#0A66C2", label: "LinkedIn" },
  whatsapp: { icon: WhatsappBrand, brandColor: "#25D366", label: "WhatsApp" },
};

function alignToFlex(align: WidgetAlign): string {
  return align === "center"
    ? "justify-center text-center"
    : align === "left"
      ? "justify-start text-left"
      : "justify-end text-right";
}

function alignToTextOnly(align: WidgetAlign): string {
  return align === "center"
    ? "text-center"
    : align === "left"
      ? "text-left"
      : "text-right";
}

/* ============================================================
   WidgetRenderer — מציג ווידג'ט בודד.
   משמש גם בתצוגה המקדימה וגם בדף הציבורי.
   ============================================================ */
export function WidgetRenderer({ widget }: { widget: WidgetInstance }) {
  switch (widget.type) {
    case "heading": {
      const p = widget.props as import("@/lib/widgets").HeadingProps;
      const sizeMap: Record<typeof p.size, string> = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
        xl: "text-3xl",
        "2xl": "text-4xl",
        "3xl": "text-5xl",
      };
      const Tag = p.level as keyof React.JSX.IntrinsicElements;
      return (
        <div className={alignToTextOnly(p.align)}>
          <Tag
            className={`${sizeMap[p.size]} font-extrabold leading-tight`}
            style={{ color: p.color }}
          >
            {p.text}
          </Tag>
        </div>
      );
    }

    case "text": {
      const p = widget.props as import("@/lib/widgets").TextProps;
      const sizeMap: Record<typeof p.size, string> = {
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
      };
      return (
        <p
          className={`${sizeMap[p.size]} ${alignToTextOnly(p.align)} leading-relaxed whitespace-pre-wrap`}
          style={{ color: p.color }}
        >
          {p.text}
        </p>
      );
    }

    case "image": {
      const p = widget.props as import("@/lib/widgets").ImageProps;
      const roundedMap: Record<typeof p.rounded, string> = {
        none: "rounded-none",
        sm: "rounded-md",
        md: "rounded-xl",
        lg: "rounded-2xl",
        full: "rounded-full",
      };
      const widthClass = p.width === "auto" ? "max-w-md" : "w-full";
      const inner = (
        <div className={`relative ${widthClass}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.src}
            alt={p.alt}
            className={`w-full h-auto object-cover ${roundedMap[p.rounded]}`}
          />
        </div>
      );
      const wrap = p.link ? (
        <a href={p.link} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        inner
      );
      return <div className={`flex ${alignToFlex(p.align)}`}>{wrap}</div>;
    }

    case "video": {
      const p = widget.props as import("@/lib/widgets").VideoProps;
      const ratioMap: Record<typeof p.ratio, string> = {
        "16:9": "aspect-video",
        "4:3": "aspect-[4/3]",
        "1:1": "aspect-square",
      };
      const embed = toYouTubeEmbed(p.url, p.autoplay);
      if (!embed) {
        return (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/55">
            הזן URL חוקי של YouTube או Vimeo
          </div>
        );
      }
      return (
        <div className={`overflow-hidden rounded-xl ${ratioMap[p.ratio]}`}>
          <iframe
            src={embed}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    case "button": {
      const p = widget.props as import("@/lib/widgets").ButtonProps;
      const sizeMap: Record<typeof p.size, string> = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      };
      const baseClass = `inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 ${sizeMap[p.size]} ${
        p.fullWidth ? "w-full" : ""
      }`;
      const styleObj: React.CSSProperties =
        p.style === "solid"
          ? { backgroundColor: p.bgColor, color: p.textColor }
          : p.style === "outline"
            ? {
                backgroundColor: "transparent",
                color: p.bgColor,
                border: `2px solid ${p.bgColor}`,
              }
            : { backgroundColor: "transparent", color: p.textColor };
      return (
        <div className={`flex ${alignToFlex(p.align)}`}>
          <a
            href={p.link || "#"}
            className={`${baseClass} hover:scale-105`}
            style={styleObj}
          >
            {p.text}
          </a>
        </div>
      );
    }

    case "divider": {
      const p = widget.props as import("@/lib/widgets").DividerProps;
      const thickMap: Record<typeof p.thickness, string> = {
        thin: "border-t",
        medium: "border-t-2",
        thick: "border-t-4",
      };
      const widthMap: Record<typeof p.width, string> = {
        short: "w-16",
        medium: "w-32",
        full: "w-full",
      };
      return (
        <div className="flex justify-center">
          <div
            className={`${thickMap[p.thickness]} ${widthMap[p.width]}`}
            style={{ borderColor: p.color }}
          />
        </div>
      );
    }

    case "spacer": {
      const p = widget.props as import("@/lib/widgets").SpacerProps;
      return <div style={{ height: `${p.height}px` }} aria-hidden />;
    }

    case "icon": {
      const p = widget.props as import("@/lib/widgets").IconProps;
      const Icon = ICON_MAP[p.iconName] ?? StarIcon;
      const sizeMap: Record<typeof p.size, string> = {
        sm: "size-6",
        md: "size-10",
        lg: "size-14",
        xl: "size-20",
      };
      return (
        <div className={`flex ${alignToFlex(p.align)}`}>
          <Icon className={sizeMap[p.size]} style={{ color: p.color }} />
        </div>
      );
    }

    case "icon-box": {
      const p = widget.props as import("@/lib/widgets").IconBoxProps;
      const Icon = ICON_MAP[p.iconName] ?? StarIcon;
      return (
        <div
          className={`flex flex-col gap-3 ${
            p.align === "center"
              ? "items-center text-center"
              : p.align === "left"
                ? "items-start text-left"
                : "items-end text-right"
          }`}
        >
          <div
            className="flex size-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${p.iconColor}1f`, color: p.iconColor }}
          >
            <Icon className="size-7" />
          </div>
          <h4 className="text-lg font-bold text-white">{p.title}</h4>
          <p className="text-sm leading-relaxed text-white/70">
            {p.description}
          </p>
        </div>
      );
    }

    case "gallery": {
      const p = widget.props as import("@/lib/widgets").GalleryProps;
      const colsMap: Record<typeof p.columns, string> = {
        2: "grid-cols-2",
        3: "grid-cols-2 md:grid-cols-3",
        4: "grid-cols-2 md:grid-cols-4",
      };
      const gapMap: Record<typeof p.gap, string> = {
        sm: "gap-2",
        md: "gap-3",
        lg: "gap-5",
      };
      const roundedMap: Record<typeof p.rounded, string> = {
        none: "rounded-none",
        md: "rounded-lg",
        lg: "rounded-xl",
      };
      return (
        <div className={`grid ${colsMap[p.columns]} ${gapMap[p.gap]}`}>
          {p.items.map((it, i) => (
            <div
              key={i}
              className={`relative aspect-square overflow-hidden ${roundedMap[p.rounded]} bg-white/5`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                alt={it.alt}
                className="size-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      );
    }

    case "counter": {
      const p = widget.props as import("@/lib/widgets").CounterProps;
      return (
        <div className="text-center">
          <div
            className="text-5xl font-black md:text-6xl"
            style={{ color: p.color }}
          >
            {p.prefix}
            {p.value.toLocaleString("he-IL")}
            {p.suffix}
          </div>
          <div className="mt-2 text-base text-white/65">{p.label}</div>
        </div>
      );
    }

    case "testimonial": {
      const p = widget.props as import("@/lib/widgets").TestimonialProps;
      return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`size-4 ${
                  i < p.rating
                    ? "fill-[#C9A24A] text-[#C9A24A]"
                    : "text-white/20"
                }`}
              />
            ))}
          </div>
          <p className="mb-5 text-base leading-relaxed text-white/85 md:text-lg">
            &ldquo;{p.quote}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            {p.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatar}
                alt={p.author}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-11 items-center justify-center rounded-full bg-[#C9A24A]/20 text-base font-bold text-[#C9A24A]">
                {p.author.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-bold text-white">{p.author}</div>
              {p.role && (
                <div className="text-xs text-white/55">{p.role}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    case "alert": {
      const p = widget.props as import("@/lib/widgets").AlertProps;
      const variantMap: Record<
        typeof p.variant,
        { Icon: typeof StarIcon; bg: string; border: string; iconCol: string }
      > = {
        info: {
          Icon: InfoIcon,
          bg: "bg-blue-500/10",
          border: "border-blue-400/30",
          iconCol: "text-blue-300",
        },
        success: {
          Icon: CheckCircleIcon,
          bg: "bg-emerald-500/10",
          border: "border-emerald-400/30",
          iconCol: "text-emerald-300",
        },
        warning: {
          Icon: AlertTriangleIcon,
          bg: "bg-amber-500/10",
          border: "border-amber-400/30",
          iconCol: "text-amber-300",
        },
        error: {
          Icon: XCircleIcon,
          bg: "bg-red-500/10",
          border: "border-red-400/30",
          iconCol: "text-red-300",
        },
      };
      const v = variantMap[p.variant];
      return (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 ${v.bg} ${v.border}`}
        >
          <v.Icon className={`mt-0.5 size-5 shrink-0 ${v.iconCol}`} />
          <div className="flex-1">
            <div className="font-bold text-white">{p.title}</div>
            <div className="mt-1 text-sm text-white/75">{p.text}</div>
          </div>
        </div>
      );
    }

    case "social-icons": {
      const p = widget.props as import("@/lib/widgets").SocialIconsProps;
      const sizeMap: Record<typeof p.size, string> = {
        sm: "size-9",
        md: "size-11",
        lg: "size-14",
      };
      const iconSizeMap: Record<typeof p.size, string> = {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
      };
      const shapeMap: Record<typeof p.shape, string> = {
        circle: "rounded-full",
        square: "rounded-none",
        rounded: "rounded-xl",
      };
      return (
        <div className={`flex flex-wrap gap-2.5 ${alignToFlex(p.align)}`}>
          {p.items.map((it, i) => {
            const meta = SOCIAL_MAP[it.network];
            const Icon = meta.icon;
            return (
              <a
                key={i}
                href={it.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={meta.label}
                className={`flex items-center justify-center text-white transition-transform hover:scale-110 ${sizeMap[p.size]} ${shapeMap[p.shape]}`}
                style={{ backgroundColor: meta.brandColor }}
              >
                <Icon className={iconSizeMap[p.size]} />
              </a>
            );
          })}
        </div>
      );
    }

    case "accordion": {
      return <AccordionRender items={(widget.props as AccordionProps).items} />;
    }

    case "tabs": {
      return <TabsRender items={(widget.props as TabsProps).items} />;
    }

    default:
      return null;
  }
}

/* ============================================================
   Accordion + Tabs — דורשים state, אז מופרדים לקומפוננטות.
   ============================================================ */

function AccordionRender({
  items,
}: {
  items: AccordionProps["items"];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid gap-2">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-right hover:bg-white/[0.04]"
            >
              <span className="font-bold text-white">{it.title}</span>
              <ChevronDownIcon
                className={`size-4 text-white/55 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-white/5 px-5 py-3.5 text-sm leading-relaxed text-white/75">
                {it.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TabsRender({ items }: { items: TabsProps["items"] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] p-1">
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              active === i
                ? "bg-[#C9A24A] text-black"
                : "text-white/65 hover:text-white"
            }`}
          >
            {it.title}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-white/80">
        {items[active]?.content}
      </div>
    </div>
  );
}

/* ============================================================
   WidgetsCanvas — מציג רשימת ווידג'טים. משמש גם בתצוגה המקדימה
   (עם controls) וגם בדף הציבורי (clean).
   ============================================================ */
export function WidgetsCanvas({
  widgets,
  className,
}: {
  widgets: WidgetInstance[];
  className?: string;
}) {
  if (!widgets.length) return null;
  return (
    <div className={`grid gap-6 ${className ?? ""}`}>
      {widgets.map((w) => (
        <WidgetRenderer key={w.id} widget={w} />
      ))}
    </div>
  );
}
