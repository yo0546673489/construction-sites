"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { TrashIcon, PhoneIcon, MessageCircleIcon } from "lucide-react";
import { deleteLead, updateLeadStatus } from "@/app/admin/leads/actions";

type Lead = {
  id: string;
  name: string;
  phone: string;
  area: string | null;
  notes: string | null;
  status: string;
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

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-5 py-4 font-semibold">שם</th>
              <th className="px-5 py-4 font-semibold">טלפון</th>
              <th className="px-5 py-4 font-semibold">אזור</th>
              <th className="px-5 py-4 font-semibold">תאריך</th>
              <th className="px-5 py-4 font-semibold">סטטוס</th>
              <th className="px-5 py-4 font-semibold">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map((lead) => {
              const waText = encodeURIComponent(
                `שלום ${lead.name}, ראיתי את הפנייה שלך באתר. רציתי לעדכן אותך לגבי השיפוץ.`
              );
              const waNumber = lead.phone.replace(/\D/g, "");
              return (
                <tr key={lead.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-4 font-medium">{lead.name}</td>
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
                      onChange={(e) => changeStatus(lead.id, e.target.value)}
                      disabled={isPending}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold focus:outline-none ${
                        STATUSES.find((s) => s.value === lead.status)?.color ??
                        "bg-white/10 text-white/70"
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
