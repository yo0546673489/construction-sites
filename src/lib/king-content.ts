/**
 * KingSiteContent — סכימה לתבנית "לחיות כמו מלך".
 * אתר תוכן/קואצ'ינג בנושא שמירת הברית (יהודי דתי).
 * מבוסס על ניתוח של 13 צילומי מסך מהאתר המקורי.
 */

import type { StyleOverrides } from "@/lib/content";

export type KingSiteContent = {
  /* SEO + מטא */
  meta: {
    brandName: string;
    pageTitle: string;
    pageDescription: string;
    logoUrl: string;
  };

  /* Top Navigation */
  nav: {
    items: Array<{ label: string; href: string }>;
    /** כפתור "הורדת המדריך" — כתום */
    primaryCta: { text: string; href: string };
    /** כפתור "השיק בפודקאסט" — ירוק */
    secondaryCta: { text: string; href: string };
  };

  /* HERO */
  hero: {
    title: string;
    subtitle: string;
    /** כפתור CTA יחיד גדול */
    ctaText: string;
    ctaHref: string;
    /** תמונת אריה */
    lionImage: string;
  };

  /* Book Solution Section — "הפתרון שיעזור לך לצאת מפגם הברית" */
  bookSolution: {
    title: string;
    titleHighlight: string;
    intro: string;
    paragraphs: string[];
    bookImage: string;
  };

  /* Pain Cards — "אח יקר, אם אתה:" — 4 cards */
  painCards: {
    title: string;
    cards: Array<{ text: string }>;
    bottomLine: string;
  };

  /* Mountain Big CTA — "גם אתה, כמו עשרות-אלפי בחורים..." */
  mountainCta: {
    title: string;
    titleHighlight: string;
    backgroundImage: string;
  };

  /* Journey Cards — "המסע שלך אל החופש מתחיל ... כאן!" — 6 cards */
  journeyCards: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    cards: Array<{
      number: string;
      iconName: string;
      title: string;
      description: string;
    }>;
  };

  /* Testimonials — "סיפורי הצלחה" — 4 cards */
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      quote: string;
    }>;
    moreLink: string;
  };

  /* Articles — "מחקרים מדעיים עדכניים..." */
  articles: {
    title: string;
    intro: string;
    items: Array<{
      number: string;
      title: string;
      excerpt: string;
      readMoreText?: string;
    }>;
    moreLink: string;
  };

  /* Contact form */
  contact: {
    title: string;
    description: string;
    fieldName: string;
    fieldEmail: string;
    fieldPhone: string;
    fieldMessage: string;
    consentText: string;
    submitText: string;
  };

  /* Apps section — "תמצא אותנו בכל הערוצים" */
  apps: {
    title: string;
    description: string;
    sosCard: { title: string; description: string; cta: string; href: string };
    aryotCard: { title: string; description: string; cta: string; href: string };
    socialTitle: string;
    socialLinks: Array<{ platform: string; url: string }>;
  };

  /* Footer */
  footer: {
    brandTagline: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
    columns: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    copyrightText: string;
  };

  styleOverrides?: StyleOverrides;
};

/* ===========================================================
   ברירת המחדל — מבוסס על הצילומים האמיתיים
   =========================================================== */
