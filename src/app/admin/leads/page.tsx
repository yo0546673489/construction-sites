import { requireTenantUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { LeadsTable } from "@/components/admin/leads-table";

export const metadata = { title: "לידים — דשבורד" };

export default async function LeadsPage() {
  const { tenant } = await requireTenantUser();

  // בידוד מובנה — שולפים רק לידים של ה-tenant הפעיל
  const leads = await prisma.lead.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
          ניהול
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
          לידים
        </h1>
        <p className="mt-2 text-sm text-white/55">
          {leads.length === 0
            ? "אין עדיין לידים. הם יופיעו כאן ברגע שמישהו ימלא את הטופס."
            : `סה״כ ${leads.length} לידים. לחץ על סטטוס כדי לעדכן.`}
        </p>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
