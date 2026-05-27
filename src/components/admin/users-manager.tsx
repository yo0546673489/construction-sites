"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
  ShieldIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser, deleteUser } from "@/app/admin/users/actions";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
};

export function UsersManager({
  users,
  currentUserId,
  canManage,
}: {
  users: User[];
  currentUserId: string;
  canManage: boolean;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createUser(formData);
      if (result.ok) {
        toast.success("המשתמש נוסף בהצלחה");
        (e.target as HTMLFormElement).reset();
        setShowAdd(false);
      } else {
        toast.error(result.error ?? "שגיאה");
      }
    });
  }

  function handleDelete(userId: string, email: string) {
    if (!confirm(`למחוק את המשתמש ${email}?`)) return;
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.ok) {
        toast.success("המשתמש נמחק");
      } else {
        toast.error(result.error ?? "שגיאה");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {users.length} משתמשים במערכת
        </p>
        {canManage && (
          <Button
            onClick={() => setShowAdd((v) => !v)}
            className="rounded-xl bg-emerald-500 font-bold text-black hover:bg-white"
          >
            <PlusIcon className="size-4" />
            {showAdd ? "סגור" : "הוסף משתמש"}
          </Button>
        )}
      </div>

      {showAdd && canManage && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 md:grid-cols-2"
        >
          <div className="grid gap-2">
            <Label className="text-sm text-slate-700">שם</Label>
            <Input
              name="name"
              placeholder="אופציונלי"
              className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-sm text-slate-700">אימייל *</Label>
            <Input
              name="email"
              type="email"
              required
              className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-sm text-slate-700">סיסמה * (6+ תווים)</Label>
            <Input
              name="password"
              type="password"
              required
              minLength={6}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-sm text-slate-700">תפקיד</Label>
            <select
              name="role"
              defaultValue="EDITOR"
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
            >
              <option value="EDITOR" className="bg-white">
                EDITOR — עורך תוכן + רואה לידים
              </option>
              <option value="OWNER" className="bg-white">
                OWNER — שליטה מלאה כולל משתמשים
              </option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-white font-bold text-black hover:bg-emerald-500"
            >
              {isPending ? "מוסיף..." : "צור משתמש"}
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {users.map((u) => {
            const isMe = u.id === currentUserId;
            return (
              <li
                key={u.id}
                className="flex items-center gap-4 p-5"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  {u.role === "SUPERADMIN" ? (
                    <ShieldIcon className="size-5" />
                  ) : (
                    <UserCircleIcon className="size-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">
                      {u.name || u.email}
                    </span>
                    {isMe && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        אתה
                      </span>
                    )}
                  </div>
                  {u.name && (
                    <div className="truncate text-xs text-slate-500">
                      {u.email}
                    </div>
                  )}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    u.role === "SUPERADMIN"
                      ? "bg-red-500/15 text-red-700"
                      : u.role === "OWNER"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {u.role}
                </span>
                {canManage && !isMe && u.role !== "SUPERADMIN" && (
                  <button
                    onClick={() => handleDelete(u.id, u.email)}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-700"
                    aria-label="מחק"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
