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
  };

  /* Story — סיפור העמותה */
  story: {
    kicker: string;
    paragraphs: string[];
    cta: string;
  };

  /* Gallery — רגעים מהשטח */
  gallery: {
    title: string;
    subtitle: string;
    items: Array<{
      src: string;
      caption: string;
    }>;
  };

  /* Impact */
  impact: {
    title: string;
    counters: Array<{
      value: number;
      suffix: string;
      label: string;
    }>;
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
  };

  /* Urgency */
  urgency: {
    title: string;
    subtitle: string;
    goal: number;
    raised: number;
    deadline: string;
  };

  /* Big Video — וידאו ענק עם play overlay */
  bigVideo: {
    title: string;
    subtitle: string;
    videoUrl: string;
    poster: string;
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
    typewriterPhase2: "אבל בזכותך – זה יכול להשתנות",
    typewriterPhase3: "פותחים את הלב. מצילים משפחות.",
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
  },
  story: {
    kicker: "הסיפור שלנו",
    paragraphs: [
      'עמותת "פותחים את הלב בהובלת הנוער" הוקמה לפני כחמש שנים ביוזמה של בני נוער מפרדס חנה-כרכור — מתוך רצון אמיתי לשנות מציאות ולסייע למשפחות, קשישים ונכים נזקקים.',
      "בכל שבוע מחולקים סלי מזון מלאים לכ-250 משפחות, ובחגים — מעל 400 סלים, כשהצורך רק הולך וגדל.",
      "העמותה פועלת בהתנדבות מלאה של בני נוער שמובילים עשייה אמיתית — אוספים, אורזים, מעמיסים, ויוצאים לשטח עם שליחות בלב.",
    ],
    cta: "אני רוצה להיות חלק ❤️",
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
  },
  impact: {
    title: "במספרים",
    counters: [
      { value: 250, suffix: "", label: "משפחות בכל שבוע" },
      { value: 400, suffix: "+", label: "סלים בחגים" },
      { value: 5, suffix: "", label: "שנות פעילות" },
      { value: 100, suffix: "%", label: "התנדבות נוער" },
    ],
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
  },
  urgency: {
    title: "הביקוש עולה — ואנחנו חייבים אתכם",
    subtitle:
      "כל תרומה עכשיו מאפשרת חלוקה נוספת השבוע. אל תחכה — אנשים סומכים עלינו.",
    goal: 100000,
    raised: 78000,
    deadline: "30 בנובמבר",
  },
  bigVideo: {
    title: "תראו איך נראית החלוקה בפועל",
    subtitle: "סרטון אחד שווה אלף מילים",
    videoUrl: "/uploads/charity/video-08.mp4",
    poster: "/uploads/charity/image-17.jpg",
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
    line2: "וגורמים לשינוי אמיתי",
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
export function parseCharityContent(json: string): CharitySiteContent {
  try {
    const parsed = JSON.parse(json);
    return { ...DEFAULT_CHARITY_CONTENT, ...parsed } as CharitySiteContent;
  } catch {
    return DEFAULT_CHARITY_CONTENT;
  }
}

export function stringifyCharityContent(content: CharitySiteContent): string {
  return JSON.stringify(content);
}
