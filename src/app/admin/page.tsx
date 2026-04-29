import Link from "next/link";
import {
  InboxIcon,
  TrendingUpIcon,
  CalendarIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "lucide-react";
import { requireTenantUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export const metadata = { title: "סקירה — דשבורד" };

export default async function DashboardPage() {
  // requireTenantUser מטפל בכל ה-redirects: SUPERADMIN ללא active tenant → /admin/tenants
  const { user, tenant } = await requireTenantUser();

  // נתוני dashboard — בידוד מובנה לפי tenantId
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
    },
    {
      icon: CalendarIcon,
      label: "החודש",
      value: leadsThisMonth,
      hint: now.toLocaleDateString("he-IL", { month: "long" }),
    },
    {
      icon: TrendingUpIcon,
      label: "חדשים — לטיפול",
      value: newLeads,
      hint: "טרם נוצר קשר",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
            ברוך הבא
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
            {user.name || user.email}
          </h1>
        </div>
        <Link
          href={`/sites/${tenant.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:border-[#C9A24A]/40 hover:text-[#C9A24A]"
        >
          <ExternalLinkIcon className="size-4" />
          הדף הציבורי שלך
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#C9A24A]/15 text-[#C9A24A]">
                <s.icon className="size-5" />
              </div>
              <div className="text-sm font-medium text-white/55">
                {s.label}
              </div>
            </div>
            <div className="mt-5 text-4xl font-black tracking-tight">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-white/45">{s.hint}</div>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-lg font-bold">לידים אחרונים</h2>
          <Link
            href="/admin/leads"
            className="text-sm font-medium text-[#C9A24A] hover:underline"
          >
            כל הלידים ←
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center text-white/55">
            <InboxIcon className="size-10 text-white/30" />
            <p className="text-sm">עדיין אין לידים. התחל בקידום של הדף.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {recentLeads.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-3 p-5"
              >
                <div>
                  <div className="font-semibold">{lead.name}</div>
                  <div className="mt-0.5 text-sm text-white/55">
                    {lead.phone} · {lead.area || "—"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      lead.status === "NEW"
                        ? "bg-[#C9A24A]/15 text-[#C9A24A]"
                        : lead.status === "WON"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : lead.status === "LOST"
                        ? "bg-red-500/15 text-red-300"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <span className="text-xs text-white/40">
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
        className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-l from-[#C9A24A]/15 to-white/[0.02] p-5 transition-all hover:border-[#C9A24A]/40"
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#C9A24A] text-black">
          <FileTextIcon className="size-5" />
        </div>
        <div className="flex-1">
          <div className="font-bold">עריכת תוכן הדף</div>
          <div className="text-sm text-white/55">
            עדכן כותרות, תמונות, מספרים — הכל ממקום אחד.
          </div>
        </div>
        <ExternalLinkIcon className="size-5 text-white/40 transition-transform group-hover:-translate-x-1" />
      </Link>
    </div>
  );
}
