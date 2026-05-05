/**
 * סקריפט יצירת tenant חדש בתבנית "king" (לחיות כמו מלך).
 *
 * הרצה:
 *   npx tsx scripts/seed-king.ts            # יוצר tenant עם slug "king"
 *   npx tsx scripts/seed-king.ts mybrand    # יוצר tenant עם slug שונה
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  DEFAULT_KING_CONTENT,
  stringifyKingContent,
} from "../src/lib/king-content";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const filename = url.startsWith("file:") ? url.slice(5) : url;

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: filename }),
});

async function main() {
  const slug = process.argv[2] ?? "king";

  const existing = await prisma.tenant.findUnique({ where: { slug } });

  if (existing) {
    // אם קיים — מעדכן את התבנית והתוכן ל-defaults
    await prisma.tenant.update({
      where: { id: existing.id },
      data: {
        template: "king",
        content: stringifyKingContent(DEFAULT_KING_CONTENT),
        published: true,
      },
    });
    console.log(`✅ Updated existing tenant "${slug}" to template "king".`);
  } else {
    // יצירה חדשה
    await prisma.tenant.create({
      data: {
        slug,
        name: DEFAULT_KING_CONTENT.meta.brandName,
        template: "king",
        content: stringifyKingContent(DEFAULT_KING_CONTENT),
        published: true,
      },
    });
    console.log(`✅ Created new tenant "${slug}" with template "king".`);
  }

  console.log(`📍 View at: http://localhost:3000/sites/${slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
