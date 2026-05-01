"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth-helpers";

/**
 * עדכון קוד פיקסל פייסבוק עבור ה-tenant הנוכחי.
 * מקבל את הקוד המלא כפי שמוצג ב-Meta Events Manager
 * (כולל <script> ו-<noscript>), או לחילופין רק מזהה (15-16 ספרות) —
 * במקרה כזה נארוז אותו אוטומטית בקוד הסטנדרטי.
 *
 * מחרוזת ריקה — מסירה את הפיקסל.
 */
export async function updateFacebookPixel(input: string) {
  const { tenant } = await requireTenantUser();

  const trimmed = input.trim();

  // הסרה
  if (trimmed.length === 0) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { facebookPixelCode: null },
    });
    revalidatePath("/admin/settings");
    revalidatePath(`/sites/${tenant.slug}`);
    return { ok: true } as const;
  }

  // אם המשתמש הזין רק מספר — נארוז ב-template הסטנדרטי
  let code = trimmed;
  if (/^[0-9]{6,32}$/.test(trimmed)) {
    code = buildStandardPixelCode(trimmed);
  } else {
    // ולידציה בסיסית — צריך להיות קוד פיקסל אמיתי
    const looksLikePixel =
      code.includes("fbq") &&
      (code.includes("connect.facebook.net") || code.includes("facebook.com"));
    if (!looksLikePixel) {
      return {
        ok: false,
        error:
          "הקוד אינו נראה כקוד פיקסל פייסבוק תקין — ודא שהעתקת את הקוד המלא מ-Meta Events Manager",
      } as const;
    }
    // הגבלת אורך כהגנה (קוד פיקסל סטנדרטי < 2KB)
    if (code.length > 8000) {
      return {
        ok: false,
        error: "הקוד ארוך מדי. ודא שהעתקת רק את קוד הפיקסל ולא תוכן נוסף",
      } as const;
    }
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { facebookPixelCode: code },
  });

  revalidatePath("/admin/settings");
  revalidatePath(`/sites/${tenant.slug}`);
  return { ok: true } as const;
}

/**
 * עדכון קוד Microsoft Clarity עבור ה-tenant הנוכחי.
 * מקבל את הקוד המלא (כולל <script>) או רק את ה-Project ID.
 * מחרוזת ריקה — מסירה את הקוד.
 */
export async function updateClarityCode(input: string) {
  const { tenant } = await requireTenantUser();
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { clarityCode: null },
    });
    revalidatePath("/admin/settings");
    revalidatePath(`/sites/${tenant.slug}`);
    return { ok: true } as const;
  }

  // ולידציה — או Project ID לבד או קוד שמכיל "clarity"
  const isProjectId = /^[a-z0-9]{8,16}$/i.test(trimmed);
  const looksLikeClarity =
    trimmed.includes("clarity") || trimmed.includes("clarity.ms");

  if (!isProjectId && !looksLikeClarity) {
    return {
      ok: false,
      error:
        "הקוד אינו נראה כקוד Clarity תקין — הדבק את הקוד המלא מ-clarity.microsoft.com או רק את ה-Project ID",
    } as const;
  }

  if (trimmed.length > 4000) {
    return {
      ok: false,
      error: "הקוד ארוך מדי. ודא שהעתקת רק את קוד Clarity",
    } as const;
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { clarityCode: trimmed },
  });

  revalidatePath("/admin/settings");
  revalidatePath(`/sites/${tenant.slug}`);
  return { ok: true } as const;
}

/** בניית קוד הפיקסל הסטנדרטי כשהמשתמש הזין רק מספר */
function buildStandardPixelCode(pixelId: string): string {
  return `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`;
}
