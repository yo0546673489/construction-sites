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
import { getElementCSS } from "@/lib/content";
import { ImpactCounter } from "./impact-counter";
import { UrgencyBar } from "./urgency-bar";
import { LiveDonationFeed } from "./live-feed";
import { StickyDonate } from "./sticky-donate";
import { HeroSplit } from "./hero-split";
import { ReelsHorizontal } from "./reels-horizontal";
import { StorySection } from "./story-section";
import { KenBurnsGallery } from "./ken-burns-gallery";
import { DelayedPopup } from "./delayed-popup";
import { TopBanner } from "./top-banner";
import { Reveal } from "./reveal";
import { EmotionalSection } from "./emotional-section";

/* פלטה רכה לפי המפרט */
const BLUE = "#2F5D8C";
const RED = "#E53935";
const YELLOW = "#F4C542";

export function CharityLanding({
  content,
}: {
  content: CharitySiteContent;
}) {
  // Helper להחלת style overrides per-element
  const css = (key: string) => getElementCSS(content, key);

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
        sideMedia={content.hero.altSideMedia || content.hero.sideMedia}
        sideMediaType={
          content.hero.altSideMediaType || content.hero.sideMediaType
        }
        sideMediaPoster={content.hero.sideMediaPoster}
        typewriterPhase1={content.hero.typewriterPhase1}
        typewriterPhase2={content.hero.typewriterPhase2}
        typewriterPhase3={content.hero.typewriterPhase3}
        primaryCta={content.donate.primaryCta}
        secondaryCta={content.donate.secondaryCta}
        donationUrl={content.donate.donationUrl}
      />

      {/* ===========================================================
          2. REELS — Horizontal scroll (dark blurred bg + immersive)
          =========================================================== */}
      <section
        id="reels"
        className="relative overflow-hidden py-14 text-white sm:py-20 md:py-28"
        style={{
          background: "linear-gradient(180deg, #0F1B2D 0%, #1F3F60 100%)",
        }}
      >
        {/* רקע מטושטש — תמונת פעילות אמיתית ב-blur נמוך opacity */}
        {content.gallery.altItems && content.gallery.altItems.length > 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url(${content.gallery.altItems[2]?.src || content.gallery.altItems[0].src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(50px) saturate(1.2)",
              transform: "scale(1.2)",
            }}
          />
        )}
        {/* texture — radial accents בזהב/אדום */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at 10% 0%, ${YELLOW}22, transparent 50%), radial-gradient(ellipse at 95% 100%, ${RED}1F, transparent 50%)`,
          }}
        />
        <Reveal>
          <div className="relative mx-auto mb-12 max-w-6xl px-6 text-center md:mb-14">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#FFF",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <SparklesIcon className="size-3.5" />
              וידאו
            </div>
            {content.reels.altIntroText && (
              <p className="mx-auto mb-3 max-w-2xl text-balance text-base font-medium text-white/85 md:text-lg">
                {content.reels.altIntroText}
              </p>
            )}
            <h2
              className="text-shadow-soft text-balance text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
              style={css("reels.title")}
            >
              {content.reels.title}
            </h2>
          </div>
        </Reveal>

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
        paragraphs={
          content.story.altParagraphs && content.story.altParagraphs.length > 0
            ? content.story.altParagraphs
            : content.story.paragraphs
        }
        cta={content.story.altCta || content.story.cta}
        donationUrl={content.donate.donationUrl}
        bgImage={content.story.altBgImage || content.story.bgImage}
      />

      {/* ===========================================================
          4. GALLERY — Ken Burns + blurred bg + floating circles
          =========================================================== */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 md:py-36"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F9FBFF 100%)",
        }}
      >
        {/* רקע מטושטש — תמונות הגלריה ב-blur גדול ושקיפות נמוכה */}
        {content.gallery.items.length > 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url(${content.gallery.items[0].src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(80px) saturate(1.2)",
              transform: "scale(1.3)",
            }}
          />
        )}
        {/* floating glow circles — מוסיפים תחושת תנועה */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 right-[-100px] size-72 rounded-full opacity-30 blur-3xl slow-zoom"
          style={{ background: YELLOW }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-20 left-[-100px] size-80 rounded-full opacity-25 blur-3xl slow-zoom"
          style={{ background: BLUE, animationDelay: "8s" }}
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-12 text-center md:mb-14">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
                style={{ background: `${YELLOW}25`, color: "#7A5A00" }}
              >
                גלריה
              </div>
              <h2
                className="text-balance text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                style={css("gallery.title")}
              >
                {content.gallery.altTitle || content.gallery.title}
              </h2>
              <p
                className="mt-3 text-balance text-base font-medium sm:mt-4 sm:text-lg md:text-xl"
                style={{ color: "#5A5A5A", ...css("gallery.subtitle") }}
              >
                {content.gallery.altSubtitle || content.gallery.subtitle}
              </p>
              <p className="mt-2 text-balance text-sm italic md:text-base" style={{ color: "#7A5A00" }}>
                כל תמונה כאן היא חיים שנגעו בהם
              </p>
            </div>
          </Reveal>

          <KenBurnsGallery
            items={
              content.gallery.altItems && content.gallery.altItems.length > 0
                ? content.gallery.altItems
                : content.gallery.items
            }
          />

          {/* CTA תחתון לגלריה */}
          <Reveal delayMs={200}>
            <div className="mt-14 text-center md:mt-16">
              <p className="mb-5 text-base font-bold md:text-lg" style={{ color: "#1A1A1A" }}>
                {content.gallery.altBottomLine || "גם אתה יכול להיות חלק מהעשייה"}
              </p>
              <a
                href={content.donate.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sweep relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-base font-black text-white shadow-xl transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${RED}, #C62828)`,
                  boxShadow: `0 18px 45px -10px ${RED}66`,
                }}
              >
                <HeartIcon className="size-4 fill-white" />
                {content.gallery.altBottomCta || content.donate.primaryCta}
                <ArrowLeftIcon className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===========================================================
          5. IMPACT — Numbers (image bg + dark overlay)
          =========================================================== */}
      <section
        className={`relative overflow-hidden py-14 text-white sm:py-20 md:py-32 ${
          content.impact.bgImage ? "parallax-fixed" : ""
        }`}
        style={
          content.impact.bgImage
            ? { backgroundImage: `url(${content.impact.bgImage})` }
            : {
                background: `linear-gradient(135deg, ${BLUE} 0%, #1F3F60 100%)`,
              }
        }
      >
        {/* dark overlay חזק */}
        {content.impact.bgImage && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, rgba(15,30,55,0.88) 0%, rgba(31,63,96,0.85) 50%, rgba(10,20,40,0.9) 100%)`,
            }}
          />
        )}
        {/* radial accent */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at 80% 20%, ${YELLOW}33, transparent 50%), radial-gradient(ellipse at 20% 80%, ${RED}22, transparent 50%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <h2
              className="text-balance text-center text-3xl font-black tracking-tight text-shadow-soft md:text-5xl"
              style={css("impact.title")}
            >
              {content.impact.title}
            </h2>
          </Reveal>

          {(() => {
            const counters =
              content.impact.altCounters && content.impact.altCounters.length > 0
                ? content.impact.altCounters
                : content.impact.counters;
            return (
              <div
                className={`mt-14 grid gap-10 md:gap-8 ${
                  counters.length <= 3
                    ? "md:grid-cols-3"
                    : "md:grid-cols-4"
                }`}
              >
                {counters.map((c, i) => (
                  <Reveal key={`${c.label}-${i}`} variant="zoom" delayMs={i * 150}>
                    <div className="flex flex-col items-center text-center">
                      <ImpactCounter
                        to={c.value}
                        suffix={c.suffix}
                        className="text-shadow-strong text-5xl font-black tracking-tight md:text-7xl"
                      />
                      <div className="text-shadow-soft mt-3 text-sm font-bold uppercase tracking-widest opacity-95 md:text-base">
                        {c.label}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            );
          })()}

          {content.impact.extraLabel && (
            <Reveal delayMs={500}>
              <div className="mt-14 text-center">
                <div
                  className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-bold backdrop-blur-md md:text-lg"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#FFF",
                  }}
                >
                  <HeartIcon className="size-5 fill-current" style={{ color: RED }} />
                  <span className="text-shadow-soft">{content.impact.extraLabel}</span>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ===========================================================
          6. DONATION CARDS — Soft blue→red gradient bg + microtext
          =========================================================== */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 md:py-36"
        style={{
          background:
            "linear-gradient(135deg, #F0F6FD 0%, #FFFFFF 40%, #FCEEEE 100%)",
        }}
      >
        {/* floating accent blobs — מוסיפים חיוּת */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full opacity-20 blur-3xl slow-zoom"
          style={{ background: BLUE }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full opacity-25 blur-3xl slow-zoom"
          style={{ background: RED, animationDelay: "10s" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${RED}10, transparent 60%), radial-gradient(ellipse at 50% 100%, ${BLUE}10, transparent 55%)`,
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="text-center">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
                style={{ background: `${RED}10`, color: RED }}
              >
                <HeartIcon className="size-3.5" />
                לתרומה
              </div>
              <h2
                className="text-balance text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                style={css("donationCards.title")}
              >
                {content.donationCards.title}
              </h2>
              <p
                className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed md:text-xl"
                style={{ color: "#5A5A5A", ...css("donationCards.subtitle") }}
              >
                {content.donationCards.altSubtitle ||
                  content.donationCards.subtitle}
              </p>
              <p
                className="mt-3 text-balance text-sm font-bold md:text-base"
                style={{ color: RED }}
              >
                {content.donationCards.altMicroText ||
                  "כל סכום קטן הופך לארוחה אמיתית"}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:mt-16 md:grid-cols-3 md:gap-7">
            {(content.donationCards.altCards &&
            content.donationCards.altCards.length > 0
              ? content.donationCards.altCards
              : content.donationCards.cards
            ).map((card, idx) => (
              <Reveal key={card.amount} variant="zoom" delayMs={idx * 120}>
                <a
                  href={content.donate.donationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cl-floating-card relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-3xl border border-zinc-100 bg-white p-6 text-center shadow-xl shadow-zinc-900/[0.06] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_70px_-15px_rgba(229,57,53,0.3)] sm:gap-5 sm:p-8 md:p-10"
                  style={{ animationDelay: `${idx * 0.5}s` }}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-1.5 transition-all group-hover:h-2"
                    style={{
                      background: `linear-gradient(90deg, ${RED}, ${YELLOW}, ${RED})`,
                    }}
                  />

                  <div
                    className="flex size-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      background: `linear-gradient(135deg, ${RED}, #C62828)`,
                      boxShadow: `0 16px 40px -12px ${RED}66`,
                    }}
                  >
                    <HeartIcon className="size-7 fill-white text-white" />
                  </div>

                  <div
                    className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl"
                    style={{ color: RED }}
                  >
                    ₪{card.amount}
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className="text-lg font-black md:text-xl"
                      style={{ color: "#1A1A1A" }}
                    >
                      {card.title}
                    </div>
                    <div
                      className="text-sm leading-relaxed md:text-base"
                      style={{ color: "#666" }}
                    >
                      {card.description}
                    </div>
                  </div>

                  {/* microtext — אמינות */}
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
                    style={{
                      background: `${YELLOW}25`,
                      color: "#7A5A00",
                    }}
                  >
                    <CheckCircle2Icon className="size-3" />
                    100% הולך למשפחות נזקקות
                  </div>

                  <div
                    className="sweep relative mt-2 inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-black text-white shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${RED}, #C62828)`,
                    }}
                  >
                    תרום עכשיו
                    <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={400}>
            <div className="mt-12 text-center">
              <a
                href={content.donate.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold underline-offset-4 transition-colors hover:underline md:text-base"
                style={{ color: BLUE, ...css("donationCards.customLabel") }}
              >
                {content.donationCards.customLabel}
                <ArrowLeftIcon className="size-3.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===========================================================
          7. EMOTIONAL — מחליף את Urgency. רקע full image + dark overlay,
             טקסט קצר, כפתור גדול. Fallback: Urgency אם emotional.enabled=false
          =========================================================== */}
      {content.emotional?.enabled !== false ? (
        <EmotionalSection
          title={content.emotional?.title || "יש משפחות שמחכות לחלוקה הקרובה"}
          subtitle={
            content.emotional?.subtitle || "ובלעדיך – זה לא יקרה"
          }
          cta={content.emotional?.cta || "אני רוצה לעזור עכשיו"}
          bgImage={
            content.emotional?.bgImage ||
            content.urgency.bgImage ||
            "/uploads/charity/image-15.jpg"
          }
          donationUrl={content.donate.donationUrl}
        />
      ) : (
        <section
          className={`relative overflow-hidden py-14 text-white sm:py-20 md:py-32 ${
            content.urgency.bgImage ? "parallax-fixed" : ""
          }`}
          style={
            content.urgency.bgImage
              ? { backgroundImage: `url(${content.urgency.bgImage})` }
              : {
                  background: `linear-gradient(135deg, #1A2845 0%, ${BLUE} 100%)`,
                }
          }
        >
          {content.urgency.bgImage && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(8,15,30,0.85) 0%, rgba(20,40,70,0.82) 60%, rgba(40,15,15,0.85) 100%)",
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${RED}44 0%, transparent 60%)`,
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
              <h2
                className="text-balance text-3xl font-black leading-[1.15] tracking-tight text-shadow-strong md:text-5xl"
                style={css("urgency.title")}
              >
                {content.urgency.title}
              </h2>
              {content.urgency.subtitle && (
                <p
                  className="mt-4 text-base opacity-95 text-shadow-soft md:text-lg"
                  style={css("urgency.subtitle")}
                >
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
            <div className="mt-12 text-center">
              <a
                href={content.donate.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sweep relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-9 py-4 text-base font-black shadow-2xl transition-all hover:scale-105 md:text-lg"
                style={{ color: RED }}
              >
                <HeartIcon className="size-5 fill-current" />
                עזור להגיע ליעד
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ===========================================================
          9. TRUST — clean, with subtle yellow accent
          =========================================================== */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 md:py-36"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FBF8F0 50%, #F5F0E0 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, ${YELLOW}15, transparent 50%), radial-gradient(ellipse at 10% 100%, ${BLUE}10, transparent 50%)`,
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="text-center">
              <div
                className="inline-flex size-16 items-center justify-center rounded-full shadow-md"
                style={{
                  background: `${BLUE}10`,
                  color: BLUE,
                }}
              >
                <ShieldCheckIcon className="size-8" />
              </div>
              <h2
                className="mt-6 text-balance text-4xl font-black tracking-tight md:text-5xl"
                style={css("trust.title")}
              >
                {content.trust.title}
              </h2>
              <p
                className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed md:text-xl"
                style={{ color: "#5A5A5A", ...css("trust.description") }}
              >
                {content.trust.description}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {content.trust.badges.map((badge, idx) => (
              <Reveal key={badge} delayMs={idx * 80}>
                <div className="group hover-lift flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                    style={{ background: `${YELLOW}30`, color: "#7A5A00" }}
                  >
                    <CheckCircle2Icon className="size-5" />
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#1A1A1A" }}
                  >
                    {badge}
                  </span>
                </div>
              </Reveal>
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
                <div
                  className="text-2xl font-black md:text-3xl"
                  style={css("trust.founderName")}
                >
                  {content.trust.founderName}
                </div>
                <div
                  className="mt-1 text-base"
                  style={{ color: "#5A5A5A", ...css("trust.founderRole") }}
                >
                  {content.trust.founderRole}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===========================================================
          10. FINAL CTA — gradient + reveal + sweep
          =========================================================== */}
      <section
        className="relative overflow-hidden py-16 text-center text-white sm:py-24 md:py-40"
        style={{
          background: `linear-gradient(135deg, ${RED} 0%, ${BLUE} 100%)`,
        }}
      >
        {/* radial glow */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at center, ${YELLOW}66, transparent 60%)`,
          }}
        />
        {/* gradient-shift עדין על השכבה הזו */}
        <div
          className="gradient-shift absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(120deg, transparent 0%, ${YELLOW}33 50%, transparent 100%)`,
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal>
            <h2
              className="text-balance text-3xl font-black leading-[1.1] tracking-tight text-shadow-strong sm:text-4xl md:text-6xl lg:text-7xl"
              style={css("finalCta.line1")}
            >
              {content.finalCta.line1}
            </h2>
          </Reveal>
          <Reveal delayMs={200}>
            <p
              className="mt-6 text-balance text-base font-medium opacity-95 text-shadow-soft sm:text-lg md:text-xl lg:text-2xl"
              style={css("finalCta.line2")}
            >
              {content.finalCta.line2}
            </p>
          </Reveal>
          <Reveal variant="zoom" delayMs={400}>
            <a
              href={content.donate.donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sweep cta-pulse relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-base font-black shadow-2xl transition-transform hover:scale-105 sm:px-10 sm:py-5 sm:text-lg md:mt-14 md:px-14 md:py-6 md:text-2xl"
              style={{ color: RED, boxShadow: "0 25px 70px -15px rgba(0,0,0,0.4)", ...css("finalCta.button") }}
            >
              <HeartIcon className="size-5 fill-current sm:size-6" />
              {content.finalCta.button}
              <ArrowLeftIcon className="size-6" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ===========================================================
          Footer — חזק עם CTA, אייקונים ופלטה כהה
          =========================================================== */}
      <footer className="relative overflow-hidden bg-zinc-950 text-zinc-400">
        {/* radial accents */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at 15% 20%, ${RED}22, transparent 50%), radial-gradient(ellipse at 85% 80%, ${BLUE}22, transparent 55%)`,
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          {/* קריאה אחרונה לתרומה */}
          <div className="mb-12 text-center">
            <p className="text-balance text-xl font-black text-white md:text-2xl">
              עדיין לא תרמת? כל סכום עוזר משפחה אחת השבוע
            </p>
            <a
              href={content.donate.donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sweep relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-black text-white shadow-xl transition-transform hover:scale-105 md:text-base"
              style={{
                background: `linear-gradient(135deg, ${RED}, #C62828)`,
                boxShadow: `0 18px 45px -10px ${RED}66`,
              }}
            >
              <HeartIcon className="size-4 fill-white" />
              {content.donate.primaryCta}
              <ArrowLeftIcon className="size-4" />
            </a>
          </div>

          {/* מפריד עדין */}
          <div
            className="mx-auto mb-12 h-px max-w-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            }}
          />

          {/* גריד תוכן הפוטר */}
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {/* לוגו + תיאור */}
            <div>
              <div className="flex items-center gap-3">
                {content.meta.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={content.meta.logoUrl}
                    alt={content.meta.brandName}
                    className="size-14 rounded-full bg-white p-1.5 shadow-lg"
                  />
                ) : (
                  <div
                    className="flex size-14 items-center justify-center rounded-full shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${RED}, ${BLUE})`,
                    }}
                  >
                    <HeartIcon className="size-6 fill-white text-white" />
                  </div>
                )}
                <div>
                  <div className="text-lg font-black text-white">
                    {content.meta.brandName}
                  </div>
                  <div className="text-sm">{content.meta.brandTagline}</div>
                </div>
              </div>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-500">
                עמותה בהובלת בני נוער. ללא מטרות רווח. כל שקל מגיע לאלה שצריכים
                אותו.
              </p>
            </div>

            {/* יצירת קשר */}
            <div>
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-white">
                יצירת קשר
              </h3>
              <ul className="space-y-3 text-sm">
                {content.contact.phone && (
                  <li>
                    <a
                      href={`tel:${content.contact.phone}`}
                      className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                    >
                      <PhoneIcon className="size-4" />
                      {content.contact.phone}
                    </a>
                  </li>
                )}
                {content.contact.email && (
                  <li>
                    <a
                      href={`mailto:${content.contact.email}`}
                      className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                    >
                      <MailIcon className="size-4" />
                      {content.contact.email}
                    </a>
                  </li>
                )}
                {content.contact.whatsappNumber && (
                  <li>
                    <a
                      href={`https://wa.me/${content.contact.whatsappNumber.replace(
                        /\D/g,
                        ""
                      )}?text=${encodeURIComponent(
                        content.contact.whatsappMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                    >
                      <MessageCircleIcon className="size-4" />
                      וואטסאפ
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* badges אמינות */}
            <div>
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-white">
                למה לתרום אלינו?
              </h3>
              <ul className="space-y-2 text-sm">
                {content.trust.badges.slice(0, 4).map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-zinc-400"
                  >
                    <CheckCircle2Icon
                      className="mt-0.5 size-4 shrink-0"
                      style={{ color: YELLOW }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* סוף הפוטר */}
          <div
            className="mx-auto mt-12 h-px max-w-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            }}
          />
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-zinc-500 md:flex-row">
            <span>
              © {new Date().getFullYear()} {content.meta.brandName} · כל
              הזכויות שמורות
            </span>
            <span>נבנה בלב פתוח · בהובלת הנוער</span>
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
