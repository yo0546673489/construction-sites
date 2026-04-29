/**
 * SiteContent — סכימה מלאה לתוכן דף הנחיתה.
 * נשמר ב-DB כ-JSON-string ב-Tenant.content.
 * זה ה-Single Source of Truth לכל הטקסטים, התמונות, המספרים והקישורים.
 *
 * styleOverrides — מאפשר דריסת עיצוב per-element (גודל פונט, צבע, וכו').
 * המפתח הוא ElementKey (למשל "hero.headlineLine1").
 */

/* ===========================================================
   TextStyle — דריסת סגנון לכל אלמנט בודד.
   =========================================================== */
export type FontSize =
  | "xs" | "sm" | "base" | "lg"
  | "xl" | "2xl" | "3xl" | "4xl"
  | "5xl" | "6xl" | "7xl";

export type FontWeight =
  | "normal" | "medium" | "semibold" | "bold" | "black";

export type TextAlign = "right" | "center" | "left";

export type TextStyle = {
  size?: FontSize;
  weight?: FontWeight;
  /** הקסה (#C9A24A) או שם CSS חוקי */
  color?: string;
  align?: TextAlign;
};

export type StyleOverrides = Record<string, TextStyle>;

/* ===========================================================
   טבלאות המרה — TextStyle → ערכי CSS גולמיים.
   =========================================================== */
export const FONT_SIZE_PX: Record<FontSize, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
};

export const FONT_WEIGHT_NUM: Record<FontWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
};

/** אובייקט CSS בלי תלות בריאקט — מתאים גם ל-JSX וגם ל-server. */
export type StyleCSS = {
  fontSize?: string;
  fontWeight?: number;
  color?: string;
  textAlign?: "right" | "center" | "left";
};

/**
 * הופך TextStyle ל-CSS-properties.
 */
export function styleToCSS(style: TextStyle | undefined): StyleCSS {
  if (!style) return {};
  const css: StyleCSS = {};
  if (style.size) css.fontSize = FONT_SIZE_PX[style.size];
  if (style.weight) css.fontWeight = FONT_WEIGHT_NUM[style.weight];
  if (style.color) css.color = style.color;
  if (style.align) css.textAlign = style.align;
  return css;
}

/**
 * מחזיר את ה-CSS עבור ElementKey ספציפי (אם קיימת דריסה).
 */
export function getElementCSS(
  content: SiteContent,
  elementKey: string
): StyleCSS {
  return styleToCSS(content.styleOverrides?.[elementKey]);
}

