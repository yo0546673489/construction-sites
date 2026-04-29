import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Prisma Client singleton.
 * - SQLite via better-sqlite3 (Prisma 7 דורש adapter חיצוני).
 * - בדיב, מאחסנים את ה-instance על globalThis כדי למנוע יצירת חיבורים מרובים בעת hot-reload.
 */

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  // ה-URL מגיע כ-"file:./dev.db" — הסר את הקידומת "file:" עבור better-sqlite3
  const filename = url.startsWith("file:") ? url.slice(5) : url;

  const adapter = new PrismaBetterSqlite3({ url: filename });

  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
