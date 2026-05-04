/**
 * סקריפט — מאפס tenant charity ל-skeleton ריק.
 *   – כל שדה טקסט מוחלף ב-placeholder קצר וברור (סוגריים מרובעים).
 *   – תמונות נשארות ב-defaults של ה-template כדי שה-layout לא ייקרס.
 *   – סקשנים אופציונליים (popup, liveFeed) מושבתים.
 * הרצה: npx tsx scripts/blank-charity-tenant.ts <slug>
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  type CharitySiteContent,
  stringifyCharityContent,
} from "../src/lib/charity-content";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const filename = url.startsWith("file:") ? url.slice(5) : url;

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: filename }),
});

// תמונה ניטרלית ל-placeholder (Unsplash, רישוי חופשי)
const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80";

const BLANK_CONTENT: CharitySiteContent = {
  meta: {
    brandName: "[שם העמותה]",
    brandTagline: "[טאגליין]",
    pageTitle: "[כותרת SEO]",
    pageDescription: "[תיאור SEO לעמותה]",
    logoUrl: "",
    topBanner: "",
  },
  donate: {
    donationUrl: "#",
    primaryCta: "[CTA ראשי]",
    secondaryCta: "[CTA משני]",
  },
  hero: {
    sideMedia: PLACEHOLDER_IMG,
    sideMediaType: "image",
    sideMediaPoster: PLACEHOLDER_IMG,
    typewriterPhase1: "[שורת פתיח 1]",
    typewriterPhase2: "[שורת פתיח 2]",
    typewriterPhase3: "[שורת פתיח 3]",
  },
  reels: {
    title: "[כותרת סקשן רילים]",
    items: [
      {
        videoUrl: "",
        poster: PLACEHOLDER_IMG,
        overlayText: "[כיתוב על הוידאו]",
        cta: "[CTA]",
      },
      {
        videoUrl: "",
        poster: PLACEHOLDER_IMG,
        overlayText: "[כיתוב על הוידאו]",
        cta: "[CTA]",
      },
      {
        videoUrl: "",
        poster: PLACEHOLDER_IMG,
        overlayText: "[כיתוב על הוידאו]",
        cta: "[CTA]",
      },
    ],
  },
  story: {
    kicker: "[קיקר סיפור]",
    paragraphs: [
      "[פסקה ראשונה — סיפור העמותה]",
      "[פסקה שנייה — מה אתם עושים]",
      "[פסקה שלישית — איך זה עוזר]",
    ],
    cta: "[CTA סיפור]",
    bgImage: PLACEHOLDER_IMG,
  },
  gallery: {
    title: "[כותרת גלריה]",
    subtitle: "[סאב-כותרת גלריה]",
    items: Array.from({ length: 6 }, (_, i) => ({
      src: PLACEHOLDER_IMG,
      caption: `[כיתוב תמונה ${i + 1}]`,
    })),
  },
  impact: {
    title: "[כותרת מספרים]",
    counters: [
      { value: 0, suffix: "+", label: "[מטריקה 1]" },
      { value: 0, suffix: "", label: "[מטריקה 2]" },
      { value: 0, suffix: "+", label: "[מטריקה 3]" },
    ],
  },
  donationCards: {
    title: "[כותרת מדרגות תרומה]",
    subtitle: "[סאב-כותרת מדרגות תרומה]",
    cards: [
      { amount: 0, title: "[רמה 1]", description: "[תיאור רמה 1]" },
      { amount: 0, title: "[רמה 2]", description: "[תיאור רמה 2]" },
      { amount: 0, title: "[רמה 3]", description: "[תיאור רמה 3]" },
    ],
    customLabel: "[סכום אחר]",
  },
  urgency: {
    title: "[כותרת דחיפות]",
    subtitle: "[טקסט דחיפות]",
    goal: 0,
    raised: 0,
    deadline: "[יעד תאריך]",
  },
  bigVideo: {
    title: "[כותרת וידאו גדול]",
    subtitle: "[סאב-כותרת וידאו]",
    videoUrl: "",
    poster: PLACEHOLDER_IMG,
  },
  trust: {
    title: "[כותרת אמון]",
    description: "[תיאור / ציטוט]",
    badges: ["[בדג' 1]", "[בדג' 2]", "[בדג' 3]"],
    founderVideoUrl: "",
    founderName: "[שם המייסד]",
    founderRole: "[תפקיד]",
  },
  liveFeed: {
    enabled: false,
    items: [],
  },
  finalCta: {
    line1: "[שורה 1 — CTA סופי]",
    line2: "[שורה 2 — CTA סופי]",
    button: "[טקסט כפתור]",
  },
  popup: {
    enabled: false,
    delaySeconds: 15,
    title: "[כותרת popup]",
    text: "[טקסט popup]",
    cta: "[CTA popup]",
  },
  contact: {
    whatsappNumber: "",
    whatsappMessage: "",
    email: "",
    phone: "",
  },
};

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npx tsx scripts/blank-charity-tenant.ts <slug>");
    process.exit(1);
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    console.error(`Tenant '${slug}' not found.`);
    process.exit(1);
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      template: "charity",
      content: stringifyCharityContent(BLANK_CONTENT),
    },
  });

  console.log(`Tenant '${slug}' reset to blank charity skeleton.`);
  console.log(`URL: https://${slug === "lp-3" ? "lp3.pro-digital.org" : `pro-digital.org/sites/${slug}`}`);
  console.log(`Edit at: https://pro-digital.org/admin/content`);
}

main()
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
