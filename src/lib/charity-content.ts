/**
 * CharitySiteContent — סכימה לדף עמותה (high-conversion donation site).
 *
 * Design v3 (לפי המסמך השני):
 *  - פלטה רכה: כחול #2F5D8C + אדום #E53935 + צהוב #F4C542 (אקסנט בלבד)
 *  - רקע: gradient #F9FBFF → #EEF3F8
 *  - Hero: split layout (תמונה/וידאו בצד) — לא full-screen video
 *  - Reels: horizontal scroll עם snap (חזרנו לאופקי)
 *  - Story: 3 פסקאות על העמותה
 *  - Big Video: סקשן וידאו ענק עם play overlay
 *  - Popup: מופיע אחרי 15 שניות
 */

import type { StyleOverrides } from "@/lib/content";

export type CharitySiteContent = {
  /* SEO + מיתוג */
  meta: {
    brandName: string;
    brandTagline: string;
    pageTitle: string;
    pageDescription: string;
    logoUrl: string;
    /** באנר עליון (full-width) שמופיע מעל ה-Hero. ריק = לא מציג. */
    topBanner: string;
  };

  /* תרומה */
  donate: {
    donationUrl: string;
    primaryCta: string;
    secondaryCta: string;
  };

  /* HERO — split layout */
  hero: {
    /** מדיה בצד (image/video) */
    sideMedia: string;
    sideMediaType: "image" | "video";
    /** poster לוידאו */
    sideMediaPoster: string;
    /** Typewriter sequence */
    typewriterPhase1: string;
    typewriterPhase2: string;
    typewriterPhase3: string;
    /** וידאו חלופי לצד ה-Hero — אם הוגדר, גובר על sideMedia */
    altSideMedia?: string;
    /** סוג מדיה חלופי (image/video) */
    altSideMediaType?: "image" | "video";
  };

  /* Reels — horizontal scroll */
  reels: {
    title: string;
    items: Array<{
      videoUrl: string;
      poster: string;
      overlayText: string;
      cta: string;
    }>;
    /** טקסט מעל הכותרת (אופציונלי) */
    altIntroText?: string;
  };

  /* Story — סיפור העמותה */
  story: {
    kicker: string;
    paragraphs: string[];
    cta: string;
    /** תמונת רקע parallax (אופציונלי). ריק = רקע gradient רך. */
    bgImage?: string;
    /** פסקאות חלופיות — אם קיימות, גוברות על paragraphs */
    altParagraphs?: string[];
    /** CTA חלופי */
    altCta?: string;
    /** תמונת רקע חלופית — גוברת על bgImage */
    altBgImage?: string;
  };

  /* Gallery — רגעים מהשטח */
  gallery: {
    title: string;
    subtitle: string;
    items: Array<{
      src: string;
      caption: string;
    }>;
    /** כותרת חלופית */
    altTitle?: string;
    /** subtitle חלופי */
    altSubtitle?: string;
    /** items חלופיים — אם קיים, גובר על items */
    altItems?: Array<{ src: string; caption: string }>;
    /** טקסט CTA חלופי בתחתית */
    altBottomCta?: string;
    /** טקסט מעל הכפתור */
    altBottomLine?: string;
  };

  /* Impact */
  impact: {
    title: string;
    counters: Array<{
      value: number;
      suffix: string;
      label: string;
    }>;
    /** מערך חזק חלופי — מוצג אם הוגדר (override על counters). */
    altCounters?: Array<{
      value: number;
      suffix: string;
      label: string;
    }>;
    /** טקסט אקסטרה (label שאינו מספר) — דוגמה: "קהילה של מתנדבים מכל הארץ" */
    extraLabel?: string;
    /** תמונת רקע מטושטשת (אופציונלי). ריק = gradient רגיל. */
    bgImage?: string;
  };

  /* Donation Cards (glass) */
  donationCards: {
    title: string;
    subtitle: string;
    cards: Array<{
      amount: number;
      title: string;
      description: string;
    }>;
    customLabel: string;
    /** subtitle חלופי */
    altSubtitle?: string;
    /** טקסט קטן אדום מעל הכרטיסים */
    altMicroText?: string;
    /** cards חלופיים — אם קיים, גובר על cards */
    altCards?: Array<{
      amount: number;
      title: string;
      description: string;
    }>;
  };

  /* Urgency */
  urgency: {
    title: string;
    subtitle: string;
    goal: number;
    raised: number;
    deadline: string;
    /** תמונת רקע דרמטית (אופציונלי). ריק = gradient כהה. */
    bgImage?: string;
  };

  /* Big Video — וידאו ענק עם play overlay */
  bigVideo: {
    title: string;
    subtitle: string;
    videoUrl: string;
    poster: string;
    /** טקסט קטן שמעל הוידאו (אופציונלי) — שורה 1 */
    kickerLine1?: string;
    /** טקסט קטן שמעל הוידאו (אופציונלי) — שורה 2 */
    kickerLine2?: string;
    /** כותרת overlay על הוידאו — אם הוגדר, גובר על title */
    overlayTitle?: string;
    /** CTA חיצוני שמופיע ב-overlay של הוידאו (אופציונלי) */
    overlayCta?: string;
    /** וידאו חלופי — אם הוגדר, גובר על videoUrl */
    altVideoUrl?: string;
  };

  /** סקשן רגשי — מחליף את ה-Urgency כברירת מחדל. אם enabled=false → מציג Urgency. */
  emotional?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    cta?: string;
    bgImage?: string;
  };

  /* Trust */
  trust: {
    title: string;
    description: string;
    badges: string[];
    founderVideoUrl: string;
    founderName: string;
    founderRole: string;
  };

  /* Live activity */
  liveFeed: {
    enabled: boolean;
    items: Array<{
      name: string;
      city: string;
      amount: number;
    }>;
  };

  /* Final CTA */
  finalCta: {
    line1: string;
    line2: string;
    button: string;
  };

  /* Popup אחרי 15 שניות */
  popup: {
    enabled: boolean;
    delaySeconds: number;
    title: string;
    text: string;
    cta: string;
  };

  /* Contact */
  contact: {
    whatsappNumber: string;
    whatsappMessage: string;
    email: string;
    phone: string;
  };

  /** דריסות עיצוב per-element (אופציונלי) */
  styleOverrides?: StyleOverrides;
};

