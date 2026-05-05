import {
  ArrowLeftIcon,
  CheckIcon,
  CrownIcon,
  DownloadIcon,
  HeadphonesIcon,
  InfinityIcon,
  KeyIcon,
  PlayIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-react";
import type { KingSiteContent } from "@/lib/king-content";

/* ============================================================
   פלטה — מתאים לצילומים
   ============================================================ */
const NAVY_DEEP = "#091428"; // הרקע העמוק ביותר
const NAVY = "#0D1B30"; // רקע ראשי
const NAVY_CARD = "#152946"; // רקע כרטיסים
const NAVY_LIGHT = "#1A3050";
const GOLD = "#F4C547"; // הזהב הראשי (חם ובהיר)
const GOLD_DARK = "#D4A82F";
const ORANGE = "#F39C12"; // CTA כתום
const ORANGE_DARK = "#E67E22";
const RED = "#E74C3C";

/* SVG inline לסמלים חברתיים */
function SocialIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (platform === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    );
  }
  return null;
}

/* מיפוי אייקוני Lucide לכרטיסי המסע */
const JOURNEY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  search: SearchIcon,
  shield: ShieldIcon,
  key: KeyIcon,
  users: UsersIcon,
  target: TargetIcon,
  infinity: InfinityIcon,
  star: StarIcon,
};

function JourneyIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = JOURNEY_ICONS[name] || StarIcon;
  return <Cmp className={className} />;
}

