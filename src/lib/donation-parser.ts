// lib/donation-parser.ts
// פרסר אוניברסלי לחילוץ נתוני תרומה ממיילים
// תומך ב-Nedarim Plus, JGive, Cardcom, ועוד

import type { ParsedDonation } from './feature-types';

interface ParserContext {
  subject: string;
  body: string;
  from: string;
  date: Date;
  keywords: Array<{ id: string; keyword: string; campaignName: string }>;
}

// ============================================
// 1. ניקוי טקסט HTML/RTF
// ============================================

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// 2. דפוסי חילוץ סכום
// ============================================

const AMOUNT_PATTERNS = [
  // עם תווית "סכום:"
  /סכום[:\s]+₪?\s*([\d,]+\.?\d*)/,
  /amount[:\s]+\$?₪?\s*([\d,]+\.?\d*)/i,
  /total[:\s]+\$?₪?\s*([\d,]+\.?\d*)/i,
  
  // ש"ח אחרי המספר
  /([\d,]+\.?\d*)\s*₪/,
  /([\d,]+\.?\d*)\s*ש["']?ח/,
  /([\d,]+\.?\d*)\s*שח/,
  /([\d,]+\.?\d*)\s*NIS/i,
  /([\d,]+\.?\d*)\s*ILS/i,
  
  // ₪ לפני המספר
  /₪\s*([\d,]+\.?\d*)/,
  /\$\s*([\d,]+\.?\d*)/,
];

function extractAmount(text: string): number | null {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const cleaned = match[1].replace(/,/g, '');
      const amount = parseFloat(cleaned);
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  return null;
}

// ============================================
// 3. דפוסי חילוץ שם תורם
// ============================================

const NAME_PATTERNS = [
  /שם[:\s]+([\u0590-\u05FF\sא-ת]+?)(?=\n|כתובת|טלפון|מייל|סכום|תאריך|$)/,
  /תורם[:\s]+([\u0590-\u05FF\sא-ת]+?)(?=\n|כתובת|טלפון|מייל|סכום|$)/,
  /donor[:\s]+([A-Za-z\s]+?)(?=\n|address|phone|email|$)/i,
  /name[:\s]+([A-Za-z\u0590-\u05FF\s]+?)(?=\n|address|phone|email|$)/i,
];

function extractDonorName(text: string): string | undefined {
  for (const pattern of NAME_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const name = match[1].trim();
      // ולידציה: לפחות 2 תווים, לא יותר מ-50
      if (name.length >= 2 && name.length <= 50) {
        return name;
      }
    }
  }
  return undefined;
}

// ============================================
// 4. דפוסי חילוץ טלפון
// ============================================

const PHONE_PATTERNS = [
  /טלפון[:\s]+([\d\-+]+)/,
  /נייד[:\s]+([\d\-+]+)/,
  /phone[:\s]+([\d\-+()]+)/i,
  /tel[:\s]+([\d\-+()]+)/i,
  /(05\d{1}[-\s]?\d{3}[-\s]?\d{4})/,  // ישראלי
];

function extractPhone(text: string): string | undefined {
  for (const pattern of PHONE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const phone = match[1].replace(/[\s\-()]/g, '');
      if (phone.length >= 9 && phone.length <= 15) {
        return phone;
      }
    }
  }
  return undefined;
}

// ============================================
// 5. דפוסי חילוץ אמצעי תשלום
// ============================================

