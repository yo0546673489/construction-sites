"use server";

import { prisma } from "@/lib/db";

/**
 * שמירת ליד חדש מהדף הציבורי.
 * חשוב: לא דורש auth (דף ציבורי). הבידוד הוא לפי tenantId שמועבר מהדף.
 * ה-tenantId לא נחשף ל-client בתור ערך רגיש — הוא ידוע בלבד דרך ה-tenant
 * הספציפי שטענו. אם מזייפים tenantId, הליד פשוט יישמר ל-tenant אחר —
 * אין דליפת מידע, רק "ספאם" לכיוון הלא-נכון.
 */
export async function submitLead(input: {
  tenantId: string;
  name: string;
  phone: string;
  area: string;
}) {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const area = input.area.trim();

  if (!name || !phone || !area) {
    return { ok: false, error: "כל השדות חובה" } as const;
  }
  if (name.length > 100 || phone.length > 30 || area.length > 100) {
    return { ok: false, error: "אחד מהשדות ארוך מדי" } as const;
  }

  // ודא שה-tenant קיים ופעיל
  const tenant = await prisma.tenant.findUnique({
    where: { id: input.tenantId },
    select: { id: true, published: true },
  });
  if (!tenant || !tenant.published) {
    return { ok: false, error: "האתר אינו זמין כרגע" } as const;
  }

  await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      name,
      phone,
      area,
    },
  });

  return { ok: true } as const;
}
