/**
 * סקריפט חד-פעמי — מעביר את ה-tenant "opentheheart" לתבנית charity
 * ומאתחל אותו עם תוכן ברירת מחדל לעמותה.
 *
 * הרצה: npx tsx scripts/migrate-charity-tenant.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  DEFAULT_CHARITY_CONTENT,
  stringifyCharityContent,
} from "../src/lib/charity-content";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const filename = url.startsWith("file:") ? url.slice(5) : url;

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: filename }),
});

async function main() {
  // התאמה לתבנית charity ברגע שמזהים את הלקוח
  const slug = process.argv[2] ?? "opentheheart";

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    console.error(`❌ Tenant '${slug}' not found.`);
    process.exit(1);
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      template: "charity",
      content: stringifyCharityContent(DEFAULT_CHARITY_CONTENT),
    },
  });

  console.log(`✅ Tenant '${slug}' migrated to charity template.`);
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
