import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const filename = url.startsWith("file:") ? url.slice(5) : url;
const adapter = new PrismaBetterSqlite3({ url: filename });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tenant = await prisma.tenant.findUnique({ where: { slug: "demo" } });
  if (!tenant) {
    console.log("no tenant");
    return;
  }
  await prisma.lead.createMany({
    data: [
      {
        tenantId: tenant.id,
        name: "אבי כהן",
        phone: "0501234567",
        area: "תל אביב",
        notes: "מעוניין בשיפוץ מטבח, תקציב 40K",
        status: "NEW",
        handled: false,
      },
      {
        tenantId: tenant.id,
        name: "רחל לוי",
        phone: "0509876543",
        area: "ירושלים",
        notes: "אמבטיה — דחוף",
        status: "CONTACTED",
        handled: true,
      },
      {
        tenantId: tenant.id,
        name: "דני ביטון",
        phone: "0521112233",
        area: "מרכז",
        notes: null,
        status: "WON",
        handled: true,
      },
    ],
  });
  console.log("seeded 3 leads");
}

main().finally(() => prisma.$disconnect());
