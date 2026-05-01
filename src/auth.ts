import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

/**
 * הרחבת טיפוסי Session ו-JWT — מוסיפים שדות שאנחנו צריכים בכל מקום:
 *  - role: "SUPERADMIN" | "OWNER" | "EDITOR"
 *  - tenantId: ה-Tenant של המשתמש (null עבור SUPERADMIN)
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "SUPERADMIN" | "OWNER" | "EDITOR";
      tenantId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "SUPERADMIN" | "OWNER" | "EDITOR";
    tenantId?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // האפליקציה רצה מאחורי reverse proxy (Caddy) בפרודקשן —
  // צריך לסמן trustHost: true כדי ש-NextAuth יקבל את ה-host header.
  trustHost: true,

  // session via JWT (חובה ל-Credentials provider)
  session: { strategy: "jwt" },

  // דף ההתחברות שלנו
  pages: {
    signIn: "/admin/login",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "אימייל", type: "email" },
        password: { label: "סיסמה", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // מה שמוחזר כאן נכנס ל-jwt() callback בפעם הראשונה
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role as "SUPERADMIN" | "OWNER" | "EDITOR",
          tenantId: user.tenantId,
        };
      },
    }),
  ],

  callbacks: {
    // מועבר בלוגין הראשון: user מלא; בקריאות הבאות: רק token.
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as "SUPERADMIN" | "OWNER" | "EDITOR";
        token.tenantId = user.tenantId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub ?? "";
        session.user.role =
          (token.role as "SUPERADMIN" | "OWNER" | "EDITOR") ?? "EDITOR";
        session.user.tenantId = (token.tenantId as string | null) ?? null;
      }
      return session;
    },
  },
});
