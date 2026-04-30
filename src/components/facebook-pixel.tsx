import Script from "next/script";

/**
 * Meta (Facebook) Pixel — מוטמע בדף הציבורי כאשר ה-tenant הגדיר קוד פיקסל.
 *
 * המשתמש מדביק את הקוד המלא ב-/admin/settings (כולל <script> ו-<noscript>).
 * כאן אנחנו מנתחים את הקוד ומפצלים בין החלק שנכנס לתוך next/script (כדי
 * להבטיח טעינה תקינה) לבין ה-<noscript> (שמתרנדר as-is).
 */
export function FacebookPixel({ code }: { code: string }) {
  if (!code || !code.trim()) return null;

  const { scriptBody, noscriptHtml } = parsePixelCode(code);

  if (!scriptBody) return null;

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: scriptBody }}
      />
      {noscriptHtml && (
        <noscript dangerouslySetInnerHTML={{ __html: noscriptHtml }} />
      )}
    </>
  );
}

/**
 * מחלץ את תוכן ה-script (בלי תגי <script>) ואת תוכן ה-noscript מתוך הקוד המודבק.
 * אם אין תגי <script> — מתייחס לכל הקוד כתוכן script (תאימות אחורה).
 */
function parsePixelCode(raw: string): {
  scriptBody: string;
  noscriptHtml: string;
} {
  // הסרת הערות HTML שפייסבוק מוסיפה (<!-- Meta Pixel Code -->)
  const cleaned = raw.replace(/<!--[\s\S]*?-->/g, "");

  // חיפוש script body
  const scriptMatch = cleaned.match(
    /<script[^>]*>([\s\S]*?)<\/script>/i
  );
  const scriptBody = scriptMatch
    ? scriptMatch[1].trim()
    : cleaned.includes("fbq")
      ? cleaned.trim()
      : "";

  // חיפוש noscript body
  const noscriptMatch = cleaned.match(
    /<noscript[^>]*>([\s\S]*?)<\/noscript>/i
  );
  const noscriptHtml = noscriptMatch ? noscriptMatch[1].trim() : "";

  return { scriptBody, noscriptHtml };
}
