import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pro-digital.org"),
  title: "לידים לשיפוצניקים — אנחנו מביאים, אתה עובד",
  description:
    "מערכת חכמה שמביאה לשיפוצניקים פניות חמות של לקוחות אמיתיים — בלי לרדוף, בלי פרסום, בלי כאב ראש.",
  alternates: {
    canonical: "/",
    languages: {
      "he-IL": "/",
      "x-default": "/",
    },
  },
  other: {
    "geo.region": "IL",
    "geo.placename": "Israel",
    language: "Hebrew",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect לדומיינים שמאחורי משאבים קריטיים */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
