import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getActiveTenantId } from "@/lib/active-tenant";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: "SUPERADMIN" | "OWNER" | "EDITOR";
  tenantId: string | null;
};

/**
 * דורש שיהיה משתמש מחובר; אחרת מפנה ל-login.
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
    tenantId: session.user.tenantId,
  };
}

/**
 * דורש משתמש שהוא SUPERADMIN; אחרת מפנה ל-/admin.
 */
export async function requireSuperAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "SUPERADMIN") {
    redirect("/admin");
  }
  return user;
}

/**
 * Effective tenant id —
 *  - OWNER/EDITOR: ה-tenantId שלהם (מהסשן).
 *  - SUPERADMIN: ה-tenant שהוא "נכנס" אליו (מ-cookie).
 *  אם SUPERADMIN לא בחר tenant — מחזיר null.
 */
export async function getEffectiveTenantId(
  user: SessionUser
): Promise<string | null> {
  if (user.role === "SUPERADMIN") {
    return await getActiveTenantId();
  }
  return user.tenantId;
}

/**
 * דורש משתמש עם tenant פעיל — מחזיר את ה-tenant המלא.
 * SUPERADMIN ללא tenant פעיל → /admin/tenants
 * אחרים ללא tenant → /admin/login
 */
export async function requireTenantUser() {
  const user = await requireUser();
  const tenantId = await getEffectiveTenantId(user);

  if (!tenantId) {
    if (user.role === "SUPERADMIN") {
      redirect("/admin/tenants");
    }
    redirect("/admin/login");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    if (user.role === "SUPERADMIN") {
      redirect("/admin/tenants");
    }
    redirect("/admin/login");
  }

  return { user, tenant };
}

/**
 * משתמש OWNER/SUPERADMIN — לפעולות ניהול משתמשים בתוך tenant.
 */
export async function requireOwnerOrAdmin() {
  const user = await requireUser();
  if (user.role !== "OWNER" && user.role !== "SUPERADMIN") {
    redirect("/admin");
  }
  return user;
}
