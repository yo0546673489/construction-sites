import { cookies } from "next/headers";

/**
 * "Active tenant" עבור SUPERADMIN — שימור הלקוח הנוכחי שהוא מנהל.
 * מבוסס על cookie. בידוד אבטחה: ה-cookie חתום כ-httpOnly + sameSite=lax.
 */

const COOKIE_NAME = "st_active_tenant";
const ONE_WEEK = 60 * 60 * 24 * 7;

export async function getActiveTenantId(): Promise<string | null> {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value ?? null;
}

export async function setActiveTenantId(tenantId: string) {
  const c = await cookies();
  c.set(COOKIE_NAME, tenantId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_WEEK,
  });
}

export async function clearActiveTenantId() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
