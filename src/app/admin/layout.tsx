import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getActiveTenantId } from "@/lib/active-tenant";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }

  const user = {
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

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
    <div className="relative flex min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Soft background accents — subtle emerald glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-teal-400/8 blur-[100px]" />
      </div>

      <AdminSidebar
        user={user}
        tenant={tenant}
        isImpersonating={isImpersonating}
      />

      <div className="relative flex-1 overflow-x-auto">
        {isImpersonating && tenant && (
          <div className="sticky top-0 z-30 border-b border-emerald-200/60 bg-emerald-50/90 px-6 py-2.5 text-center text-xs font-medium text-emerald-800 backdrop-blur-md md:px-10">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              אתה עובד כעת כמנהל מערכת בתוך הלקוח{" "}
              <span className="font-bold">{tenant.name}</span>
            </span>
          </div>
        )}
        <div className="mx-auto max-w-7xl p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
