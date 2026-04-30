/**
 * מערכת ווידג'טים מותאמים — בסגנון אלמנטור.
 * נשמר ב-content.customWidgets ב-DB.
 *
 * כל ווידג'ט הוא אובייקט עם:
 *  - id (מזהה ייחודי)
 *  - type (סוג הווידג'ט)
 *  - props (התוכן והעיצוב הספציפי לסוג)
 */

import type {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";

/* ============================================================
   טיפוסי ווידג'טים — כל סוג עם props ייעודי
   ============================================================ */

export type WidgetType =
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "divider"
  | "spacer"
  | "icon"
  | "icon-box"
  | "gallery"
  | "counter"
  | "testimonial"
  | "alert"
  | "social-icons"
  | "accordion"
  | "tabs";

export type WidgetAlign = "right" | "center" | "left";
export type HeadingLevel = "h1" | "h2" | "h3" | "h4";
export type ButtonStyle = "solid" | "outline" | "ghost";
export type IconName =
  | "star"
  | "heart"
  | "check"
  | "zap"
  | "shield"
  | "trophy"
  | "rocket"
  | "thumbs-up"
  | "smile"
  | "phone"
  | "mail"
  | "map-pin"
  | "clock"
  | "tag"
  | "gift"
  | "lightbulb";
export type SocialName =
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "linkedin"
  | "whatsapp";
export type AlertVariant = "info" | "success" | "warning" | "error";

/* ===== Props per widget type ===== */

export type HeadingProps = {
  text: string;
  level: HeadingLevel;
  align: WidgetAlign;
  color: string;
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
};

export type TextProps = {
  text: string;
  align: WidgetAlign;
  color: string;
  size: "sm" | "base" | "lg";
};

export type ImageProps = {
  src: string;
  alt: string;
  link: string;
  rounded: "none" | "sm" | "md" | "lg" | "full";
  width: "auto" | "full";
  align: WidgetAlign;
};

export type VideoProps = {
  /** URL של YouTube/Vimeo (יומר אוטומטית ל-embed) */
  url: string;
  ratio: "16:9" | "4:3" | "1:1";
  autoplay: boolean;
};

export type ButtonProps = {
  text: string;
  link: string;
  style: ButtonStyle;
  size: "sm" | "md" | "lg";
  align: WidgetAlign;
  bgColor: string;
  textColor: string;
  fullWidth: boolean;
};

export type DividerProps = {
  color: string;
  thickness: "thin" | "medium" | "thick";
  width: "short" | "medium" | "full";
};

export type SpacerProps = {
  height: number; // px
};

export type IconProps = {
  iconName: IconName;
  size: "sm" | "md" | "lg" | "xl";
  color: string;
  align: WidgetAlign;
};

export type IconBoxProps = {
  iconName: IconName;
  iconColor: string;
  title: string;
  description: string;
  align: WidgetAlign;
};

export type GalleryProps = {
  columns: 2 | 3 | 4;
  gap: "sm" | "md" | "lg";
  rounded: "none" | "md" | "lg";
  items: Array<{ src: string; alt: string }>;
};

export type CounterProps = {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  color: string;
};

export type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

export type AlertProps = {
  variant: AlertVariant;
  title: string;
  text: string;
};

export type SocialIconsProps = {
  align: WidgetAlign;
  size: "sm" | "md" | "lg";
  shape: "circle" | "square" | "rounded";
  items: Array<{ network: SocialName; url: string }>;
};

export type AccordionProps = {
  items: Array<{ title: string; content: string }>;
};

export type TabsProps = {
  items: Array<{ title: string; content: string }>;
};

/* ============================================================
   מודל הווידג'ט — כל ווידג'ט במסד
   ============================================================ */

export type WidgetPropsMap = {
  heading: HeadingProps;
  text: TextProps;
  image: ImageProps;
  video: VideoProps;
  button: ButtonProps;
  divider: DividerProps;
  spacer: SpacerProps;
  icon: IconProps;
  "icon-box": IconBoxProps;
  gallery: GalleryProps;
  counter: CounterProps;
  testimonial: TestimonialProps;
  alert: AlertProps;
  "social-icons": SocialIconsProps;
  accordion: AccordionProps;
  tabs: TabsProps;
};

export type WidgetInstance<T extends WidgetType = WidgetType> = {
  id: string;
  type: T;
  props: WidgetPropsMap[T];
};

/* ============================================================
   קטגוריות + Metadata להצגה בפאנל הווידג'טים
   ============================================================ */

export type WidgetCategory = "basic" | "media" | "content" | "general";

export const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  basic: "בסיסי",
  media: "מדיה",
  content: "תוכן",
  general: "כללי",
};

/** שם אייקון מ-lucide-react שמייצג את הווידג'ט בפאנל */
export type WidgetMeta = {
  type: WidgetType;
  label: string;
  category: WidgetCategory;
  /** lucide icon name (מומפה ב-widget-library) */
  iconKey: string;
};

