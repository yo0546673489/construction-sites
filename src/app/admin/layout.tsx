import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getActiveTenantId } from "@/lib/active-tenant";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ה-proxy כבר מבטיח שיש session, אבל בודקים ליתר ביטחון.
  const session = await auth();

  // ב-/admin/login (וכאשר אין session) — רנדר את הילדים בלי sidebar.
  if (!session?.user) {
    return <>{children}</>;
  }

  const user = {
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

  // קביעת ה-tenant הפעיל:
  //  - OWNER/EDITOR — ה-tenantId שלהם מהסשן
  //  - SUPERADMIN — מ-cookie של "active tenant"
  const activeTenantId =
    user.role === "SUPERADMIN"
      ? await getActiveTenantId()
      : session.user.tenantId;

  const tenant = activeTenantId
    ? await prisma.tenant.findUnique({
        where: { id: activeTenantId },
        select: { name: true, slug: true },
      })
    : null;

  const isImpersonating = user.role === "SUPERADMIN" && tenant !== null;

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <AdminSidebar
        user={user}
        tenant={tenant}
        isImpersonating={isImpersonating}
      />
      <div className="flex-1 overflow-x-auto">
        {/* באנר עליון כש-SUPERADMIN מנהל לקוח */}
        {isImpersonating && tenant && (
          <div className="border-b border-[#C9A24A]/20 bg-[#C9A24A]/5 px-6 py-2.5 text-center text-xs text-[#C9A24A]/90 md:px-10">
            אתה עובד כעת כמנהל מערכת בתוך הלקוח{" "}
            <span className="font-semibold">{tenant.name}</span>
          </div>
        )}
        <div className="mx-auto max-w-6xl p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
