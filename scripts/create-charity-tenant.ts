/**
 * סקריפט — יוצר tenant חדש עם תבנית charity ותוכן ברירת-מחדל.
 * הרצה: npx tsx scripts/create-charity-tenant.ts <slug> "<display name>"
 * דוגמה: npx tsx scripts/create-charity-tenant.ts lp-3 "אתר תרומה"
 *
 * אם ה-slug כבר קיים — הסקריפט לא יוצר כפילות אלא מודיע.
 * את התוכן עורכים דרך /admin/content אחרי היצירה.
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
  const slug = process.argv[2];
  const name = process.argv[3];

  if (!slug || !name) {
    console.error("Usage: npx tsx scripts/create-charity-tenant.ts <slug> \"<name>\"");
    process.exit(1);
  }

  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
    console.log(`Tenant '${slug}' already exists (id=${existing.id}). Skipping create.`);
    console.log(`URL: https://pro-digital.org/sites/${slug}`);
    return;
  }

  const tenant = await prisma.tenant.create({
    data: {
      slug,
      name,
      template: "charity",
      content: stringifyCharityContent(DEFAULT_CHARITY_CONTENT),
      published: true,
    },
  });

  console.log(`Created tenant '${slug}' (id=${tenant.id}) with charity template.`);
  console.log(`URL: https://pro-digital.org/sites/${slug}`);
  console.log(`Edit content at: https://pro-digital.org/admin/content`);
}

main()
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
