"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import {
  setActiveTenantId,
  clearActiveTenantId,
} from "@/lib/active-tenant";
import {
  DEFAULT_SITE_CONTENT,
  stringifySiteContent,
} from "@/lib/content";
import {
  DEFAULT_CHARITY_CONTENT,
  stringifyCharityContent,
} from "@/lib/charity-content";

const SLUG_REGEX = /^[a-z0-9-]{2,40}$/;

/**
 * יצירת לקוח (Tenant) חדש + משתמש OWNER ראשוני שלו.
 * הרשאה: SUPERADMIN בלבד.
 */
export async function createTenant(formData: FormData) {
  await requireSuperAdmin();

  const slug = String(formData.get("slug") ?? "")
    .toLowerCase()
    .trim();
  const name = String(formData.get("name") ?? "").trim();
  const templateInput = String(formData.get("template") ?? "renovator");
  const template = templateInput === "charity" ? "charity" : "renovator";
  const ownerEmail = String(formData.get("ownerEmail") ?? "")
    .toLowerCase()
    .trim();
  const ownerPassword = String(formData.get("ownerPassword") ?? "");
  const ownerName = String(formData.get("ownerName") ?? "").trim();

  if (!slug || !SLUG_REGEX.test(slug)) {
    return {
      ok: false,
      error: "Slug חייב להיות 2-40 תווים, אותיות קטנות באנגלית/מספרים/מקפים בלבד",
    } as const;
  }
  if (!name) return { ok: false, error: "שם העסק חובה" } as const;
  if (!ownerEmail) return { ok: false, error: "אימייל בעלים חובה" } as const;
  if (ownerPassword.length < 6)
    return { ok: false, error: "סיסמה — 6+ תווים" } as const;

  // בדוק כפילות slug
  const existingSlug = await prisma.tenant.findUnique({ where: { slug } });
  if (existingSlug) return { ok: false, error: "Slug כבר תפוס" } as const;

  // בדוק כפילות אימייל
  const existingUser = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });
  if (existingUser)
    return { ok: false, error: "אימייל בעלים כבר רשום במערכת" } as const;

  const passwordHash = await bcrypt.hash(ownerPassword, 10);

  const initialContent =
    template === "charity"
      ? stringifyCharityContent(DEFAULT_CHARITY_CONTENT)
      : stringifySiteContent(DEFAULT_SITE_CONTENT);

  const tenant = await prisma.tenant.create({
    data: {
      slug,
      name,
      template,
      content: initialContent,
      published: true,
      users: {
        create: {
          email: ownerEmail,
          name: ownerName || null,
          passwordHash,
          role: "OWNER",
        },
      },
    },
  });

  revalidatePath("/admin/tenants");
  return { ok: true, tenantId: tenant.id, slug } as const;
}

/**
 * מחיקת לקוח — עם cascade דרך הסכמה (User, Lead) — רק SUPERADMIN.
 */
export async function deleteTenant(tenantId: string) {
  await requireSuperAdmin();
  await prisma.tenant.delete({ where: { id: tenantId } });
  revalidatePath("/admin/tenants");
  return { ok: true } as const;
}

/**
 * SUPERADMIN "נכנס" לדשבורד של tenant ספציפי כדי לנהל אותו.
 * מאחסנים ב-cookie. אחרי הקריאה, ה-helpers יחזירו את ה-tenant הזה.
 */
export async function enterTenant(tenantId: string) {
  await requireSuperAdmin();
  // ודא שה-tenant קיים
  const exists = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });
  if (!exists) {
    return { ok: false, error: "הלקוח לא נמצא" } as const;
  }
  await setActiveTenantId(tenantId);
  redirect("/admin");
}

/**
 * יציאה ממצב "ניהול לקוח" — SUPERADMIN חוזר לרשימת לקוחות.
 */
export async function exitTenant() {
  await requireSuperAdmin();
  await clearActiveTenantId();
  redirect("/admin/tenants");
}
