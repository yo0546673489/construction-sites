/**
 * רישום של כל ה"אלמנטים" הניתנים לעריכה בדף הנחיתה.
 * כל אלמנט: text או image או list-section.
 * המפתחות נשמרים ב-styleOverrides של ה-content.
 */

import type { SiteContent, TextStyle } from "@/lib/content";

/* ===== TEXT element keys (ניתנים לעריכת טקסט + סגנון) ===== */
export type TextElementKey =
  | "hero.badge"
  | "hero.headlineLine1"
  | "hero.headlineLine2"
  | "hero.subheadline"
  | "hero.primaryCta"
  | "pain.kicker"
  | "pain.title"
  | "beliefBreaker.titleBefore"
  | "beliefBreaker.titleHighlight"
  | "beliefBreaker.paragraph1"
  | "beliefBreaker.paragraph2"
  | "solution.kicker"
  | "solution.titleBefore"
  | "solution.titleHighlight"
  | "proof.kicker"
  | "proof.title"
  | "gallery.kicker"
  | "gallery.title"
  | "gallery.subtitle"
  | "differentiator.kicker"
  | "differentiator.title"
  | "differentiator.paragraph1Before"
  | "differentiator.paragraph1Highlight"
  | "differentiator.paragraph2Before"
  | "differentiator.paragraph2Highlight"
  | "ctaSection.kicker"
  | "ctaSection.titleBefore"
  | "ctaSection.titleHighlight"
  | "ctaSection.description"
  | "ctaSection.formButtonText"
  | "meta.brandName";

/* ===== Section element keys (פותח list-editor / panel ייעודי) ===== */
export type SectionElementKey =
  | "section:hero.background" // תמונת רקע של ה-Hero
  | "section:meta" // מטא + SEO
  | "section:contact" // וואטסאפ
  | "section:pain.items" // רשימת כאבים
  | "section:solution.steps" // שלבים
  | "section:proof.stats" // מספרים
  | "section:gallery.items" // תמונות גלריה
  | "section:ctaSection.bullets" // bullets
  | "section:beforeAfter" // לפני / אחרי
  | "section:workPhotos" // תמונות עבודה
  | "section:marketingProcess" // המערכת מאחורי הקלעים
  | "section:tagline" // משפט תגלין
  | "section:whatsappProof" // הודעות וואטסאפ
  | "section:testimonials"; // המלצות שיפוצניקים

export type SelectionKey = TextElementKey | SectionElementKey;

/* ===== Metadata לכל אלמנט טקסט ===== */
export type TextElementMeta = {
  key: TextElementKey;
  label: string;
  /** סוג הקלט בפאנל — input קצר או textarea */
  inputType: "input" | "textarea";
};

export const TEXT_ELEMENTS: Record<TextElementKey, TextElementMeta> = {
  "hero.badge": { key: "hero.badge", label: "תג מעל הכותרת", inputType: "input" },
  "hero.headlineLine1": { key: "hero.headlineLine1", label: "כותרת — שורה 1", inputType: "input" },
  "hero.headlineLine2": { key: "hero.headlineLine2", label: "כותרת — שורה 2", inputType: "input" },
  "hero.subheadline": { key: "hero.subheadline", label: "כותרת משנית", inputType: "textarea" },
  "hero.primaryCta": { key: "hero.primaryCta", label: "כפתור Hero", inputType: "input" },
  "pain.kicker": { key: "pain.kicker", label: "קיקר — כאבים", inputType: "input" },
  "pain.title": { key: "pain.title", label: "כותרת — כאבים", inputType: "input" },
  "beliefBreaker.titleBefore": { key: "beliefBreaker.titleBefore", label: "כותרת שבירה — תחילה", inputType: "input" },
  "beliefBreaker.titleHighlight": { key: "beliefBreaker.titleHighlight", label: "כותרת שבירה — סוף", inputType: "input" },
  "beliefBreaker.paragraph1": { key: "beliefBreaker.paragraph1", label: "פסקה 1 — שבירה", inputType: "textarea" },
  "beliefBreaker.paragraph2": { key: "beliefBreaker.paragraph2", label: "פסקה 2 — שבירה", inputType: "textarea" },
  "solution.kicker": { key: "solution.kicker", label: "קיקר — פתרון", inputType: "input" },
  "solution.titleBefore": { key: "solution.titleBefore", label: "כותרת פתרון — תחילה", inputType: "input" },
  "solution.titleHighlight": { key: "solution.titleHighlight", label: "כותרת פתרון — סוף", inputType: "input" },
  "proof.kicker": { key: "proof.kicker", label: "קיקר — מספרים", inputType: "input" },
  "proof.title": { key: "proof.title", label: "כותרת — מספרים", inputType: "input" },
  "gallery.kicker": { key: "gallery.kicker", label: "קיקר — גלריה", inputType: "input" },
  "gallery.title": { key: "gallery.title", label: "כותרת — גלריה", inputType: "input" },
  "gallery.subtitle": { key: "gallery.subtitle", label: "תת כותרת — גלריה", inputType: "input" },
  "differentiator.kicker": { key: "differentiator.kicker", label: "קיקר — בידול", inputType: "input" },
  "differentiator.title": { key: "differentiator.title", label: "כותרת — בידול", inputType: "input" },
  "differentiator.paragraph1Before": { key: "differentiator.paragraph1Before", label: "פסקה 1 — תחילה", inputType: "input" },
  "differentiator.paragraph1Highlight": { key: "differentiator.paragraph1Highlight", label: "פסקה 1 — סוף (מודגש)", inputType: "input" },
  "differentiator.paragraph2Before": { key: "differentiator.paragraph2Before", label: "פסקה 2 — תחילה", inputType: "input" },
  "differentiator.paragraph2Highlight": { key: "differentiator.paragraph2Highlight", label: "פסקה 2 — סוף (מודגש)", inputType: "input" },
  "ctaSection.kicker": { key: "ctaSection.kicker", label: "קיקר — טופס", inputType: "input" },
  "ctaSection.titleBefore": { key: "ctaSection.titleBefore", label: "כותרת טופס — תחילה", inputType: "input" },
  "ctaSection.titleHighlight": { key: "ctaSection.titleHighlight", label: "כותרת טופס — סוף", inputType: "input" },
  "ctaSection.description": { key: "ctaSection.description", label: "תיאור — טופס", inputType: "textarea" },
  "ctaSection.formButtonText": { key: "ctaSection.formButtonText", label: "טקסט הכפתור — טופס", inputType: "input" },
  "meta.brandName": { key: "meta.brandName", label: "שם העסק (Footer)", inputType: "input" },
};

/* ===== Metadata לקטעי list ===== */
export const SECTION_ELEMENTS: Record<SectionElementKey, { label: string }> = {
  "section:hero.background": { label: "תמונת רקע — Hero" },
  "section:meta": { label: "מטא + SEO" },
  "section:contact": { label: "וואטסאפ" },
  "section:pain.items": { label: "רשימת כאבים" },
  "section:solution.steps": { label: "שלבי הפתרון" },
  "section:proof.stats": { label: "מספרים" },
  "section:gallery.items": { label: "תמונות הגלריה" },
  "section:ctaSection.bullets": { label: "Bullets — טופס" },
  "section:beforeAfter": { label: "לפני / אחרי" },
  "section:workPhotos": { label: "תמונות עבודה" },
  "section:marketingProcess": { label: "מערכת מאחורי הקלעים" },
  "section:tagline": { label: "משפט תגלין" },
  "section:whatsappProof": { label: "הודעות וואטסאפ" },
  "section:testimonials": { label: "המלצות" },
};

/* ===== Helpers — קריאה/כתיבה של טקסט לפי key ===== */
export function getText(content: SiteContent, key: TextElementKey): string {
  const [section, field] = key.split(".") as [keyof SiteContent, string];
  const sec = content[section] as unknown;
  if (!sec || typeof sec !== "object") return "";
  return (sec as Record<string, unknown>)[field] as string ?? "";
}

export function setText(
  content: SiteContent,
  key: TextElementKey,
  value: string
): SiteContent {
  const [section, field] = key.split(".") as [keyof SiteContent, string];
  return {
    ...content,
    [section]: {
      ...(content[section] as object),
      [field]: value,
    },
  };
}

/* ===== Helpers — קריאה/כתיבה של style overrides ===== */
export function getStyle(
  content: SiteContent,
  key: TextElementKey
): TextStyle {
  return content.styleOverrides?.[key] ?? {};
}

export function setStyle(
  content: SiteContent,
  key: TextElementKey,
  style: TextStyle
): SiteContent {
  const overrides = { ...(content.styleOverrides ?? {}) };
  // מסירים ערכים undefined כדי לא לאחסן זבל
  const clean: TextStyle = {};
  if (style.size !== undefined) clean.size = style.size;
  if (style.weight !== undefined) clean.weight = style.weight;
  if (style.color !== undefined) clean.color = style.color;
  if (style.align !== undefined) clean.align = style.align;

  if (Object.keys(clean).length === 0) {
    delete overrides[key];
  } else {
    overrides[key] = clean;
  }
  return { ...content, styleOverrides: overrides };
}

/* ===== Type guards ===== */
export function isTextElementKey(k: string): k is TextElementKey {
  return k in TEXT_ELEMENTS;
}

export function isSectionElementKey(k: string): k is SectionElementKey {
  return k.startsWith("section:");
}
