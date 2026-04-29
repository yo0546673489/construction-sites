/**
 * Seed — מאתחל את ה-DB עם משתמשים ותוכן ראשוניים.
 * הרצה: `npx prisma db seed` או באופן אוטומטי בעת migrate dev.
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
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
  console.log("🌱 Seeding database...");

  // ---------- SUPERADMIN ----------
  const superadminPassword = "admin123"; // ⚠️ לשנות בייצור!
  const superadminHash = await bcrypt.hash(superadminPassword, 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "מנהל מערכת",
      passwordHash: superadminHash,
      role: "SUPERADMIN",
      tenantId: null,
    },
  });
  console.log("  ✓ SUPERADMIN: admin@example.com / admin123");

  // ---------- TENANT דוגמה ----------
  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      slug: "demo",
      name: "שיפוצי הדגמה",
      content: stringifySiteContent(DEFAULT_SITE_CONTENT),
      published: true,
    },
  });
  console.log(`  ✓ Tenant: ${tenant.name} (slug: ${tenant.slug})`);

  // ---------- OWNER של ה-Tenant ----------
  const ownerPassword = "owner123";
  const ownerHash = await bcrypt.hash(ownerPassword, 10);

  await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {
      tenantId: tenant.id,
    },
    create: {
      email: "owner@example.com",
      name: "בעל העסק",
      passwordHash: ownerHash,
      role: "OWNER",
      tenantId: tenant.id,
    },
  });
  console.log("  ✓ OWNER: owner@example.com / owner123 → demo");

  console.log("\n✅ Done!");
  console.log("\nגישה לדשבורד: http://localhost:3000/admin/login");
  console.log("דף הנחיתה הציבורי: http://localhost:3000/sites/demo");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