const PAYMENT_METHODS: Record<string, RegExp[]> = {
  ביט: [/\bביט\b/, /\bbit\b/i],
  אשראי: [/\bאשראי\b/, /\bcredit/i, /\bvisa\b/i, /\bmastercard\b/i],
  PayPal: [/\bpaypal\b/i, /\bפייפאל\b/],
  הוראת_קבע: [/הוראת\s*קבע/, /\bstanding\s*order/i],
  צ_ק: [/\bצ['"]?ק\b/, /\bcheck\b/i, /\bcheque\b/i],
  העברה: [/העברה\s*בנקאית/, /bank\s*transfer/i, /wire/i],
  מזומן: [/\bמזומן\b/, /\bcash\b/i],
};

function extractPaymentMethod(text: string): string | undefined {
  for (const [method, patterns] of Object.entries(PAYMENT_METHODS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return method.replace(/_/g, ' ');
      }
    }
  }
  return undefined;
}

// ============================================
// 6. זיהוי מערכת השולח
// ============================================

function detectParserSource(from: string, body: string): string {
  const fromLower = from.toLowerCase();
  
  if (fromLower.includes('nedarimplus') || body.includes('נדרים פלוס')) {
    return 'nedarim_plus';
  }
  if (fromLower.includes('jgive')) {
    return 'jgive';
  }
  if (fromLower.includes('cardcom')) {
    return 'cardcom';
  }
  if (fromLower.includes('paypal')) {
    return 'paypal';
  }
  if (fromLower.includes('matara') || body.includes('מטרה')) {
    return 'matara';
  }
  
  return 'universal';
}

// ============================================
// 7. התאמה למילות מפתח של הקמפיין
// ============================================

function matchKeyword(
  text: string,
  keywords: Array<{ id: string; keyword: string; campaignName: string }>
): { id: string; keyword: string; campaignName: string } | null {
  const textLower = text.toLowerCase();
  
  for (const kw of keywords) {
    if (!kw.keyword.trim()) continue;
    
    const keywordLower = kw.keyword.toLowerCase().trim();
    if (textLower.includes(keywordLower)) {
      return kw;
    }
  }
  return null;
}

// ============================================
// 8. הפונקציה הראשית - parseEmail
// ============================================

export function parseEmail(context: ParserContext): ParsedDonation | null {
  const cleanBody = stripHtml(context.body);
  const fullText = `${context.subject}\n${cleanBody}`;
  
  // 1. בדיקת התאמה למילת קוד - חובה
  const matched = matchKeyword(fullText, context.keywords);
  if (!matched) {
    return null; // אין קמפיין רלוונטי
  }
  
  // 2. חילוץ סכום - חובה
  const amount = extractAmount(fullText);
  if (!amount) {
    return null; // לא הצלחנו לחלץ סכום
  }
  
  // 3. חילוץ פרטים נוספים (לא חובה)
  const donorName = extractDonorName(cleanBody);
  const donorPhone = extractPhone(cleanBody);
  const paymentMethod = extractPaymentMethod(fullText);
  const parserSource = detectParserSource(context.from, fullText);
  
  // 4. בדיקה אם הנתונים מספיק טובים
  const needsReview = !donorName || !paymentMethod;
  
  // 5. שמירת snippet לדיבאג ואימות
  const rawSnippet = cleanBody.substring(0, 200);
  
  return {
    amount,
    currency: 'ILS',
    donorName,
    donorPhone,
    paymentMethod,
    matchedKeyword: matched.keyword,
    parserSource,
    needsReview,
    rawSnippet,
  };
}

// ============================================
// 9. בדיקות לפיתוח (אפשר למחוק בייצור)
// ============================================

export function testParser() {
  const sample = `
    נדרים פלוס - התקבלה עסקה חדשה #70718975
    
    שלום רב,
    להלן פרטי העסקה שנתקבלה במערכת עבור קופת הצדקה המרכזית - טוב לב:
    
    תאריך עסקה: 04/05/2026 21:51
    שם: שיר ר
    טלפון: 0523283997
    סכום: 100.00 ₪
    תשלומים: 1
    קטגוריה: ב-36 ש"ח יסעד רעב בבית התמחוי בזכותך
    הערות: פרויקט 36 ms 2 |
    מותג: ביט
    מספר אישור: 29617529
  `;
  
  const result = parseEmail({
    subject: '[נדרים פלוס] התקבלה עסקה חדשה #70718975',
    body: sample,
    from: 'noreply@nedarimplus.com',
    date: new Date(),
    keywords: [
      { id: '1', keyword: 'פרויקט 36', campaignName: 'סבב חורף 2026' },
    ],
  });
  
  console.log('Parser Result:', result);
  return result;
}
