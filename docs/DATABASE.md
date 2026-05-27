# Database

SQLite via Prisma 7. Schema at `prisma/schema.prisma`. Adapter: `@prisma/adapter-better-sqlite3`. File: `prisma/dev.db` (local) / `~/platform/prisma/dev.db` (prod).

---

## Why SQLite

This is a single-server platform with low concurrent write volume (one cron + a handful of admin clicks). SQLite handles it fine. Migration to Postgres is straightforward when scale demands — change `provider` in schema + `DATABASE_URL`.

---

## Models — at a glance

```
Tenant ─┬─ User           (1:N)  cascade delete
        ├─ Lead           (1:N)  cascade delete
        ├─ GmailConnection(1:1)  cascade delete   ← UNIQUE on tenantId
        ├─ DonationKeyword(1:N)  cascade delete
        ├─ Donation       (1:N)  cascade delete
        └─ ShareableReport(1:N)  cascade delete

DonationKeyword ─ Donation (1:N)  on delete: SET NULL on Donation.keywordId
```

---

## Tenant
The platform's "customer".

| Field | Type | Note |
|---|---|---|
| `id` | String, cuid | PK |
| `slug` | String, UNIQUE | URL segment for `/sites/{slug}` |
| `name` | String | Display name in admin |
| `template` | String, default `"renovator"` | `"renovator"` \| `"charity"` — switches public renderer + content schema + admin editor |
| `content` | String | JSON-serialized content. Schema = `SiteContent` (renovator) or `CharitySiteContent` (charity). Single source of truth for all texts/images/numbers on the public site. |
| `published` | Boolean, default `true` | If false, public `/sites/{slug}` returns 404 |
| `facebookPixelCode` | String? | Full `<script>` block. Injected into public site head. |
| `clarityCode` | String? | Full Clarity `<script>` block. Injected into public site head. |
| `clarityApiToken` | String? | API token (secret). Used server-side only by `/admin/analytics`. |
| `metaAdAccountId` | String? | `act_123456789` format. Used by `/admin/campaigns` & `/admin/reports`. |
| `metaAdAccountName` | String? | Cached display name (currently never written — present in schema but no UI). |
| `createdAt` / `updatedAt` | DateTime | Standard timestamps |

Indexes: `@@index([slug])` (in addition to UNIQUE).

---

## User
A user of the admin dashboard.

| Field | Type | Note |
|---|---|---|
| `id` | String, cuid | PK |
| `email` | String, UNIQUE | Login id |
| `name` | String? | Display name |
| `passwordHash` | String | bcrypt hash, 10 rounds |
| `role` | String, default `"OWNER"` | `"SUPERADMIN"` \| `"OWNER"` \| `"EDITOR"` |
| `tenantId` | String? | NULL only for SUPERADMIN |
| `tenant` | Tenant? | Cascade delete (deleting a tenant kills its users) |
| `createdAt` / `updatedAt` | DateTime | Standard |

Indexes: `@@index([tenantId])`.

Created via:
- `prisma/seed.ts` (admin@example.com, owner@example.com)
- `tenants/actions.ts > createTenant` (creates an OWNER per new tenant)
- `users/actions.ts > createUser` (OWNER adds EDITORs to their tenant)

---

## Lead
A form submission from the public site.

| Field | Type | Note |
|---|---|---|
| `id` | String, cuid | PK |
| `tenantId` | String | FK |
| `name` | String | Required |
| `phone` | String | Required, free text (Israeli formats) |
| `area` | String? | Free text (city/region) |
| `notes` | String? | Currently no UI; reserved for future |
| `status` | String, default `"NEW"` | `"NEW"` \| `"CONTACTED"` \| `"WON"` \| `"LOST"` |
| `handled` | Boolean, default `false` | Independent toggle, can be marked without changing status |
| `createdAt` / `updatedAt` | DateTime | Standard |

Indexes: `@@index([tenantId, createdAt])` (for `/admin/leads` ordered queries).

Submission entry point: `src/app/sites/actions.ts > submitLead` (no auth — public).

