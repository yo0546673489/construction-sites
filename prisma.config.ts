import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 — קונפיג גלובלי לפרויקט.
// ה-DATABASE_URL מגיע מ-.env (file:./dev.db).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --import tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