/* ===========================================================
   ברירת המחדל — תוכן המבוסס על המפרט החדש.
   =========================================================== */
export const DEFAULT_CHARITY_CONTENT: CharitySiteContent = {
  meta: {
    brandName: "פותחים את הלב",
    brandTagline: "בהובלת הנוער",
    pageTitle: "פותחים את הלב — מצילים משפחות בכל שבוע",
    pageDescription:
      "עמותת 'פותחים את הלב' בהובלת הנוער מפרדס חנה-כרכור — מחלקת סלי מזון ל-250 משפחות בכל שבוע. כל תרומה שלך — שינוי אמיתי בחיים של מישהו.",
    logoUrl: "/uploads/charity/logo.png",
    topBanner: "/uploads/charity/banner.png",
  },
  donate: {
    donationUrl: "https://example.com/donate",
    primaryCta: "תרום עכשיו ❤️",
    secondaryCta: "צפה בפעילות שלנו",
  },
  hero: {
    sideMedia: "/uploads/charity/video-01.mp4",
    sideMediaType: "video",
    sideMediaPoster: "/uploads/charity/image-01.jpg",
    typewriterPhase1: "יש משפחות שלא יודעות איך תראה השבת שלהן...",
    typewriterPhase2: "ובזכותך זה יכול להשתנות",
    typewriterPhase3: "פותחים את הלב. מצילים משפחות.",
    altSideMedia: "/uploads/charity/feature-video.mp4",
    altSideMediaType: "video",
  },
  reels: {
    title: "ככה זה נראה בשטח",
    items: [
      {
        videoUrl: "/uploads/charity/video-02.mp4",
        poster: "/uploads/charity/image-02.jpg",
        overlayText: "אריזה לחלוקה השבועית",
        cta: "גם אני רוצה לעזור",
      },
      {
        videoUrl: "/uploads/charity/video-03.mp4",
        poster: "/uploads/charity/image-03.jpg",
        overlayText: "חלוקה למשפחות",
        cta: "תרום עכשיו",
      },
      {
        videoUrl: "/uploads/charity/video-04.mp4",
        poster: "/uploads/charity/image-04.jpg",
        overlayText: "בני נוער מובילים",
        cta: "אני רוצה להצטרף",
      },
      {
        videoUrl: "/uploads/charity/video-05.mp4",
        poster: "/uploads/charity/image-05.jpg",
        overlayText: "סלי שבת מוכנים",
        cta: "תרום סל",
      },
      {
        videoUrl: "/uploads/charity/video-06.mp4",
        poster: "/uploads/charity/image-06.jpg",
        overlayText: "כל שבוע — 250 משפחות",
        cta: "אני בעניין",
      },
      {
        videoUrl: "/uploads/charity/video-07.mp4",
        poster: "/uploads/charity/image-07.jpg",
        overlayText: "התנדבות מלאה של הנוער",
        cta: "אני בפנים",
      },
    ],
    altIntroText: "זה לא תמונות. זו מציאות של מאות משפחות",
  },
  story: {
    kicker: "הסיפור שלנו",
    paragraphs: [
      'עמותת "פותחים את הלב בהובלת הנוער" הוקמה לפני כחמש שנים ביוזמה של בני נוער מפרדס חנה-כרכור — מתוך רצון אמיתי לשנות מציאות ולסייע למשפחות, קשישים ונכים נזקקים.',
      "בכל שבוע מחולקים סלי מזון מלאים לכ-250 משפחות, ובחגים — מעל 400 סלים, כשהצורך רק הולך וגדל.",
      "העמותה פועלת בהתנדבות מלאה של בני נוער שמובילים עשייה אמיתית — אוספים, אורזים, מעמיסים, ויוצאים לשטח עם שליחות בלב.",
    ],
    cta: "אני רוצה להיות חלק ❤️",
    bgImage: "/uploads/charity/image-09.jpg",
    altParagraphs: [
      'עמותת "פותחים את הלב בהובלת הנוער" הוקמה בשיא מגפת הקורונה ביוזמה של בני נוער מפרדס חנה-כרכור, מתוך רצון אמיתי לפעול ולעזור למי שצריך.',
      "בכל שבוע מחולקים כ-250 סלי מזון למשפחות, קשישים ונזקקים. בתקופות חגים מעל 400 סלים, כשהצורך רק הולך וגדל.",
      "העמותה פועלת בהתנדבות מלאה של בני נוער ומתנדבים מכל הארץ. אוספים, אורזים ומגיעים לשטח כדי להביא עזרה אמיתית.",
      "במהלך המלחמה חולקו אלפי מארזים לחיילים ולכוחות הביטחון.",
      "זו לא רק עמותה. זו קהילה של נתינה ועשייה.",
    ],
    altCta: "אני רוצה להיות חלק ❤️",
    altBgImage: "/uploads/charity/story-bg.jpg",
  },
  gallery: {
    title: "רגעים מהשטח",
    subtitle: "תמונות אמיתיות. לב פתוח. שינוי אמיתי.",
    items: [
      { src: "/uploads/charity/image-08.jpg", caption: "חלוקת מזון שבועית" },
      { src: "/uploads/charity/image-09.jpg", caption: "אריזת סלי שבת" },
      { src: "/uploads/charity/image-10.jpg", caption: "בני נוער בעבודה" },
      { src: "/uploads/charity/image-11.jpg", caption: "מארזים לחיילים" },
      { src: "/uploads/charity/image-12.jpg", caption: "שליחות בלב" },
      { src: "/uploads/charity/image-13.jpg", caption: "ביחד יותר חזקים" },
      { src: "/uploads/charity/image-14.jpg", caption: "פתיחת לב" },
      { src: "/uploads/charity/image-15.jpg", caption: "מאחורי הקלעים" },
      { src: "/uploads/charity/image-16.jpg", caption: "צוות המתנדבים" },
    ],
    altTitle: "רגעים מהעשייה",
    altSubtitle: "כך נראית העשייה מאחורי כל סל מזון",
    altItems: [
      { src: "/uploads/charity/image-08.jpg", caption: "מארזי שי לחגים מוכנים לחלוקה" },
      { src: "/uploads/charity/image-09.jpg", caption: "מתנדבי הנוער אורזים סלי ירקות" },
      { src: "/uploads/charity/image-10.jpg", caption: "סלי מזון מסודרים לקראת חלוקה" },
      { src: "/uploads/charity/image-11.jpg", caption: "מתנדבות מסיימות אריזת מארזים" },
      { src: "/uploads/charity/image-12.jpg", caption: "מבצע קמחא דפסחא — היערכות לחלוקה" },
      { src: "/uploads/charity/image-13.jpg", caption: "קמחא דפסחא — מאות סלים מוכנים" },
      { src: "/uploads/charity/image-14.jpg", caption: "סידור סלי המזון לפני החלוקה" },
      { src: "/uploads/charity/image-15.jpg", caption: "אולם החלוקה הראשי" },
      { src: "/uploads/charity/image-16.jpg", caption: "מתנדבי העמותה במלוא העשייה" },
    ],
    altBottomLine: "גם אני רוצה להיות חלק מהעשייה",
    altBottomCta: "גם אני רוצה לקחת חלק",
  },
  impact: {
    title: "במספרים",
    counters: [
      { value: 5000, suffix: "+", label: "סלי מזון חולקו" },
      { value: 250, suffix: "", label: "משפחות בכל שבוע" },
      { value: 400, suffix: "+", label: "סלים בחגים" },
      { value: 100, suffix: "%", label: "התנדבות נוער" },
    ],
    altCounters: [
      { value: 250, suffix: "", label: "משפחות בכל שבוע" },
      { value: 200, suffix: "+", label: "מתנדבים פעילים" },
      { value: 5000, suffix: "+", label: "סלי מזון חולקו" },
    ],
    extraLabel: "קהילה של נתינה ועשייה",
    bgImage: "/uploads/charity/image-11.jpg",
  },
  donationCards: {
    title: "בחר את גובה התרומה",
    subtitle: "כל סכום — שינוי אמיתי. בחר את מה שמתאים לך.",
    cards: [
      {
        amount: 50,
        title: "ארוחה חמה",
        description: "מזון לכמה ימים למשפחה אחת",
      },
      {
        amount: 100,
        title: "תמיכה למשפחה",
        description: "מזון לשבוע מלא",
      },
      {
        amount: 250,
        title: "סל מלא לשבת",
        description: "סל מזון מלא לכל המשפחה",
      },
    ],
    customLabel: "לבחירת סכום נוסף",
    altSubtitle: "כל תרומה הופכת לסל מזון אמיתי",
    altMicroText: "גם סכום קטן יכול לשנות חיים",
    altCards: [
      {
        amount: 50,
        title: "סיוע בסיסי",
        description: "סיוע בסיסי למשפחה",
      },
      {
        amount: 100,
        title: "תמיכה שבועית",
        description: "תמיכה שבועית למשפחה נזקקת",
      },
      {
        amount: 250,
        title: "סל מזון מלא",
        description: "סל מזון מלא למשפחה לשבוע",
      },
    ],
  },
  urgency: {
    title: "הביקוש עולה — ואנחנו חייבים אתכם",
    subtitle:
      "כל תרומה עכשיו מאפשרת חלוקה נוספת השבוע. אל תחכה — אנשים סומכים עלינו.",
    goal: 100000,
    raised: 78000,
    deadline: "30 בנובמבר",
    bgImage: "/uploads/charity/image-15.jpg",
  },
  bigVideo: {
    title: "כך נראית החלוקה האמיתית בשטח",
    subtitle: "סרטון אחד שווה אלף מילים",
    videoUrl: "/uploads/charity/video-08.mp4",
    poster: "/uploads/charity/image-17.jpg",
    kickerLine1: "פותחים את הלב בהובלת הנוער",
    kickerLine2: "מסייעים למאות משפחות בכל שבוע",
    overlayTitle: "כך נראית החלוקה האמיתית בשטח",
    overlayCta: "גם אני רוצה להיות חלק ❤️",
    altVideoUrl: "/uploads/charity/feature-video.mp4",
  },
  // Override of bigVideo.kickerLine2 for the new spec ↑ already correct

  emotional: {
    enabled: true,
    title: "מאות משפחות מחכות לחלוקה הקרובה",
    subtitle: "ובלעדינו זה פשוט לא יקרה",
    cta: "תרום עכשיו ❤️",
    bgImage: "/uploads/charity/image-15.jpg",
  },
  trust: {
    title: "אנחנו עמותה אמיתית — נוער מתנדב",
    description:
      "ללא מטרות רווח. ללא דמי תיווך. כל שקל — לאלה שצריכים אותו.",
    badges: [
      "עמותה הפועלת ללא מטרות רווח",
      "מנוהלת כולה על ידי בני נוער ומתנדבים",
      "100% שקיפות",
      "כל תרומה מגיעה ישירות לשטח",
    ],
    founderVideoUrl: "",
    founderName: "צוות המתנדבים",
    founderRole: "פותחים את הלב — בהובלת הנוער",
  },
  liveFeed: {
    enabled: true,
    items: [
      { name: "דוד", city: "חיפה", amount: 120 },
      { name: "רחל", city: "תל אביב", amount: 50 },
      { name: "דני", city: "פרדס חנה", amount: 250 },
      { name: "מיכל", city: "באר שבע", amount: 100 },
      { name: "אברהם", city: "פתח תקווה", amount: 360 },
      { name: "שירה", city: "רעננה", amount: 50 },
      { name: "אורי", city: "נתניה", amount: 180 },
      { name: "תמר", city: "מודיעין", amount: 100 },
    ],
  },
  finalCta: {
    line1: "פותחים את הלב — ביחד",
    line2: "ומשנים חיים אמיתיים",
    button: "תרום עכשיו ❤️",
  },
  popup: {
    enabled: true,
    delaySeconds: 15,
    title: "רגע אחד...",
    text: "גם תרומה קטנה עושה שינוי גדול. רוצה לעזור עכשיו?",
    cta: "כן, אני תורם ❤️",
  },
  contact: {
    whatsappNumber: "972500000000",
    whatsappMessage: 'שלום, אני מעוניין/ת לעזור לעמותת "פותחים את הלב"',
    email: "info@example.org",
    phone: "03-0000000",
  },
};

