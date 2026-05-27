"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  Building2Icon,
  ExternalLinkIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createTenant,
  deleteTenant,
  enterTenant,
} from "@/app/admin/tenants/actions";

type Tenant = {
  id: string;
  slug: string;
  name: string;
  template: string;
  published: boolean;
  createdAt: Date;
  _count: { users: number; leads: number };
};

const TEMPLATE_LABELS: Record<string, string> = {
  renovator: "🔨 שיפוצניק",
  charity: "❤️ עמותה",
};

export function TenantsManager({ tenants }: { tenants: Tenant[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createTenant(formData);
      if (result.ok) {
        toast.success(`לקוח חדש נוצר: ${result.slug}`);
        form.reset();
        setShowAdd(false);
      } else {
        toast.error(result.error ?? "שגיאה");
      }
    });
  }

  function handleDelete(t: Tenant) {
    const confirmText = `למחוק את "${t.name}"?\n\nזה ימחק:\n• את כל המשתמשים שלו (${t._count.users})\n• את כל הלידים (${t._count.leads})\n• את הדף הציבורי /${t.slug}\n\nהפעולה לא ניתנת לביטול.`;
    if (!confirm(confirmText)) return;

    startTransition(async () => {
      const result = await deleteTenant(t.id);
      if (result.ok) {
        toast.success("הלקוח נמחק");
      } else {
        toast.error("שגיאה");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {tenants.length} לקוחות פעילים בפלטפורמה
        </p>
        <Button
          onClick={() => setShowAdd((v) => !v)}
          className="rounded-xl bg-emerald-500 font-bold text-black hover:bg-white"
        >
          <PlusIcon className="size-4" />
          {showAdd ? "סגור" : "לקוח חדש"}
        </Button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6"
        >
          <h3 className="text-lg font-bold">פרטי הלקוח</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-sm text-slate-700">שם העסק *</Label>
              <Input
                name="name"
                required
                placeholder="שיפוצי כהן"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm text-slate-700">
                Slug (חלק מה-URL) *
              </Label>
              <Input
                name="slug"
                required
                pattern="[a-z0-9-]{2,40}"
                placeholder="cohen-shipuzim"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
                dir="ltr"
              />
              <p className="text-xs text-slate-400">
                /sites/[slug] — אותיות קטנות באנגלית, מספרים, מקפים
              </p>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-sm text-slate-700">תבנית עיצוב *</Label>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 has-[input:checked]:border-emerald-500 has-[input:checked]:bg-emerald-50">
                  <input
                    type="radio"
                    name="template"
                    value="renovator"
                    defaultChecked
                    className="size-4 accent-[#C9A24A]"
                  />
                  <div>
                    <div className="text-sm font-bold">🔨 שיפוצניק / שירות</div>
                    <div className="text-xs text-slate-600">
                      Hero + Pain + פתרון + לידים. שחור + זהב.
                    </div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 has-[input:checked]:border-emerald-500 has-[input:checked]:bg-emerald-50">
                  <input
                    type="radio"
                    name="template"
                    value="charity"
                    className="size-4 accent-[#C9A24A]"
                  />
                  <div>
                    <div className="text-sm font-bold">❤️ עמותה / תרומה</div>
                    <div className="text-xs text-slate-600">
                      Donate cards + Story + Impact. כחול + אדום + צהוב.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <h3 className="mt-2 text-lg font-bold">בעל העסק (משתמש OWNER)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-sm text-slate-700">שם</Label>
              <Input
                name="ownerName"
                placeholder="אופציונלי"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm text-slate-700">אימייל *</Label>
              <Input
                name="ownerEmail"
                type="email"
                required
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <div className="md:col-span-2">
              <div className="grid gap-2">
                <Label className="text-sm text-slate-700">סיסמה התחלתית *</Label>
                <Input
                  name="ownerPassword"
                  type="password"
                  required
                  minLength={6}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-white font-bold text-black hover:bg-emerald-500"
          >
            {isPending ? "יוצר..." : "צור לקוח חדש"}
          </Button>
        </form>
      )}

      {tenants.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
          <Building2Icon className="size-10 text-slate-300" />
          <p className="text-sm text-slate-600">
            אין עדיין לקוחות. צור את הראשון.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tenants.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{t.name}</h3>
                    {t.published ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        פעיל
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        מוסתר
                      </span>
                    )}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {TEMPLATE_LABELS[t.template] ?? t.template}
                    </span>
                  </div>
                  <a
                    href={`/sites/${t.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-slate-600 hover:text-emerald-600"
                  >
                    /sites/{t.slug}
                    <ExternalLinkIcon className="size-3" />
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(t)}
                  disabled={isPending}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-700"
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label="משתמשים" value={t._count.users} />
                <Stat label="לידים" value={t._count.leads} />
              </div>

              <form
                action={async () => {
                  await enterTenant(t.id);
                }}
                className="mt-5"
              >
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 font-bold text-black hover:bg-white"
                >
                  היכנס לדשבורד
                  <ArrowLeftIcon className="size-4" />
                </Button>
              </form>

              <div className="mt-4 flex justify-between text-xs text-slate-400">
                <span>
                  נוצר {new Date(t.createdAt).toLocaleDateString("he-IL")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-black/30 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-0.5 text-xl font-bold">{value}</div>
    </div>
  );
}
