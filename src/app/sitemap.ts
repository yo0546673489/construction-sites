import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

/**
 * Sitemap דינמי — מחזיר את כל הדפים הפעילים.
 *
 * כתובת ציבורית: https://www.pro-digital.org/sitemap.xml
 *
 * כולל:
 *  - הדף הראשי (= rewrite ל-/sites/demo)
 *  - כל ה-tenants המפורסמים תחת /sites/{slug}
 *
 * לא כולל:
 *  - דפי /admin (מוגנים ב-robots.txt)
 *  - API endpoints
 *
 * Note: בעתיד, כשנוסיף custom domains או דפי משנה, נצרף אותם כאן.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.pro-digital.org";

  // שולפים את כל ה-tenants הפעילים
  const tenants = await prisma.tenant.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const urls: MetadataRoute.Sitemap = [
    // הדף הראשי — מציג את האתר של demo (שיפוצניק) דרך rewrite
    {
      url: baseUrl,
      lastModified: tenants[0]?.updatedAt ?? new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // כל אתר ציבורי
  for (const t of tenants) {
    urls.push({
      url: `${baseUrl}/sites/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return urls;
}
