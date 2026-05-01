"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  InboxIcon,
  UsersIcon,
  Building2Icon,
  ExternalLinkIcon,
  LogOutIcon,
  ArrowLeftCircleIcon,
  SettingsIcon,
  BarChart3Icon,
} from "lucide-react";
import { exitTenant } from "@/app/admin/tenants/actions";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboardIcon;
};

type Props = {
  user: {
    email: string;
    name: string | null;
    role: "SUPERADMIN" | "OWNER" | "EDITOR";
  };
  /** ה-tenant שהמשתמש "בתוכו" עכשיו (משלו, או דרך כניסת SUPERADMIN). */
  tenant: {
    name: string;
    slug: string;
  } | null;
  /** האם זה SUPERADMIN שעבד בתוך tenant מסוים? */
  isImpersonating: boolean;
};

export function AdminSidebar({ user, tenant, isImpersonating }: Props) {
  const pathname = usePathname();

  // אם יש tenant פעיל — מציגים את הניווט שלו.
  // אחרת (SUPERADMIN ללא tenant) — מציגים רק את ניהול הפלטפורמה.
  const tenantNav: NavItem[] = tenant
    ? [
        { href: "/admin", label: "סקירה", icon: LayoutDashboardIcon },
        { href: "/admin/content", label: "עריכת תוכן", icon: FileTextIcon },
        { href: "/admin/leads", label: "לידים", icon: InboxIcon },
        { href: "/admin/analytics", label: "אנליטיקות", icon: BarChart3Icon },
      ]
    : [];

  if (
    tenant &&
    (user.role === "OWNER" || user.role === "SUPERADMIN")
  ) {
    tenantNav.push({
      href: "/admin/users",
      label: "משתמשים",
      icon: UsersIcon,
    });
    tenantNav.push({
      href: "/admin/settings",
      label: "הגדרות",
      icon: SettingsIcon,
    });
  }

  const adminNav: NavItem[] =
    user.role === "SUPERADMIN"
      ? [
          {
            href: "/admin/tenants",
            label: "כל הלקוחות",
            icon: Building2Icon,
          },
        ]
      : [];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-white/10 bg-zinc-950 text-white">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-white/10 p-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
          {user.role === "SUPERADMIN" && !tenant ? "מנהל מערכת" : "דשבורד"}
        </div>
        {tenant ? (
          <>
            <div className="truncate text-lg font-bold">{tenant.name}</div>
            <Link
              href={`/sites/${tenant.slug}`}
              target="_blank"
              className="mt-1 inline-flex items-center gap-1 text-xs text-white/50 hover:text-[#C9A24A]"
            >
              צפה בדף הציבורי <ExternalLinkIcon className="size-3" />
            </Link>
          </>
        ) : (
          <div className="truncate text-lg font-bold text-white/70">
            ניהול הפלטפורמה
          </div>
        )}
      </div>

      {/* Impersonation banner */}
      {isImpersonating && (
        <form action={exitTenant} className="border-b border-white/10 p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-3 py-2.5 text-sm font-semibold text-[#C9A24A] hover:bg-[#C9A24A]/15"
          >
            <ArrowLeftCircleIcon className="size-4" />
            יציאה מהלקוח
          </button>
        </form>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {tenantNav.length > 0 && (
          <ul className="space-y-1">
            {tenantNav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#C9A24A]/15 text-[#C9A24A]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {adminNav.length > 0 && (
          <>
            {tenantNav.length > 0 && (
              <div className="mt-6 mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                ניהול פלטפורמה
              </div>
            )}
            <ul className="space-y-1">
              {adminNav.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#C9A24A]/15 text-[#C9A24A]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      {/* Footer — user info + logout */}
      <div className="border-t border-white/10 p-3">
        <div className="mb-2 px-3 py-2">
          <div className="truncate text-sm font-medium text-white">
            {user.name || user.email}
          </div>
          <div className="truncate text-xs text-white/50">{user.email}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#C9A24A]">
            {user.role}
          </div>
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOutIcon className="size-4" />
            התנתק
          </button>
        </form>
      </div>
    </aside>
  );
}