export type SiteContent = {
  /* SEO + מטא */
  meta: {
    /** שם העסק — מוצג ב-Footer וב-tab title */
    brandName: string;
    /** כותרת ה-tab בדפדפן */
    pageTitle: string;
    /** תיאור meta ל-SEO */
    pageDescription: string;
  };

  /* קשר */
  contact: {
    /** מספר וואטסאפ בפורמט בינלאומי, ללא + (למשל: 972500000000) */
    whatsappNumber: string;
    /** הטקסט שיופיע אוטומטית בהודעת הוואטסאפ */
    whatsappMessage: string;
  };

  /* HERO */
  hero: {
    /** התג הקטן מעל הכותרת */
    badge: string;
    /** שורה ראשונה של הכותרת (אפקט טייפרייטר) */
    headlineLine1: string;
    /** שורה שנייה של הכותרת — תופיע בזהב */
    headlineLine2: string;
    /** הכותרת המשנית */
    subheadline: string;
    /** טקסט הכפתור הראשי */
    primaryCta: string;
    /** URL לתמונת רקע (יכול להיות מ-Unsplash, CDN, או /uploads/...) */
    backgroundImage: string;
  };

  /* PAIN — תגיד לי אם זה אתה */
  pain: {
    kicker: string;
    title: string;
    /** הכאבים — שמות אייקונים מתוך LucidePainIcon (ראה מיפוי בקובץ) */
    items: Array<{ iconName: PainIconName; text: string }>;
  };

  /* שבירת אמונה */
  beliefBreaker: {
    /** הכותרת — ניתן לצבע חלק מהטקסט בזהב באמצעות [[...]] */
    titleBefore: string;
    titleHighlight: string;
    paragraph1: string;
    paragraph2: string;
  };

  /* הפתרון — איך זה עובד */
  solution: {
    kicker: string;
    titleBefore: string;
    titleHighlight: string;
    steps: Array<{
      num: string;
      iconName: SolutionIconName;
      title: string;
      desc: string;
    }>;
  };

  /* הוכחה — מספרים */
  proof: {
    kicker: string;
    title: string;
    stats: Array<{ value: number; suffix: string; label: string }>;
  };

  /* גלריה */
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    items: Array<{ src: string; alt: string; label: string }>;
  };

  /* בידול */
  differentiator: {
    kicker: string;
    title: string;
    paragraph1Before: string;
    paragraph1Highlight: string;
    paragraph2Before: string;
    paragraph2Highlight: string;
  };

  /* CTA + טופס */
  ctaSection: {
    kicker: string;
    titleBefore: string;
    titleHighlight: string;
    description: string;
    bullets: string[];
    formButtonText: string;
  };

  /* ===== סקשנים חדשים — תחושת עסק חי, לא רק "עיצוב" ===== */

  /** Before / After — ככה נראים לקוחות שמגיעים מהמערכת */
  beforeAfter: {
    kicker: string;
    title: string;
    subtitle: string;
    items: Array<{
      before: string;
      after: string;
      label: string;
    }>;
  };

  /** תמונות עבודה אמיתיות (שיפוצניק עם קסדה, צבע, וכו') */
  workPhotos: {
    kicker: string;
    title: string;
    subtitle: string;
    items: Array<{
      src: string;
      caption: string;
    }>;
  };

  /** Marketing Process — איך המערכת עובדת מאחורי הקלעים */
  marketingProcess: {
    kicker: string;
    title: string;
    subtitle: string;
    items: Array<{
      iconName: MarketingIconName;
      title: string;
      description: string;
    }>;
  };

  /** Tagline — משפט גדול וחזק, חוצה את הדף */
  tagline: {
    line1: string;
    line2: string;
  };

  /** WhatsApp Proof — צילומי הודעות שיכלות נראות אמיתיות */
  whatsappProof: {
    kicker: string;
    title: string;
    subtitle: string;
    messages: Array<{
      name: string;
      text: string;
      time: string;
    }>;
  };

  /** Testimonials — שיפוצניקים שכבר עובדים איתנו */
  testimonials: {
    kicker: string;
    title: string;
    items: Array<{
      name: string;
      area: string;
      quote: string;
      before: string;
      after: string;
    }>;
  };

  /** דריסות עיצוב per-element (אופציונלי) */
  styleOverrides?: StyleOverrides;
};

/** אייקונים לסקשן "המערכת מאחורי הקלעים" */
export type MarketingIconName =
  | "megaphone"
  | "target"
  | "trending-up"
  | "filter"
  | "bot"
  | "bell-ring"
  | "map-pin"
  | "gauge";

/**
 * אייקונים מותרים — כדי שלא נצטרך לשמור קומפוננטות-פונקציות ב-DB,
 * שומרים שם של אייקון, וממפים אותו ל-LucideIcon בצד הלקוח.
 */
export type PainIconName =
  | "user-x"
  | "megaphone"
  | "calendar-off"
  | "phone"
  | "phone-off"
  | "phone-missed"
  | "frown"
  | "wallet";

export type SolutionIconName =
  | "target"
  | "phone-call"
  | "trending-up"
  | "wrench"
  | "zap"
  | "hammer";

