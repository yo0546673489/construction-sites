import Image from "next/image";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  HeartIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import type { CharitySiteContent } from "@/lib/charity-content";
import { ImpactCounter } from "./impact-counter";
import { UrgencyBar } from "./urgency-bar";
import { LiveDonationFeed } from "./live-feed";
import { StickyDonate } from "./sticky-donate";
import { HeroSplit } from "./hero-split";
import { ReelsHorizontal } from "./reels-horizontal";
import { StorySection } from "./story-section";
import { BigVideo } from "./big-video";
import { KenBurnsGallery } from "./ken-burns-gallery";
import { DelayedPopup } from "./delayed-popup";
import { TopBanner } from "./top-banner";

/* פלטה רכה לפי המפרט */
const BLUE = "#2F5D8C";
const RED = "#E53935";
const YELLOW = "#F4C542";

export function CharityLanding({
  content,
}: {
  content: CharitySiteContent;
}) {
  return (
    <main dir="rtl" style={{ color: "#1A1A1A" }} className="bg-white">
      {/* ===========================================================
          0. TOP BANNER — אם הוגדר
          =========================================================== */}
      {content.meta.topBanner && (
        <TopBanner
          src={content.meta.topBanner}
          alt={content.meta.brandName}
        />
      )}

      {/* ===========================================================
          1. HERO — Split layout
          =========================================================== */}
      <HeroSplit
        brandName={content.meta.brandName}
        brandTagline={content.meta.brandTagline}
        sideMedia={content.hero.sideMedia}
        sideMediaType={content.hero.sideMediaType}
        sideMediaPoster={content.hero.sideMediaPoster}
        typewriterPhase1={content.hero.typewriterPhase1}
        typewriterPhase2={content.hero.typewriterPhase2}
        typewriterPhase3={content.hero.typewriterPhase3}
        primaryCta={content.donate.primaryCta}
        secondaryCta={content.donate.secondaryCta}
        donationUrl={content.donate.donationUrl}
      />

      {/* ===========================================================
          2. REELS — Horizontal scroll
          =========================================================== */}
      <section
        id="reels"
        className="overflow-hidden py-20 md:py-24"
        style={{ background: "#FFFFFF" }}
      >
        <div className="mx-auto mb-10 max-w-6xl px-6 text-center md:mb-12">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
            style={{ background: `${BLUE}10`, color: BLUE }}
          >
            <SparklesIcon className="size-3.5" />
            וידאו
          </div>
          <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
            {content.reels.title}
          </h2>
        </div>

        <ReelsHorizontal
          items={content.reels.items}
          donationUrl={content.donate.donationUrl}
        />
      </section>

      {/* ===========================================================
          3. STORY — סיפור העמותה
          =========================================================== */}
      <StorySection
        kicker={content.story.kicker}
        paragraphs={content.story.paragraphs}
        cta={content.story.cta}
        donationUrl={content.donate.donationUrl}
      />

      {/* ===========================================================
          4. GALLERY — Ken Burns
          =========================================================== */}
      <section
        className="py-24 md:py-32"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F9FBFF 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <div
              className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
              style={{ background: `${YELLOW}25`, color: "#7A5A00" }}
            >
              גלריה
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
              {content.gallery.title}
            </h2>
            <p
              className="mt-3 text-base md:text-lg"
              style={{ color: "#5A5A5A" }}
            >
              {content.gallery.subtitle}
            </p>
          </div>
          <KenBurnsGallery items={content.gallery.items} />
        </div>
      </section>

      {/* ===========================================================
          5. IMPACT — Numbers
          =========================================================== */}
      <section
        className="relative overflow-hidden py-20 text-white md:py-24"
        style={{
          background: `linear-gradient(135deg, ${BLUE} 0%, #1F3F60 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 80% 20%, ${YELLOW}33, transparent 50%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-balance text-center text-3xl font-black tracking-tight md:text-5xl">
            {content.impact.title}
          </h2>
          <div
            className={`mt-12 grid gap-8 md:gap-6 ${
              content.impact.counters.length <= 3
                ? "md:grid-cols-3"
                : "md:grid-cols-4"
            }`}
          >
            {content.impact.counters.map((c, i) => (
              <div
                key={c.label}
                className="number-explode flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <ImpactCounter
                  to={c.value}
                  suffix={c.suffix}
                  className="text-5xl font-black tracking-tight md:text-6xl"
                />
                <div className="mt-2 text-sm font-bold uppercase tracking-widest opacity-90 md:text-base">
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
          6. DONATION CARDS — Glassmorphism
          =========================================================== */}
      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{
          background:
            "linear-gradient(180deg, #F9FBFF 0%, #FFFFFF 50%, #EEF3F8 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${RED}15, transparent 60%)`,
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
              style={{ background: `${RED}10`, color: RED }}
            >
              <HeartIcon className="size-3.5" />
              לתרומה
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
              {content.donationCards.title}
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-base md:text-lg"
              style={{ color: "#5A5A5A" }}
            >
              {content.donationCards.subtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {content.donationCards.cards.map((card) => (
              <a
                key={card.amount}
                href={content.donate.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-xl shadow-zinc-900/5 backdrop-blur-xl transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${RED}15, transparent 70%)`,
                  }}
                />

                <div
                  className="flex size-14 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${RED}, #C62828)`,
                    boxShadow: `0 12px 30px -10px ${RED}66`,
                  }}
                >
                  <HeartIcon className="size-6 fill-white text-white" />
                </div>
                <div className="text-5xl font-black" style={{ color: RED }}>
                  ₪{card.amount}
                </div>
                <div className="space-y-1">
                  <div
                    className="text-base font-black"
                    style={{ color: "#1A1A1A" }}
                  >
                    {card.title}
                  </div>
                  <div className="text-sm" style={{ color: "#5A5A5A" }}>
                    {card.description}
                  </div>
                </div>
                <div
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${RED}, #C62828)`,
                  }}
                >
                  תרום
                  <ArrowLeftIcon className="size-3.5" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={content.donate.donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold underline-offset-4 transition-colors hover:underline"
              style={{ color: BLUE }}
            >
              {content.donationCards.customLabel}
              <ArrowLeftIcon className="size-3" />
            </a>
          </div>
        </div>
      </section>

      {/* ===========================================================
          7. URGENCY — Dramatic dark
          =========================================================== */}
      <section
        className="relative overflow-hidden py-20 text-white md:py-24"
        style={{
          background: `linear-gradient(135deg, #1A2845 0%, ${BLUE} 100%)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${RED}33 0%, transparent 60%)`,
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
              style={{ background: `${RED}33`, color: "#FCA5A5" }}
            >
              <span
                className="size-1.5 animate-pulse rounded-full"
                style={{ background: "#FCA5A5" }}
              />
              דחוף
            </div>
            <h2 className="text-balance text-3xl font-black leading-[1.15] tracking-tight md:text-4xl">
              {content.urgency.title}
            </h2>
            {content.urgency.subtitle && (
              <p className="mt-4 text-base opacity-90 md:text-lg">
                {content.urgency.subtitle}
              </p>
            )}
          </div>

          <div className="mt-10">
            <UrgencyBar
              goal={content.urgency.goal}
              raised={content.urgency.raised}
              deadline={content.urgency.deadline}
            />
          </div>

          <div className="mt-10 text-center">
            <a
              href={content.donate.donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-black shadow-xl transition-all hover:scale-105"
              style={{ color: RED }}
            >
              <HeartIcon className="size-4 fill-current" />
              עזור להגיע ליעד
            </a>
          </div>
        </div>
      </section>

      {/* ===========================================================
          8. BIG VIDEO — full width
          =========================================================== */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center md:mb-14">
            <div
              className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
              style={{ background: `${BLUE}10`, color: BLUE }}
            >
              ראו במו עיניכם
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
              {content.bigVideo.title}
            </h2>
            {content.bigVideo.subtitle && (
              <p
                className="mt-3 text-base md:text-lg"
                style={{ color: "#5A5A5A" }}
              >
                {content.bigVideo.subtitle}
              </p>
            )}
          </div>

          <BigVideo
            videoUrl={content.bigVideo.videoUrl}
            poster={content.bigVideo.poster}
          />
        </div>
      </section>

      {/* ===========================================================
          9. TRUST — clean, minimal
          =========================================================== */}
      <section
        className="py-24 md:py-32"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F9FBFF 100%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div
              className="inline-flex size-14 items-center justify-center rounded-full"
              style={{
                background: `${BLUE}10`,
                color: BLUE,
              }}
            >
              <ShieldCheckIcon className="size-7" />
            </div>
            <h2 className="mt-5 text-balance text-3xl font-black tracking-tight md:text-4xl">
              {content.trust.title}
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-base md:text-lg"
              style={{ color: "#5A5A5A" }}
            >
              {content.trust.description}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {content.trust.badges.map((badge) => (
              <div
                key={badge}
                className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md"
              >
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                  style={{ background: `${YELLOW}30`, color: "#7A5A00" }}
                >
                  <CheckCircle2Icon className="size-5" />
                </div>
                <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>
                  {badge}
                </span>
              </div>
            ))}
          </div>

          {content.trust.founderVideoUrl && (
            <div className="mt-16 grid gap-8 rounded-3xl border border-zinc-100 bg-gradient-to-b from-zinc-50 to-white p-6 shadow-sm md:grid-cols-[1fr_1.5fr] md:items-center md:p-8">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-black shadow-lg md:aspect-[9/16]">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                >
                  <source src={content.trust.founderVideoUrl} type="video/mp4" />
                </video>
              </div>
              <div>
                <div className="text-2xl font-black md:text-3xl">
                  {content.trust.founderName}
                </div>
                <div
                  className="mt-1 text-base"
                  style={{ color: "#5A5A5A" }}
                >
                  {content.trust.founderRole}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===========================================================
          10. FINAL CTA — gradient
          =========================================================== */}
      <section
        className="relative overflow-hidden py-24 text-center text-white md:py-32"
        style={{
          background: `linear-gradient(135deg, ${RED} 0%, ${BLUE} 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at center, ${YELLOW}55, transparent 60%)`,
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6">
          <h2 className="text-balance text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
            {content.finalCta.line1}
          </h2>
          <p className="mt-5 text-balance text-xl font-medium opacity-95 md:text-2xl">
            {content.finalCta.line2}
          </p>
          <a
            href={content.donate.donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pulse mt-12 inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-black shadow-2xl transition-transform hover:scale-105"
            style={{ color: RED }}
          >
            {content.finalCta.button}
            <ArrowLeftIcon className="size-6" />
          </a>
        </div>
      </section>

      {/* ===========================================================
          Footer
          =========================================================== */}
      <footer className="bg-zinc-950 py-12 text-zinc-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 text-sm md:flex-row">
          <div className="flex items-center gap-3">
            {content.meta.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.meta.logoUrl}
                alt={content.meta.brandName}
                className="size-12 rounded-full bg-white p-1"
              />
            ) : (
              <div
                className="flex size-12 items-center justify-center rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${RED}, ${BLUE})`,
                }}
              >
                <HeartIcon className="size-5 fill-white text-white" />
              </div>
            )}
            <div>
              <div className="font-black text-white">
                {content.meta.brandName}
              </div>
              <div className="text-xs">{content.meta.brandTagline}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
            {content.contact.phone && (
              <a
                href={`tel:${content.contact.phone}`}
                className="flex items-center gap-1.5 hover:text-white"
              >
                <PhoneIcon className="size-3.5" />
                {content.contact.phone}
              </a>
            )}
            {content.contact.email && (
              <a
                href={`mailto:${content.contact.email}`}
                className="flex items-center gap-1.5 hover:text-white"
              >
                <MailIcon className="size-3.5" />
                {content.contact.email}
              </a>
            )}
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* ===========================================================
          Floating elements
          =========================================================== */}
      {content.contact.whatsappNumber && (
        <a
          href={`https://wa.me/${content.contact.whatsappNumber.replace(
            /\D/g,
            ""
          )}?text=${encodeURIComponent(content.contact.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="וואטסאפ"
          className="fixed right-4 bottom-24 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white transition-transform hover:scale-110 md:bottom-6"
        >
          <MessageCircleIcon className="size-6" />
        </a>
      )}

      <StickyDonate
        donationUrl={content.donate.donationUrl}
        ctaText={content.donate.primaryCta}
      />

      {content.liveFeed.enabled && content.liveFeed.items.length > 0 && (
        <LiveDonationFeed items={content.liveFeed.items} />
      )}

      {content.popup.enabled && (
        <DelayedPopup
          delaySeconds={content.popup.delaySeconds}
          title={content.popup.title}
          text={content.popup.text}
          cta={content.popup.cta}
          donationUrl={content.donate.donationUrl}
        />
      )}
    </main>
  );
}
