import { requireSuperAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { TenantsManager } from "@/components/admin/tenants-manager";

export const metadata = { title: "לקוחות — דשבורד" };

export default async function TenantsPage() {
  await requireSuperAdmin();

  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      template: true,
      published: true,
      createdAt: true,
      _count: {
        select: { users: true, leads: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
          ניהול פלטפורמה
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
          כל הלקוחות
        </h1>
        <p className="mt-2 text-sm text-white/55">
          לכל לקוח: דשבורד משלו, משתמשים משלו, לידים משלו, ודף נחיתה ב-/sites/[slug].
        </p>
      </div>

      <TenantsManager tenants={tenants} />
    </div>
  );
}