export function KingLanding({ content }: { content: KingSiteContent }) {
  return (
    <main
      dir="rtl"
      className="min-h-screen text-white"
      style={{
        background: NAVY,
        fontFamily: "Heebo, system-ui, sans-serif",
      }}
    >
      {/* ============== TOP NAV ============== */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          background: `${NAVY_DEEP}E0`,
          borderColor: `${GOLD}33`,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          {/* Logo on right */}
          <a href="#" className="flex shrink-0 items-center gap-2">
            <CrownIcon className="size-7" style={{ color: GOLD }} />
            <span
              className="text-lg font-black tracking-tight md:text-xl"
              style={{ color: GOLD }}
            >
              {content.meta.brandName}
            </span>
          </a>

          {/* Nav items center */}
          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium md:flex">
            {content.nav.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/80 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTAs on left */}
          <div className="ms-auto flex items-center gap-2">
            <a
              href={content.nav.secondaryCta.href}
              className="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-white/5 sm:inline-flex"
              style={{ color: "#22C55E", borderColor: "#22C55E66" }}
            >
              <HeadphonesIcon className="size-3.5" />
              {content.nav.secondaryCta.text}
            </a>
            <a
              href={content.nav.primaryCta.href}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black text-white shadow-md transition-transform hover:scale-105 sm:px-5 sm:text-sm"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                boxShadow: `0 6px 20px -8px ${ORANGE}80`,
              }}
            >
              <DownloadIcon className="size-3.5" />
              {content.nav.primaryCta.text}
            </a>
          </div>
        </div>
      </header>

      {/* ============== HERO ============== */}
      <section
        className="relative overflow-hidden py-12 md:py-20"
        style={{
          background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 50%, ${NAVY_LIGHT} 100%)`,
        }}
      >
        {/* Subtle blue glow flares */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(ellipse at 70% 30%, ${ORANGE}15, transparent 50%), radial-gradient(ellipse at 20% 70%, #4A90E222, transparent 60%)`,
          }}
        />
        {/* Stars overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
          {/* Right: Text */}
          <div className="order-2 text-center md:order-1 md:text-right">
            <h1
              className="text-balance text-5xl font-black leading-[1.0] tracking-tight md:text-7xl lg:text-8xl"
              style={{
                color: GOLD,
                textShadow: `0 4px 24px ${GOLD}55, 0 2px 8px rgba(0,0,0,0.6)`,
              }}
            >
              {content.hero.title}
            </h1>
            <p className="mt-5 text-balance text-lg font-bold leading-relaxed text-white md:text-2xl">
              {content.hero.subtitle}
            </p>

            <div className="mt-8 flex justify-center md:justify-start">
              <a
                href={content.hero.ctaHref}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black text-white shadow-2xl transition-transform hover:scale-105 sm:px-10 sm:py-4 sm:text-base md:text-lg"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                  boxShadow: `0 22px 55px -12px ${ORANGE}99`,
                }}
              >
                <DownloadIcon className="size-4 sm:size-5" />
                {content.hero.ctaText}
              </a>
            </div>
          </div>

          {/* Left: Lion image */}
          <div className="order-1 flex items-center justify-center md:order-2">
            <div className="relative">
              {content.hero.lionImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={content.hero.lionImage}
                  alt={content.hero.title}
                  className="max-h-[440px] w-auto"
                />
              ) : (
                <div
                  className="relative flex size-64 items-center justify-center rounded-full sm:size-80 md:size-[420px]"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${ORANGE}55, ${NAVY_DEEP} 70%)`,
                    boxShadow: `0 30px 80px -20px ${ORANGE}99`,
                  }}
                >
                  <CrownIcon
                    className="size-32 sm:size-40 md:size-48"
                    style={{ color: GOLD }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{ boxShadow: `inset 0 0 80px ${GOLD}55` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============== BOOK SOLUTION ============== */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: NAVY_DEEP }}
      >
        {/* Sparkle dots overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, ${ORANGE}1F, transparent 50%)`,
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-14">
          {/* Right: Text */}
          <div className="order-2 text-right md:order-1">
            <h2
              className="text-balance text-3xl font-black leading-tight tracking-tight md:text-5xl"
              style={{ color: GOLD }}
            >
              {content.bookSolution.title}{" "}
              <span style={{ color: ORANGE }}>
                {content.bookSolution.titleHighlight}
              </span>
            </h2>
            <p className="mt-5 text-base font-bold text-white/90 md:text-lg">
              {content.bookSolution.intro}
            </p>
            <div className="mt-5 space-y-4">
              {content.bookSolution.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-white/75 md:text-base"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Left: Book image */}
          <div className="order-1 flex items-center justify-center md:order-2">
            <div className="relative">
              {content.bookSolution.bookImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={content.bookSolution.bookImage}
                  alt="הספר"
                  className="max-h-[420px] w-auto rotate-[-6deg] drop-shadow-2xl"
                />
              ) : (
                <div
                  className="relative flex h-72 w-52 rotate-[-6deg] items-center justify-center rounded-lg sm:h-80 sm:w-60 md:h-96 md:w-72"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE} 0%, ${RED} 50%, ${NAVY} 100%)`,
                    boxShadow: `0 30px 70px -10px ${ORANGE}99, inset 0 0 40px rgba(0,0,0,0.3)`,
                  }}
                >
                  <div className="text-center">
                    <CrownIcon
                      className="mx-auto size-16 md:size-20"
                      style={{ color: GOLD }}
                    />
                    <p
                      className="mt-3 text-2xl font-black md:text-3xl"
                      style={{ color: GOLD }}
                    >
                      לחיות
                    </p>
                    <p
                      className="text-2xl font-black md:text-3xl"
                      style={{ color: GOLD }}
                    >
                      כמו מלך
                    </p>
                    <p className="mt-2 text-xs text-white/80">
                      השליטה בידיים שלך
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============== PAIN CARDS — אח יקר אם אתה: ============== */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: NAVY }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            className="mb-10 text-center text-2xl font-black tracking-tight md:mb-14 md:text-4xl"
            style={{ color: GOLD }}
          >
            {content.painCards.title}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.painCards.cards.map((card, idx) => (
              <div
                key={idx}
                className="rounded-2xl border p-5 text-center text-sm leading-relaxed text-white/90 sm:text-base"
                style={{
                  background: NAVY_CARD,
                  borderColor: `${GOLD}33`,
                }}
              >
                {card.text}
              </div>
            ))}
          </div>

          <p
            className="mt-12 text-center text-2xl font-black tracking-tight md:text-4xl"
            style={{ color: GOLD }}
          >
            {content.painCards.bottomLine}
          </p>
        </div>
      </section>

      {/* ============== MOUNTAIN BIG CTA ============== */}
      <section
        className="relative overflow-hidden py-24 md:py-36"
        style={
          content.mountainCta.backgroundImage
            ? {
                backgroundImage: `url(${content.mountainCta.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: `linear-gradient(180deg, ${NAVY_DEEP} 0%, #2A4A3D 50%, ${NAVY} 100%)`,
              }
        }
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${NAVY}AA 0%, ${NAVY_DEEP}DD 100%)`,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p
            className="text-balance text-2xl font-black leading-tight tracking-tight md:text-4xl lg:text-5xl"
            style={{
              color: "#FFF",
              textShadow: "0 4px 24px rgba(0,0,0,0.7)",
            }}
          >
            {content.mountainCta.title}
          </p>
          <p
            className="mt-4 text-balance text-2xl font-black tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: GOLD, textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}
          >
            {content.mountainCta.titleHighlight}
          </p>
        </div>
      </section>

      {/* ============== JOURNEY CARDS — 6 cards ============== */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: NAVY }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center md:mb-14">
            <h2 className="text-balance text-3xl font-black leading-tight tracking-tight md:text-5xl">
              <span style={{ color: GOLD }}>{content.journeyCards.title}</span>{" "}
              <span style={{ color: ORANGE }}>
                {content.journeyCards.titleHighlight}
              </span>
            </h2>
            <p className="mt-4 text-base text-white/75 md:text-lg">
              {content.journeyCards.subtitle}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.journeyCards.cards.map((card, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-1"
                style={{
                  background: NAVY_CARD,
                  borderColor: `${GOLD}40`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="text-2xl font-black"
                    style={{ color: GOLD }}
                  >
                    {card.number}
                  </div>
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `${GOLD}1A`,
                      color: GOLD,
                    }}
                  >
                    <JourneyIcon name={card.iconName} className="size-5" />
                  </div>
                </div>
                <h3 className="mt-3 text-base font-black leading-tight md:text-lg">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70 md:text-sm">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section
        id="testimonials"
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: NAVY_DEEP }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 text-center md:mb-14">
            <h2
              className="text-balance text-3xl font-black tracking-tight md:text-5xl"
              style={{ color: GOLD }}
            >
              {content.testimonials.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-white/70 md:text-base">
              {content.testimonials.subtitle}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {content.testimonials.items.map((t, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border p-6 sm:p-7"
                style={{
                  background: `linear-gradient(135deg, #1F4D6D 0%, #163E5A 100%)`,
                  borderColor: `${GOLD}33`,
                }}
              >
                <div
                  className="absolute right-4 top-3 text-5xl leading-none"
                  style={{ color: `${GOLD}AA` }}
                >
                  &rdquo;
                </div>
                <h3
                  className="text-base font-black leading-tight md:text-lg"
                  style={{ color: GOLD }}
                >
                  {t.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85 md:text-base">
                  {t.quote}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:underline md:text-base"
              style={{ color: GOLD }}
            >
              {content.testimonials.moreLink}
              <ArrowLeftIcon className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============== ARTICLES ============== */}
      <section
        id="articles"
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: NAVY }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-8 text-center md:mb-12">
            <h2
              className="mx-auto max-w-3xl text-balance text-2xl font-black leading-tight tracking-tight md:text-3xl lg:text-4xl"
              style={{ color: GOLD }}
            >
              {content.articles.title}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-balance text-sm leading-relaxed text-white/75 md:text-base">
              {content.articles.intro}
            </p>
          </div>

          <div className="space-y-3">
            {content.articles.items.map((article, idx) => (
              <div
                key={idx}
                className="rounded-xl border p-5 transition-colors hover:bg-white/[0.02]"
                style={{
                  background: NAVY_CARD,
                  borderColor: `${GOLD}33`,
                }}
              >
                <div
                  className="mb-3 h-1.5 w-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, ${ORANGE}, ${GOLD})`,
                  }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-black"
                    style={{ background: GOLD, color: NAVY_DEEP }}
                  >
                    {article.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black leading-tight text-white md:text-base">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/65 md:text-sm">
                      {article.excerpt}
                    </p>
                    <a
                      href="#"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold md:text-sm"
                      style={{ color: GOLD }}
                    >
                      {article.readMoreText} <ArrowLeftIcon className="size-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:underline md:text-base"
              style={{ color: GOLD }}
            >
              {content.articles.moreLink}
              <ArrowLeftIcon className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============== CONTACT FORM ============== */}
      <section
        id="contact"
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: NAVY_DEEP }}
      >
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-8 text-center md:mb-10">
            <h2
              className="text-balance text-3xl font-black tracking-tight md:text-5xl"
              style={{ color: GOLD }}
            >
              {content.contact.title}
            </h2>
            <p className="mx-auto mt-4 text-balance text-sm text-white/75 md:text-base">
              {content.contact.description}
            </p>
          </div>

          <form action="#" method="post" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                name="name"
                placeholder={content.contact.fieldName}
                required
                className="w-full rounded-full border px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
                style={{
                  background: NAVY_CARD,
                  borderColor: `${GOLD}40`,
                }}
              />
              <input
                type="email"
                name="email"
                placeholder={content.contact.fieldEmail}
                className="w-full rounded-full border px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
                style={{
                  background: NAVY_CARD,
                  borderColor: `${GOLD}40`,
                }}
              />
              <input
                type="tel"
                name="phone"
                placeholder={content.contact.fieldPhone}
                className="w-full rounded-full border px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
                style={{
                  background: NAVY_CARD,
                  borderColor: `${GOLD}40`,
                }}
              />
            </div>

            <textarea
              name="message"
              placeholder={content.contact.fieldMessage}
              rows={4}
              className="w-full resize-none rounded-2xl border px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
              style={{
                background: NAVY_CARD,
                borderColor: `${GOLD}40`,
              }}
            />

            <label className="flex items-center gap-2 text-xs text-white/70 md:text-sm">
              <input
                type="checkbox"
                className="size-4 rounded border-white/30 bg-transparent"
                style={{ accentColor: GOLD }}
              />
              <span>
                <CheckIcon
                  className="me-1 inline size-3.5"
                  style={{ color: GOLD }}
                />
                {content.contact.consentText}
              </span>
            </label>

            <div className="flex justify-center pt-3">
              <button
                type="submit"
                className="rounded-full px-12 py-3 text-base font-black text-black shadow-2xl transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                  boxShadow: `0 18px 45px -10px ${GOLD}80`,
                }}
              >
                {content.contact.submitText}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ============== APPS — SOS + Aryot + Social ============== */}
      <section
        className="relative overflow-hidden py-16 md:py-20"
        style={{ background: NAVY }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2
            className="text-balance text-3xl font-black tracking-tight md:text-4xl"
            style={{ color: GOLD }}
          >
            {content.apps.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-white/75 md:text-base">
            {content.apps.description}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {/* SOS card */}
            <div
              className="relative overflow-hidden rounded-3xl border p-6"
              style={{
                background: `linear-gradient(135deg, #4A1F2A 0%, ${NAVY_DEEP} 100%)`,
                borderColor: `${RED}66`,
              }}
            >
              <div
                className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${RED}, #C0392B)`,
                  boxShadow: `0 12px 30px -10px ${RED}99`,
                }}
              >
                <SocialIcon platform="whatsapp" className="size-8 text-white" />
              </div>
              <h3 className="text-lg font-black md:text-xl" style={{ color: RED }}>
                {content.apps.sosCard.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-white/75 md:text-sm">
                {content.apps.sosCard.description}
              </p>
              <a
                href={content.apps.sosCard.href}
                className="mt-5 inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-black text-white shadow-md transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${RED}, #C0392B)`,
                }}
              >
                {content.apps.sosCard.cta}
              </a>
            </div>

            {/* Aryot card */}
            <div
              className="relative overflow-hidden rounded-3xl border p-6"
              style={{
                background: `linear-gradient(135deg, #4A331E 0%, ${NAVY_DEEP} 100%)`,
                borderColor: `${ORANGE}66`,
              }}
            >
              <div
                className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                  boxShadow: `0 12px 30px -10px ${ORANGE}99`,
                }}
              >
                <SocialIcon platform="whatsapp" className="size-8 text-white" />
              </div>
              <h3
                className="text-lg font-black md:text-xl"
                style={{ color: ORANGE }}
              >
                {content.apps.aryotCard.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-white/75 md:text-sm">
                {content.apps.aryotCard.description}
              </p>
              <a
                href={content.apps.aryotCard.href}
                className="mt-5 inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-black text-white shadow-md transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                }}
              >
                {content.apps.aryotCard.cta}
              </a>
            </div>
          </div>

          {/* Social row */}
          <div className="mt-12">
            <p className="text-sm font-bold text-white/70">
              {content.apps.socialTitle}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {content.apps.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                    color: NAVY_DEEP,
                  }}
                  aria-label={link.platform}
                >
                  <SocialIcon platform={link.platform} className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer
        className="relative overflow-hidden border-t py-12"
        style={{
          background: NAVY_DEEP,
          borderColor: `${GOLD}33`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brand on right (RTL: appears first) */}
            <div className="text-right">
              <div className="flex items-center gap-2">
                <CrownIcon className="size-7" style={{ color: GOLD }} />
                <span className="text-lg font-black" style={{ color: GOLD }}>
                  {content.meta.brandName}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/65">
                {content.footer.brandTagline}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={content.footer.primaryCta.href}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black text-white shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                  }}
                >
                  <DownloadIcon className="size-3.5" />
                  {content.footer.primaryCta.text}
                </a>
                <a
                  href={content.footer.secondaryCta.href}
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold"
                  style={{
                    color: "#22C55E",
                    borderColor: "#22C55E66",
                  }}
                >
                  <PlayIcon className="size-3.5" />
                  {content.footer.secondaryCta.text}
                </a>
              </div>
            </div>

            {/* Columns */}
            {content.footer.columns.map((col) => (
              <div key={col.title}>
                <h3
                  className="mb-3 text-sm font-black uppercase tracking-widest"
                  style={{ color: GOLD }}
                >
                  {col.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mx-auto mt-10 h-px max-w-2xl"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}33, transparent)`,
            }}
          />

          <div className="mt-6 text-center text-xs text-white/50">
            {content.footer.copyrightText}
          </div>
        </div>
      </footer>
    </main>
  );
}