export const DEFAULT_KING_CONTENT: KingSiteContent = {
  meta: {
    brandName: "לחיות כמו מלך",
    pageTitle: "לחיות כמו מלך — המדריך המלא ליציאה מפגם הברית",
    pageDescription:
      "המדריך המלא ליציאה מפגם הברית לתמיד. אלפי בחורים שהשתחררו, סיפורי הצלחה ומחקרים מדעיים.",
    logoUrl: "",
  },
  nav: {
    items: [
      { label: "בית", href: "#" },
      { label: "אודות", href: "#about" },
      { label: "הזדהות התרומה", href: "#identify" },
      { label: "מחקרים מדעיים", href: "#articles" },
      { label: "סיפורי הצלחה", href: "#testimonials" },
      { label: "צרו קשר", href: "#contact" },
    ],
    primaryCta: { text: "הורדת המדריך", href: "#contact" },
    secondaryCta: { text: "האזינו לפודקאסט", href: "#" },
  },
  hero: {
    title: "לחיות כמו מלך",
    subtitle: "המדריך המלא ליציאה מפגם הברית — לתמיד!",
    ctaText: "להורדת המדריך בחינם עכשיו!",
    ctaHref: "#contact",
    lionImage: "",
  },
  bookSolution: {
    title: "הפתרון שיעזור לך לצאת מפגם",
    titleHighlight: "הברית — אחת ולתמיד!",
    intro:
      'חיל עומדים להשתתפות מן הקצה אל הקצה עם "לחיות כמו מלך"',
    paragraphs: [
      "החוברת הזו, שכוללה עם המון אהבה, רגישות וזרימה מדויקת, יש בכוחה לעזור לך לצאת מהשעבוד הכי קשה בעולם — ההרגל לפגום הברית.",
      "אני אובטיח, קודם כל מתוך — שאחת לא לדבר במאבק שלך?",
      "זה המאבק הכי קשה ביותר שלנו, ולכן כתבנו ועבדנו על המדריך הזה. בכרכים ומשאבי, על-מנת לעזור לך כך לחתבחזק ולחתחזחזק לצרכים את הקשבה ולהשפיע זרע לבטלה.",
      "בוא תגלה את הכוח העצום שטמון בך לצאת זה ולחיות חיים מלאי ברכה, אור, שמחה, עוצמה וטהרה — החיים האמורים שטענו לך מלכתחילה!",
    ],
    bookImage: "",
  },
  painCards: {
    title: "אח יקר, אם אתה:",
    cards: [
      { text: "מרגיש שהחיים נקועים ולא יודע מה לעשות" },
      {
        text: "מנסה שוב ושוב להפסיק אך לא מצליח לצאת מהבוץ",
      },
      {
        text: "לכוד בטעצי הקסמים מתסכל ולא יודע איך להתיר אותו",
      },
      {
        text: "נכנע לפיצוי ופוגש בכוורון באוכף קבוע לפתות אחת לשבועיים",
      },
    ],
    bottomLine: "אז יש לנו את הפתרון לבעיה שלך!",
  },
  mountainCta: {
    title: "גם אתה, כמו עשרות-אלפי בחורים",
    titleHighlight:
      'אחרים שהתחזקו עם "לחיות כמו מלך"… תצא מזה!',
    backgroundImage: "",
  },
  journeyCards: {
    title: "המסע שלך אל החופש מתחיל",
    titleHighlight: "כאן!",
    subtitle: "מה תלמד באמצעות המדריך שלי:",
    cards: [
      {
        number: "1.",
        iconName: "search",
        title: "תכיר את הבעיה שלך לעומק",
        description:
          "תבין מה זה פגם הברית באמת, איך זה נוצר, איזה נזקים זה גורם, ולמה זה כל-כך מסוכן.",
      },
      {
        number: "2.",
        iconName: "shield",
        title: "תקבל הצעות שכוונותיך זרע",
        description:
          "תכיר את הסיבות הנכונות שמובילות אותך לחזרה לפגם — וכך תוכל למנוע אותן.",
      },
      {
        number: "3.",
        iconName: "key",
        title: "תבץ ותכבר שתיחות מהוטויות",
        description:
          "תקבל כלים פרקטיים לפתיחת השער, יצירת תזוזה והתחברות לפנים שלך.",
      },
      {
        number: "4.",
        iconName: "users",
        title: "שיטה שעזרה גם לחזרי מתעודי",
        description:
          "מפת דרכים מסודרת שאלפי בחורים השתמשו בה והצליחו לצאת — אחת ולתמיד.",
      },
      {
        number: "5.",
        iconName: "target",
        title: "תפעל בהצלת הקיסום",
        description:
          "תכיר את הדרך לקדם פעילות ולשמור על קסם החיים שלך מבלי לפגוע בעצמך.",
      },
      {
        number: "6.",
        iconName: "infinity",
        title: "כיצד תמשיך את היותך?",
        description:
          "תקבל את הבסיס לשמירה ארוכת טווח, מנגנונים פרקטיים ותכנון לתמיד.",
      },
    ],
  },
  testimonials: {
    title: "סיפורי הצלחה",
    subtitle:
      'עדויות אמיתיות של בחורים כמוך שהתחזקו ופגם הברית באמצעות "לחיות כמו מלך"',
    items: [
      {
        title: 'הספר ש"לחיות כמו מלך" היה עבור הצלה לדרור!',
        quote:
          "ביש שנים רבות שאני מתמודד עם פגם הברית ולא מצליח להפסיק. ניסיתי הכל. רק כשמצאתי את המדריך הזה, הבנתי שיש פתרון אמיתי. תוך כמה חודשים — שינוי אמיתי שלא האמנתי שיקרה.",
      },
      {
        title: "הספרות הזה חידש אותי גרמתם אומר אפשר לחאר",
        quote:
          "אני קורא הרבה ספרים בנושא, אבל זה היה משהו אחר. הבהיר, מסודר, ועם דרך פרקטית. תוך חצי שנה אני נקי, ועד היום אני נשען על הכלים מהמדריך.",
      },
      {
        title: "בחוברת הזו באמת יש משהו מיוחד!",
        quote:
          "מה שמיוחד פה זה השילוב של כתיבה רגישה, הבנה אמיתית של הקושי, וכלים מעשיים שעובדים. לא עוד תיאוריה מנותקת — אלא שיטה אמיתית. זה שינה לי את החיים.",
      },
      {
        title: "הספרים מחזק ביותר",
        quote:
          "כתבתם משהו שאי אפשר לקרוא בלי דמעות. כל פסקה מחזיקה ומלמדת. ההבנה שיש דרך החוצה, ושאני לא לבד — זה שינה לי את הכל.",
      },
    ],
    moreLink: "לקריאת עוד סיפורי הצלחה",
  },
  articles: {
    title:
      "מחקרים מדעיים עדכניים על נזקי הפורנוגרפיה, האונן והוצאת זרע לבטלה",
    intro:
      "מחקרים מדעיים עדכניים מובילים מן הסטף מאוד. שדה ומובלים לך ערך הפורנוגרפיה (סטוסיו), זוקא בעידן מתון, שעלולה היא לתבעוט (פגם הברית) — לבין נזקים תפסיכוגיים בריאות, בקשיים תרכבותיים, באיכות שמהשם החיים. במחקרים האחרונים מתחזקים הצורך הצעת.",
    items: [
      {
        number: "1",
        title:
          "תקציר ב-7% המתמודים הכרניים שירוץ ושרך בערכי פורנוגרפיה ואונן",
        excerpt:
          "מחקר שנערך בקרב גם רכיב 7,000 גברים בני 18 עד 30 על השפעת הפורנוגרפיה והאונן על תופעות בנפש בקרב בחורים בלגן 2.7 לעומה ניתן 18%. מחקר ראשון של סוגו ומאשר חתימה.",
      },
      {
        number: "2",
        title:
          "השפעת שלקריות של גרסת הפורנוגרפיה והאונן על קייסיו הקופה זרע מהשתת",
        excerpt:
          "מחקר באוניברסיטת קליפורניה לפני שנים מצאן שעשרות אלפים מנגנים פעמים מצמייה כמרך ליהיות הזרעיב, נכלאוצרים, מאון מאופוצויב, מתרים זרע נכלאים וסיכוייהם להאן, אינם נמצאים, מסקייה — מסקנואיים. מחקרי נוספים שמהוציעים את החיים מים-מסות נמצאו אנותכפותיים.",
      },
      {
        number: "3",
        title:
          "שלינך והוצאת זרע לבטלה מהקיסיה לבחורים מאופוץ בית הקעיר",
        excerpt:
          "מחקר ב-2026 לפני 3,400 גבר ראשי לוויות ביתי הקדם, אצל 88% מבעלי משפחה. ניצור על הקופ של ברגאוטוגרפיה ניצורי קלוית. ביבסואל בעיים. ביא 96% הקיסור בלעדיו במגע, חולגיים נוספים על הקייסיה.",
      },
      {
        number: "4",
        title:
          "תקציר נוצרים לב לפני האונן הפורנוגרפיה ושאיכא הוצאת זרע לבטלה",
        excerpt:
          "מחקר וביצין בלעי מאוויים מסיכואייה. סוקר אינטרנטיים מצאו שיש על האונן וצפיה בפורנוגרפיה השפעה לשליליות על הבריאות הנפשית, ועל יכולתם לקבועים בקעוקים יחיסיים תקיניים. בחורים שמתפעוים זה זרעבי בורם זוכים לחיים מלאים יותר.",
      },
    ],
    moreLink: "לצפייה בכל המאמרים המדעיים",
  },
  contact: {
    title: "צור איתנו קשר",
    description:
      "מוזמן לכתוב לנו בכל שאלה או בקשה לעזרה, וגם אם ברצונך להצטרף לפעילות שלנו",
    fieldName: "שם פרטי ומשפחה",
    fieldEmail: "אימייל",
    fieldPhone: "טלפון",
    fieldMessage: "דבר איתי אחי",
    consentText: "אשמח להיות בקשר ולהתעדכן לגבי הפעילות התברכת שלכם",
    submitText: "שלח",
  },
  apps: {
    title: "תמצא אותנו בכל הערוצים",
    description:
      "תכנים, אירועים, עצות בדיקות, ייעוצים והשראה שלא תרצה לפספס. הזמנתי הצטרפות עכשיו.",
    sosCard: {
      title: "עזרה ראשונה — SOS",
      description:
        "קבוצת ויראית האונן בני נוער הברית, המסירת תזוקה אופן לקבועי טוודי בקבוצת קוואיב.",
      cta: "להצטרף עכשיו",
      href: "#",
    },
    aryotCard: {
      title: 'ביבברי "אריות"',
      description:
        "קבוצת ויראית האונן בני נוער חברים, המסירת תזוקה אופן לקבועי טוודי בקבוצת.",
      cta: "להצטרף עכשיו",
      href: "#",
    },
    socialTitle: "עקבו אחרינו ברשתות:",
    socialLinks: [
      { platform: "youtube", url: "#" },
      { platform: "tiktok", url: "#" },
      { platform: "instagram", url: "#" },
      { platform: "facebook", url: "#" },
    ],
  },
  footer: {
    brandTagline: "המסע שלך אל החופש",
    primaryCta: { text: "הורדת המדריך", href: "#contact" },
    secondaryCta: { text: "פודקאסט", href: "#" },
    columns: [
      {
        title: "אודות",
        links: [
          { label: "בלוג", href: "#" },
          { label: "האם אתה אונן?", href: "#" },
          { label: "לקראת התברכת אבילי", href: "#" },
          { label: "על העבודות שלנו", href: "#" },
          { label: "אם תיהיה", href: "#" },
        ],
      },
      {
        title: "מאמרים בנושאים",
        links: [
          { label: "מה הוא פגם הברית", href: "#" },
          { label: "מה היא ז... אונה", href: "#" },
          { label: "מה הראשון נמצא בנגע", href: "#" },
          { label: "ביצור הראשון נמצא", href: "#" },
          { label: "על נזקי האונן בשלב צעיר ומבוגר", href: "#" },
          { label: "מה רוצה הוא הספר", href: "#" },
          { label: "גם תזות בארעי", href: "#" },
        ],
      },
    ],
    copyrightText: 'כל הזכויות שמורות — "לחיות כמו מלך" 2026',
  },
};

/* ===========================================================
   Helpers — deep merge
   =========================================================== */
function deepMergeKing<T>(base: T, override: unknown): T {
  if (
    !override ||
    typeof override !== "object" ||
    Array.isArray(override) ||
    !base ||
    typeof base !== "object" ||
    Array.isArray(base)
  ) {
    return override === undefined ? base : (override as T);
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(override as Record<string, unknown>)) {
    const baseVal = (base as Record<string, unknown>)[k];
    const ovVal = (override as Record<string, unknown>)[k];
    out[k] =
      baseVal && typeof baseVal === "object" && !Array.isArray(baseVal)
        ? deepMergeKing(baseVal, ovVal)
        : ovVal !== undefined
          ? ovVal
          : baseVal;
  }
  return out as T;
}

export function parseKingContent(json: string): KingSiteContent {
  try {
    const parsed = JSON.parse(json);
    return deepMergeKing(DEFAULT_KING_CONTENT, parsed);
  } catch {
    return DEFAULT_KING_CONTENT;
  }
}

export function stringifyKingContent(content: KingSiteContent): string {
  return JSON.stringify(content);
}
