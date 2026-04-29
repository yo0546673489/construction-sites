"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";

/**
 * הוספת משתמש ל-tenant.
 * - OWNER יכול להוסיף רק ל-tenant שלו.
 * - SUPERADMIN יכול להוסיף לכל tenant (כרגע פשוט: ל-tenant שלו אם יש).
 * - לא ניתן ליצור SUPERADMIN דרך ה-UI (הגנה).
 */
export async function createUser(formData: FormData) {
  const me = await requireUser();
  if (me.role !== "OWNER" && me.role !== "SUPERADMIN") {
    return { ok: false, error: "אין לך הרשאה" } as const;
  }
  if (!me.tenantId) {
    return { ok: false, error: "לא מוגדר tenant" } as const;
  }

  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const roleInput = String(formData.get("role") ?? "EDITOR");

  if (!email || !password) {
    return { ok: false, error: "אימייל וסיסמה חובה" } as const;
  }
  if (password.length < 6) {
    return { ok: false, error: "הסיסמה חייבת להיות באורך 6+ תווים" } as const;
  }

  // נמנע מיצירת SUPERADMIN דרך ה-UI
  const role = roleInput === "OWNER" ? "OWNER" : "EDITOR";

  // בדוק כפילות
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "אימייל כבר קיים במערכת" } as const;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
      role,
      tenantId: me.tenantId,
    },
  });

  revalidatePath("/admin/users");
  return { ok: true } as const;
}

/**
 * מחיקת משתמש — רק במסגרת ה-tenant של המשתמש הנוכחי.
 * אסור למחוק את עצמך.
 */
export async function deleteUser(userId: string) {
  const me = await requireUser();
  if (me.role !== "OWNER" && me.role !== "SUPERADMIN") {
    return { ok: false, error: "אין לך הרשאה" } as const;
  }
  if (userId === me.id) {
    return { ok: false, error: "לא ניתן למחוק את עצמך" } as const;
  }
  if (!me.tenantId) {
    return { ok: false, error: "לא מוגדר tenant" } as const;
  }

  // בידוק: ה-target חייב להיות באותו tenant.
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { tenantId: true, role: true },
  });
  if (!target || target.tenantId !== me.tenantId) {
    return { ok: false, error: "המשתמש לא נמצא" } as const;
  }
  if (target.role === "SUPERADMIN") {
    return { ok: false, error: "לא ניתן למחוק SUPERADMIN" } as const;
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { ok: true } as const;
}
