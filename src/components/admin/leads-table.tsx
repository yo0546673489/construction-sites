"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  TrashIcon,
  PhoneIcon,
  MessageCircleIcon,
  ChevronDownIcon,
  CheckIcon,
} from "lucide-react";
import {
  deleteLead,
  toggleLeadHandled,
  updateLeadStatus,
} from "@/app/admin/leads/actions";

type Lead = {
  id: string;
  name: string;
  phone: string;
  area: string | null;
  notes: string | null;
  status: string;
  handled: boolean;
  createdAt: Date;
};

const STATUSES = [
  { value: "NEW", label: "חדש", color: "bg-[#C9A24A]/15 text-[#C9A24A]" },
  {
    value: "CONTACTED",
    label: "יצרתי קשר",
    color: "bg-blue-500/15 text-blue-300",
  },
  { value: "WON", label: "סגרתי", color: "bg-emerald-500/15 text-emerald-300" },
  { value: "LOST", label: "פספסתי", color: "bg-red-500/15 text-red-300" },
];

export function LeadsTable({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function changeStatus(leadId: string, status: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, status);
      if (!result.ok) {
        toast.error(result.error ?? "שגיאה");
      }
    });
  }

  function toggleHandled(leadId: string, handled: boolean) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, handled } : l))
    );
    startTransition(async () => {
      const result = await toggleLeadHandled(leadId, handled);
      if (!result.ok) {
        toast.error(result.error ?? "שגיאה");
      } else {
        toast.success(handled ? "סומן כטופל" : "סומן כלא-טופל");
      }
    });
  }

  function handleDelete(leadId: string) {
    if (!confirm("למחוק את הליד הזה? הפעולה לא ניתנת לביטול.")) return;
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    startTransition(async () => {
      const result = await deleteLead(leadId);
      if (!result.ok) {
        toast.error(result.error ?? "שגיאה");
      } else {
        toast.success("הליד נמחק");
      }
    });
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-16 text-center text-white/55">
        <div className="text-sm">עדיין אין לידים.</div>
        <div className="text-xs">לידים שיגיעו דרך הטופס יופיעו כאן בזמן אמת.</div>
      </div>
    );
  }

  /* Stats */
  const handledCount = leads.filter((l) => l.handled).length;
  const pendingCount = leads.length - handledCount;

  return (
    <div className="space-y-4">
      {/* סיכום מהיר — כמה טופלו / לא טופלו */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="סה״כ לידים" value={leads.length} tone="neutral" />
        <StatCard
          label="ממתינים לטיפול"
          value={pendingCount}
          tone="warning"
        />
        <StatCard label="טופלו" value={handledCount} tone="success" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-4 font-semibold">טופל</th>
                <th className="px-5 py-4 font-semibold">שם</th>
                <th className="px-5 py-4 font-semibold">טלפון</th>
                <th className="px-5 py-4 font-semibold">אזור</th>
                <th className="px-5 py-4 font-semibold">תאריך</th>
                <th className="px-5 py-4 font-semibold">סטטוס</th>
                <th className="px-5 py-4 font-semibold">פעולות</th>
                <th className="px-5 py-4" aria-label="פירוט"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead) => {
                const waText = encodeURIComponent(
                  `שלום ${lead.name}, ראיתי את הפנייה שלך באתר. רציתי לעדכן אותך לגבי השיפוץ.`
                );
                const waNumber = lead.phone.replace(/\D/g, "");
                const isExpanded = expandedId === lead.id;
                return (
                  <FragmentRow key={lead.id}>
                    <tr
                      className={`transition-colors hover:bg-white/[0.02] ${
                        lead.handled ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={lead.handled}
                          onClick={() =>
                            toggleHandled(lead.id, !lead.handled)
                          }
                          disabled={isPending}
                          title={lead.handled ? "סמן כלא טופל" : "סמן כטופל"}
                          className={`flex size-7 items-center justify-center rounded-md border-2 transition-all ${
                            lead.handled
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-white/25 hover:border-emerald-400"
                          }`}
                        >
                          {lead.handled && <CheckIcon className="size-4" />}
                        </button>
                      </td>
                      <td className={`px-5 py-4 font-medium ${lead.handled ? "line-through" : ""}`}>
                        {lead.name}
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-white/80 hover:text-[#C9A24A]"
                          dir="ltr"
                        >
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-white/70">
                        {lead.area || "—"}
                      </td>
                      <td className="px-5 py-4 text-white/55">
                        {new Date(lead.createdAt).toLocaleDateString("he-IL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            changeStatus(lead.id, e.target.value)
                          }
                          disabled={isPending}
                          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold focus:outline-none ${
                            STATUSES.find((s) => s.value === lead.status)
                              ?.color ?? "bg-white/10 text-white/70"
                          }`}
                        >
                          {STATUSES.map((s) => (
                            <option
                              key={s.value}
                              value={s.value}
                              className="bg-zinc-900 text-white"
                            >
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex size-8 items-center justify-center rounded-lg text-white/55 hover:bg-white/10 hover:text-white"
                            title="התקשר"
                          >
                            <PhoneIcon className="size-4" />
                          </a>
                          <a
                            href={`https://wa.me/${waNumber}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex size-8 items-center justify-center rounded-lg text-white/55 hover:bg-emerald-500/10 hover:text-emerald-300"
                            title="שלח וואטסאפ"
                          >
                            <MessageCircleIcon className="size-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="flex size-8 items-center justify-center rounded-lg text-white/40 hover:bg-red-500/10 hover:text-red-300"
                            title="מחק"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : lead.id)
                          }
                          className={`flex size-8 items-center justify-center rounded-lg text-white/55 hover:bg-white/10 hover:text-white ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          title="פירוט מלא"
                          aria-label="פירוט מלא"
                        >
                          <ChevronDownIcon className="size-4 transition-transform" />
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-white/[0.015]">
                        <td colSpan={8} className="px-5 py-5">
                          <div className="grid gap-3 md:grid-cols-2">
                            <DetailField label="שם מלא" value={lead.name} />
                            <DetailField
                              label="טלפון"
                              value={lead.phone}
                              ltr
                              href={`tel:${lead.phone}`}
                            />
                            <DetailField
                              label="אזור"
                              value={lead.area || "—"}
                            />
                            <DetailField
                              label="תאריך הגשה"
                              value={new Date(lead.createdAt).toLocaleString(
                                "he-IL",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            />
                            <DetailField
                              label="סטטוס"
                              value={
                                STATUSES.find((s) => s.value === lead.status)
                                  ?.label ?? lead.status
                              }
                            />
                            <DetailField
                              label="טופל"
                              value={lead.handled ? "כן" : "לא"}
                              tone={lead.handled ? "success" : "warning"}
                            />
                            <div className="md:col-span-2">
                              <DetailField
                                label="הערות"
                                value={lead.notes || "אין הערות"}
                                multiline
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "success" | "warning";
}) {
  const toneCls =
    tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300"
      : tone === "warning"
        ? "border-amber-500/30 bg-amber-500/[0.06] text-amber-300"
        : "border-white/10 bg-white/[0.04] text-white/85";
  return (
    <div className={`rounded-xl border px-4 py-3 ${toneCls}`}>
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function DetailField({
  label,
  value,
  ltr,
  href,
  multiline,
  tone,
}: {
  label: string;
  value: string;
  ltr?: boolean;
  href?: string;
  multiline?: boolean;
  tone?: "success" | "warning";
}) {
  const valueCls =
    tone === "success"
      ? "text-emerald-300 font-bold"
      : tone === "warning"
        ? "text-amber-300 font-bold"
        : "text-white/85";
  const content = href ? (
    <a
      href={href}
      className="text-[#C9A24A] hover:underline"
      dir={ltr ? "ltr" : undefined}
    >
      {value}
    </a>
  ) : (
    <span dir={ltr ? "ltr" : undefined}>{value}</span>
  );
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-white/45">
        {label}
      </div>
      <div className={`text-sm ${valueCls} ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {content}
      </div>
    </div>
  );
}
