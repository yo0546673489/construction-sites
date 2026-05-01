import type { MetadataRoute } from "next";

/**
 * robots.txt דינמי.
 * כתובת ציבורית: https://www.pro-digital.org/robots.txt
 *
 * החלטות:
 *  - לכל הסורקים: מותר הכל חוץ מ-admin/api/_next
 *  - חוסמים סורקי AI (GPTBot, ClaudeBot וכו') — אופציונלי, ניתן לפתוח אם הלקוח רוצה.
 *  - מצביעים על ה-sitemap המאוחד.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
      },
      // חוסמים סורקי AI כברירת מחדל (התוכן שלך — שלך)
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
    ],
    sitemap: "https://www.pro-digital.org/sitemap.xml",
    host: "https://www.pro-digital.org",
  };
}
