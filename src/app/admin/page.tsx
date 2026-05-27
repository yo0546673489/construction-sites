import Link from "next/link";
import {
  InboxIcon,
  TrendingUpIcon,
  CalendarIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import { requireTenantUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export const metadata = { title: "סקירה — דשבורד" };

export default async function DashboardPage() {
  const { user, tenant } = await requireTenantUser();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalLeads, leadsThisMonth, newLeads, recentLeads] = await Promise.all(
    [
      prisma.lead.count({ where: { tenantId: tenant.id } }),
      prisma.lead.count({
        where: { tenantId: tenant.id, createdAt: { gte: startOfMonth } },
      }),
      prisma.lead.count({
        where: { tenantId: tenant.id, status: "NEW" },
      }),
      prisma.lead.findMany({
        where: { tenantId: tenant.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]
  );

  const stats = [
    {
      icon: InboxIcon,
      label: "סה״כ לידים",
      value: totalLeads,
      hint: "מאז ההתחלה",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      icon: CalendarIcon,
      label: "החודש",
      value: leadsThisMonth,
      hint: now.toLocaleDateString("he-IL", { month: "long" }),
      gradient: "from-sky-400 to-blue-500",
    },
    {
      icon: TrendingUpIcon,
      label: "חדשים — לטיפול",
      value: newLeads,
      hint: "טרם נוצר קשר",
      gradient: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ברוך הבא
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            {user.name || user.email.split("@")[0]}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            הנה מה שקורה ב-{tenant.name} ברגע זה.
          </p>
        </div>
        <Link
          href={`/sites/${tenant.slug}`}
          target="_blank"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md hover:shadow-emerald-500/10"
        >
          <ExternalLinkIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
          הדף הציבורי שלך
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-300/20"
          >
            {/* Subtle gradient blob in corner */}
            <div
              className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div
                  className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg shadow-slate-900/5`}
                >
                  <s.icon className="size-5 text-white" />
                </div>
                <ArrowUpRightIcon className="size-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500" />
              </div>
              <div className="mt-6 text-sm font-medium text-slate-500">
                {s.label}
              </div>
              <div className="mt-1.5 text-4xl font-black tracking-tight text-slate-900">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400">
                {s.hint}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              לידים אחרונים
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              5 פניות אחרונות מהאתר
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            כל הלידים
            <ArrowUpRightIcon className="size-3" />
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100">
              <InboxIcon className="size-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              עדיין אין לידים
            </p>
            <p className="text-xs text-slate-400">התחל בקידום של הדף.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentLeads.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-3 p-5 transition-colors hover:bg-slate-50/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-bold text-emerald-700">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {lead.name}
                    </div>
                    <div className="mt-0.5 text-sm text-slate-500">
                      {lead.phone} · {lead.area || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      lead.status === "NEW"
                        ? "bg-emerald-100 text-emerald-700"
                        : lead.status === "WON"
                        ? "bg-teal-100 text-teal-700"
                        : lead.status === "LOST"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString("he-IL")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick action */}
      <Link
        href="/admin/content"
        className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-l from-emerald-50 via-white to-white p-6 shadow-sm transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
      >
        {/* Decorative gradient blob */}
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-300 to-teal-300 opacity-15 blur-3xl" />

        <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
          <FileTextIcon className="size-5 text-white" />
        </div>
        <div className="relative flex-1">
          <div className="text-base font-bold text-slate-900">
            עריכת תוכן הדף
          </div>
          <div className="mt-0.5 text-sm text-slate-600">
            עדכן כותרות, תמונות, מספרים — הכל ממקום אחד.
          </div>
        </div>
        <div className="relative flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:-translate-x-1">
          <ArrowUpRightIcon className="size-4 text-emerald-600" />
        </div>
      </Link>
    </div>
  );
}
