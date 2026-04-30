"use client";

import Image from "next/image";
import {
  ArrowLeftIcon,
  CircleCheckIcon,
  HardHatIcon,
  ImageIcon,
  ListIcon,
  MessageCircleIcon,
} from "lucide-react";
import { type SiteContent, getElementCSS } from "@/lib/content";
import { painIcon, solutionIcon } from "@/lib/icon-map";
import { EditableElement } from "./editable-element";

type Props = {
  content: SiteContent;
  selected: string | null;
  onSelect: (key: string) => void;
};

/** Helper: מחזיר style object עבור text element */
function s(content: SiteContent, key: string) {
  return getElementCSS(content, key);
}

/**
 * תצוגה מקדימה של דף הנחיתה — כל אלמנט עם פנסיל לעריכה.
 */
export function LandingPreview({ content, selected, onSelect }: Props) {
  return (
    <div dir="rtl" className="@container bg-black text-white">
      {/* ============== HERO ============== */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden">
        {/* תמונת רקע — אלמנט בודד עם פנסיל בפינה */}
        <div className="absolute inset-0">
          <Image
            src={content.hero.backgroundImage}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover [filter:brightness(0.45)]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(201,162,74,0.18),transparent_55%)]" />
          {/* פנסיל לתמונת רקע — בפינה למעלה משמאל */}
          <div className="absolute top-3 left-3 z-20">
            <EditableElement
              elementKey="section:hero.background"
              selected={selected === "section:hero.background"}
              onSelect={onSelect}
              compact
              disableInner={false}
            >
              <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur">
                <ImageIcon className="size-3.5" />
                תמונת רקע
              </div>
            </EditableElement>
          </div>
        </div>

        <div className="relative w-full px-8 py-20 @[768px]:py-24">
          <div className="max-w-3xl space-y-5">
            <EditableElement
              elementKey="hero.badge"
              selected={selected === "hero.badge"}
              onSelect={onSelect}
              compact
              className="inline-block"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium tracking-wide text-white/85 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-[#C9A24A]" />
                <span style={s(content, "hero.badge")}>
                  {content.hero.badge}
                </span>
              </div>
            </EditableElement>

            <h1 className="text-balance text-3xl font-black leading-[1.1] tracking-tight @[768px]:text-5xl">
              <EditableElement
                elementKey="hero.headlineLine1"
                selected={selected === "hero.headlineLine1"}
                onSelect={onSelect}
                className="block"
              >
                <span className="block" style={s(content, "hero.headlineLine1")}>
                  {content.hero.headlineLine1}
                </span>
              </EditableElement>
              <EditableElement
                elementKey="hero.headlineLine2"
                selected={selected === "hero.headlineLine2"}
                onSelect={onSelect}
                className="mt-2 block"
              >
                <span
                  className="block text-[#C9A24A]"
                  style={s(content, "hero.headlineLine2")}
                >
                  {content.hero.headlineLine2}
                </span>
              </EditableElement>
            </h1>

            <EditableElement
              elementKey="hero.subheadline"
              selected={selected === "hero.subheadline"}
              onSelect={onSelect}
              className="block max-w-xl"
            >
              <p
                className="text-balance text-base leading-relaxed text-white/75 @[768px]:text-lg"
                style={s(content, "hero.subheadline")}
              >
                {content.hero.subheadline}
              </p>
            </EditableElement>

            <EditableElement
              elementKey="hero.primaryCta"
              selected={selected === "hero.primaryCta"}
              onSelect={onSelect}
              compact
              className="inline-block"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[#C9A24A] px-7 py-3 text-base font-bold text-black shadow-2xl shadow-[#C9A24A]/30">
                <span style={s(content, "hero.primaryCta")}>
                  {content.hero.primaryCta}
                </span>
                <ArrowLeftIcon className="size-5" />
              </div>
            </EditableElement>
          </div>
        </div>
      </section>

      {/* ============== PAIN ============== */}
      <section className="border-y border-white/[0.08] bg-zinc-950 py-16 @[768px]:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 space-y-3 text-center">
            <EditableElement
              elementKey="pain.kicker"
              selected={selected === "pain.kicker"}
              onSelect={onSelect}
              compact
              className="inline-block"
            >
              <div
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A]"
                style={s(content, "pain.kicker")}
              >
                {content.pain.kicker}
              </div>
            </EditableElement>
            <EditableElement
              elementKey="pain.title"
              selected={selected === "pain.title"}
              onSelect={onSelect}
            >
              <h2
                className="text-balance text-3xl font-black leading-[1.1] tracking-tight @[768px]:text-4xl"
                style={s(content, "pain.title")}
              >
                {content.pain.title}
              </h2>
            </EditableElement>
          </div>

          {/* Pain items — section-level pencil (list editor) */}
          <EditableElement
            elementKey="section:pain.items"
            selected={selected === "section:pain.items"}
            onSelect={onSelect}
          >
            <ul className="grid gap-3">
              {content.pain.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A24A]/15 text-[#C9A24A]">
                    {painIcon(item.iconName, "size-5")}
                  </span>
                  <span className="text-sm font-medium text-white/90 @[768px]:text-base">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </EditableElement>
        </div>
      </section>

      {/* ============== שבירת אמונה ============== */}
      <section className="relative overflow-hidden py-20 @[768px]:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,162,74,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl space-y-6 px-6 text-center">
          <h2 className="text-balance text-4xl font-black leading-[1.05] tracking-tight @[768px]:text-5xl">
            <EditableElement
              elementKey="beliefBreaker.titleBefore"
              selected={selected === "beliefBreaker.titleBefore"}
              onSelect={onSelect}
              className="inline-block"
            >
              <span style={s(content, "beliefBreaker.titleBefore")}>
                {content.beliefBreaker.titleBefore}
              </span>
            </EditableElement>{" "}
            <EditableElement
              elementKey="beliefBreaker.titleHighlight"
              selected={selected === "beliefBreaker.titleHighlight"}
              onSelect={onSelect}
              className="inline-block"
            >
              <span
                className="text-[#C9A24A]"
                style={s(content, "beliefBreaker.titleHighlight")}
              >
                {content.beliefBreaker.titleHighlight}
              </span>
            </EditableElement>
          </h2>
          <EditableElement
            elementKey="beliefBreaker.paragraph1"
            selected={selected === "beliefBreaker.paragraph1"}
            onSelect={onSelect}
            className="mx-auto block max-w-2xl"
          >
            <p
              className="text-base leading-relaxed text-white/70 @[768px]:text-lg"
              style={s(content, "beliefBreaker.paragraph1")}
            >
              {content.beliefBreaker.paragraph1}
            </p>
          </EditableElement>
          <EditableElement
            elementKey="beliefBreaker.paragraph2"
            selected={selected === "beliefBreaker.paragraph2"}
            onSelect={onSelect}
            className="mx-auto block max-w-2xl"
          >
            <p
              className="text-base font-semibold leading-relaxed text-white @[768px]:text-lg"
              style={s(content, "beliefBreaker.paragraph2")}
            >
              {content.beliefBreaker.paragraph2}
            </p>
          </EditableElement>
        </div>
      </section>

      {/* ============== הפתרון ============== */}
      <section className="border-y border-white/[0.08] bg-zinc-950 py-16 @[768px]:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 space-y-3 text-center">
            <EditableElement
              elementKey="solution.kicker"
              selected={selected === "solution.kicker"}
              onSelect={onSelect}
              compact
              className="inline-block"
            >
              <div
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A]"
                style={s(content, "solution.kicker")}
              >
                {content.solution.kicker}
              </div>
            </EditableElement>
            <h2 className="text-balance text-3xl font-black leading-[1.1] tracking-tight @[768px]:text-4xl">
              <EditableElement
                elementKey="solution.titleBefore"
                selected={selected === "solution.titleBefore"}
                onSelect={onSelect}
                className="inline-block"
              >
                <span style={s(content, "solution.titleBefore")}>
                  {content.solution.titleBefore}
                </span>
              </EditableElement>{" "}
              <EditableElement
                elementKey="solution.titleHighlight"
                selected={selected === "solution.titleHighlight"}
                onSelect={onSelect}
                className="inline-block"
              >
                <span
                  className="text-[#C9A24A]"
                  style={s(content, "solution.titleHighlight")}
                >
                  {content.solution.titleHighlight}
                </span>
              </EditableElement>
            </h2>
          </div>

          {/* Steps list */}
          <EditableElement
            elementKey="section:solution.steps"
            selected={selected === "section:solution.steps"}
            onSelect={onSelect}
          >
            <div className="grid gap-8 @[768px]:grid-cols-3">
              {content.solution.steps.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex size-12 items-center justify-center rounded-full border border-[#C9A24A]/40 bg-zinc-950 text-[#C9A24A]">
                    {solutionIcon(step.iconName, "size-5")}
                  </div>
                  <div className="mt-4 text-xs font-bold tracking-[0.3em] text-[#C9A24A]">
                    {step.num}
                  </div>
                  <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== BEFORE / AFTER (preview placeholder) ============== */}
      <section className="bg-[#FAF9F6] py-12 text-zinc-900">
        <div className="mx-auto max-w-5xl px-6">
          <EditableElement
            elementKey="section:beforeAfter"
            selected={selected === "section:beforeAfter"}
            onSelect={onSelect}
          >
            <div className="text-center">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#A07820]">
                {content.beforeAfter.kicker}
              </div>
              <h2 className="text-2xl font-black @[768px]:text-3xl">
                {content.beforeAfter.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                {content.beforeAfter.subtitle}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {content.beforeAfter.items.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-lg bg-zinc-200"
                  >
                    {item.before && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.before}
                        alt=""
                        className="aspect-square object-cover"
                      />
                    )}
                    {item.after && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.after}
                        alt=""
                        className="aspect-square object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== WORK PHOTOS (preview) ============== */}
      <section className="bg-white py-12 text-zinc-900">
        <div className="mx-auto max-w-5xl px-6">
          <EditableElement
            elementKey="section:workPhotos"
            selected={selected === "section:workPhotos"}
            onSelect={onSelect}
          >
            <div className="text-center">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-zinc-700">
                {content.workPhotos.kicker}
              </div>
              <h2 className="text-2xl font-black @[768px]:text-3xl">
                {content.workPhotos.title}
              </h2>
              <div className="mt-4 grid grid-cols-4 gap-1.5">
                {content.workPhotos.items.slice(0, 4).map((p, i) =>
                  p.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={p.src}
                      alt=""
                      className="aspect-[4/5] rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      key={i}
                      className="aspect-[4/5] rounded-lg bg-zinc-200"
                    />
                  )
                )}
              </div>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== MARKETING PROCESS (preview) ============== */}
      <section className="bg-zinc-950 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <EditableElement
            elementKey="section:marketingProcess"
            selected={selected === "section:marketingProcess"}
            onSelect={onSelect}
          >
            <div className="text-center text-white">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#C9A24A]">
                {content.marketingProcess.kicker}
              </div>
              <h2 className="text-2xl font-black @[768px]:text-3xl">
                {content.marketingProcess.title}
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {content.marketingProcess.items.slice(0, 6).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-right"
                  >
                    <div className="text-xs font-bold text-white">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== TAGLINE (preview) ============== */}
      <section className="bg-[#FAF9F6] py-10 text-zinc-900">
        <div className="mx-auto max-w-3xl px-6">
          <EditableElement
            elementKey="section:tagline"
            selected={selected === "section:tagline"}
            onSelect={onSelect}
          >
            <div className="text-center">
              <p className="text-xl font-black leading-tight @[768px]:text-2xl">
                {content.tagline.line1}
              </p>
              <p
                className="mt-1 text-xl font-black leading-tight @[768px]:text-2xl"
                style={{ color: "#A07820" }}
              >
                {content.tagline.line2}
              </p>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== WHATSAPP PROOF (preview) ============== */}
      <section className="bg-zinc-50 py-12 text-zinc-900">
        <div className="mx-auto max-w-5xl px-6">
          <EditableElement
            elementKey="section:whatsappProof"
            selected={selected === "section:whatsappProof"}
            onSelect={onSelect}
          >
            <div className="text-center">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#075E54]">
                {content.whatsappProof.kicker}
              </div>
              <h2 className="text-2xl font-black @[768px]:text-3xl">
                {content.whatsappProof.title}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2 text-right">
                {content.whatsappProof.messages.slice(0, 4).map((m, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-zinc-200 bg-white p-3"
                  >
                    <div className="text-xs font-bold text-[#075E54]">
                      {m.name}
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-zinc-700">
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== הוכחה ============== */}
      <section className="border-b border-white/[0.08] py-16 @[768px]:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 space-y-3 text-center">
            <EditableElement
              elementKey="proof.kicker"
              selected={selected === "proof.kicker"}
              onSelect={onSelect}
              compact
              className="inline-block"
            >
              <div
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A]"
                style={s(content, "proof.kicker")}
              >
                {content.proof.kicker}
              </div>
            </EditableElement>
            <EditableElement
              elementKey="proof.title"
              selected={selected === "proof.title"}
              onSelect={onSelect}
            >
              <h2
                className="text-balance text-3xl font-black tracking-tight @[768px]:text-4xl"
                style={s(content, "proof.title")}
              >
                {content.proof.title}
              </h2>
            </EditableElement>
          </div>

          {/* Stats list */}
          <EditableElement
            elementKey="section:proof.stats"
            selected={selected === "section:proof.stats"}
            onSelect={onSelect}
          >
            <div
              className={`grid gap-px overflow-hidden rounded-2xl bg-white/10 @[768px]:grid-cols-${Math.min(
                content.proof.stats.length,
                3
              )}`}
            >
              {content.proof.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center bg-black px-6 py-10 text-center @[768px]:py-14"
                >
                  <div className="text-5xl font-black tracking-tight text-[#C9A24A] @[768px]:text-6xl">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-white/55">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== TESTIMONIALS (preview) ============== */}
      <section className="bg-[#FAF9F6] py-12 text-zinc-900">
        <div className="mx-auto max-w-5xl px-6">
          <EditableElement
            elementKey="section:testimonials"
            selected={selected === "section:testimonials"}
            onSelect={onSelect}
          >
            <div className="text-center">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#A07820]">
                {content.testimonials.kicker}
              </div>
              <h2 className="text-2xl font-black @[768px]:text-3xl">
                {content.testimonials.title}
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {content.testimonials.items.slice(0, 3).map((t, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-zinc-200 bg-white p-3 text-right"
                  >
                    <div className="text-xs italic text-zinc-700 line-clamp-2">
                      &ldquo;{t.quote}&rdquo;
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-zinc-900">
                        {t.name}
                      </span>
                      <span className="text-[#A07820]">
                        {t.before}→{t.after}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== גלריה ============== */}
      <section className="border-b border-white/[0.08] bg-zinc-950 py-16 @[768px]:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 space-y-3 text-center">
            <EditableElement
              elementKey="gallery.kicker"
              selected={selected === "gallery.kicker"}
              onSelect={onSelect}
              compact
              className="inline-block"
            >
              <div
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A]"
                style={s(content, "gallery.kicker")}
              >
                {content.gallery.kicker}
              </div>
            </EditableElement>
            <EditableElement
              elementKey="gallery.title"
              selected={selected === "gallery.title"}
              onSelect={onSelect}
            >
              <h2
                className="text-balance text-3xl font-black tracking-tight @[768px]:text-4xl"
                style={s(content, "gallery.title")}
              >
                {content.gallery.title}
              </h2>
            </EditableElement>
            <EditableElement
              elementKey="gallery.subtitle"
              selected={selected === "gallery.subtitle"}
              onSelect={onSelect}
            >
              <p
                className="text-sm text-white/55"
                style={s(content, "gallery.subtitle")}
              >
                {content.gallery.subtitle}
              </p>
            </EditableElement>
          </div>

          {/* Gallery items */}
          <EditableElement
            elementKey="section:gallery.items"
            selected={selected === "section:gallery.items"}
            onSelect={onSelect}
          >
            <div className="grid gap-3 @[768px]:grid-cols-3">
              {content.gallery.items.map((img, i) => (
                <figure
                  key={`${img.src}-${i}`}
                  className={`relative overflow-hidden rounded-2xl bg-black ${
                    i === 0 ? "@[768px]:col-span-2 @[768px]:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      i === 0
                        ? "aspect-[4/5] @[768px]:aspect-auto @[768px]:h-full"
                        : "aspect-[4/5]"
                    }`}
                  >
                    {img.src && (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80" />
                    <figcaption className="absolute bottom-3 right-3 text-xs font-semibold tracking-wide text-white">
                      {img.label}
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== בידול ============== */}
      <section className="py-20 @[768px]:py-24">
        <div className="mx-auto max-w-3xl space-y-5 px-6 text-center">
          <EditableElement
            elementKey="differentiator.kicker"
            selected={selected === "differentiator.kicker"}
            onSelect={onSelect}
            compact
            className="inline-block"
          >
            <div
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A]"
              style={s(content, "differentiator.kicker")}
            >
              {content.differentiator.kicker}
            </div>
          </EditableElement>
          <EditableElement
            elementKey="differentiator.title"
            selected={selected === "differentiator.title"}
            onSelect={onSelect}
          >
            <h2
              className="text-balance text-3xl font-black leading-[1.05] tracking-tight @[768px]:text-5xl"
              style={s(content, "differentiator.title")}
            >
              {content.differentiator.title}
            </h2>
          </EditableElement>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 @[768px]:text-lg">
            <EditableElement
              elementKey="differentiator.paragraph1Before"
              selected={selected === "differentiator.paragraph1Before"}
              onSelect={onSelect}
              className="inline-block"
            >
              <span style={s(content, "differentiator.paragraph1Before")}>
                {content.differentiator.paragraph1Before}
              </span>
            </EditableElement>{" "}
            <EditableElement
              elementKey="differentiator.paragraph1Highlight"
              selected={selected === "differentiator.paragraph1Highlight"}
              onSelect={onSelect}
              className="inline-block"
            >
              <span
                className="font-semibold text-white"
                style={s(content, "differentiator.paragraph1Highlight")}
              >
                {content.differentiator.paragraph1Highlight}
              </span>
            </EditableElement>
          </p>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 @[768px]:text-lg">
            <EditableElement
              elementKey="differentiator.paragraph2Before"
              selected={selected === "differentiator.paragraph2Before"}
              onSelect={onSelect}
              className="inline-block"
            >
              <span style={s(content, "differentiator.paragraph2Before")}>
                {content.differentiator.paragraph2Before}
              </span>
            </EditableElement>{" "}
            <EditableElement
              elementKey="differentiator.paragraph2Highlight"
              selected={selected === "differentiator.paragraph2Highlight"}
              onSelect={onSelect}
              className="inline-block"
            >
              <span
                className="font-semibold text-white"
                style={s(content, "differentiator.paragraph2Highlight")}
              >
                {content.differentiator.paragraph2Highlight}
              </span>
            </EditableElement>
          </p>
        </div>
      </section>

      {/* ============== CTA + Form ============== */}
      <section className="relative overflow-hidden border-t border-white/[0.08] bg-zinc-950 py-16 @[768px]:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(201,162,74,0.18),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-6 @[768px]:grid-cols-2">
          <div className="space-y-4">
            <EditableElement
              elementKey="ctaSection.kicker"
              selected={selected === "ctaSection.kicker"}
              onSelect={onSelect}
              compact
              className="inline-block"
            >
              <div
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A]"
                style={s(content, "ctaSection.kicker")}
              >
                {content.ctaSection.kicker}
              </div>
            </EditableElement>
            <h2 className="text-balance text-3xl font-black leading-[1.05] tracking-tight @[768px]:text-4xl">
              <EditableElement
                elementKey="ctaSection.titleBefore"
                selected={selected === "ctaSection.titleBefore"}
                onSelect={onSelect}
                className="inline-block"
              >
                <span style={s(content, "ctaSection.titleBefore")}>
                  {content.ctaSection.titleBefore}
                </span>
              </EditableElement>
              <EditableElement
                elementKey="ctaSection.titleHighlight"
                selected={selected === "ctaSection.titleHighlight"}
                onSelect={onSelect}
                className="inline-block"
              >
                <span
                  className="text-[#C9A24A]"
                  style={s(content, "ctaSection.titleHighlight")}
                >
                  {content.ctaSection.titleHighlight}
                </span>
              </EditableElement>
            </h2>
            <EditableElement
              elementKey="ctaSection.description"
              selected={selected === "ctaSection.description"}
              onSelect={onSelect}
              className="block max-w-md"
            >
              <p
                className="text-base leading-relaxed text-white/65"
                style={s(content, "ctaSection.description")}
              >
                {content.ctaSection.description}
              </p>
            </EditableElement>

            {/* Bullets — section pencil */}
            <EditableElement
              elementKey="section:ctaSection.bullets"
              selected={selected === "section:ctaSection.bullets"}
              onSelect={onSelect}
            >
              <div className="space-y-3 pt-3">
                {content.ctaSection.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-2.5">
                    <div className="flex size-6 items-center justify-center rounded-full bg-[#C9A24A]">
                      <CircleCheckIcon className="size-3.5 text-black" />
                    </div>
                    <span className="text-sm font-medium text-white/90">
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </EditableElement>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/60 p-6">
            <FieldMock label="שם מלא" />
            <FieldMock label="טלפון" />
            <FieldMock label="אזור פעילות" />
            <EditableElement
              elementKey="ctaSection.formButtonText"
              selected={selected === "ctaSection.formButtonText"}
              onSelect={onSelect}
              className="mt-2 block"
            >
              <div className="flex items-center justify-center rounded-xl bg-[#C9A24A] py-3 text-sm font-bold text-black">
                <span style={s(content, "ctaSection.formButtonText")}>
                  {content.ctaSection.formButtonText}
                </span>
              </div>
            </EditableElement>
          </div>
        </div>
      </section>

      {/* ============== Footer ============== */}
      <footer className="bg-black py-8 text-white/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 text-sm">
          <EditableElement
            elementKey="meta.brandName"
            selected={selected === "meta.brandName"}
            onSelect={onSelect}
            compact
            className="inline-block"
          >
            <div className="flex items-center gap-2">
              <HardHatIcon className="size-4 text-[#C9A24A]" />
              <span
                className="font-bold tracking-wide text-white"
                style={s(content, "meta.brandName")}
              >
                {content.meta.brandName}
              </span>
            </div>
          </EditableElement>

          {/* Meta SEO — section */}
          <EditableElement
            elementKey="section:meta"
            selected={selected === "section:meta"}
            onSelect={onSelect}
            compact
            disableInner={false}
          >
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium">
              <ListIcon className="size-3" />
              SEO + מטא
            </div>
          </EditableElement>

          {/* Contact / WhatsApp — section */}
          <EditableElement
            elementKey="section:contact"
            selected={selected === "section:contact"}
            onSelect={onSelect}
            compact
            disableInner={false}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 px-3 py-1.5 text-xs font-semibold text-[#25D366]">
              <MessageCircleIcon className="size-3.5" />
              {content.contact.whatsappNumber}
            </div>
          </EditableElement>
        </div>
      </footer>
    </div>
  );
}

function FieldMock({ label }: { label: string }) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-medium text-white/70">{label}</div>
      <div className="h-10 rounded-lg border border-white/15 bg-white/5" />
    </div>
  );
}
