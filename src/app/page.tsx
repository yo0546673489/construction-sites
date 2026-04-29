import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, LockKeyholeIcon } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Premium Lead System — פלטפורמה לשיפוצניקים",
};

/**
 * עמוד הבית של הפלטפורמה — לא לקוח ספציפי.
 * שני קישורים: דשבורד למשתמשים, ודף הדגמה למבקרים.
 * הדפים הציבוריים של לקוחות נמצאים ב-/sites/[slug].
 */
export default async function PlatformHome() {
  // ניצור רשימת לקוחות פעילים (פתוחים) להדגמה. במצב production —
  // כדאי להסיר את ההצגה הזו ולהפנות ל-/admin/login.
  const tenants = await prisma.tenant.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { slug: true, name: true },
    take: 10,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 py-12 text-white">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#C9A24A]">
          <span className="size-1.5 rounded-full bg-[#C9A24A]" />
          Premium Lead System
        </div>
        <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
          פלטפורמה ל
          <span className="text-[#C9A24A]">שיפוצניקים</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base text-white/60 md:text-lg">
          לכל בעל עסק — דף נחיתה משלו, לידים שלו, צוות משלו.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A24A] px-8 py-3.5 text-sm font-bold text-black transition-colors hover:bg-white"
          >
            <LockKeyholeIcon className="size-4" />
            כניסה לדשבורד
            <ArrowLeftIcon className="size-4" />
          </Link>
        </div>

        {tenants.length > 0 && (
          <div className="mt-14">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              דפי נחיתה פעילים
            </div>
            <ul className="grid gap-2 text-sm">
              {tenants.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/sites/${t.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right transition-colors hover:border-[#C9A24A]/30 hover:bg-white/[0.06]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{t.name}</span>
                      <span dir="ltr" className="text-xs text-white/40">
                        /sites/{t.slug}
                      </span>
                    </span>
                    <ExternalLinkIcon className="size-4 text-white/30 transition-transform group-hover:-translate-x-1 group-hover:text-[#C9A24A]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
