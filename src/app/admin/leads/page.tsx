import { requireTenantUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { LeadsTable } from "@/components/admin/leads-table";
import { InboxIcon } from "lucide-react";

export const metadata = { title: "לידים — דשבורד" };

export default async function LeadsPage() {
  const { tenant } = await requireTenantUser();

  const leads = await prisma.lead.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          <InboxIcon className="size-3" />
          ניהול
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          לידים
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {leads.length === 0
            ? "אין עדיין לידים. הם יופיעו כאן ברגע שמישהו ימלא את הטופס."
            : `סה״כ ${leads.length} לידים. לחץ על סטטוס כדי לעדכן.`}
        </p>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
