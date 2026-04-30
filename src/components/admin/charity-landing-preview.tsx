"use client";

import Image from "next/image";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  HeartIcon,
  ImageIcon,
  ListIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  PlayCircleIcon,
  PlayIcon,
  ShieldCheckIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";
import type { CharitySiteContent } from "@/lib/charity-content";
import { getElementCSS } from "@/lib/content";
import { EditableElement } from "./editable-element";

const BLUE = "#2F5D8C";
const RED = "#E53935";
const YELLOW = "#F4C542";

type Props = {
  content: CharitySiteContent;
  selected: string | null;
  onSelect: (key: string) => void;
};

/** Helper: מחזיר style object עבור text element */
function s(content: CharitySiteContent, key: string) {
  return getElementCSS(content, key);
}

/**
 * תצוגה מקדימה של דף העמותה — כל אלמנט עם פנסיל לעריכה.
 * אנימציות מנוטרלות (Typewriter סטטי, וידאו עם poster בלבד).
 */
export function CharityLandingPreview({
  content,
  selected,
  onSelect,
}: Props) {
  return (
    <div dir="rtl" style={{ color: "#1A1A1A" }} className="@container bg-white">
      {/* ============== TOP BANNER ============== */}
      {content.meta.topBanner && (
        <EditableElement
          elementKey="section:meta"
          selected={selected === "section:meta"}
          onSelect={onSelect}
        >
          <div className="relative w-full overflow-hidden bg-black">
            <Image
              src={content.meta.topBanner}
              alt={content.meta.brandName}
              width={1672}
              height={941}
              priority
              sizes="100vw"
              className="block h-auto w-full"
            />
          </div>
        </EditableElement>
      )}

      {/* ============== HERO SPLIT ============== */}
      <section
        className="relative min-h-[700px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F9FBFF 0%, #EEF3F8 100%)",
        }}
      >
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 @[768px]:grid-cols-2 @[768px]:gap-12">
          {/* Side media */}
          <EditableElement
            elementKey="section:hero.media"
            selected={selected === "section:hero.media"}
            onSelect={onSelect}
            className="order-2 @[768px]:order-1"
          >
            <div className="relative aspect-[5/6] overflow-hidden rounded-3xl bg-zinc-200 shadow-xl">
              <Image
                src={content.hero.sideMediaPoster || content.hero.sideMedia}
                alt={content.meta.brandName}
                fill
                sizes="50vw"
                className="object-cover"
                unoptimized
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              {content.hero.sideMediaType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-white/30 backdrop-blur">
                    <PlayIcon className="size-5 fill-white text-white" />
                  </div>
                </div>
              )}
            </div>
          </EditableElement>

          {/* Content */}
          <div className="order-1 @[768px]:order-2 space-y-5">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest"
              style={{
                background: `${BLUE}10`,
                color: BLUE,
                border: `1px solid ${BLUE}25`,
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: RED }}
              />
              <EditableElement
                elementKey="meta.brandName"
                selected={selected === "meta.brandName"}
                onSelect={onSelect}
                compact
                className="inline-block"
              >
                <span style={s(content, "meta.brandName")}>
                  {content.meta.brandName}
                </span>
              </EditableElement>
              <span>·</span>
              <EditableElement
                elementKey="meta.brandTagline"
                selected={selected === "meta.brandTagline"}
                onSelect={onSelect}
                compact
                className="inline-block"
              >
                <span style={s(content, "meta.brandTagline")}>
                  {content.meta.brandTagline}
                </span>
              </EditableElement>
            </div>

            {/* Typewriter — סטטי בתצוגה */}
            <h1
              className="text-balance text-2xl font-black leading-[1.15] tracking-tight @[640px]:text-3xl @[768px]:text-5xl"
              style={{ color: "#0F1B2D" }}
            >
              <EditableElement
                elementKey="hero.typewriterPhase3"
                selected={selected === "hero.typewriterPhase3"}
                onSelect={onSelect}
                className="block"
              >
                <span style={s(content, "hero.typewriterPhase3")}>
                  {content.hero.typewriterPhase3}
                </span>
              </EditableElement>
            </h1>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 @[640px]:flex-row">
              <EditableElement
                elementKey="donate.primaryCta"
                selected={selected === "donate.primaryCta"}
                onSelect={onSelect}
                className="inline-block"
              >
                <div
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${RED}, #C62828)`,
                  }}
                >
                  <span style={s(content, "donate.primaryCta")}>
                    {content.donate.primaryCta}
                  </span>
                  <ArrowLeftIcon className="size-5" />
                </div>
              </EditableElement>
              <EditableElement
                elementKey="donate.secondaryCta"
                selected={selected === "donate.secondaryCta"}
                onSelect={onSelect}
                className="inline-block"
              >
                <div
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-bold"
                  style={{ color: BLUE, borderColor: `${BLUE}40` }}
                >
                  <PlayCircleIcon className="size-4" />
                  <span style={s(content, "donate.secondaryCta")}>
                    {content.donate.secondaryCta}
                  </span>
                </div>
              </EditableElement>
            </div>

            {/* Hero typewriter phase 1 + 2 (לעריכה) */}
            <div className="grid gap-2 rounded-xl border border-zinc-200 bg-white/50 p-3 text-xs text-zinc-500">
              <div>פאזות Typewriter (יוצגו ראשונות):</div>
              <EditableElement
                elementKey="hero.typewriterPhase1"
                selected={selected === "hero.typewriterPhase1"}
                onSelect={onSelect}
                compact
                className="inline-block"
              >
                <span style={s(content, "hero.typewriterPhase1")}>
                  פאזה 1: {content.hero.typewriterPhase1}
                </span>
              </EditableElement>
              <EditableElement
                elementKey="hero.typewriterPhase2"
                selected={selected === "hero.typewriterPhase2"}
                onSelect={onSelect}
                compact
                className="inline-block"
              >
                <span style={s(content, "hero.typewriterPhase2")}>
                  פאזה 2: {content.hero.typewriterPhase2}
                </span>
              </EditableElement>
            </div>
          </div>
        </div>
      </section>

      {/* ============== REELS ============== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center space-y-3">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
              style={{ background: `${BLUE}10`, color: BLUE }}
            >
              <SparklesIcon className="size-3.5" />
              וידאו
            </div>
            <EditableElement
              elementKey="reels.title"
              selected={selected === "reels.title"}
              onSelect={onSelect}
            >
              <h2
                className="text-balance text-3xl font-black tracking-tight @[768px]:text-4xl"
                style={s(content, "reels.title")}
              >
                {content.reels.title}
              </h2>
            </EditableElement>
          </div>

          <EditableElement
            elementKey="section:reels.items"
            selected={selected === "section:reels.items"}
            onSelect={onSelect}
          >
            <div className="flex gap-3 overflow-x-auto pb-3">
              {content.reels.items.slice(0, 4).map((reel, i) => (
                <div
                  key={i}
                  className="relative aspect-[9/16] w-[180px] shrink-0 overflow-hidden rounded-2xl bg-zinc-900 shadow-md"
                >
                  {reel.poster && (
                    <Image
                      src={reel.poster}
                      alt={reel.overlayText}
                      fill
                      sizes="180px"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                  <p className="absolute right-3 bottom-12 left-3 text-xs font-black text-white">
                    {reel.overlayText}
                  </p>
                  <div
                    className="absolute right-3 bottom-3 left-3 rounded-lg py-2 text-center text-xs font-black text-white"
                    style={{ background: RED }}
                  >
                    {reel.cta}
                  </div>
                </div>
              ))}
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== STORY ============== */}
      <section
        className="relative overflow-hidden py-20"
        style={{
          background: content.story.bgImage
            ? `linear-gradient(180deg, rgba(10,18,35,0.78), rgba(15,30,55,0.85)), url(${content.story.bgImage}) center/cover`
            : "linear-gradient(180deg, #F9FBFF 0%, #EEF3F8 100%)",
        }}
      >
        <div
          className={`relative mx-auto max-w-3xl px-6 text-center ${
            content.story.bgImage ? "text-white" : "text-zinc-900"
          }`}
        >
          <EditableElement
            elementKey="story.kicker"
            selected={selected === "story.kicker"}
            onSelect={onSelect}
            compact
            className="inline-block"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest backdrop-blur-md"
              style={
                content.story.bgImage
                  ? {
                      background: "rgba(255,255,255,0.12)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }
                  : { background: `${BLUE}10`, color: BLUE }
              }
            >
              <HeartIcon className="size-3.5" style={{ color: RED }} />
              <span style={s(content, "story.kicker")}>
                {content.story.kicker}
              </span>
            </div>
          </EditableElement>

          <EditableElement
            elementKey="section:story.body"
            selected={selected === "section:story.body"}
            onSelect={onSelect}
            className="mt-8 block"
          >
            <div className="space-y-5">
              {content.story.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-balance leading-[1.85] ${
                    i === 0 ? "text-2xl font-black" : "text-lg font-medium"
                  }`}
                  style={
                    content.story.bgImage
                      ? {
                          color:
                            i === 0
                              ? "#FFFFFF"
                              : "rgba(255,255,255,0.92)",
                        }
                      : { color: i === 0 ? "#1A1A1A" : "#3A3A3A" }
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </EditableElement>

          <EditableElement
            elementKey="story.cta"
            selected={selected === "story.cta"}
            onSelect={onSelect}
            className="mt-8 inline-block"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-black text-white"
              style={{
                background: `linear-gradient(135deg, ${RED}, #C62828)`,
              }}
            >
              <HeartIcon className="size-4 fill-white" />
              <span style={s(content, "story.cta")}>{content.story.cta}</span>
              <ArrowLeftIcon className="size-4" />
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== GALLERY ============== */}
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center space-y-3">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
              style={{ background: `${YELLOW}25`, color: "#7A5A00" }}
            >
              גלריה
            </div>
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
                className="text-base text-zinc-600 @[768px]:text-lg"
                style={s(content, "gallery.subtitle")}
              >
                {content.gallery.subtitle}
              </p>
            </EditableElement>
          </div>

          <EditableElement
            elementKey="section:gallery.items"
            selected={selected === "section:gallery.items"}
            onSelect={onSelect}
          >
            <div className="grid grid-cols-3 gap-2">
              {content.gallery.items.slice(0, 6).map((img, i) => (
                <div
                  key={`${img.src}-${i}`}
                  className="relative aspect-square overflow-hidden rounded-xl bg-zinc-200"
                >
                  {img.src && (
                    <Image
                      src={img.src}
                      alt={img.caption}
                      fill
                      sizes="(max-width: 768px) 33vw, 200px"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
              ))}
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== IMPACT ============== */}
      <section
        className="relative overflow-hidden py-16 text-white"
        style={{
          background: content.impact.bgImage
            ? `linear-gradient(135deg, rgba(15,30,55,0.88), rgba(31,63,96,0.85)), url(${content.impact.bgImage}) center/cover`
            : `linear-gradient(135deg, ${BLUE} 0%, #1F3F60 100%)`,
        }}
      >
        <div className="relative mx-auto max-w-6xl px-6">
          <EditableElement
            elementKey="impact.title"
            selected={selected === "impact.title"}
            onSelect={onSelect}
          >
            <h2
              className="text-balance text-center text-3xl font-black tracking-tight @[768px]:text-4xl"
              style={s(content, "impact.title")}
            >
              {content.impact.title}
            </h2>
          </EditableElement>

          <EditableElement
            elementKey="section:impact.numbers"
            selected={selected === "section:impact.numbers"}
            onSelect={onSelect}
            className="mt-8 block"
          >
            <div
              className={`grid gap-6 ${
                content.impact.counters.length <= 3
                  ? "@[768px]:grid-cols-3"
                  : "@[768px]:grid-cols-4"
              }`}
            >
              {content.impact.counters.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-4xl font-black @[768px]:text-5xl">
                    {c.value}
                    {c.suffix}
                  </div>
                  <div className="mt-2 text-sm font-bold uppercase tracking-widest opacity-90">
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== DONATION CARDS ============== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center space-y-3">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
              style={{ background: `${RED}10`, color: RED }}
            >
              <HeartIcon className="size-3.5" />
              לתרומה
            </div>
            <EditableElement
              elementKey="donationCards.title"
              selected={selected === "donationCards.title"}
              onSelect={onSelect}
            >
              <h2
                className="text-balance text-3xl font-black tracking-tight @[768px]:text-4xl"
                style={s(content, "donationCards.title")}
              >
                {content.donationCards.title}
              </h2>
            </EditableElement>
            <EditableElement
              elementKey="donationCards.subtitle"
              selected={selected === "donationCards.subtitle"}
              onSelect={onSelect}
            >
              <p
                className="text-base text-zinc-600"
                style={s(content, "donationCards.subtitle")}
              >
                {content.donationCards.subtitle}
              </p>
            </EditableElement>
          </div>

          <EditableElement
            elementKey="section:donationCards.cards"
            selected={selected === "section:donationCards.cards"}
            onSelect={onSelect}
          >
            <div className="grid gap-4 @[768px]:grid-cols-3">
              {content.donationCards.cards.map((card) => (
                <div
                  key={card.amount}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 text-center"
                >
                  <div
                    className="mx-auto flex size-12 items-center justify-center rounded-xl text-white"
                    style={{
                      background: `linear-gradient(135deg, ${RED}, #C62828)`,
                    }}
                  >
                    <HeartIcon className="size-5 fill-white" />
                  </div>
                  <div
                    className="mt-3 text-3xl font-black"
                    style={{ color: RED }}
                  >
                    ₪{card.amount}
                  </div>
                  <div className="mt-1 text-sm font-bold text-zinc-900">
                    {card.title}
                  </div>
                  <div className="text-xs text-zinc-600">
                    {card.description}
                  </div>
                </div>
              ))}
            </div>
          </EditableElement>

          <div className="mt-6 text-center">
            <EditableElement
              elementKey="donationCards.customLabel"
              selected={selected === "donationCards.customLabel"}
              onSelect={onSelect}
              className="inline-block"
            >
              <span
                className="text-sm font-bold underline-offset-4 hover:underline"
                style={{ color: BLUE, ...s(content, "donationCards.customLabel") }}
              >
                {content.donationCards.customLabel}
              </span>
            </EditableElement>
          </div>
        </div>
      </section>

      {/* ============== URGENCY ============== */}
      <section
        className="relative overflow-hidden bg-zinc-950 py-16 text-white"
        style={
          content.urgency.bgImage
            ? {
                background: `linear-gradient(135deg, rgba(20,30,55,0.88), rgba(40,15,15,0.92)), url(${content.urgency.bgImage}) center/cover`,
              }
            : undefined
        }
      >
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
            style={{ background: `${RED}33`, color: "#FCA5A5" }}
          >
            <span
              className="size-1.5 rounded-full"
              style={{ background: "#FCA5A5" }}
            />
            דחוף
          </div>
          <EditableElement
            elementKey="urgency.title"
            selected={selected === "urgency.title"}
            onSelect={onSelect}
          >
            <h2
              className="text-balance text-3xl font-black @[768px]:text-4xl"
              style={s(content, "urgency.title")}
            >
              {content.urgency.title}
            </h2>
          </EditableElement>
          <EditableElement
            elementKey="urgency.subtitle"
            selected={selected === "urgency.subtitle"}
            onSelect={onSelect}
            className="mt-3 block"
          >
            <p
              className="text-base opacity-90"
              style={s(content, "urgency.subtitle")}
            >
              {content.urgency.subtitle}
            </p>
          </EditableElement>

          <EditableElement
            elementKey="section:urgency.numbers"
            selected={selected === "section:urgency.numbers"}
            onSelect={onSelect}
            className="mt-6 block"
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-baseline justify-between">
                <span>נאסף עד כה</span>
                <span className="text-2xl font-black">
                  ₪{content.urgency.raised.toLocaleString("he-IL")}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to left, ${YELLOW}, #FFE08A)`,
                    width: `${Math.min(
                      100,
                      Math.round(
                        (content.urgency.raised / content.urgency.goal) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
              <div className="flex items-baseline justify-between text-xs opacity-85">
                <span>יעד: ₪{content.urgency.goal.toLocaleString("he-IL")}</span>
                <span>עד {content.urgency.deadline}</span>
              </div>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== BIG VIDEO ============== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 text-center space-y-2">
            <EditableElement
              elementKey="bigVideo.title"
              selected={selected === "bigVideo.title"}
              onSelect={onSelect}
            >
              <h2
                className="text-balance text-3xl font-black tracking-tight @[768px]:text-4xl"
                style={s(content, "bigVideo.title")}
              >
                {content.bigVideo.title}
              </h2>
            </EditableElement>
            <EditableElement
              elementKey="bigVideo.subtitle"
              selected={selected === "bigVideo.subtitle"}
              onSelect={onSelect}
            >
              <p
                className="text-base text-zinc-600"
                style={s(content, "bigVideo.subtitle")}
              >
                {content.bigVideo.subtitle}
              </p>
            </EditableElement>
          </div>

          <EditableElement
            elementKey="section:bigVideo.media"
            selected={selected === "section:bigVideo.media"}
            onSelect={onSelect}
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-900">
              {content.bigVideo.poster && (
                <Image
                  src={content.bigVideo.poster}
                  alt={content.bigVideo.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex size-20 items-center justify-center rounded-full text-white shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${BLUE}, #1F3F60)`,
                  }}
                >
                  <PlayIcon className="size-8 fill-white" />
                </div>
              </div>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== TRUST ============== */}
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center space-y-3">
            <div
              className="inline-flex size-12 items-center justify-center rounded-full"
              style={{ background: `${BLUE}10`, color: BLUE }}
            >
              <ShieldCheckIcon className="size-6" />
            </div>
            <EditableElement
              elementKey="trust.title"
              selected={selected === "trust.title"}
              onSelect={onSelect}
            >
              <h2
                className="text-balance text-3xl font-black tracking-tight @[768px]:text-4xl"
                style={s(content, "trust.title")}
              >
                {content.trust.title}
              </h2>
            </EditableElement>
            <EditableElement
              elementKey="trust.description"
              selected={selected === "trust.description"}
              onSelect={onSelect}
            >
              <p
                className="text-base text-zinc-600"
                style={s(content, "trust.description")}
              >
                {content.trust.description}
              </p>
            </EditableElement>
          </div>

          <EditableElement
            elementKey="section:trust.badges"
            selected={selected === "section:trust.badges"}
            onSelect={onSelect}
            className="mt-8 block"
          >
            <div className="grid gap-3 @[640px]:grid-cols-2 @[768px]:grid-cols-4">
              {content.trust.badges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3"
                >
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `${YELLOW}30`, color: "#7A5A00" }}
                  >
                    <CheckCircle2Icon className="size-4" />
                  </div>
                  <span className="text-sm font-bold text-zinc-900">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </EditableElement>

          <EditableElement
            elementKey="section:trust.founder"
            selected={selected === "section:trust.founder"}
            onSelect={onSelect}
            className="mt-8 block"
          >
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-center">
              <EditableElement
                elementKey="trust.founderName"
                selected={selected === "trust.founderName"}
                onSelect={onSelect}
                compact
                className="inline-block"
                disableInner={true}
              >
                <span
                  className="text-xl font-black"
                  style={s(content, "trust.founderName")}
                >
                  {content.trust.founderName}
                </span>
              </EditableElement>
              <EditableElement
                elementKey="trust.founderRole"
                selected={selected === "trust.founderRole"}
                onSelect={onSelect}
                compact
                className="mt-1 inline-block"
                disableInner={true}
              >
                <span
                  className="text-sm text-zinc-500"
                  style={s(content, "trust.founderRole")}
                >
                  {content.trust.founderRole}
                </span>
              </EditableElement>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section
        className="relative overflow-hidden py-16 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${RED} 0%, ${BLUE} 100%)`,
        }}
      >
        <div className="relative mx-auto max-w-3xl px-6 space-y-5">
          <EditableElement
            elementKey="finalCta.line1"
            selected={selected === "finalCta.line1"}
            onSelect={onSelect}
          >
            <h2
              className="text-balance text-3xl font-black leading-[1.1] @[768px]:text-5xl"
              style={s(content, "finalCta.line1")}
            >
              {content.finalCta.line1}
            </h2>
          </EditableElement>
          <EditableElement
            elementKey="finalCta.line2"
            selected={selected === "finalCta.line2"}
            onSelect={onSelect}
          >
            <p
              className="text-balance text-lg font-medium opacity-95 @[768px]:text-xl"
              style={s(content, "finalCta.line2")}
            >
              {content.finalCta.line2}
            </p>
          </EditableElement>
          <EditableElement
            elementKey="finalCta.button"
            selected={selected === "finalCta.button"}
            onSelect={onSelect}
            className="inline-block"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 text-lg font-black"
              style={{ color: RED, ...s(content, "finalCta.button") }}
            >
              {content.finalCta.button}
              <ArrowLeftIcon className="size-5" />
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== POPUP PREVIEW ============== */}
      <section className="bg-zinc-100 py-12">
        <div className="mx-auto max-w-md px-6">
          <div className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
            תצוגת popup (אחרי {content.popup.delaySeconds}s)
          </div>
          <EditableElement
            elementKey="section:popup.settings"
            selected={selected === "section:popup.settings"}
            onSelect={onSelect}
          >
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div
                className="px-6 pt-10 pb-6 text-white"
                style={{
                  background: `linear-gradient(135deg, ${BLUE}, #1F3F60)`,
                }}
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
                  <HeartIcon className="size-6 fill-white text-white" />
                </div>
                <EditableElement
                  elementKey="popup.title"
                  selected={selected === "popup.title"}
                  onSelect={onSelect}
                  className="mt-4 block"
                  disableInner={true}
                >
                  <h2
                    className="text-2xl font-black"
                    style={s(content, "popup.title")}
                  >
                    {content.popup.title}
                  </h2>
                </EditableElement>
                <EditableElement
                  elementKey="popup.text"
                  selected={selected === "popup.text"}
                  onSelect={onSelect}
                  className="mt-2 block"
                  disableInner={true}
                >
                  <p
                    className="text-sm opacity-95"
                    style={s(content, "popup.text")}
                  >
                    {content.popup.text}
                  </p>
                </EditableElement>
              </div>
              <div className="p-5">
                <EditableElement
                  elementKey="popup.cta"
                  selected={selected === "popup.cta"}
                  onSelect={onSelect}
                  className="block"
                  disableInner={true}
                >
                  <div
                    className="rounded-2xl py-3 text-center text-base font-black text-white"
                    style={{
                      background: `linear-gradient(135deg, ${RED}, #C62828)`,
                      ...s(content, "popup.cta"),
                    }}
                  >
                    {content.popup.cta}
                  </div>
                </EditableElement>
              </div>
            </div>
          </EditableElement>
        </div>
      </section>

      {/* ============== Footer (meta + contact) ============== */}
      <footer className="bg-zinc-950 py-8 text-zinc-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 text-sm">
          <EditableElement
            elementKey="section:meta"
            selected={selected === "section:meta"}
            onSelect={onSelect}
            compact
          >
            <div className="flex items-center gap-2 text-white">
              <div
                className="flex size-8 items-center justify-center rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${RED}, ${BLUE})`,
                }}
              >
                <HeartIcon className="size-4 fill-white text-white" />
              </div>
              <span className="font-black">{content.meta.brandName}</span>
            </div>
          </EditableElement>

          <EditableElement
            elementKey="section:contact"
            selected={selected === "section:contact"}
            onSelect={onSelect}
            compact
            disableInner={false}
          >
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <PhoneIcon className="size-3" />
                {content.contact.phone}
              </span>
              <span className="flex items-center gap-1">
                <MailIcon className="size-3" />
                {content.contact.email}
              </span>
              <span
                className="flex items-center gap-1 rounded-full bg-[#25D366]/15 px-2 py-0.5 text-[#25D366]"
              >
                <MessageCircleIcon className="size-3" />
                WA
              </span>
            </div>
          </EditableElement>

          <EditableElement
            elementKey="section:liveFeed"
            selected={selected === "section:liveFeed"}
            onSelect={onSelect}
            compact
            disableInner={false}
          >
            <div className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs">
              <ListIcon className="size-3" />
              Live Feed: {content.liveFeed.enabled ? "פעיל" : "כבוי"}
            </div>
          </EditableElement>
        </div>
      </footer>
    </div>
  );
}
