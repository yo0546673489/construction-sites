"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/app/sites/actions";

type Props = {
  tenantId: string;
  buttonText: string;
};

export function LeadForm({ tenantId, buttonText }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const area = String(formData.get("area") || "").trim();

    if (!name || !phone || !area) {
      toast.error("נא למלא את כל השדות");
      setPending(false);
      return;
    }

    const result = await submitLead({ tenantId, name, phone, area });
    if (result.ok) {
      toast.success("קיבלנו. ניצור איתך קשר בתוך 24 שעות.");
      e.currentTarget.reset();
    } else {
      toast.error(result.error ?? "שגיאה בשליחה");
    }
    setPending(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-3xl border border-white/10 bg-[#0B1D2A]/80 p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur md:p-9"
    >
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-sm font-medium text-white/80">
          שם מלא
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="שם פרטי ושם משפחה"
          autoComplete="name"
          required
          className="h-12 rounded-xl border-white/15 bg-white/5 text-base text-white placeholder:text-white/65 focus-visible:border-[#C8A45D] focus-visible:ring-[#C8A45D]/30"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone" className="text-sm font-medium text-white/80">
          טלפון
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="050-0000000"
          autoComplete="tel"
          required
          className="h-12 rounded-xl border-white/15 bg-white/5 text-base text-white placeholder:text-white/65 focus-visible:border-[#C8A45D] focus-visible:ring-[#C8A45D]/30"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="area" className="text-sm font-medium text-white/80">
          אזור פעילות
        </Label>
        <Input
          id="area"
          name="area"
          placeholder="למשל: מרכז, ירושלים, צפון"
          required
          className="h-12 rounded-xl border-white/15 bg-white/5 text-base text-white placeholder:text-white/65 focus-visible:border-[#C8A45D] focus-visible:ring-[#C8A45D]/30"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="cta-pulse h-13 w-full rounded-xl bg-[#C8A45D] py-3.5 text-base font-bold text-black transition-all hover:bg-white hover:text-black disabled:opacity-60"
      >
        {pending ? "שולח..." : buttonText}
      </Button>

      <p className="text-center text-xs text-white/70">
        בלחיצה על הכפתור אתה מאשר שניצור איתך קשר בנוגע לפניות חדשות.
      </p>
    </form>
  );
}
