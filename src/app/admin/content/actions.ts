"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth-helpers";
import { parseSiteContent, stringifySiteContent } from "@/lib/content";
import {
  parseCharityContent,
  stringifyCharityContent,
} from "@/lib/charity-content";

/**
 * שמירת תוכן הדף — ה-payload מגיע מהטופס כ-JSON-string.
 * הסכימה תלויה ב-template של ה-tenant.
 * בידוד: שומר רק על ה-tenant של המשתמש המחובר.
 */
export async function saveContent(payload: string) {
  const { tenant } = await requireTenantUser();

  try {
    JSON.parse(payload);
  } catch {
    return { ok: false, error: "פורמט לא תקין" } as const;
  }

  // ממזגים עם ברירת המחדל לפי הסוג, כדי לא לאבד שדות
  let serialized: string;
  if (tenant.template === "charity") {
    const merged = parseCharityContent(payload);
    serialized = stringifyCharityContent(merged);
  } else {
    const merged = parseSiteContent(payload);
    serialized = stringifySiteContent(merged);
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { content: serialized },
  });

  // רענון של דפי הציבור
  revalidatePath(`/sites/${tenant.slug}`);
  revalidatePath("/admin");

  return { ok: true } as const;
}

/**
 * החלפת מצב פרסום — האם הדף הציבורי גלוי.
 */
export async function togglePublished(published: boolean) {
  const { tenant } = await requireTenantUser();
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { published },
  });
  revalidatePath(`/sites/${tenant.slug}`);
  return { ok: true } as const;
}
