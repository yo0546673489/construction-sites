"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ExternalLinkIcon,
  EyeIcon,
  MonitorIcon,
  MousePointer2Icon,
  SaveIcon,
  SmartphoneIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SiteContent } from "@/lib/content";
import {
  isTextElementKey,
  isSectionElementKey,
  TEXT_ELEMENTS,
  SECTION_ELEMENTS,
  type TextElementKey,
  type SectionElementKey,
} from "@/lib/element-registry";
import {
  WIDGET_REGISTRY,
  type WidgetInstance,
} from "@/lib/widgets";
import { saveContent } from "@/app/admin/content/actions";
import { LandingPreview } from "./landing-preview";
import { TextStylePanel } from "./text-style-panel";
import { WidgetListCanvas } from "./widget-list-canvas";
import { WidgetSettings } from "./widget-settings";
import {
  BeforeAfterFields,
  ContactFields,
  CtaFields,
  GalleryFields,
  HeroFields,
  MarketingProcessFields,
  MetaFields,
  PainFields,
  ProofFields,
  SolutionFields,
  TaglineFields,
  TestimonialsFields,
  WhatsAppProofFields,
  WorkPhotosFields,
} from "./content-fields";

export function ContentEditor({
  initial,
  tenantSlug,
}: {
  initial: SiteContent;
  tenantSlug: string;
}) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [isPending, startTransition] = useTransition();
  const [hasChanges, setHasChanges] = useState(false);

  function setWidgets(
    next: WidgetInstance[] | ((prev: WidgetInstance[]) => WidgetInstance[])
  ) {
    setContent((prev) => {
      const current = prev.customWidgets ?? [];
      const updated = typeof next === "function" ? next(current) : next;
      return { ...prev, customWidgets: updated };
    });
    setHasChanges(true);
  }

  /** מזהה ווידג'ט = "widget:<id>". בודק האם הבחירה הנוכחית היא של ווידג'ט. */
  const isWidgetSelection =
    selected !== null && selected.startsWith("widget:");
  const selectedWidgetId = isWidgetSelection ? selected!.slice(7) : null;
  const selectedWidget =
    selectedWidgetId !== null
      ? (content.customWidgets ?? []).find((w) => w.id === selectedWidgetId) ??
        null
      : null;

  function updateWidget(updated: WidgetInstance) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === updated.id ? updated : w))
    );
  }

  function patchContent(next: SiteContent) {
    setContent(next);
    setHasChanges(true);
  }

  function update<K extends keyof SiteContent>(
    section: K,
    patch: Partial<SiteContent[K]>
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

  const panelTitle = selected
    ? isWidgetSelection
      ? selectedWidget
        ? WIDGET_REGISTRY[selectedWidget.type].label
        : "ווידג'ט"
      : isTextElementKey(selected)
        ? TEXT_ELEMENTS[selected].label
        : isSectionElementKey(selected)
          ? SECTION_ELEMENTS[selected as SectionElementKey].label
          : ""
    : "";

  return (
    <div className="-m-6 flex h-[calc(100vh-50px)] flex-col bg-zinc-900 md:-m-10">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950 px-5 py-3">
        <div>
          <h1 className="text-base font-bold">עורך ויזואלי</h1>
          <p className="text-xs text-white/50">
            לחץ על אלמנט כדי לערוך · בסוף הדף הוסף ווידג'טים חדשים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/sites/${tenantSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 hover:border-[#C9A24A]/40 hover:text-[#C9A24A]"
          >
            <EyeIcon className="size-3.5" />
            דף ציבורי
            <ExternalLinkIcon className="size-3" />
          </a>
          <Button
            onClick={handleSave}
            disabled={isPending || !hasChanges}
            className="h-9 rounded-lg bg-[#C9A24A] px-4 text-sm font-bold text-black hover:bg-white disabled:opacity-50"
          >
            <SaveIcon className="size-4" />
            {isPending ? "שומר..." : hasChanges ? "שמור שינויים" : "נשמר"}
          </Button>
        </div>
      </div>

      {/* Preview-mode toolbar (shared) */}
      <div className="flex items-center justify-center gap-1 border-b border-white/10 bg-zinc-950/50 px-4 py-2.5">
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
          <button
            type="button"
            onClick={() => setPreviewMode("desktop")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              previewMode === "desktop"
                ? "bg-[#C9A24A] text-black"
                : "text-white/60 hover:text-white"
            }`}
            aria-label="תצוגת מחשב"
          >
            <MonitorIcon className="size-3.5" />
            מחשב
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("mobile")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              previewMode === "mobile"
                ? "bg-[#C9A24A] text-black"
                : "text-white/60 hover:text-white"
            }`}
            aria-label="תצוגת מובייל"
          >
            <SmartphoneIcon className="size-3.5" />
            מובייל
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Preview pane */}
        <div className="flex flex-1 flex-col overflow-hidden bg-zinc-900">
          {/* Scrollable preview area */}
          <div
            className="flex-1 overflow-y-auto p-6"
            onClick={() => setSelected(null)}
          >
            <div
              className={`mx-auto overflow-hidden border shadow-2xl shadow-black/40 transition-all duration-500 ${
                previewMode === "mobile"
                  ? "max-w-[400px] rounded-[2.5rem] border-zinc-700 ring-8 ring-zinc-800"
                  : "max-w-3xl rounded-2xl border-white/10"
              }`}
            >
              <LandingPreview
                content={content}
                selected={selected}
                onSelect={setSelected}
              />
              {/* רשימת ווידג'טים מותאמים + כפתור "+" — תמיד מוצגים בסוף הדף */}
              <WidgetListCanvas
                widgets={content.customWidgets ?? []}
                onChange={setWidgets}
                selectedWidgetId={selectedWidgetId}
                onSelect={(id) => setSelected(id ? `widget:${id}` : null)}
              />
            </div>
          </div>
        </div>

        {/* Side panel */}
        <aside className="flex w-[420px] shrink-0 flex-col border-r border-white/10 bg-zinc-950">
          {selected ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
                    עריכה
                  </div>
                  <div className="mt-0.5 text-base font-bold">{panelTitle}</div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex size-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white"
                  aria-label="סגור"
                >
                  <XIcon className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {/* WIDGET — settings פר-סוג */}
                {isWidgetSelection && selectedWidget && (
                  <WidgetSettings
                    widget={selectedWidget}
                    onChange={updateWidget}
                  />
                )}

                {/* TEXT element — full text + style controls */}
                {!isWidgetSelection && isTextElementKey(selected) && (
                  <TextStylePanel
                    elementKey={selected as TextElementKey}
                    content={content}
                    onChange={patchContent}
                  />
                )}

                {/* SECTION elements — list editors + special panels */}
                {selected === "section:hero.background" && (
                  <HeroFields
                    value={content.hero}
                    onChange={(v) => update("hero", v)}
                  />
                )}
                {selected === "section:meta" && (
                  <MetaFields
                    value={content.meta}
                    onChange={(v) => update("meta", v)}
                  />
                )}
                {selected === "section:contact" && (
                  <ContactFields
                    value={content.contact}
                    onChange={(v) => update("contact", v)}
                  />
                )}
                {selected === "section:pain.items" && (
                  <PainFields
                    value={content.pain}
                    onChange={(v) => update("pain", v)}
                  />
                )}
                {selected === "section:solution.steps" && (
                  <SolutionFields
                    value={content.solution}
                    onChange={(v) => update("solution", v)}
                  />
                )}
                {selected === "section:proof.stats" && (
                  <ProofFields
                    value={content.proof}
                    onChange={(v) => update("proof", v)}
                  />
                )}
                {selected === "section:gallery.items" && (
                  <GalleryFields
                    value={content.gallery}
                    onChange={(v) => update("gallery", v)}
                  />
                )}
                {selected === "section:ctaSection.bullets" && (
                  <CtaFields
                    value={content.ctaSection}
                    onChange={(v) => update("ctaSection", v)}
                  />
                )}
                {selected === "section:beforeAfter" && (
                  <BeforeAfterFields
                    value={content.beforeAfter}
                    onChange={(v) => update("beforeAfter", v)}
                  />
                )}
                {selected === "section:workPhotos" && (
                  <WorkPhotosFields
                    value={content.workPhotos}
                    onChange={(v) => update("workPhotos", v)}
                  />
                )}
                {selected === "section:marketingProcess" && (
                  <MarketingProcessFields
                    value={content.marketingProcess}
                    onChange={(v) => update("marketingProcess", v)}
                  />
                )}
                {selected === "section:tagline" && (
                  <TaglineFields
                    value={content.tagline}
                    onChange={(v) => update("tagline", v)}
                  />
                )}
                {selected === "section:whatsappProof" && (
                  <WhatsAppProofFields
                    value={content.whatsappProof}
                    onChange={(v) => update("whatsappProof", v)}
                  />
                )}
                {selected === "section:testimonials" && (
                  <TestimonialsFields
                    value={content.testimonials}
                    onChange={(v) => update("testimonials", v)}
                  />
                )}
              </div>
            </>
          ) : (
            <EmptyPanel />
          )}
        </aside>
      </div>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#C9A24A]/10 text-[#C9A24A]">
        <MousePointer2Icon className="size-6" />
      </div>
      <div>
        <h3 className="text-base font-bold">לחץ על פנסיל בתצוגה</h3>
        <p className="mt-1.5 text-sm text-white/55">
          ליד כל אלמנט בדף יש אייקון פנסיל זהוב.
          <br />
          לחיצה עליו פותחת את כל אפשרויות העריכה — טקסט, גודל, צבע, יישור ועוד.
        </p>
      </div>
      <div className="mt-4 grid w-full gap-1.5 text-right text-xs text-white/55">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          ✏️ <span className="font-bold text-white/85">טקסטים בודדים</span> —
          כותרות, פסקאות, כפתורים
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          ✏️ <span className="font-bold text-white/85">סקשנים עם רשימות</span>{" "}
          — כאבים, שלבים, תמונות
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          ✏️ <span className="font-bold text-white/85">תמונת רקע + SEO</span> —
          בפינות הדף
        </div>
      </div>
    </div>
  );
}
