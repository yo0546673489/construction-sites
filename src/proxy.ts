import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Proxy (Next.js 16+) — מגן על /admin/* (פרט ל-/admin/login).
 * אם אין session, מפנה ל-/admin/login עם callbackUrl.
 *
 * הערה: מ-Next.js 16, `middleware.ts` הוחלף ב-`proxy.ts`.
 */
export default auth((req) => {
  const { pathname, search } = req.nextUrl;

  // login הוא פתוח לכולם
  if (pathname === "/admin/login") return NextResponse.next();

  // כל שאר ה-/admin/* דורש משתמש מחובר
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

// matcher — להריץ את ה-proxy רק ב-/admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
