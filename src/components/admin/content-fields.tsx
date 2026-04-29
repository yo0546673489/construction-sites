"use client";

import { ImageIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type SiteContent,
  type PainIconName,
  type SolutionIconName,
  type MarketingIconName,
} from "@/lib/content";

const PAIN_ICONS: PainIconName[] = [
  "user-x",
  "megaphone",
  "calendar-off",
  "phone",
  "phone-off",
  "phone-missed",
  "frown",
  "wallet",
];

const SOLUTION_ICONS: SolutionIconName[] = [
  "target",
  "phone-call",
  "trending-up",
  "wrench",
  "zap",
  "hammer",
];

const MARKETING_ICONS: MarketingIconName[] = [
  "megaphone",
  "target",
  "trending-up",
  "filter",
  "bot",
  "bell-ring",
  "map-pin",
  "gauge",
];

/* ---------------- Reusable styling helpers ---------------- */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-medium text-white/85">{label}</Label>
      {children}
      {hint && <p className="text-xs text-white/45">{hint}</p>}
    </div>
  );
}

export const fieldClass =
  "h-11 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30";

export const textareaClass =
  "min-h-24 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30";

const addBtn =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85 hover:border-[#C9A24A]/40 hover:text-[#C9A24A]";

const trashBtn =
  "flex size-10 shrink-0 items-center justify-center rounded-lg text-white/40 hover:bg-red-500/10 hover:text-red-300";

/* ---------------- Section forms ---------------- */

export function MetaFields({
  value,
  onChange,
}: {
  value: SiteContent["meta"];
  onChange: (v: Partial<SiteContent["meta"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="שם העסק (מותג)" hint="מוצג ב-Footer ובכותרת הדפדפן">
        <Input
          value={value.brandName}
          onChange={(e) => onChange({ brandName: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת ה-tab בדפדפן">
        <Input
          value={value.pageTitle}
          onChange={(e) => onChange({ pageTitle: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="תיאור מטא ל-SEO">
        <Textarea
          value={value.pageDescription}
          onChange={(e) => onChange({ pageDescription: e.target.value })}
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

export function ContactFields({
  value,
  onChange,
}: {
  value: SiteContent["contact"];
  onChange: (v: Partial<SiteContent["contact"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field
        label="מספר וואטסאפ"
        hint="פורמט בינלאומי ללא +. למשל ישראל: 972501234567"
      >
        <Input
          value={value.whatsappNumber}
          onChange={(e) => onChange({ whatsappNumber: e.target.value })}
          className={fieldClass}
          placeholder="972501234567"
        />
      </Field>
      <Field
        label="הודעה דיפולטית"
        hint="הטקסט שיופיע אוטומטית כשהמבקר ילחץ על וואטסאפ"
      >
        <Textarea
          value={value.whatsappMessage}
          onChange={(e) => onChange({ whatsappMessage: e.target.value })}
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

export function HeroFields({
  value,
  onChange,
}: {
  value: SiteContent["hero"];
  onChange: (v: Partial<SiteContent["hero"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="תג מעל הכותרת">
        <Input
          value={value.badge}
          onChange={(e) => onChange({ badge: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת — שורה 1">
        <Input
          value={value.headlineLine1}
          onChange={(e) => onChange({ headlineLine1: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת — שורה 2 (תוצג בזהב)">
        <Input
          value={value.headlineLine2}
          onChange={(e) => onChange({ headlineLine2: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת משנית">
        <Textarea
          value={value.subheadline}
          onChange={(e) => onChange({ subheadline: e.target.value })}
          className={textareaClass}
        />
      </Field>
      <Field label="טקסט הכפתור הראשי">
        <Input
          value={value.primaryCta}
          onChange={(e) => onChange({ primaryCta: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כתובת תמונת רקע" hint="URL — Unsplash, CDN או /uploads/...">
        <Input
          value={value.backgroundImage}
          onChange={(e) => onChange({ backgroundImage: e.target.value })}
          className={fieldClass}
          placeholder="https://..."
        />
      </Field>
    </div>
  );
}

export function PainFields({
  value,
  onChange,
}: {
  value: SiteContent["pain"];
  onChange: (v: Partial<SiteContent["pain"]>) => void;
}) {
  function updateItem(i: number, patch: Partial<typeof value.items[number]>) {
    const items = value.items.map((it, idx) =>
      idx === i ? { ...it, ...patch } : it
    );
    onChange({ items });
  }
  function removeItem(i: number) {
    onChange({ items: value.items.filter((_, idx) => idx !== i) });
  }
  function addItem() {
    onChange({
      items: [...value.items, { iconName: "user-x", text: "כאב חדש" }],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר (מעל הכותרת)">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            הכאבים ({value.items.length})
          </Label>
          <button type="button" onClick={addItem} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="flex items-start gap-2">
                <select
                  value={item.iconName}
                  onChange={(e) =>
                    updateItem(i, {
                      iconName: e.target.value as PainIconName,
                    })
                  }
                  className="h-10 rounded-lg border border-white/15 bg-white/5 px-2 text-xs text-white"
                >
                  {PAIN_ICONS.map((n) => (
                    <option key={n} value={n} className="bg-zinc-900">
                      {n}
                    </option>
                  ))}
                </select>
                <Input
                  value={item.text}
                  onChange={(e) => updateItem(i, { text: e.target.value })}
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BeliefFields({
  value,
  onChange,
}: {
  value: SiteContent["beliefBreaker"];
  onChange: (v: Partial<SiteContent["beliefBreaker"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="כותרת — תחילה (לבן)">
        <Input
          value={value.titleBefore}
          onChange={(e) => onChange({ titleBefore: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת — סוף (זהב)">
        <Input
          value={value.titleHighlight}
          onChange={(e) => onChange({ titleHighlight: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="פסקה 1">
        <Textarea
          value={value.paragraph1}
          onChange={(e) => onChange({ paragraph1: e.target.value })}
          className={textareaClass}
        />
      </Field>
      <Field label="פסקה 2 (מודגשת)">
        <Textarea
          value={value.paragraph2}
          onChange={(e) => onChange({ paragraph2: e.target.value })}
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

export function SolutionFields({
  value,
  onChange,
}: {
  value: SiteContent["solution"];
  onChange: (v: Partial<SiteContent["solution"]>) => void;
}) {
  function updateStep(i: number, patch: Partial<typeof value.steps[number]>) {
    const steps = value.steps.map((s, idx) =>
      idx === i ? { ...s, ...patch } : s
    );
    onChange({ steps });
  }
  function removeStep(i: number) {
    onChange({ steps: value.steps.filter((_, idx) => idx !== i) });
  }
  function addStep() {
    const num = String(value.steps.length + 1).padStart(2, "0");
    onChange({
      steps: [
        ...value.steps,
        { num, iconName: "target", title: "שלב חדש", desc: "תיאור..." },
      ],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת — תחילה (לבן)">
        <Input
          value={value.titleBefore}
          onChange={(e) => onChange({ titleBefore: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת — סוף (זהב)">
        <Input
          value={value.titleHighlight}
          onChange={(e) => onChange({ titleHighlight: e.target.value })}
          className={fieldClass}
        />
      </Field>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            שלבים ({value.steps.length})
          </Label>
          <button type="button" onClick={addStep} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.steps.map((step, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="grid gap-2">
                <div className="grid grid-cols-[60px_1fr_auto] gap-2">
                  <Input
                    value={step.num}
                    onChange={(e) => updateStep(i, { num: e.target.value })}
                    placeholder="01"
                    className={fieldClass}
                  />
                  <select
                    value={step.iconName}
                    onChange={(e) =>
                      updateStep(i, {
                        iconName: e.target.value as SolutionIconName,
                      })
                    }
                    className="h-11 rounded-lg border border-white/15 bg-white/5 px-2 text-xs text-white"
                  >
                    {SOLUTION_ICONS.map((n) => (
                      <option key={n} value={n} className="bg-zinc-900">
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className={trashBtn}
                    aria-label="מחק"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(i, { title: e.target.value })}
                  placeholder="כותרת"
                  className={fieldClass}
                />
                <Textarea
                  value={step.desc}
                  onChange={(e) => updateStep(i, { desc: e.target.value })}
                  placeholder="תיאור"
                  className={textareaClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProofFields({
  value,
  onChange,
}: {
  value: SiteContent["proof"];
  onChange: (v: Partial<SiteContent["proof"]>) => void;
}) {
  function updateStat(i: number, patch: Partial<typeof value.stats[number]>) {
    const stats = value.stats.map((s, idx) =>
      idx === i ? { ...s, ...patch } : s
    );
    onChange({ stats });
  }
  function removeStat(i: number) {
    onChange({ stats: value.stats.filter((_, idx) => idx !== i) });
  }
  function addStat() {
    onChange({
      stats: [...value.stats, { value: 0, suffix: "+", label: "מדד חדש" }],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            מספרים ({value.stats.length})
          </Label>
          <button type="button" onClick={addStat} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.stats.map((stat, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="grid grid-cols-[80px_70px_auto] gap-2">
                <Input
                  type="number"
                  value={stat.value}
                  onChange={(e) =>
                    updateStat(i, { value: Number(e.target.value) || 0 })
                  }
                  placeholder="30"
                  className={fieldClass}
                />
                <Input
                  value={stat.suffix}
                  onChange={(e) => updateStat(i, { suffix: e.target.value })}
                  placeholder="+"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <Input
                value={stat.label}
                onChange={(e) => updateStat(i, { label: e.target.value })}
                placeholder="פניות בחודש"
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GalleryFields({
  value,
  onChange,
}: {
  value: SiteContent["gallery"];
  onChange: (v: Partial<SiteContent["gallery"]>) => void;
}) {
  function updateImg(i: number, patch: Partial<typeof value.items[number]>) {
    const items = value.items.map((s, idx) =>
      idx === i ? { ...s, ...patch } : s
    );
    onChange({ items });
  }
  function removeImg(i: number) {
    onChange({ items: value.items.filter((_, idx) => idx !== i) });
  }
  function addImg() {
    onChange({
      items: [...value.items, { src: "", alt: "תמונה חדשה", label: "כותרת" }],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת משנית">
        <Input
          value={value.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className={fieldClass}
        />
      </Field>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            תמונות ({value.items.length})
          </Label>
          <button type="button" onClick={addImg} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.items.map((img, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="flex items-start gap-2">
                {img.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/30">
                    <ImageIcon className="size-5" />
                  </div>
                )}
                <Input
                  value={img.src}
                  onChange={(e) => updateImg(i, { src: e.target.value })}
                  placeholder="https://..."
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeImg(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <div className="grid gap-2">
                <Input
                  value={img.label}
                  onChange={(e) => updateImg(i, { label: e.target.value })}
                  placeholder="כותרת מתחת לתמונה"
                  className={fieldClass}
                />
                <Input
                  value={img.alt}
                  onChange={(e) => updateImg(i, { alt: e.target.value })}
                  placeholder="alt — תיאור לנגישות"
                  className={fieldClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DifferentiatorFields({
  value,
  onChange,
}: {
  value: SiteContent["differentiator"];
  onChange: (v: Partial<SiteContent["differentiator"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="פסקה 1 — תחילה">
        <Input
          value={value.paragraph1Before}
          onChange={(e) => onChange({ paragraph1Before: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="פסקה 1 — סוף (מודגש)">
        <Input
          value={value.paragraph1Highlight}
          onChange={(e) => onChange({ paragraph1Highlight: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="פסקה 2 — תחילה">
        <Input
          value={value.paragraph2Before}
          onChange={(e) => onChange({ paragraph2Before: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="פסקה 2 — סוף (מודגש)">
        <Input
          value={value.paragraph2Highlight}
          onChange={(e) => onChange({ paragraph2Highlight: e.target.value })}
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

export function CtaFields({
  value,
  onChange,
}: {
  value: SiteContent["ctaSection"];
  onChange: (v: Partial<SiteContent["ctaSection"]>) => void;
}) {
  function updateBullet(i: number, text: string) {
    onChange({
      bullets: value.bullets.map((b, idx) => (idx === i ? text : b)),
    });
  }
  function removeBullet(i: number) {
    onChange({ bullets: value.bullets.filter((_, idx) => idx !== i) });
  }
  function addBullet() {
    onChange({ bullets: [...value.bullets, "יתרון חדש"] });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת — תחילה (לבן)">
        <Input
          value={value.titleBefore}
          onChange={(e) => onChange({ titleBefore: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת — סוף (זהב)">
        <Input
          value={value.titleHighlight}
          onChange={(e) => onChange({ titleHighlight: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="תיאור">
        <Textarea
          value={value.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className={textareaClass}
        />
      </Field>
      <Field label="טקסט הכפתור">
        <Input
          value={value.formButtonText}
          onChange={(e) => onChange({ formButtonText: e.target.value })}
          className={fieldClass}
        />
      </Field>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            יתרונות ({value.bullets.length})
          </Label>
          <button type="button" onClick={addBullet} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-2">
          {value.bullets.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={b}
                onChange={(e) => updateBullet(i, e.target.value)}
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() => removeBullet(i)}
                className={trashBtn}
                aria-label="מחק"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== BeforeAfter ============== */
export function BeforeAfterFields({
  value,
  onChange,
}: {
  value: SiteContent["beforeAfter"];
  onChange: (v: Partial<SiteContent["beforeAfter"]>) => void;
}) {
  function updateItem(i: number, patch: Partial<typeof value.items[number]>) {
    onChange({
      items: value.items.map((it, idx) =>
        idx === i ? { ...it, ...patch } : it
      ),
    });
  }
  function removeItem(i: number) {
    onChange({ items: value.items.filter((_, idx) => idx !== i) });
  }
  function addItem() {
    onChange({
      items: [
        ...value.items,
        { before: "", after: "", label: "פרויקט חדש" },
      ],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="תת כותרת">
        <Input
          value={value.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            פרויקטים ({value.items.length})
          </Label>
          <button type="button" onClick={addItem} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.items.map((item, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-white/60">
                  זוג {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium text-white/70">
                    תמונה — לפני
                  </Label>
                  <div className="flex gap-2">
                    {item.before ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.before}
                        alt=""
                        className="size-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/30">
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                    <Input
                      value={item.before}
                      onChange={(e) =>
                        updateItem(i, { before: e.target.value })
                      }
                      placeholder="URL"
                      className={fieldClass}
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium text-white/70">
                    תמונה — אחרי
                  </Label>
                  <div className="flex gap-2">
                    {item.after ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.after}
                        alt=""
                        className="size-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/30">
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                    <Input
                      value={item.after}
                      onChange={(e) =>
                        updateItem(i, { after: e.target.value })
                      }
                      placeholder="URL"
                      className={fieldClass}
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
              <Input
                value={item.label}
                onChange={(e) => updateItem(i, { label: e.target.value })}
                placeholder="תיאור הפרויקט"
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== WorkPhotos ============== */
export function WorkPhotosFields({
  value,
  onChange,
}: {
  value: SiteContent["workPhotos"];
  onChange: (v: Partial<SiteContent["workPhotos"]>) => void;
}) {
  function updateImg(i: number, patch: Partial<typeof value.items[number]>) {
    onChange({
      items: value.items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    });
  }
  function removeImg(i: number) {
    onChange({ items: value.items.filter((_, idx) => idx !== i) });
  }
  function addImg() {
    onChange({ items: [...value.items, { src: "", caption: "כותרת" }] });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="תת כותרת">
        <Input
          value={value.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            תמונות ({value.items.length})
          </Label>
          <button type="button" onClick={addImg} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.items.map((img, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="flex items-start gap-2">
                {img.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.src}
                    alt=""
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/30">
                    <ImageIcon className="size-5" />
                  </div>
                )}
                <div className="grid flex-1 gap-2">
                  <Input
                    value={img.src}
                    onChange={(e) => updateImg(i, { src: e.target.value })}
                    placeholder="URL תמונה"
                    className={fieldClass}
                    dir="ltr"
                  />
                  <Input
                    value={img.caption}
                    onChange={(e) =>
                      updateImg(i, { caption: e.target.value })
                    }
                    placeholder="כיתוב"
                    className={fieldClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImg(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== MarketingProcess ============== */
export function MarketingProcessFields({
  value,
  onChange,
}: {
  value: SiteContent["marketingProcess"];
  onChange: (v: Partial<SiteContent["marketingProcess"]>) => void;
}) {
  function updateItem(i: number, patch: Partial<typeof value.items[number]>) {
    onChange({
      items: value.items.map((it, idx) =>
        idx === i ? { ...it, ...patch } : it
      ),
    });
  }
  function removeItem(i: number) {
    onChange({ items: value.items.filter((_, idx) => idx !== i) });
  }
  function addItem() {
    onChange({
      items: [
        ...value.items,
        {
          iconName: "megaphone",
          title: "כותרת",
          description: "תיאור...",
        },
      ],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="תת כותרת">
        <Textarea
          value={value.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className={textareaClass}
        />
      </Field>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            יכולות ({value.items.length})
          </Label>
          <button type="button" onClick={addItem} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.items.map((item, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="grid grid-cols-[120px_1fr_auto] gap-2">
                <select
                  value={item.iconName}
                  onChange={(e) =>
                    updateItem(i, {
                      iconName: e.target.value as MarketingIconName,
                    })
                  }
                  className="h-11 rounded-lg border border-white/15 bg-white/5 px-2 text-xs text-white"
                >
                  {MARKETING_ICONS.map((n) => (
                    <option key={n} value={n} className="bg-zinc-900">
                      {n}
                    </option>
                  ))}
                </select>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  placeholder="כותרת"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <Textarea
                value={item.description}
                onChange={(e) =>
                  updateItem(i, { description: e.target.value })
                }
                placeholder="תיאור"
                className={textareaClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== Tagline ============== */
export function TaglineFields({
  value,
  onChange,
}: {
  value: SiteContent["tagline"];
  onChange: (v: Partial<SiteContent["tagline"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="שורה 1 (שחור)">
        <Input
          value={value.line1}
          onChange={(e) => onChange({ line1: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="שורה 2 (זהב, חזק)">
        <Input
          value={value.line2}
          onChange={(e) => onChange({ line2: e.target.value })}
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

/* ============== WhatsApp Proof ============== */
export function WhatsAppProofFields({
  value,
  onChange,
}: {
  value: SiteContent["whatsappProof"];
  onChange: (v: Partial<SiteContent["whatsappProof"]>) => void;
}) {
  function updateMsg(
    i: number,
    patch: Partial<typeof value.messages[number]>
  ) {
    onChange({
      messages: value.messages.map((m, idx) =>
        idx === i ? { ...m, ...patch } : m
      ),
    });
  }
  function removeMsg(i: number) {
    onChange({ messages: value.messages.filter((_, idx) => idx !== i) });
  }
  function addMsg() {
    onChange({
      messages: [
        ...value.messages,
        { name: "שם", text: "טקסט הודעה...", time: "10:00" },
      ],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="תת כותרת">
        <Input
          value={value.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            הודעות ({value.messages.length})
          </Label>
          <button type="button" onClick={addMsg} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.messages.map((msg, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="grid grid-cols-[1fr_80px_auto] gap-2">
                <Input
                  value={msg.name}
                  onChange={(e) => updateMsg(i, { name: e.target.value })}
                  placeholder="שם הלקוח"
                  className={fieldClass}
                />
                <Input
                  value={msg.time}
                  onChange={(e) => updateMsg(i, { time: e.target.value })}
                  placeholder="10:42"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeMsg(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <Textarea
                value={msg.text}
                onChange={(e) => updateMsg(i, { text: e.target.value })}
                placeholder="טקסט ההודעה"
                className={textareaClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== Testimonials ============== */
export function TestimonialsFields({
  value,
  onChange,
}: {
  value: SiteContent["testimonials"];
  onChange: (v: Partial<SiteContent["testimonials"]>) => void;
}) {
  function updateItem(i: number, patch: Partial<typeof value.items[number]>) {
    onChange({
      items: value.items.map((it, idx) =>
        idx === i ? { ...it, ...patch } : it
      ),
    });
  }
  function removeItem(i: number) {
    onChange({ items: value.items.filter((_, idx) => idx !== i) });
  }
  function addItem() {
    onChange({
      items: [
        ...value.items,
        {
          name: "שם",
          area: "אזור",
          quote: "ציטוט מהשיפוצניק",
          before: "0",
          after: "0",
        },
      ],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            המלצות ({value.items.length})
          </Label>
          <button type="button" onClick={addItem} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.items.map((item, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(i, { name: e.target.value })}
                  placeholder="שם השיפוצניק"
                  className={fieldClass}
                />
                <Input
                  value={item.area}
                  onChange={(e) => updateItem(i, { area: e.target.value })}
                  placeholder="אזור"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <Textarea
                value={item.quote}
                onChange={(e) => updateItem(i, { quote: e.target.value })}
                placeholder="ציטוט"
                className={textareaClass}
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium text-white/70">
                    לפני (פניות בחודש)
                  </Label>
                  <Input
                    value={item.before}
                    onChange={(e) =>
                      updateItem(i, { before: e.target.value })
                    }
                    placeholder="3"
                    className={fieldClass}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium text-white/70">
                    אחרי (פניות בחודש)
                  </Label>
                  <Input
                    value={item.after}
                    onChange={(e) => updateItem(i, { after: e.target.value })}
                    placeholder="25"
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