---

## GmailConnection
Per-tenant OAuth tokens for Gmail.

| Field | Type | Note |
|---|---|---|
| `id` | String, cuid | PK |
| `tenantId` | String, UNIQUE | One Gmail per tenant |
| `email` | String | Plain (display only) |
| `accessToken` | String | **Encrypted** via `lib/encryption.ts` (AES-256-GCM, salt+IV+tag, base64) |
| `refreshToken` | String | **Encrypted** (same scheme) |
| `tokenExpiresAt` | DateTime | When access token expires; refresh kicks in 5 min before |
| `lastSyncAt` | DateTime? | Updated on each successful sync |
| `lastSyncError` | String? | Last sync's error message (or null) |
| `syncEnabled` | Boolean, default `true` | Set to false if refresh fails — UI shows "reconnect" |
| `createdAt` / `updatedAt` | DateTime | Standard |

Created/updated by: `lib/gmail-api.ts > saveGmailConnection` (called from OAuth callback).

⚠️ **Encryption key dependency:** `ENCRYPTION_KEY` env var derives the AES key. If it changes, all stored tokens become unreadable. Store it like a vault password.

---

## DonationKeyword
Maps a Hebrew search keyword (appears in Nedarim Plus emails) to a campaign name (matched against Meta campaign names).

| Field | Type | Note |
|---|---|---|
| `id` | String, cuid | PK |
| `tenantId` | String | FK |
| `keyword` | String | Substring searched in donation email body (case-insensitive) |
| `campaignName` | String | Display name AND substring matched against Meta campaign names |
| `metaCampaignId` | String? | **Vestigial — no longer used by app code.** Removed from UI; kept in schema for backward compat |
| `color` | String, default `"#3b82f6"` | Hex; UI accent for charts/sections |
| `isActive` | Boolean, default `true` | Inactive keywords skipped during sync |
| `createdAt` / `updatedAt` | DateTime | Standard |

Indexes: `@@index([tenantId])`.

Created via: `keywords-manager.tsx` UI on `/admin/settings/donations`.

---

## Donation
A single donation parsed from an email.

| Field | Type | Note |
|---|---|---|
| `id` | String, cuid | PK |
| `tenantId` | String | FK |
| `keywordId` | String? | FK; SET NULL on keyword delete |
| `amount` | Float | In `currency` units |
| `currency` | String, default `"ILS"` | Always ILS in current data |
| `donorName` | String? | Best-effort extraction |
| `donorPhone` | String? | Best-effort |
| `donorEmail` | String? | Reserved; not currently extracted |
| `paymentMethod` | String? | "ביט" / "אשראי" / "הוראת קבע" / etc. **Often null due to broken Hebrew regex** |
| `emailSubject` | String | Original subject |
| `emailFrom` | String | Original sender |
| `emailDate` | DateTime | When the email was sent (= donation timestamp) |
| `emailMessageId` | String, UNIQUE | Gmail message id — dedupe key |
| `rawSnippet` | String? | First 200 chars of stripped body for debugging |
| `parserSource` | String, default `"universal"` | `"nedarim_plus"` \| `"jgive"` \| `"cardcom"` \| `"paypal"` \| `"matara"` \| `"universal"` |
| `needsReview` | Boolean, default `false` | True if `donorName` or `paymentMethod` couldn't be extracted |
| `createdAt` | DateTime | When ingested (≠ emailDate) |

Indexes:
- `@@index([tenantId, emailDate])` — dashboard date-range queries
- `@@index([keywordId])` — per-keyword aggregations
- `@@index([tenantId, needsReview])` — future "review queue" UI

Inserted only by `lib/donations-service.ts > syncTenantDonations`.

---

## ShareableReport
Public read-only cashflow link.

