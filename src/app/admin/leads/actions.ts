"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth-helpers";

const VALID_STATUSES = ["NEW", "CONTACTED", "WON", "LOST"] as const;
type Status = (typeof VALID_STATUSES)[number];

/**
 * עדכון סטטוס ליד — בידוד מובנה: רק לידים של ה-tenant של המשתמש.
 */
export async function updateLeadStatus(leadId: string, status: string) {
  const { tenant } = await requireTenantUser();

  if (!VALID_STATUSES.includes(status as Status)) {
    return { ok: false, error: "סטטוס לא תקין" } as const;
  }

  // ה-where כולל גם tenantId כדי למנוע גישה ל-leads של tenant אחר
  const result = await prisma.lead.updateMany({
    where: { id: leadId, tenantId: tenant.id },
    data: { status },
  });

  if (result.count === 0) {
    return { ok: false, error: "הליד לא נמצא" } as const;
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true } as const;
}

/**
 * מחיקת ליד.
 */
export async function deleteLead(leadId: string) {
  const { tenant } = await requireTenantUser();

  const result = await prisma.lead.deleteMany({
    where: { id: leadId, tenantId: tenant.id },
  });

  if (result.count === 0) {
    return { ok: false, error: "הליד לא נמצא" } as const;
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true } as const;
}

/**
 * סימון/ביטול-סימון של ליד כ"טופל".
 * תיבת בחירה עצמאית — ניתן להפעיל ללא קשר לסטטוס המפורט.
 */
export async function toggleLeadHandled(leadId: string, handled: boolean) {
  const { tenant } = await requireTenantUser();

  const result = await prisma.lead.updateMany({
    where: { id: leadId, tenantId: tenant.id },
    data: { handled },
  });

  if (result.count === 0) {
    return { ok: false, error: "הליד לא נמצא" } as const;
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true } as const;
}
