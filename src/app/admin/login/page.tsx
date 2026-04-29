import { redirect } from "next/navigation";
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
   * אם הכניסה נכשלת, NextAuth זורק שגיאה ומפנה חזרה עם ?error=...
   */
  async function handleLogin(formData: FormData) {
    "use server";
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#C9A24A]/30 bg-[#C9A24A]/10 text-[#C9A24A]">
            <LockKeyholeIcon className="size-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            דשבורד ניהול
          </h1>
          <p className="mt-2 text-sm text-white/60">
            התחבר עם פרטי המשתמש שלך
          </p>
        </div>

        <form
          action={handleLogin}
          className="space-y-5 rounded-3xl border border-white/10 bg-black/40 p-7 shadow-2xl shadow-black/40 backdrop-blur md:p-8"
        >
          {errorParam && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-200">
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
              className="h-12 rounded-xl border-white/15 bg-white/5 text-base text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30"
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
              className="h-12 rounded-xl border-white/15 bg-white/5 text-base text-white placeholder:text-white/35 focus-visible:border-[#C9A24A] focus-visible:ring-[#C9A24A]/30"
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#C9A24A] text-base font-bold text-black hover:bg-white"
          >
            התחבר לדשבורד
          </Button>

          <p className="text-center text-xs text-white/45">
            <span className="font-semibold text-white/60">דמו:</span>{" "}
            admin@example.com / admin123
            <br />
            <span className="font-semibold text-white/60">בעל עסק:</span>{" "}
            owner@example.com / owner123
          </p>
        </form>
      </div>
    </main>
  );
}