| Field | Type | Note |
|---|---|---|
| `id` | String, cuid | PK |
| `tenantId` | String | FK |
| `token` | String, UNIQUE | URL token — `crypto.randomBytes(24).toString('base64url')` |
| `title` | String | Shown to public viewer |
| `showSpend` / `showDonations` / `showRoas` / `showCampaigns` | Boolean, all default `true` | Toggle individual sections |
| `password` | String? | Optional plaintext password (compared in URL `?pwd=`) |
| `expiresAt` | DateTime? | If past, page shows "expired" |
| `viewCount` | Int, default `0` | Incremented on each view |
| `lastViewedAt` | DateTime? | Updated on each view |
| `dateRangeDays` | Int, default `30` | Used for `getCashflowSummary` |
| `isActive` | Boolean, default `true` | Soft-disable |
| `createdAt` | DateTime | Standard |

Indexes: `@@index([token])`, `@@index([tenantId])`.

⚠️ Password is **plaintext**. Acceptable for low-risk use (the report is data, not credentials), but worth noting.

---

## Migrations history

```
prisma/migrations/
├── 20260428095915_init/                         — Tenant, User, Lead
├── 20260428115901_add_template/                 — Tenant.template
├── 20260430104439_add_handled_and_pixel/        — Lead.handled, Tenant.facebookPixelCode
├── 20260430113001_pixel_code_field/             — (typo correction / column adjust)
├── 20260501064726_add_clarity_code/             — Tenant.clarityCode
├── 20260501065436_add_clarity_api_token/        — Tenant.clarityApiToken
└── 20260505141752_add_meta_campaigns_and_donations/
                                                  — Tenant.metaAdAccountId/Name
                                                  — GmailConnection
                                                  — DonationKeyword
                                                  — Donation
                                                  — ShareableReport
```

`migration_lock.toml`:
```toml
provider = "sqlite"
```

To create a new migration: `npx prisma migrate dev --name describe_change`. To apply on prod: `npx prisma migrate deploy`.

---

## Seed

`prisma/seed.ts` populates:
- 1 SUPERADMIN: `admin@example.com / admin123`
- 1 OWNER: `owner@example.com / owner123`
- 1 Tenant: `slug=demo, name="שיפוצי הדגמה", template=renovator`

Run with `npx prisma db seed`. Idempotent (uses `upsert`).

---

## Helper diagnostic scripts

Located in `scripts/`. Run with `npx tsx scripts/X.ts` from project root. Useful for manual ops:

- `diag-donations.ts` — full diagnostic of donation sync (DB state + Gmail API queries + parser test)
- `diag-tenants.ts` — list all tenants, gmail connections, keywords, users
- `seed-test-leads.ts` — bulk-create test leads
- `seed-king.ts` — seed a "king" template tenant (legacy, see lib/king-content.ts)
- `create-charity-tenant.ts` / `blank-charity-tenant.ts` — provisioning helpers
- `migrate-charity-tenant.ts` / `migrate-renovator-tenant.ts` — content schema migrations

---

## How the app talks to the DB

`src/lib/db.ts` exports a Prisma singleton:
```ts
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// strip "file:" prefix from DATABASE_URL → pass to better-sqlite3
const adapter = new PrismaBetterSqlite3({ url: filename });
export const prisma = globalThis.__prisma ?? new PrismaClient({ adapter });
```

Stored on `globalThis` in dev to survive HMR. **Never instantiate a new PrismaClient anywhere else.**

---

## Tenant isolation — query patterns

There is no row-level security. Isolation = discipline. Every server-side query that touches per-tenant data MUST include `tenantId` in `where`.

**Safe pattern (preferred):**
```ts
const { tenant } = await requireTenantUser();
await prisma.lead.updateMany({          // ← updateMany, not update
  where: { id: leadId, tenantId: tenant.id },
  data: { status: "WON" },
});
// If leadId belongs to a different tenant, count=0, no data affected.
```

**Unsafe pattern (DO NOT use for cross-tenant writes):**
```ts
await prisma.lead.update({              // ← update without tenant check throws
  where: { id: leadId },                //   if missing — but worse, it would
  data: { status: "WON" },              //   succeed for ANY id and leak/edit data
});
```

This is enforced by convention only. There's no linter rule.
