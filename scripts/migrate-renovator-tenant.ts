/**
 * סקריפט חד-פעמי — מאתחל tenant של שיפוצניק עם תוכן ברירת המחדל החדש
 * (כולל הסקשנים החדשים: Before/After, Work Photos, Marketing Process,
 * Tagline, WhatsApp Proof, Testimonials).
 *
 * הרצה: npx tsx scripts/migrate-renovator-tenant.ts demo
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  DEFAULT_SITE_CONTENT,
  stringifySiteContent,
} from "../src/lib/content";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const filename = url.startsWith("file:") ? url.slice(5) : url;

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: filename }),
});

async function main() {
  const slug = process.argv[2] ?? "demo";

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    console.error(`❌ Tenant '${slug}' not found.`);
    process.exit(1);
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      template: "renovator",
      content: stringifySiteContent(DEFAULT_SITE_CONTENT),
    },
  });

  console.log(`✅ Tenant '${slug}' migrated to renovator template.`);
  console.log(`   View at: http://localhost:3000/sites/${slug}`);
}

main()
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
