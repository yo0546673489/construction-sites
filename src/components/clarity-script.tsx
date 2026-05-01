import Script from "next/script";

/**
 * Microsoft Clarity — session recordings, heatmaps וניתוח התנהגות גולשים.
 *
 * המשתמש מדביק את הקוד המלא ב-/admin/settings (כפי ש-Clarity נותן
 * ב-Settings → Setup → Install tracking code). אנחנו מחלצים את גוף ה-script
 * ומטמיעים אותו דרך next/script כדי להבטיח טעינה תקינה.
 */
export function ClarityScript({ code }: { code: string }) {
  if (!code || !code.trim()) return null;

  const scriptBody = parseClarityCode(code);
  if (!scriptBody) return null;

  return (
    <Script
      id="ms-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: scriptBody }}
    />
  );
}

/**
 * מחלץ את תוכן ה-<script> מהקוד המודבק.
 * אם נדבק רק ה-Project ID (10 תווים אלפא-נומריים) — בונים את הקוד הסטנדרטי.
 */
function parseClarityCode(raw: string): string {
  const cleaned = raw.replace(/<!--[\s\S]*?-->/g, "").trim();

  // אופציה: המשתמש הזין רק Project ID (לדוגמה: "abc123def4")
  if (/^[a-z0-9]{8,16}$/i.test(cleaned)) {
    return buildStandardClarityCode(cleaned);
  }

  // אופציה: המשתמש הדביק <script>...</script>
  const m = cleaned.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (m) return m[1].trim();

  // אופציה: המשתמש הדביק את הקוד הגולמי בלי תגי <script>
  if (cleaned.includes("clarity") || cleaned.includes("clarity.ms")) {
    return cleaned;
  }

  return "";
}

/** סקריפט סטנדרטי של Clarity — בא לידי שימוש כשמשתמש מזין רק Project ID. */
function buildStandardClarityCode(projectId: string): string {
  return `
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${projectId}");
  `.trim();
}