/* ===========================================================
   Helpers
   =========================================================== */

/** deep-merge רקורסיבי: defaults עם חורים שה-incoming מכסה.
 *  arrays — הפרסום שולט (אין מיזוג). objects רגילים — מתמזגים מפתח-מפתח.
 *  זה חיוני כדי ששדות חדשים שנוספו לסכימה (כמו bgImage) יקבלו ערכי ברירת
 *  מחדל גם עבור tenants ישנים שלא עודכנו דרך הדשבורד. */
function deepMerge<T>(base: T, override: unknown): T {
  if (
    !override ||
    typeof override !== "object" ||
    Array.isArray(override) ||
    !base ||
    typeof base !== "object" ||
    Array.isArray(base)
  ) {
    return (override === undefined ? base : (override as T));
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(override as Record<string, unknown>)) {
    const baseVal = (base as Record<string, unknown>)[k];
    const ovVal = (override as Record<string, unknown>)[k];
    out[k] =
      baseVal && typeof baseVal === "object" && !Array.isArray(baseVal)
        ? deepMerge(baseVal, ovVal)
        : ovVal !== undefined
          ? ovVal
          : baseVal;
  }
  return out as T;
}

export function parseCharityContent(json: string): CharitySiteContent {
  try {
    const parsed = JSON.parse(json);
    return deepMerge(DEFAULT_CHARITY_CONTENT, parsed);
  } catch {
    return DEFAULT_CHARITY_CONTENT;
  }
}

export function stringifyCharityContent(content: CharitySiteContent): string {
  return JSON.stringify(content);
}