/* ===========================================================
   ברירת המחדל — תוכן ההתחלתי לכל Tenant חדש.
   נטען בעת יצירת Tenant חדש מהדשבורד.
   =========================================================== */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  meta: {
    brandName: "Premium Lead System",
    pageTitle: "לידים לשיפוצניקים — אנחנו מביאים, אתה עובד",
    pageDescription:
      "מערכת חכמה שמביאה לשיפוצניקים פניות חמות של לקוחות אמיתיים — בלי לרדוף, בלי פרסום, בלי כאב ראש.",
  },
  contact: {
    whatsappNumber: "972500000000",
    whatsappMessage: "היי, ראיתי את האתר ואני רוצה להתחיל לקבל עבודות",
  },
  hero: {
    badge: "מערכת לשיפוצניקים — מביאה עבודה. לא הבטחות.",
    headlineLine1: "שיפוצניק — יש לך ידיים זהב…",
    headlineLine2: "אבל אין לך עבודה קבועה?",
    subheadline:
      "אם אתה עדיין מחפש לקוחות במקום שהם יגיעו אליך — אתה עובד קשה מדי בשביל פחות מדי כסף.",
    primaryCta: "אני רוצה לקבל עבודות",
    backgroundImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80",
  },
  pain: {
    kicker: "זיהוי",
    title: "תגיד לי אם זה אתה...",
    items: [
      {
        iconName: "user-x",
        text: "אתה רודף אחרי לקוחות במקום שהם ירדפו אחריך",
      },
      {
        iconName: "megaphone",
        text: "מפרסם בפייסבוק / יד2 — ולא יוצא מזה כלום",
      },
      {
        iconName: "calendar-off",
        text: "יש חודשים חזקים... ואז פתאום שקט",
      },
      {
        iconName: "phone",
        text: "לקוחות מתקשרים — אבל לא סוגרים",
      },
      {
        iconName: "phone-off",
        text: "מבזבז זמן על טלפונים שלא שווים כלום",
      },
    ],
  },
  beliefBreaker: {
    titleBefore: "הבעיה היא ",
    titleHighlight: "לא בך.",
    paragraph1:
      "רוב השיפוצניקים עובדים בלי מערכת שמביאה להם לקוחות. הם תלויים במזל, בהמלצות, ובפרסום שלא באמת עובד.",
    paragraph2: "ומי שלא שולט בזרימה של לקוחות — נשאר בלי עבודה.",
  },
  solution: {
    kicker: "הפתרון",
    titleBefore: "אנחנו הופכים את זה",
    titleHighlight: "למערכת שעובדת בשבילך.",
    steps: [
      {
        num: "01",
        iconName: "target",
        title: "פניות של לקוחות אמיתיים",
        desc: "אנחנו מאתרים לקוחות שמחפשים שיפוצניק עכשיו — באזור שלך.",
      },
      {
        num: "02",
        iconName: "phone-call",
        title: "ישירות לטלפון שלך",
        desc: "הפניות מגיעות אליך בזמן אמת לוואטסאפ. בלי תווכים.",
      },
      {
        num: "03",
        iconName: "trending-up",
        title: "סוגר. ממלא יומן.",
        desc: "אתה מתקשר, סוגר ומגיע לעבוד. היומן שלך מתמלא.",
      },
    ],
  },
  proof: {
    kicker: "הוכחה",
    title: "זה כבר עובד לשיפוצניקים אחרים.",
    stats: [
      { value: 30, suffix: "+", label: "פניות בחודש" },
      { value: 200, suffix: "+", label: "לקוחות מרוצים" },
      { value: 12, suffix: "", label: "אזורי פעילות" },
    ],
  },
  gallery: {
    kicker: "עבודות",
    title: "הרמה שאנחנו מביאים אליה.",
    subtitle: "לא פרויקטים של 2,000 שקל. עבודות אמיתיות. תקציבים אמיתיים.",
    items: [
      {
        src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
        alt: "מטבח מודרני יוקרתי",
        label: "מטבח יוקרתי",
      },
      {
        src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
        alt: "חדר אמבטיה מודרני עם שיש",
        label: "אמבטיה ברמה גבוהה",
      },
      {
        src: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
        alt: "סלון מעוצב מודרני",
        label: "סלון מעוצב",
      },
      {
        src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
        alt: "צוות עבודה מקצועי",
        label: "צוות מקצועי",
      },
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        alt: "מטבח אחרי שיפוץ",
        label: "אחרי השיפוץ",
      },
      {
        src: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
        alt: "תאורה חמה בדירה מעוצבת",
        label: "עיצוב פנים",
      },
    ],
  },
  differentiator: {
    kicker: "הגישה שלנו",
    title: "זה לא עוד שיווק.",
    paragraph1Before: "אנחנו לא מוכרים פרסום. ",
    paragraph1Highlight: "אנחנו בונים לך מערכת שמייצרת עבודה.",
    paragraph2Before: "אתה לא צריך להבין שיווק. ",
    paragraph2Highlight: "אתה צריך לקבל לקוחות.",
  },
  ctaSection: {
    kicker: "הצטרפות",
    titleBefore: "רוצה להתחיל לקבל עבודות ",
    titleHighlight: "כבר השבוע?",
    description: "השאר פרטים — נחזור אליך תוך 24 שעות לפגישת התאמה קצרה.",
    bullets: ["ללא עלות התחלתית", "ללא התחייבות", "ביטול מתי שתרצה"],
    formButtonText: "שלח לי עבודות עכשיו",
  },

  /* ===== סקשנים חדשים ===== */

  beforeAfter: {
    kicker: "תוצאות בשטח",
    title: "ככה נראים לקוחות שמגיעים מהמערכת שלנו",
    subtitle: "פרויקטים אמיתיים. תקציבים אמיתיים. עבודה ברמה גבוהה.",
    items: [
      {
        before:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        after:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
        label: "שיפוץ מטבח — דירה במרכז",
      },
      {
        before:
          "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
        after:
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
        label: "אמבטיה ברמה גבוהה — תל אביב",
      },
      {
        before:
          "https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=1200&q=80",
        after:
          "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
        label: "שיפוץ סלון — דירת 4 חדרים",
      },
    ],
  },

  workPhotos: {
    kicker: "השטח",
    title: "כל יום בעבודה",
    subtitle: "מאות שיפוצניקים מקצועיים שעובדים איתנו",
    items: [
      {
        src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
        caption: "צוות מקצועי בעבודה",
      },
      {
        src: "https://images.unsplash.com/photo-1574359411659-15573a27c0c5?auto=format&fit=crop&w=1200&q=80",
        caption: "עבודה בשטח",
      },
      {
        src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        caption: "פרויקט באמצע",
      },
      {
        src: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80",
        caption: "מקצועיות ברמה גבוהה",
      },
    ],
  },

  marketingProcess: {
    kicker: "מאחורי הקלעים",
    title: "ככה אנחנו מביאים לך פניות",
    subtitle:
      "מערכת שיווק שעובדת בשבילך 24/7 — אתה רק עונה לטלפון.",
    items: [
      {
        iconName: "megaphone",
        title: "פרסומות חכמות",
        description:
          "מודעות בפייסבוק וגוגל שמכוונות בדיוק לאזור הפעילות שלך.",
      },
      {
        iconName: "map-pin",
        title: "מיקוד גיאוגרפי",
        description: "לקוחות באזור שלך בלבד — בלי טלפונים מהצפון אם אתה מהדרום.",
      },
      {
        iconName: "filter",
        title: "סינון לקוחות",
        description: "רק פניות עם תקציב אמיתי וכוונה לסגור.",
      },
      {
        iconName: "bell-ring",
        title: "ישירות לוואטסאפ",
        description: "כל ליד מגיע אליך תוך דקות — בלי לחכות.",
      },
      {
        iconName: "trending-up",
        title: "מעקב ביצועים",
        description: "אתה רואה כמה פניות הגיעו, מה הסטטוס, וכמה סגרת.",
      },
      {
        iconName: "gauge",
        title: "אופטימיזציה רציפה",
        description: "המערכת לומדת מה עובד ומשפרת את הביצועים כל הזמן.",
      },
    ],
  },

  tagline: {
    line1: "אתה לא צריך עוד עבודה.",
    line2: "אתה צריך מערכת שמביאה עבודה.",
  },

  whatsappProof: {
    kicker: "ככה זה נראה",
    title: "לידים שמגיעים אליך לוואטסאפ",
    subtitle: "אמיתיים. עם תקציב. מוכנים לסגור.",
    messages: [
      {
        name: "רחל מ.",
        text: "שלום, אני מחפשת שיפוצניק לדירה ב-3 חדרים בתל אביב. אפשר הצעת מחיר?",
        time: "10:42",
      },
      {
        name: "אבי כ.",
        text: "מתי אתה פנוי להגיע לראות את האמבטיה? אני צריך להתחיל עד החודש הבא.",
        time: "11:15",
      },
      {
        name: "דני ל.",
        text: "התקציב שלי 35 אלף ₪ למטבח. תוכל לבוא לראות מחר?",
        time: "12:03",
      },
      {
        name: "מיכל ש.",
        text: "ראיתי שאתה עובד באזור שלי. אני מעוניינת בהצעת מחיר לסלון + מסדרון.",
        time: "13:28",
      },
    ],
  },

  testimonials: {
    kicker: "המלצות",
    title: "שיפוצניקים שכבר עובדים איתנו",
    items: [
      {
        name: "אבי כ.",
        area: "ראשון לציון",
        quote:
          "עברתי מ-3 פניות בחודש ל-25 פניות חמות. היומן שלי מלא חודשיים קדימה.",
        before: "3",
        after: "25",
      },
      {
        name: "יוסי ש.",
        area: "ירושלים",
        quote:
          "לא הייתי מאמין שזה כזה הבדל. תוך שבועיים סגרתי 4 עבודות גדולות.",
        before: "1",
        after: "8",
      },
      {
        name: "דני ב.",
        area: "מרכז",
        quote:
          "פניות עם תקציב אמיתי. בלי בזבוז זמן על אנשים ש'רק שואלים'.",
        before: "5",
        after: "22",
      },
    ],
  },
};

/**
 * Parse JSON safely. אם השדה ב-DB פגום, נופלים על ברירת המחדל.
 */
export function parseSiteContent(json: string): SiteContent {
  try {
    const parsed = JSON.parse(json);
    // הגנה רדודה: ממזגים עם ברירת המחדל כדי שלא יחסר שדה ויפיל את ה-render
    return { ...DEFAULT_SITE_CONTENT, ...parsed } as SiteContent;
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function stringifySiteContent(content: SiteContent): string {
  return JSON.stringify(content);
}
