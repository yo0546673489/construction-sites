import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CircleCheckIcon,
  HardHatIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/lead-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Typewriter } from "@/components/typewriter";
import { PainList } from "@/components/pain-list";
import { Counter } from "@/components/counter";
import { FacebookPixel } from "@/components/facebook-pixel";
import { ClarityScript } from "@/components/clarity-script";
import {
  LocalBusinessSchema,
  NGOSchema,
  WebSiteSchema,
} from "@/components/seo/schemas";
import { WidgetsCanvas } from "@/components/admin/widget-renderer";
import { prisma } from "@/lib/db";
import { parseSiteContent, getElementCSS } from "@/lib/content";
import { parseCharityContent } from "@/lib/charity-content";
import { painIcon, solutionIcon, marketingIcon } from "@/lib/icon-map";
import { CharityLanding } from "@/components/charity/charity-landing";
import { BeforeAfter } from "@/components/renovator/before-after";
import { WhatsAppChat } from "@/components/renovator/whatsapp-chat";
import { TestimonialCard } from "@/components/renovator/testimonial-card";
import { FloatingProof } from "@/components/renovator/floating-proof";
import type { Metadata } from "next";

const SITE_BASE_URL = "https://www.pro-digital.org";

export async function generateMetadata({
  params,
}: PageProps<"/sites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: {
      content: true,
      published: true,
      template: true,
      slug: true,
    },
  });
  if (!tenant || !tenant.published) {
    return { title: "האתר לא נמצא", robots: { index: false, follow: false } };
  }

  /* ===== מטא-דאטה גנרית לכל סוג אתר ===== */
  const title =
    tenant.template === "charity"
      ? parseCharityContent(tenant.content).meta.pageTitle
      : parseSiteContent(tenant.content).meta.pageTitle;
  const description =
    tenant.template === "charity"
      ? parseCharityContent(tenant.content).meta.pageDescription
      : parseSiteContent(tenant.content).meta.pageDescription;
  const ogImage =
    tenant.template === "charity"
      ? parseCharityContent(tenant.content).topBanner?.logo
      : parseSiteContent(tenant.content).hero.backgroundImage;
  const canonical = `${SITE_BASE_URL}/sites/${tenant.slug}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_BASE_URL),
    alternates: {
      canonical,
      languages: { "he-IL": canonical, "x-default": canonical },
    },
    openGraph: {
      type: "website",
      locale: "he_IL",
      url: canonical,
      title,
      description,
      siteName: title,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": "IL",
      "geo.placename": "Israel",
      "og:locale:alternate": "en_US",
    },
  };
}

export default async function PublicLandingPage({
  params,
}: PageProps<"/sites/[slug]">) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
  });

  if (!tenant || !tenant.published) {
    notFound();
  }

  const tenantUrl = `${SITE_BASE_URL}/sites/${tenant.slug}`;

  /* ============== Dispatcher לפי template ============== */
  if (tenant.template === "charity") {
    const charityContent = parseCharityContent(tenant.content);
    return (
      <>
        <WebSiteSchema
          url={tenantUrl}
          name={charityContent.meta.brandName}
          description={charityContent.meta.pageDescription}
        />
        <NGOSchema content={charityContent} url={tenantUrl} />
        <CharityLanding content={charityContent} />
      </>
    );
  }

  /* ============== ברירת מחדל — שיפוצניק ============== */
  const content = parseSiteContent(tenant.content);
  // Helper מקוצר להחלת style override per-element
  const css = (key: string) => getElementCSS(content, key);

  // Fallback URL במקרה שעורך התוכן ניקה את שדה התמונה בטעות
  const heroBg =
    content.hero.backgroundImage ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80";

  return (
    <main className="flex flex-1 flex-col bg-[#0B1D2A] text-white">
      {/* ============== SEO Structured Data ============== */}
      <WebSiteSchema
        url={tenantUrl}
        name={content.meta.brandName}
        description={content.meta.pageDescription}
      />
      <LocalBusinessSchema content={content} url={tenantUrl} />

      {/* ============== HERO ============== */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <Image
          src={heroBg}
          alt="שיפוץ דירה ברמה גבוהה"
          fill
          priority
          quality={70}
          sizes="100vw"
          fetchPriority="high"
          className="object-cover [filter:brightness(0.45)] fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D2A]/70 via-[#0B1D2A]/50 to-[#0B1D2A]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(200,164,93,0.18),transparent_55%)]" />

        {/* Floating proof popups */}
        <FloatingProof
          notificationText={
            content.floatingElements?.fakeNotificationText ||
            "לקוח חדש: שיפוץ דירה 120 מ\"ר — תל אביב"
          }
          whatsappText={
            content.floatingElements?.fakeWhatsAppText ||
            "שלום, צריך הצעת מחיר לשיפוץ"
          }
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-32 md:py-40">
          <div className="max-w-4xl">
            <div className="fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium tracking-wide text-white/85 backdrop-blur-md md:text-sm">
              <span className="size-1.5 rounded-full bg-[#C8A45D]" />
              <span style={css("hero.badge")}>{content.hero.badge}</span>
            </div>

            <h1 className="text-balance text-4xl font-black leading-[1.1] tracking-tight md:text-6xl lg:text-[4.25rem]">
              <Typewriter
                text={content.hero.headlineLine1}
                delay={150}
                speed={50}
                className="block"
                style={css("hero.headlineLine1")}
              />
              <span
                className="mt-3 block text-[#C8A45D]"
                style={css("hero.headlineLine2")}
              >
                <Typewriter
                  text={content.hero.headlineLine2}
                  delay={1700}
                  speed={50}
                />
              </span>
            </h1>

            <p
              className="fade-up mt-7 max-w-2xl text-balance text-lg leading-relaxed text-white/75 md:text-xl"
              style={{ animationDelay: "3s", ...css("hero.subheadline") }}
            >
              {content.hero.subheadline}
            </p>

            <div className="fade-up mt-10" style={{ animationDelay: "3.4s" }}>
              <Button
                size="lg"
                nativeButton={false}
                className="cta-pulse h-14 rounded-full bg-[#C8A45D] px-8 text-base font-bold text-black shadow-2xl shadow-[#C8A45D]/30 transition-all hover:bg-white hover:text-black"
                render={<a href="#lead-form" />}
              >
                <span style={css("hero.primaryCta")}>
                  {content.hero.primaryCta}
                </span>
                <ArrowLeftIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PAIN ============== */}
      <section className="border-y border-white/[0.08] bg-[#1E2F3F] py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center md:mb-16">
            <div
              className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]"
              style={css("pain.kicker")}
            >
              {content.pain.kicker}
            </div>
            <h2
              className="text-balance text-4xl font-black leading-[1.1] tracking-tight md:text-5xl"
              style={css("pain.title")}
            >
              {content.pain.title}
            </h2>
          </div>

          <PainList
            items={content.pain.items.map((item) => ({
              icon: painIcon(item.iconName, "size-5"),
              text: item.text,
            }))}
          />
        </div>
      </section>

      {/* ============== שבירת אמונה ============== */}
      <section className="relative overflow-hidden py-28 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(200,164,93,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
            <span style={css("beliefBreaker.titleBefore")}>
              {content.beliefBreaker.titleBefore}
            </span>
            <span
              className="text-[#C8A45D]"
              style={css("beliefBreaker.titleHighlight")}
            >
              {content.beliefBreaker.titleHighlight}
            </span>
          </h2>
          <p
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
            style={css("beliefBreaker.paragraph1")}
          >
            {content.beliefBreaker.paragraph1}
          </p>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-white md:text-xl"
            style={css("beliefBreaker.paragraph2")}
          >
            {content.beliefBreaker.paragraph2}
          </p>
        </div>
      </section>

      {/* ============== הפתרון ============== */}
      <section
        id="how-it-works"
        className="scroll-mt-12 border-y border-white/[0.08] bg-[#1E2F3F] py-28 md:py-36"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-20 text-center">
            <div
              className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]"
              style={css("solution.kicker")}
            >
              {content.solution.kicker}
            </div>
            <h2 className="text-balance text-3xl font-black leading-[1.1] tracking-tight md:text-5xl">
              <span style={css("solution.titleBefore")}>
                {content.solution.titleBefore}
              </span>
              <br />
              <span
                className="text-[#C8A45D]"
                style={css("solution.titleHighlight")}
              >
                {content.solution.titleHighlight}
              </span>
            </h2>
          </div>

          <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {content.solution.steps.length === 3 && (
              <div
                aria-hidden="true"
                className="absolute top-7 right-[16.66%] left-[16.66%] hidden h-px bg-gradient-to-r from-transparent via-[#C8A45D]/50 to-transparent md:block"
              />
            )}

            {content.solution.steps.map((step) => (
              <div
                key={step.num}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex size-14 items-center justify-center rounded-full border border-[#C8A45D]/40 bg-[#1E2F3F] text-[#C8A45D]">
                  {solutionIcon(step.iconName, "size-6")}
                </div>
                <div className="mt-5 text-xs font-bold tracking-[0.3em] text-[#C8A45D]">
                  {step.num}
                </div>
                <h3 className="mt-3 text-xl font-bold md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== BEFORE / AFTER (רקע בהיר) ============== */}
      <section className="bg-gradient-to-b from-[#F5F5F5] via-white to-[#F5F5F5] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center md:mb-20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#C8A45D]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-[#8A6E2F]">
              <span className="size-1.5 rounded-full bg-[#C8A45D]" />
              {content.beforeAfter.kicker}
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight text-zinc-900 md:text-5xl">
              {content.beforeAfter.title}
            </h2>
            <p className="mt-4 text-base text-zinc-600 md:text-lg">
              {content.beforeAfter.subtitle}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.beforeAfter.items.map((item, i) => (
              <BeforeAfter key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ============== WORK PHOTOS — תמונות שיפוצניקים אמיתיים ============== */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center md:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-900/[0.04] px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-zinc-700">
              <HardHatIcon className="size-3.5" />
              {content.workPhotos.kicker}
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight text-zinc-900 md:text-5xl">
              {content.workPhotos.title}
            </h2>
            <p className="mt-4 text-base text-zinc-600 md:text-lg">
              {content.workPhotos.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {content.workPhotos.items.map((photo, i) => (
              <figure
                key={`${photo.src}-${i}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-200"
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                <figcaption className="absolute right-3 bottom-3 left-3 text-xs font-bold text-white md:text-sm">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============== MARKETING PROCESS — איך המערכת עובדת ============== */}
      <section className="relative overflow-hidden border-y border-white/[0.08] bg-[#1E2F3F] py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(200,164,93,0.20), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center md:mb-20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-[#C8A45D]">
              <SparklesIcon className="size-3.5" />
              {content.marketingProcess.kicker}
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
              {content.marketingProcess.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 md:text-lg">
              {content.marketingProcess.subtitle}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {content.marketingProcess.items.map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-[#C8A45D]/40 hover:bg-white/[0.05]"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#C8A45D]/15 text-[#C8A45D] transition-transform group-hover:scale-110">
                  {marketingIcon(item.iconName, "size-5")}
                </div>
                <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {item.description}
                </p>
                <div
                  className="absolute inset-x-0 -bottom-px h-px scale-x-0 bg-gradient-to-r from-transparent via-[#C8A45D]/60 to-transparent transition-transform group-hover:scale-x-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TAGLINE — משפט חזק ============== */}
      <section className="relative overflow-hidden bg-[#F5F5F5] py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(200,164,93,0.18), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-balance text-3xl font-black leading-[1.1] tracking-tight text-zinc-900 md:text-5xl lg:text-6xl">
            {content.tagline.line1}
          </p>
          <p className="mt-3 text-balance text-3xl font-black leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "#8A6E2F" }}>{content.tagline.line2}</span>
          </p>
        </div>
      </section>

      {/* ============== WHATSAPP PROOF — לידים אמיתיים ============== */}
      <section className="bg-[#F5F5F5] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center md:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-[#075E54]">
              <span className="size-1.5 rounded-full bg-[#25D366]" />
              {content.whatsappProof.kicker}
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight text-zinc-900 md:text-5xl">
              {content.whatsappProof.title}
            </h2>
            <p className="mt-4 text-base text-zinc-600 md:text-lg">
              {content.whatsappProof.subtitle}
            </p>
          </div>

          <WhatsAppChat messages={content.whatsappProof.messages} />
        </div>
      </section>

      {/* ============== הוכחה — מספרים ============== */}
      <section className="border-b border-white/[0.08] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <div
              className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]"
              style={css("proof.kicker")}
            >
              {content.proof.kicker}
            </div>
            <h2
              className="text-balance text-3xl font-black tracking-tight md:text-5xl"
              style={css("proof.title")}
            >
              {content.proof.title}
            </h2>
          </div>

          <div
            className={`grid gap-px overflow-hidden rounded-3xl bg-white/10 md:grid-cols-${Math.min(
              content.proof.stats.length,
              3
            )}`}
          >
            {content.proof.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center bg-[#0B1D2A] px-6 py-14 text-center md:py-20"
              >
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  className="text-6xl font-black tracking-tight text-[#C8A45D] md:text-7xl"
                />
                <div className="mt-3 text-sm font-medium uppercase tracking-wider text-white/75">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS — שיפוצניקים שכבר עובדים איתנו ============== */}
      <section className="bg-gradient-to-b from-white via-[#F5F5F5] to-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center md:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#C8A45D]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-[#8A6E2F]">
              <span className="size-1.5 rounded-full bg-[#C8A45D]" />
              {content.testimonials.kicker}
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight text-zinc-900 md:text-5xl">
              {content.testimonials.title}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.testimonials.items.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ============== גלריה ============== */}
      <section className="border-b border-white/[0.08] bg-[#1E2F3F] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center md:mb-20">
            <div
              className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]"
              style={css("gallery.kicker")}
            >
              {content.gallery.kicker}
            </div>
            <h2
              className="text-balance text-3xl font-black tracking-tight md:text-5xl"
              style={css("gallery.title")}
            >
              {content.gallery.title}
            </h2>
            <p className="mt-4 text-white/75" style={css("gallery.subtitle")}>
              {content.gallery.subtitle}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {content.gallery.items.map((img, i) => (
              <figure
                key={`${img.src}-${i}`}
                className={`group relative overflow-hidden rounded-3xl bg-[#0B1D2A] ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div
                  className={`relative ${
                    i === 0
                      ? "aspect-[4/5] md:aspect-auto md:h-full"
                      : "aspect-[4/5]"
                  }`}
                >
                  {img.src && (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                  <figcaption className="absolute bottom-5 right-5 text-sm font-semibold tracking-wide text-white">
                    {img.label}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============== בידול ============== */}
      <section className="py-28 md:py-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div
            className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]"
            style={css("differentiator.kicker")}
          >
            {content.differentiator.kicker}
          </div>
          <h2
            className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl"
            style={css("differentiator.title")}
          >
            {content.differentiator.title}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-white/70 md:text-xl">
            <span style={css("differentiator.paragraph1Before")}>
              {content.differentiator.paragraph1Before}
            </span>
            <span
              className="font-semibold text-white"
              style={css("differentiator.paragraph1Highlight")}
            >
              {content.differentiator.paragraph1Highlight}
            </span>
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-white/70 md:text-xl">
            <span style={css("differentiator.paragraph2Before")}>
              {content.differentiator.paragraph2Before}
            </span>
            <span
              className="font-semibold text-white"
              style={css("differentiator.paragraph2Highlight")}
            >
              {content.differentiator.paragraph2Highlight}
            </span>
          </p>
        </div>
      </section>

      {/* ============== BIG REALIZATION — "הבעיה היא לא בך" ============== */}
      {content.bigRealization?.enabled !== false && (
        <section className="relative overflow-hidden bg-[#0B1D2A] py-28 md:py-40">
          {/* Spotlight effect */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(200,164,93,0.18) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(11,29,42,1), transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <p className="text-balance text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
              {content.bigRealization?.line1 || "הבעיה היא לא בך."}
            </p>
            <div className="mx-auto mt-10 max-w-xl space-y-3 text-lg font-medium text-white/75 md:text-2xl">
              <p>{content.bigRealization?.line2 || "זה לא המקצוע שלך."}</p>
              <p>{content.bigRealization?.line3 || "זה לא השירות שלך."}</p>
            </div>
            <p className="mt-12 text-balance text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-white">זה </span>
              <span className="text-[#C8A45D]">
                {(content.bigRealization?.line4 || "השיווק שלך.").replace(
                  /^זה\s*/,
                  ""
                )}
              </span>
            </p>
          </div>
        </section>
      )}

      {/* ============== SHIFT — "תפסיק לחפש עבודה" ============== */}
      {content.shift?.enabled !== false && (
        <section
          className="relative overflow-hidden py-24 md:py-32"
          style={{
            background:
              "linear-gradient(135deg, #1E2F3F 0%, #0B1D2A 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(200,164,93,0.15), transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(200,164,93,0.1), transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <p className="text-balance text-3xl font-black leading-tight tracking-tight text-white/85 md:text-5xl lg:text-6xl">
              {content.shift?.line1 || "תפסיק לחפש עבודה."}
            </p>
            <p className="mt-6 text-balance text-3xl font-black leading-tight tracking-tight text-[#C8A45D] md:text-5xl lg:text-6xl">
              {content.shift?.line2 || "תתחיל לגרום לעבודה להגיע אליך."}
            </p>
          </div>
        </section>
      )}

      {/* ============== CTA + טופס ============== */}
      <section
        id="lead-form"
        className="scroll-mt-12 relative overflow-hidden border-t border-white/[0.08] bg-[#1E2F3F] py-28 md:py-36"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(200,164,93,0.18),transparent_55%)]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <div
              className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]"
              style={css("ctaSection.kicker")}
            >
              {content.ctaSection.kicker}
            </div>
            <h2 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              <span style={css("ctaSection.titleBefore")}>
                {content.ctaSection.titleBefore}
              </span>
              <span
                className="text-[#C8A45D]"
                style={css("ctaSection.titleHighlight")}
              >
                {content.ctaSection.titleHighlight}
              </span>
            </h2>
            <p
              className="mt-6 max-w-md text-lg leading-relaxed text-white/75"
              style={css("ctaSection.description")}
            >
              {content.ctaSection.description}
            </p>

            <div className="mt-10 space-y-4">
              {content.ctaSection.bullets.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#C8A45D]">
                    <CircleCheckIcon className="size-4 text-black" />
                  </div>
                  <span className="text-base font-medium text-white/90">
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <LeadForm
            tenantId={tenant.id}
            buttonText={content.ctaSection.formButtonText}
          />
        </div>
      </section>

      {/* ============== Custom Widgets — שנוספו דרך ה"+" בדשבורד ============== */}
      {content.customWidgets && content.customWidgets.length > 0 && (
        <section
          dir="rtl"
          className="bg-[#0B1D2A] px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <WidgetsCanvas widgets={content.customWidgets} />
          </div>
        </section>
      )}

      {/* ============== Footer ============== */}
      <footer className="bg-[#0B1D2A] py-12 text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 text-sm md:flex-row">
          <div className="flex items-center gap-2.5">
            <HardHatIcon className="size-5 text-[#C8A45D]" />
            <span
              className="font-bold tracking-wide text-white"
              style={css("meta.brandName")}
            >
              {content.meta.brandName}
            </span>
          </div>
          <div className="flex items-center gap-7">
            <a href="#how-it-works" className="hover:text-white">
              איך זה עובד
            </a>
            <a href="#lead-form" className="hover:text-white">
              צור קשר
            </a>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      <WhatsAppButton
        number={content.contact.whatsappNumber}
        message={content.contact.whatsappMessage}
      />

      {/* ============== Facebook Pixel ============== */}
      {tenant.facebookPixelCode && (
        <FacebookPixel code={tenant.facebookPixelCode} />
      )}

      {/* ============== Microsoft Clarity ============== */}
      {tenant.clarityCode && <ClarityScript code={tenant.clarityCode} />}
    </main>
  );
}
