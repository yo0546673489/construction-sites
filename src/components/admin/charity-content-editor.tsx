"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  EyeIcon,
  HeartIcon,
  ImageIcon,
  ListIcon,
  PlusIcon,
  SaveIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  TrashIcon,
  TrendingUpIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CharitySiteContent } from "@/lib/charity-content";
import { saveContent } from "@/app/admin/content/actions";

const fieldClass =
  "h-11 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30";

const textareaClass =
  "min-h-24 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30";

const addBtn =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85 hover:border-[#C9A24A]/40 hover:text-[#C9A24A]";

const trashBtn =
  "flex size-10 shrink-0 items-center justify-center rounded-lg text-white/40 hover:bg-red-500/10 hover:text-red-300";

type SectionKey =
  | "meta"
  | "donate"
  | "hero"
  | "reels"
  | "story"
  | "gallery"
  | "impact"
  | "donationCards"
  | "urgency"
  | "bigVideo"
  | "trust"
  | "liveFeed"
  | "finalCta"
  | "popup"
  | "contact";

const SECTIONS: { key: SectionKey; label: string; icon: typeof HeartIcon }[] = [
  { key: "meta", label: "מטא + לוגו", icon: ShieldCheckIcon },
  { key: "donate", label: "תרומה — URL + כפתורים", icon: HeartIcon },
  { key: "hero", label: "Hero — Typewriter + מדיה", icon: SparklesIcon },
  { key: "reels", label: "Reels (סקרול אופקי)", icon: VideoIcon },
  { key: "story", label: "סיפור העמותה", icon: HeartIcon },
  { key: "gallery", label: "גלריה (Ken Burns)", icon: ImageIcon },
  { key: "impact", label: "מספרים (Impact)", icon: TrendingUpIcon },
  { key: "donationCards", label: "כרטיסי תרומה", icon: HeartIcon },
  { key: "urgency", label: "דחיפות (Urgency)", icon: TargetIcon },
  { key: "bigVideo", label: "וידאו ענק", icon: VideoIcon },
  { key: "trust", label: "אמינות", icon: ShieldCheckIcon },
  { key: "liveFeed", label: "תרומות בזמן אמת", icon: UsersIcon },
  { key: "finalCta", label: "Final CTA", icon: SparklesIcon },
  { key: "popup", label: "Popup אחרי 15 שניות", icon: SparklesIcon },
  { key: "contact", label: "יצירת קשר", icon: ListIcon },
];

export function CharityContentEditor({
  initial,
  tenantSlug,
}: {
  initial: CharitySiteContent;
  tenantSlug: string;
}) {
  const [content, setContent] = useState<CharitySiteContent>(initial);
  const [isPending, startTransition] = useTransition();
  const [hasChanges, setHasChanges] = useState(false);
  const [open, setOpen] = useState<SectionKey | "">("hero");

  function update<K extends keyof CharitySiteContent>(
    section: K,
    patch: Partial<CharitySiteContent[K]>
  ) {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }));
    setHasChanges(true);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveContent(JSON.stringify(content));
      if (result.ok) {
        toast.success("נשמר!");
        setHasChanges(false);
      } else {
        toast.error(result.error ?? "שגיאה בשמירה");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 -mx-6 flex items-center justify-between border-b border-white/10 bg-zinc-900/95 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">
            עריכת דף עמותה
          </h1>
          <p className="mt-1 text-sm text-white/55">
            תבנית: <span className="font-bold text-[#C9A24A]">charity</span> ·
            עורך לפי סקשן.{" "}
            <a
              href={`/sites/${tenantSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A24A] hover:underline"
            >
              צפה בדף הציבורי <ExternalLinkIcon className="inline size-3" />
            </a>
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="h-11 rounded-xl bg-[#C9A24A] px-6 font-bold text-black hover:bg-white disabled:opacity-50"
        >
          <SaveIcon className="size-4" />
          {isPending ? "שומר..." : hasChanges ? "שמור שינויים" : "נשמר"}
        </Button>
      </div>

      {/* Sections accordion */}
      <div className="space-y-3">
        {SECTIONS.map((sec) => (
          <SectionAccordion
            key={sec.key}
            label={sec.label}
            icon={sec.icon}
            isOpen={open === sec.key}
            onToggle={() => setOpen(open === sec.key ? "" : sec.key)}
          >
            {sec.key === "meta" && (
              <MetaForm
                value={content.meta}
                onChange={(v) => update("meta", v)}
              />
            )}
            {sec.key === "donate" && (
              <DonateForm
                value={content.donate}
                onChange={(v) => update("donate", v)}
              />
            )}
            {sec.key === "hero" && (
              <HeroForm
                value={content.hero}
                onChange={(v) => update("hero", v)}
              />
            )}
            {sec.key === "reels" && (
              <ReelsForm
                value={content.reels}
                onChange={(v) => update("reels", v)}
              />
            )}
            {sec.key === "story" && (
              <StoryForm
                value={content.story}
                onChange={(v) => update("story", v)}
              />
            )}
            {sec.key === "bigVideo" && (
              <BigVideoForm
                value={content.bigVideo}
                onChange={(v) => update("bigVideo", v)}
              />
            )}
            {sec.key === "popup" && (
              <PopupForm
                value={content.popup}
                onChange={(v) => update("popup", v)}
              />
            )}
            {sec.key === "gallery" && (
              <GalleryForm
                value={content.gallery}
                onChange={(v) => update("gallery", v)}
              />
            )}
            {sec.key === "impact" && (
              <ImpactForm
                value={content.impact}
                onChange={(v) => update("impact", v)}
              />
            )}
            {sec.key === "donationCards" && (
              <DonationCardsForm
                value={content.donationCards}
                onChange={(v) => update("donationCards", v)}
              />
            )}
            {sec.key === "urgency" && (
              <UrgencyForm
                value={content.urgency}
                onChange={(v) => update("urgency", v)}
              />
            )}
            {sec.key === "trust" && (
              <TrustForm
                value={content.trust}
                onChange={(v) => update("trust", v)}
              />
            )}
            {sec.key === "liveFeed" && (
              <LiveFeedForm
                value={content.liveFeed}
                onChange={(v) => update("liveFeed", v)}
              />
            )}
            {sec.key === "finalCta" && (
              <FinalCtaForm
                value={content.finalCta}
                onChange={(v) => update("finalCta", v)}
              />
            )}
            {sec.key === "contact" && (
              <ContactForm
                value={content.contact}
                onChange={(v) => update("contact", v)}
              />
            )}
          </SectionAccordion>
        ))}
      </div>
    </div>
  );
}

function SectionAccordion({
  label,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  icon: typeof HeartIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-5 text-right transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#C9A24A]/15 text-[#C9A24A]">
          <Icon className="size-5" />
        </div>
        <div className="flex-1 text-base font-bold">{label}</div>
        <ChevronDownIcon
          className={`size-5 text-white/40 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-white/10 p-5 md:p-6">{children}</div>
      )}
    </div>
  );
}

