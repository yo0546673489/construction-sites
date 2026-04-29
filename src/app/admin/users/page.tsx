import { requireTenantUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { UsersManager } from "@/components/admin/users-manager";

export const metadata = { title: "משתמשים — דשבורד" };

export default async function UsersPage() {
  const { user: me, tenant } = await requireTenantUser();

  // בידוד מובנה — רק משתמשים של ה-tenant הפעיל
  const users = await prisma.user.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  const canManage = me.role === "OWNER" || me.role === "SUPERADMIN";

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
          ניהול
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
          משתמשים
        </h1>
        <p className="mt-2 text-sm text-white/55">
          {canManage
            ? "ניהול הצוות — הוספה, מחיקה, סוג הרשאה."
            : "צפייה בלבד. רק OWNER יכול להוסיף או למחוק משתמשים."}
        </p>
      </div>

      <UsersManager
        users={users}
        currentUserId={me.id}
        canManage={canManage}
      />
    </div>
  );
}
