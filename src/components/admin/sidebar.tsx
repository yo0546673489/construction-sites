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
  TargetIcon,
  HeartHandshakeIcon,
  TrendingUpIcon,
  SparklesIcon,
  WandSparklesIcon,
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
  tenant: {
    name: string;
    slug: string;
  } | null;
  isImpersonating: boolean;
};

export function AdminSidebar({ user, tenant, isImpersonating }: Props) {
  const pathname = usePathname();

  const tenantNav: NavItem[] = tenant
    ? [
        { href: "/admin", label: "סקירה", icon: LayoutDashboardIcon },
        { href: "/admin/content", label: "עריכת תוכן", icon: FileTextIcon },
        { href: "/admin/leads", label: "לידים", icon: InboxIcon },
        { href: "/admin/analytics", label: "אנליטיקות", icon: BarChart3Icon },
        { href: "/admin/campaigns", label: "קמפיינים", icon: TargetIcon },
        { href: "/admin/donations", label: "תרומות", icon: HeartHandshakeIcon },
        { href: "/admin/reports", label: "תזרים", icon: TrendingUpIcon },
        { href: "/admin/ads-generator", label: "מחולל מודעות", icon: WandSparklesIcon },
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

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <aside className="relative z-10 flex w-72 shrink-0 flex-col border-l border-slate-200/70 bg-white/80 backdrop-blur-xl">
      {/* Header — brand + tenant */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <SparklesIcon className="size-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              {user.role === "SUPERADMIN" && !tenant ? "מנהל מערכת" : "Pro Digital"}
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              דשבורד ניהול
            </div>
          </div>
        </div>

        {tenant ? (
          <div className="mt-5">
            <div className="truncate text-lg font-bold tracking-tight text-slate-900">
              {tenant.name}
            </div>
            <Link
              href={`/sites/${tenant.slug}`}
              target="_blank"
              className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ExternalLinkIcon className="size-3" />
              דף ציבורי
            </Link>
          </div>
        ) : (
          <div className="mt-5 truncate text-lg font-bold tracking-tight text-slate-900">
            ניהול הפלטפורמה
          </div>
        )}
      </div>

      {/* Impersonation banner */}
      {isImpersonating && (
        <form action={exitTenant} className="border-b border-slate-100 px-4 py-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 hover:shadow"
          >
            <ArrowLeftCircleIcon className="size-4" />
            יציאה מהלקוח
          </button>
        </form>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {tenantNav.length > 0 && (
          <ul className="space-y-0.5">
            {tenantNav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-gradient-to-l from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-xl transition-colors ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-emerald-600"
                      }`}
                    >
                      <item.icon className="size-3.5" />
                    </span>
                    {item.label}
                    {active && (
                      <span className="absolute left-2 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {adminNav.length > 0 && (
          <>
            {tenantNav.length > 0 && (
              <div className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                ניהול פלטפורמה
              </div>
            )}
            <ul className="space-y-0.5">
              {adminNav.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-gradient-to-l from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`flex size-7 items-center justify-center rounded-xl transition-colors ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-emerald-600"
                        }`}
                      >
                        <item.icon className="size-3.5" />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      {/* Footer — user card + logout */}
      <div className="border-t border-slate-100 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-sm">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">
              {user.name || user.email.split("@")[0]}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                {user.role}
              </span>
            </div>
          </div>
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <span className="flex size-7 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-rose-100">
              <LogOutIcon className="size-3.5" />
            </span>
            התנתק
          </button>
        </form>
      </div>
    </aside>
  );
}