function Field({
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

/* ============== MetaForm ============== */
function MetaForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["meta"];
  onChange: (v: Partial<CharitySiteContent["meta"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="שם העמותה">
        <Input
          value={value.brandName}
          onChange={(e) => onChange({ brandName: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="טאגליין">
        <Input
          value={value.brandTagline}
          onChange={(e) => onChange({ brandTagline: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="כותרת ה-tab">
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
      <Field
        label="URL לוגו"
        hint="מומלץ לוגו עגול, רקע שקוף או צבע אחיד"
      >
        <Input
          value={value.logoUrl}
          onChange={(e) => onChange({ logoUrl: e.target.value })}
          placeholder="/uploads/charity/logo.png"
          className={fieldClass}
          dir="ltr"
        />
      </Field>
      <Field
        label="באנר עליון (full-width)"
        hint="מופיע בראש הדף, מעל ה-Hero. השאר ריק לביטול."
      >
        <Input
          value={value.topBanner}
          onChange={(e) => onChange({ topBanner: e.target.value })}
          placeholder="/uploads/charity/banner.png"
          className={fieldClass}
          dir="ltr"
        />
      </Field>
    </div>
  );
}

/* ============== DonateForm ============== */
function DonateForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["donate"];
  onChange: (v: Partial<CharitySiteContent["donate"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field
        label="כתובת לתרומה (URL חיצוני)"
        hint="למשל: PayBox, Nedarim Plus, גבעת הרחמים. כל כפתור 'תרום' באתר יוביל לכאן."
      >
        <Input
          value={value.donationUrl}
          onChange={(e) => onChange({ donationUrl: e.target.value })}
          placeholder="https://nedarimplus.com/..."
          className={fieldClass}
          dir="ltr"
        />
      </Field>
      <Field label="טקסט הכפתור הראשי">
        <Input
          value={value.primaryCta}
          onChange={(e) => onChange({ primaryCta: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="טקסט הכפתור המשני">
        <Input
          value={value.secondaryCta}
          onChange={(e) => onChange({ secondaryCta: e.target.value })}
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

/* ============== HeroForm — Split layout: side media + typewriter ============== */
function HeroForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["hero"];
  onChange: (v: Partial<CharitySiteContent["hero"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="סוג מדיה (בצד)">
        <select
          value={value.sideMediaType}
          onChange={(e) =>
            onChange({ sideMediaType: e.target.value as "image" | "video" })
          }
          className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white"
        >
          <option value="video" className="bg-zinc-900">
            וידאו (mp4)
          </option>
          <option value="image" className="bg-zinc-900">
            תמונה
          </option>
        </select>
      </Field>
      <Field
        label={
          value.sideMediaType === "video" ? "URL וידאו" : "URL תמונה"
        }
      >
        <Input
          value={value.sideMedia}
          onChange={(e) => onChange({ sideMedia: e.target.value })}
          placeholder="/uploads/charity/video-01.mp4"
          className={fieldClass}
          dir="ltr"
        />
      </Field>
      {value.sideMediaType === "video" && (
        <Field
          label="Poster (תמונה תחליפית לוידאו)"
          hint="מוצגת עד שהוידאו נטען"
        >
          <Input
            value={value.sideMediaPoster}
            onChange={(e) => onChange({ sideMediaPoster: e.target.value })}
            placeholder="/uploads/charity/image-01.jpg"
            className={fieldClass}
            dir="ltr"
          />
        </Field>
      )}
      <Field
        label="Typewriter — פאזה 1"
        hint="מודפס, נמחק, עובר לפאזה 2"
      >
        <Input
          value={value.typewriterPhase1}
          onChange={(e) => onChange({ typewriterPhase1: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="Typewriter — פאזה 2" hint="מודפס, נמחק, עובר לפאזה 3">
        <Input
          value={value.typewriterPhase2}
          onChange={(e) => onChange({ typewriterPhase2: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field
        label="Typewriter — פאזה 3 (חזקה, נשארת!)"
        hint="המסר העיקרי"
      >
        <Input
          value={value.typewriterPhase3}
          onChange={(e) => onChange({ typewriterPhase3: e.target.value })}
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

/* ============== ReelsForm — סקרול אופקי ============== */
function ReelsForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["reels"];
  onChange: (v: Partial<CharitySiteContent["reels"]>) => void;
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
          videoUrl: "",
          poster: "",
          overlayText: "טקסט חדש",
          cta: "אני רוצה לעזור",
        },
      ],
    });
  }

  return (
    <div className="grid gap-4">
      <Field label="כותרת הסקשן">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <p className="text-xs text-white/55">
        סקרול אופקי עם snap. וידאו אנכי 9:16 שמתנגן אוטומטית במסך. מומלץ 4-8 פריטים.
      </p>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            Reels ({value.items.length})
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
              <div className="flex items-start gap-2">
                {item.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.poster}
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
                    value={item.videoUrl}
                    onChange={(e) =>
                      updateItem(i, { videoUrl: e.target.value })
                    }
                    placeholder="URL וידאו"
                    className={fieldClass}
                    dir="ltr"
                  />
                  <Input
                    value={item.poster}
                    onChange={(e) =>
                      updateItem(i, { poster: e.target.value })
                    }
                    placeholder="URL תמונה תחליפית"
                    className={fieldClass}
                    dir="ltr"
                  />
                  <Input
                    value={item.overlayText}
                    onChange={(e) =>
                      updateItem(i, { overlayText: e.target.value })
                    }
                    placeholder="טקסט מעל הוידאו"
                    className={fieldClass}
                  />
                  <Input
                    value={item.cta}
                    onChange={(e) => updateItem(i, { cta: e.target.value })}
                    placeholder="טקסט הכפתור"
                    className={fieldClass}
                  />
                </div>
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

/* ============== StoryForm — סיפור העמותה ============== */
function StoryForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["story"];
  onChange: (v: Partial<CharitySiteContent["story"]>) => void;
}) {
  function updatePara(i: number, text: string) {
    onChange({
      paragraphs: value.paragraphs.map((p, idx) => (idx === i ? text : p)),
    });
  }
  function removePara(i: number) {
    onChange({
      paragraphs: value.paragraphs.filter((_, idx) => idx !== i),
    });
  }
  function addPara() {
    onChange({ paragraphs: [...value.paragraphs, "פסקה חדשה"] });
  }

  return (
    <div className="grid gap-4">
      <Field label="קיקר (תג מעל הסיפור)">
        <Input
          value={value.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            פסקאות ({value.paragraphs.length})
          </Label>
          <button type="button" onClick={addPara} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-2">
          {value.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <Textarea
                value={p}
                onChange={(e) => updatePara(i, e.target.value)}
                rows={3}
                className={textareaClass}
              />
              <button
                type="button"
                onClick={() => removePara(i)}
                className={trashBtn}
                aria-label="מחק"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Field label="טקסט הכפתור">
        <Input
          value={value.cta}
          onChange={(e) => onChange({ cta: e.target.value })}
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

/* ============== BigVideoForm ============== */
function BigVideoForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["bigVideo"];
  onChange: (v: Partial<CharitySiteContent["bigVideo"]>) => void;
}) {
  return (
    <div className="grid gap-4">
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
      <Field
        label="URL וידאו (mp4)"
        hint="הוידאו הראשי של העמותה. ניגון בלחיצה על play"
      >
        <Input
          value={value.videoUrl}
          onChange={(e) => onChange({ videoUrl: e.target.value })}
          placeholder="/uploads/charity/video-08.mp4"
          className={fieldClass}
          dir="ltr"
        />
      </Field>
      <Field label="תמונת Poster">
        <Input
          value={value.poster}
          onChange={(e) => onChange({ poster: e.target.value })}
          placeholder="/uploads/charity/image-XX.jpg"
          className={fieldClass}
          dir="ltr"
        />
      </Field>
    </div>
  );
}

/* ============== PopupForm ============== */
function PopupForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["popup"];
  onChange: (v: Partial<CharitySiteContent["popup"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field
        label="הפעל popup"
        hint="הפופאפ יופיע פעם אחת בסשן, אחרי X שניות"
      >
        <label className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="size-5 accent-[#C9A24A]"
          />
          <span className="text-sm font-medium text-white/85">
            {value.enabled ? "פעיל" : "כבוי"}
          </span>
        </label>
      </Field>
      <Field label="זמן הופעה (שניות)">
        <Input
          type="number"
          value={value.delaySeconds}
          onChange={(e) =>
            onChange({ delaySeconds: Number(e.target.value) || 15 })
          }
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
      <Field label="טקסט">
        <Textarea
          value={value.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className={textareaClass}
        />
      </Field>
      <Field label="טקסט הכפתור">
        <Input
          value={value.cta}
          onChange={(e) => onChange({ cta: e.target.value })}
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

/* ============== FinalCtaForm ============== */
function FinalCtaForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["finalCta"];
  onChange: (v: Partial<CharitySiteContent["finalCta"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="שורה 1 — כותרת ענקית">
        <Input
          value={value.line1}
          onChange={(e) => onChange({ line1: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="שורה 2 — שאלה קוראת לפעולה">
        <Input
          value={value.line2}
          onChange={(e) => onChange({ line2: e.target.value })}
          className={fieldClass}
        />
      </Field>
      <Field label="טקסט הכפתור הסופי">
        <Input
          value={value.button}
          onChange={(e) => onChange({ button: e.target.value })}
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

/* ============== GalleryForm ============== */
function GalleryForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["gallery"];
  onChange: (v: Partial<CharitySiteContent["gallery"]>) => void;
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
                    alt={img.caption}
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

/* ============== ImpactForm ============== */
function ImpactForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["impact"];
  onChange: (v: Partial<CharitySiteContent["impact"]>) => void;
}) {
  function updateCounter(
    i: number,
    patch: Partial<typeof value.counters[number]>
  ) {
    onChange({
      counters: value.counters.map((c, idx) =>
        idx === i ? { ...c, ...patch } : c
      ),
    });
  }
  function removeCounter(i: number) {
    onChange({ counters: value.counters.filter((_, idx) => idx !== i) });
  }
  function addCounter() {
    onChange({
      counters: [
        ...value.counters,
        { value: 0, suffix: "+", label: "מדד חדש" },
      ],
    });
  }

  return (
    <div className="grid gap-4">
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
            מספרים ({value.counters.length})
          </Label>
          <button type="button" onClick={addCounter} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.counters.map((c, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="grid grid-cols-[100px_70px_auto] gap-2">
                <Input
                  type="number"
                  value={c.value}
                  onChange={(e) =>
                    updateCounter(i, { value: Number(e.target.value) || 0 })
                  }
                  placeholder="5000"
                  className={fieldClass}
                />
                <Input
                  value={c.suffix}
                  onChange={(e) => updateCounter(i, { suffix: e.target.value })}
                  placeholder="+"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeCounter(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <Input
                value={c.label}
                onChange={(e) => updateCounter(i, { label: e.target.value })}
                placeholder="ארוחות חולקו החודש"
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== DonationCardsForm ============== */
function DonationCardsForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["donationCards"];
  onChange: (v: Partial<CharitySiteContent["donationCards"]>) => void;
}) {
  function updateCard(i: number, patch: Partial<typeof value.cards[number]>) {
    onChange({
      cards: value.cards.map((c, idx) =>
        idx === i ? { ...c, ...patch } : c
      ),
    });
  }
  function removeCard(i: number) {
    onChange({ cards: value.cards.filter((_, idx) => idx !== i) });
  }
  function addCard() {
    onChange({
      cards: [
        ...value.cards,
        {
          amount: 100,
          title: "כותרת",
          description: "תיאור",
        },
      ],
    });
  }

  return (
    <div className="grid gap-4">
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
            כרטיסים ({value.cards.length})
          </Label>
          <button type="button" onClick={addCard} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-3">
          {value.cards.map((card, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="grid grid-cols-[100px_1fr_auto] gap-2">
                <Input
                  type="number"
                  value={card.amount}
                  onChange={(e) =>
                    updateCard(i, { amount: Number(e.target.value) || 0 })
                  }
                  placeholder="50"
                  className={fieldClass}
                />
                <Input
                  value={card.title}
                  onChange={(e) => updateCard(i, { title: e.target.value })}
                  placeholder="כותרת"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeCard(i)}
                  className={trashBtn}
                  aria-label="מחק"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <Input
                value={card.description}
                onChange={(e) =>
                  updateCard(i, { description: e.target.value })
                }
                placeholder="תיאור"
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      </div>
      <Field label="טקסט 'תרומה אישית'">
        <Input
          value={value.customLabel}
          onChange={(e) => onChange({ customLabel: e.target.value })}
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

/* ============== UrgencyForm ============== */
function UrgencyForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["urgency"];
  onChange: (v: Partial<CharitySiteContent["urgency"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="כותרת הסקשן">
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
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="יעד (₪)">
          <Input
            type="number"
            value={value.goal}
            onChange={(e) => onChange({ goal: Number(e.target.value) || 0 })}
            className={fieldClass}
          />
        </Field>
        <Field label="נאסף עד כה (₪)">
          <Input
            type="number"
            value={value.raised}
            onChange={(e) =>
              onChange({ raised: Number(e.target.value) || 0 })
            }
            className={fieldClass}
          />
        </Field>
      </div>
      <Field label="דדליין (טקסט חופשי)">
        <Input
          value={value.deadline}
          onChange={(e) => onChange({ deadline: e.target.value })}
          placeholder="30 בנובמבר"
          className={fieldClass}
        />
      </Field>
    </div>
  );
}

/* ============== TrustForm ============== */
function TrustForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["trust"];
  onChange: (v: Partial<CharitySiteContent["trust"]>) => void;
}) {
  function updateBadge(i: number, text: string) {
    onChange({
      badges: value.badges.map((b, idx) => (idx === i ? text : b)),
    });
  }
  function removeBadge(i: number) {
    onChange({ badges: value.badges.filter((_, idx) => idx !== i) });
  }
  function addBadge() {
    onChange({ badges: [...value.badges, "אישור חדש"] });
  }

  return (
    <div className="grid gap-4">
      <Field label="כותרת">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
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
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            תוויות אמינות ({value.badges.length})
          </Label>
          <button type="button" onClick={addBadge} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-2">
          {value.badges.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={b}
                onChange={(e) => updateBadge(i, e.target.value)}
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() => removeBadge(i)}
                className={trashBtn}
                aria-label="מחק"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="שם המייסד">
          <Input
            value={value.founderName}
            onChange={(e) => onChange({ founderName: e.target.value })}
            className={fieldClass}
          />
        </Field>
        <Field label="תפקיד">
          <Input
            value={value.founderRole}
            onChange={(e) => onChange({ founderRole: e.target.value })}
            className={fieldClass}
          />
        </Field>
      </div>
      <Field label="URL וידאו של מייסד (אופציונלי)">
        <Input
          value={value.founderVideoUrl}
          onChange={(e) => onChange({ founderVideoUrl: e.target.value })}
          placeholder="https://... .mp4"
          className={fieldClass}
          dir="ltr"
        />
      </Field>
    </div>
  );
}

/* ============== LiveFeedForm ============== */
function LiveFeedForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["liveFeed"];
  onChange: (v: Partial<CharitySiteContent["liveFeed"]>) => void;
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
        { name: "שם", city: "עיר", amount: 100 },
      ],
    });
  }

  return (
    <div className="grid gap-4">
      <Field
        label="הפעל popup תרומות בזמן אמת"
        hint="מציג בצד ימין תחתון תרומות לדוגמה לכוון יצירת תחושת תנועה"
      >
        <label className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="size-5 accent-[#C9A24A]"
          />
          <span className="text-sm font-medium text-white/85">
            {value.enabled ? "פעיל" : "כבוי"}
          </span>
        </label>
      </Field>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-white/85">
            תרומות לדוגמה ({value.items.length})
          </Label>
          <button type="button" onClick={addItem} className={addBtn}>
            <PlusIcon className="size-4" />
            הוסף
          </button>
        </div>
        <div className="space-y-2">
          {value.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_100px_auto] gap-2"
            >
              <Input
                value={item.name}
                onChange={(e) => updateItem(i, { name: e.target.value })}
                placeholder="שם"
                className={fieldClass}
              />
              <Input
                value={item.city}
                onChange={(e) => updateItem(i, { city: e.target.value })}
                placeholder="עיר"
                className={fieldClass}
              />
              <Input
                type="number"
                value={item.amount}
                onChange={(e) =>
                  updateItem(i, { amount: Number(e.target.value) || 0 })
                }
                placeholder="100"
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
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== ContactForm ============== */
function ContactForm({
  value,
  onChange,
}: {
  value: CharitySiteContent["contact"];
  onChange: (v: Partial<CharitySiteContent["contact"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field
        label="מספר וואטסאפ"
        hint="פורמט בינלאומי ללא +. למשל: 972501234567"
      >
        <Input
          value={value.whatsappNumber}
          onChange={(e) => onChange({ whatsappNumber: e.target.value })}
          className={fieldClass}
          dir="ltr"
        />
      </Field>
      <Field label="הודעה דיפולטית בוואטסאפ">
        <Textarea
          value={value.whatsappMessage}
          onChange={(e) => onChange({ whatsappMessage: e.target.value })}
          className={textareaClass}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="טלפון">
          <Input
            value={value.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="03-1234567"
            className={fieldClass}
            dir="ltr"
          />
        </Field>
        <Field label="אימייל">
          <Input
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="info@example.org"
            className={fieldClass}
            dir="ltr"
          />
        </Field>
      </div>
    </div>
  );
}