export const WIDGET_REGISTRY: Record<WidgetType, WidgetMeta> = {
  heading: { type: "heading", label: "כותרת", category: "basic", iconKey: "type" },
  text: { type: "text", label: "טקסט", category: "basic", iconKey: "align-right" },
  image: { type: "image", label: "תמונה", category: "media", iconKey: "image" },
  video: { type: "video", label: "וידאו", category: "media", iconKey: "play" },
  button: { type: "button", label: "כפתור", category: "basic", iconKey: "mouse-pointer" },
  divider: { type: "divider", label: "מפריד", category: "basic", iconKey: "minus" },
  spacer: { type: "spacer", label: "מרווח", category: "basic", iconKey: "move-vertical" },
  icon: { type: "icon", label: "אייקון", category: "basic", iconKey: "star" },
  "icon-box": { type: "icon-box", label: "תיבת אייקון", category: "general", iconKey: "square-stack" },
  gallery: { type: "gallery", label: "גלריה", category: "media", iconKey: "layout-grid" },
  counter: { type: "counter", label: "מונה", category: "general", iconKey: "hash" },
  testimonial: { type: "testimonial", label: "המלצה", category: "content", iconKey: "quote" },
  alert: { type: "alert", label: "התראה", category: "general", iconKey: "info" },
  "social-icons": { type: "social-icons", label: "רשתות חברתיות", category: "general", iconKey: "share-2" },
  accordion: { type: "accordion", label: "אקורדיון", category: "content", iconKey: "chevrons-down" },
  tabs: { type: "tabs", label: "לשוניות", category: "content", iconKey: "rectangle-horizontal" },
};

export const ALL_WIDGET_TYPES: WidgetType[] = Object.keys(
  WIDGET_REGISTRY
) as WidgetType[];

/* ============================================================
   יצירת ווידג'ט חדש עם ערכי ברירת מחדל
   ============================================================ */

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `w_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createWidget<T extends WidgetType>(type: T): WidgetInstance<T> {
  const props = DEFAULT_PROPS[type] as WidgetPropsMap[T];
  return {
    id: makeId(),
    type,
    props: structuredCloneSafe(props),
  };
}

function structuredCloneSafe<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export const DEFAULT_PROPS: WidgetPropsMap = {
  heading: {
    text: "כותרת חדשה",
    level: "h2",
    align: "right",
    color: "#FFFFFF",
    size: "xl",
  },
  text: {
    text: "כתוב כאן את הטקסט שלך. ניתן לשנות גודל, צבע ויישור מהפאנל בצד.",
    align: "right",
    color: "#E5E5E5",
    size: "base",
  },
  image: {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
    alt: "תמונה",
    link: "",
    rounded: "lg",
    width: "full",
    align: "center",
  },
  video: {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    ratio: "16:9",
    autoplay: false,
  },
  button: {
    text: "לחץ כאן",
    link: "#",
    style: "solid",
    size: "md",
    align: "center",
    bgColor: "#C9A24A",
    textColor: "#000000",
    fullWidth: false,
  },
  divider: {
    color: "#C9A24A",
    thickness: "medium",
    width: "medium",
  },
  spacer: {
    height: 40,
  },
  icon: {
    iconName: "star",
    size: "lg",
    color: "#C9A24A",
    align: "center",
  },
  "icon-box": {
    iconName: "zap",
    iconColor: "#C9A24A",
    title: "תכונה מרכזית",
    description: "תיאור קצר של מה שהופך את העסק שלך למיוחד.",
    align: "center",
  },
  gallery: {
    columns: 3,
    gap: "md",
    rounded: "lg",
    items: [
      {
        src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
        alt: "תמונה 1",
      },
      {
        src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
        alt: "תמונה 2",
      },
      {
        src: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80",
        alt: "תמונה 3",
      },
    ],
  },
  counter: {
    value: 250,
    prefix: "",
    suffix: "+",
    label: "לקוחות מרוצים",
    color: "#C9A24A",
  },
  testimonial: {
    quote: "השירות היה פשוט מעולה — מקצועי, אדיב ומהיר. ממליצה בחום לכל מי ששוקל לפנות.",
    author: "רחל לוי",
    role: "לקוחה מרוצה",
    avatar: "",
    rating: 5,
  },
  alert: {
    variant: "info",
    title: "שים לב",
    text: "זוהי הודעת מידע. ניתן לשנות את הסוג והתוכן מפאנל ההגדרות.",
  },
  "social-icons": {
    align: "center",
    size: "md",
    shape: "circle",
    items: [
      { network: "facebook", url: "https://facebook.com" },
      { network: "instagram", url: "https://instagram.com" },
      { network: "whatsapp", url: "https://wa.me/972500000000" },
    ],
  },
  accordion: {
    items: [
      { title: "שאלה ראשונה?", content: "תשובה מפורטת לשאלה הראשונה." },
      { title: "שאלה שנייה?", content: "תשובה מפורטת לשאלה השנייה." },
      { title: "שאלה שלישית?", content: "תשובה מפורטת לשאלה השלישית." },
    ],
  },
  tabs: {
    items: [
      { title: "לשונית 1", content: "תוכן הלשונית הראשונה." },
      { title: "לשונית 2", content: "תוכן הלשונית השנייה." },
      { title: "לשונית 3", content: "תוכן הלשונית השלישית." },
    ],
  },
};

/* ============================================================
   Helpers
   ============================================================ */

/** ממיר URL של YouTube ל-embed URL */
export function toYouTubeEmbed(url: string, autoplay: boolean): string {
  if (!url) return "";
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) {
      const params = autoplay ? "?autoplay=1&mute=1" : "";
      return `https://www.youtube.com/embed/${m[1]}${params}`;
    }
  }
  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    const params = autoplay ? "?autoplay=1&muted=1" : "";
    return `https://player.vimeo.com/video/${vimeo[1]}${params}`;
  }
  return url;
}

/** מנקה widgets array מנתונים פגומים */
export function sanitizeWidgets(raw: unknown): WidgetInstance[] {
  if (!Array.isArray(raw)) return [];
  const out: WidgetInstance[] = [];
  for (const item of raw) {
    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      "type" in item &&
      "props" in item &&
      typeof (item as { id: unknown }).id === "string" &&
      typeof (item as { type: unknown }).type === "string" &&
      (item as { type: string }).type in WIDGET_REGISTRY
    ) {
      out.push(item as WidgetInstance);
    }
  }
  return out;
}

/* re-export for tooling consumers if needed */
export type { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon };
