/**
 * רישום של אלמנטים בדף העמותה — לעורך הוויזואלי.
 * מקביל ל-element-registry.ts של הרנובטור.
 */

import type { CharitySiteContent } from "@/lib/charity-content";
import type { TextStyle } from "@/lib/content";

/* ===== TEXT element keys — טקסטים בודדים שניתנים לעריכה ===== */
export type CharityTextElementKey =
  | "meta.brandName"
  | "meta.brandTagline"
  | "donate.primaryCta"
  | "donate.secondaryCta"
  | "hero.typewriterPhase1"
  | "hero.typewriterPhase2"
  | "hero.typewriterPhase3"
  | "reels.title"
  | "story.kicker"
  | "story.cta"
  | "gallery.title"
  | "gallery.subtitle"
  | "impact.title"
  | "donationCards.title"
  | "donationCards.subtitle"
  | "donationCards.customLabel"
  | "urgency.title"
  | "urgency.subtitle"
  | "bigVideo.title"
  | "bigVideo.subtitle"
  | "trust.title"
  | "trust.description"
  | "trust.founderName"
  | "trust.founderRole"
  | "finalCta.line1"
  | "finalCta.line2"
  | "finalCta.button"
  | "popup.title"
  | "popup.text"
  | "popup.cta";

/* ===== Section element keys ===== */
export type CharitySectionElementKey =
  | "section:meta"
  | "section:donate"
  | "section:contact"
  | "section:hero.media"
  | "section:reels.items"
  | "section:story.body"
  | "section:gallery.items"
  | "section:impact.numbers"
  | "section:donationCards.cards"
  | "section:urgency.numbers"
  | "section:bigVideo.media"
  | "section:trust.badges"
  | "section:trust.founder"
  | "section:liveFeed"
  | "section:popup.settings";

export type CharitySelectionKey =
  | CharityTextElementKey
  | CharitySectionElementKey;

/* ===== Metadata לכל text element ===== */
export type CharityTextElementMeta = {
  key: CharityTextElementKey;
  label: string;
  inputType: "input" | "textarea";
};

export const CHARITY_TEXT_ELEMENTS: Record<
  CharityTextElementKey,
  CharityTextElementMeta
> = {
  "meta.brandName": { key: "meta.brandName", label: "שם המותג", inputType: "input" },
  "meta.brandTagline": { key: "meta.brandTagline", label: "טאגליין", inputType: "input" },
  "donate.primaryCta": { key: "donate.primaryCta", label: "כפתור CTA ראשי", inputType: "input" },
  "donate.secondaryCta": { key: "donate.secondaryCta", label: "כפתור משני", inputType: "input" },
  "hero.typewriterPhase1": { key: "hero.typewriterPhase1", label: "Hero — פאזה 1", inputType: "input" },
  "hero.typewriterPhase2": { key: "hero.typewriterPhase2", label: "Hero — פאזה 2", inputType: "input" },
  "hero.typewriterPhase3": { key: "hero.typewriterPhase3", label: "Hero — פאזה 3 (חזק)", inputType: "input" },
  "reels.title": { key: "reels.title", label: "כותרת Reels", inputType: "input" },
  "story.kicker": { key: "story.kicker", label: "קיקר Story", inputType: "input" },
  "story.cta": { key: "story.cta", label: "כפתור Story", inputType: "input" },
  "gallery.title": { key: "gallery.title", label: "כותרת גלריה", inputType: "input" },
  "gallery.subtitle": { key: "gallery.subtitle", label: "תת כותרת גלריה", inputType: "input" },
  "impact.title": { key: "impact.title", label: "כותרת מספרים", inputType: "input" },
  "donationCards.title": { key: "donationCards.title", label: "כותרת תרומה", inputType: "input" },
  "donationCards.subtitle": { key: "donationCards.subtitle", label: "תת כותרת תרומה", inputType: "input" },
  "donationCards.customLabel": { key: "donationCards.customLabel", label: "טקסט תרומה אישית", inputType: "input" },
  "urgency.title": { key: "urgency.title", label: "כותרת דחיפות", inputType: "input" },
  "urgency.subtitle": { key: "urgency.subtitle", label: "תת כותרת דחיפות", inputType: "textarea" },
  "bigVideo.title": { key: "bigVideo.title", label: "כותרת וידאו ענק", inputType: "input" },
  "bigVideo.subtitle": { key: "bigVideo.subtitle", label: "תת כותרת וידאו ענק", inputType: "input" },
  "trust.title": { key: "trust.title", label: "כותרת אמינות", inputType: "input" },
  "trust.description": { key: "trust.description", label: "תיאור אמינות", inputType: "textarea" },
  "trust.founderName": { key: "trust.founderName", label: "שם המייסד", inputType: "input" },
  "trust.founderRole": { key: "trust.founderRole", label: "תפקיד המייסד", inputType: "input" },
  "finalCta.line1": { key: "finalCta.line1", label: "Final CTA — שורה 1", inputType: "input" },
  "finalCta.line2": { key: "finalCta.line2", label: "Final CTA — שורה 2", inputType: "input" },
  "finalCta.button": { key: "finalCta.button", label: "Final CTA — כפתור", inputType: "input" },
  "popup.title": { key: "popup.title", label: "Popup — כותרת", inputType: "input" },
  "popup.text": { key: "popup.text", label: "Popup — טקסט", inputType: "textarea" },
  "popup.cta": { key: "popup.cta", label: "Popup — כפתור", inputType: "input" },
};

/* ===== Metadata לקטעי list/section ===== */
export const CHARITY_SECTION_ELEMENTS: Record<
  CharitySectionElementKey,
  { label: string }
> = {
  "section:meta": { label: "מטא + לוגו + באנר" },
  "section:donate": { label: "URL לתרומה" },
  "section:contact": { label: "יצירת קשר" },
  "section:hero.media": { label: "מדיה Hero (וידאו/תמונה)" },
  "section:reels.items": { label: "Reels — רשימת סרטונים" },
  "section:story.body": { label: "Story — פסקאות + רקע" },
  "section:gallery.items": { label: "תמונות הגלריה" },
  "section:impact.numbers": { label: "מספרי Impact + רקע" },
  "section:donationCards.cards": { label: "כרטיסי תרומה" },
  "section:urgency.numbers": { label: "Urgency — יעד + נאסף + רקע" },
  "section:bigVideo.media": { label: "וידאו ענק — קובץ + poster" },
  "section:trust.badges": { label: "Trust badges" },
  "section:trust.founder": { label: "מייסד — וידאו" },
  "section:liveFeed": { label: "Live Feed — תרומות" },
  "section:popup.settings": { label: "Popup — הגדרות" },
};

/* ===== Helpers — read/write text by key ===== */
export function getCharityText(
  content: CharitySiteContent,
  key: CharityTextElementKey
): string {
  const [section, field] = key.split(".") as [
    keyof CharitySiteContent,
    string
  ];
  const sec = content[section] as unknown;
  if (!sec || typeof sec !== "object") return "";
  return ((sec as Record<string, unknown>)[field] as string) ?? "";
}

export function setCharityText(
  content: CharitySiteContent,
  key: CharityTextElementKey,
  value: string
): CharitySiteContent {
  const [section, field] = key.split(".") as [
    keyof CharitySiteContent,
    string
  ];
  return {
    ...content,
    [section]: {
      ...(content[section] as object),
      [field]: value,
    },
  };
}

/* ===== Helpers — read/write style overrides ===== */
export function getCharityStyle(
  content: CharitySiteContent,
  key: CharityTextElementKey
): TextStyle {
  return content.styleOverrides?.[key] ?? {};
}

export function setCharityStyle(
  content: CharitySiteContent,
  key: CharityTextElementKey,
  style: TextStyle
): CharitySiteContent {
  const overrides = { ...(content.styleOverrides ?? {}) };
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
export function isCharityTextElementKey(
  k: string
): k is CharityTextElementKey {
  return k in CHARITY_TEXT_ELEMENTS;
}

export function isCharitySectionElementKey(
  k: string
): k is CharitySectionElementKey {
  return k.startsWith("section:");
}
