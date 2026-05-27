import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { LockKeyholeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "התחברות — דשבורד" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  // אם המשתמש כבר מחובר — נפנה ישירות לדשבורד
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  const params = await searchParams;
  const callbackUrl =
    typeof params?.callbackUrl === "string" ? params.callbackUrl : "/admin";
  const errorParam = typeof params?.error === "string" ? params.error : null;

  /**
   * Server Action — מבצע signIn דרך NextAuth.
   *
   * NextAuth v5 זורק AuthError כשה-credentials לא תקינים.
   * ב-server actions ב-Next.js, שגיאה לא-מטופלת = 500 generic error page.
   * לכן: AuthError → redirect חזרה ל-/admin/login עם ?error=...
   * שגיאות אחרות (כולל NEXT_REDIRECT אחרי הצלחה) — re-throw.
   */
  async function handleLogin(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        const params = new URLSearchParams({
          error: error.type,
          callbackUrl,
        });
        redirect(`/admin/login?${params.toString()}`);
      }
      // re-throw redirect/internal errors כדי ש-Next.js יפנה כרגיל
      throw error;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
            <LockKeyholeIcon className="size-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            דשבורד ניהול
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            התחבר עם פרטי המשתמש שלך
          </p>
        </div>

        <form
          action={handleLogin}
          className="space-y-5 rounded-3xl border border-slate-200 bg-black/40 p-7 shadow-2xl shadow-black/40 backdrop-blur md:p-8"
        >
          {errorParam && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-800">
              אימייל או סיסמה שגויים
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-white/80">
              אימייל
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@example.com"
              className="h-12 rounded-xl border-slate-200 bg-slate-50 text-base text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-200"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-white/80"
            >
              סיסמה
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="h-12 rounded-xl border-slate-200 bg-slate-50 text-base text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-200"
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-emerald-500 text-base font-bold text-black hover:bg-white"
          >
            התחבר לדשבורד
          </Button>

          <p className="text-center text-xs text-slate-400">
            <span className="font-semibold text-slate-600">דמו:</span>{" "}
            admin@example.com / admin123
            <br />
            <span className="font-semibold text-slate-600">בעל עסק:</span>{" "}
            owner@example.com / owner123
          </p>
        </form>
      </div>
    </main>
  );
}
