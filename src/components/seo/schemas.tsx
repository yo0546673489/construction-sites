import type { SiteContent } from "@/lib/content";
import type { CharityContent } from "@/lib/charity-content";
import { JsonLd } from "./json-ld";

/* ============================================================
   LocalBusinessSchema — לתבנית "שיפוצניק" (renovator)
   ============================================================ */

type RenovatorSchemaProps = {
  content: SiteContent;
  url: string;
};

/**
 * Schema לעסק מקומי — מתאים לשיפוצניקים, נותני שירות וכו'.
 * שדות שלא קיימים אצלנו (כתובת מלאה, geo) — לא יופיעו בסכמה,
 * ה-LD יתעלם מ-undefined.
 */
export function LocalBusinessSchema({ content, url }: RenovatorSchemaProps) {
  // ניקוי מספר טלפון — Schema.org רוצה פורמט בינלאומי עם +
  const phone = content.contact.whatsappNumber
    ? `+${content.contact.whatsappNumber.replace(/\D/g, "")}`
    : undefined;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": url,
    name: content.meta.brandName,
    description: content.meta.pageDescription,
    url,
    image: content.hero.backgroundImage,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IL",
    },
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
    priceRange: "₪₪",
    aggregateRating: content.proof?.stats?.length
      ? {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: String(
            content.proof.stats.find((s) => s.label?.includes("לקוחות"))
              ?.value ?? 50
          ),
        }
      : undefined,
  };

  return <JsonLd data={cleanUndefined(schema)} />;
}

/* ============================================================
   NGOSchema — לתבנית "עמותה" (charity)
   ============================================================ */

type NGOSchemaProps = {
  content: CharityContent;
  url: string;
};

export function NGOSchema({ content, url }: NGOSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": url,
    name: content.meta?.brandName,
    description: content.meta?.pageDescription,
    url,
    logo: content.logoUrl,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IL",
    },
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
  };

  return <JsonLd data={cleanUndefined(schema)} />;
}

/* ============================================================
   WebSiteSchema — schema כללי לכל אתר (SearchAction = sitelinks search box)
   ============================================================ */

type WebSiteSchemaProps = {
  url: string;
  name: string;
  description: string;
};

export function WebSiteSchema({ url, name, description }: WebSiteSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name,
        description,
        inLanguage: "he-IL",
      }}
    />
  );
}

/* ============================================================
   BreadcrumbSchema — לעתיד (כשיהיו דפי משנה)
   ============================================================ */

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

/* ============================================================
   Helpers
   ============================================================ */

/** מסיר רקורסיבית מפתחות שערכם undefined כדי שהסכמה תהיה נקייה. */
function cleanUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as unknown as T;
  }
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;
      out[k] = cleanUndefined(v);
    }
    return out as T;
  }
  return obj;
}
