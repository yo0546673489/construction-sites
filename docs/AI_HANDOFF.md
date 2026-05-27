# AI Handoff — START HERE

This is a curated tour of the project for an AI (or dev) joining cold. Read this first; it's the index to everything else.

---

## In one paragraph

Pro Digital is a multi-tenant Hebrew SaaS. SUPERADMIN onboards tenants. Each tenant has a `template` (`renovator` or `charity`) that drives both the public landing page (`/sites/{slug}`, also mapped to root domain via host-rewrites) and the admin dashboard (`/admin/*`). Renovator tenants collect leads from a form. Charity tenants drive donations through external payment links (Nedarim Plus), and a Gmail OAuth + cron-based parser ingests donation receipts back into the dashboard. Meta Marketing API integration shows ad spend per campaign; donations and spend are joined into a cashflow/ROAS view that can be shared as a public read-only link.

---

## Mental model — 3 axes

### 1. Two tenant templates
- `renovator` — the original product. Lead-gen for contractors. Demo tenant `slug=demo`.
- `charity` — newer template. Donation focus. Production tenant `slug=lp-3` ("טוב לב חדש").

The `template` field on `Tenant` flips:
- Which renderer `/sites/[slug]/page.tsx` calls
- Which content schema `parseSiteContent` vs `parseCharityContent` is used
- Which editor `/admin/content/page.tsx` mounts (`ContentEditor` vs `CharityContentEditor`)

### 2. Three roles
- `SUPERADMIN` — platform owner. `tenantId = null`. Lists/creates tenants. Can "enter" any tenant via cookie (`st_active_tenant`) — once entered, all admin pages behave as if they're that tenant's OWNER.
- `OWNER` — tenant operator. Full admin access within their tenant only.
- `EDITOR` — limited tenant role. Can edit content, view leads, but no user/integration management.

Auth flow: NextAuth v5 with Credentials provider + JWT sessions. Role + tenantId baked into the JWT.

### 3. Two integration directions
- **Outbound** — API calls we make:
  - Meta Marketing API (one shared `META_SYSTEM_USER_TOKEN` for the platform; per-tenant `metaAdAccountId`)
  - Microsoft Clarity Data Export API (per-tenant `clarityApiToken`)
- **Inbound + auth-via-OAuth** — APIs that talk to a per-tenant inbox:
  - Gmail API (per-tenant OAuth tokens, encrypted via AES-256-GCM and stored in `GmailConnection`)

---

## Read these in order

1. [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) — what works today, where we stopped, known bugs
2. [`SYSTEM_MAP.md`](SYSTEM_MAP.md) — every flow from click → DB → screen
3. [`DATABASE.md`](DATABASE.md) — all 7 Prisma models
4. [`API_REFERENCE.md`](API_REFERENCE.md) — internal endpoints + external APIs
5. [`FILE_STRUCTURE.md`](FILE_STRUCTURE.md) — what every file does
6. [`DECISIONS.md`](DECISIONS.md) — why things are the way they are (and what NOT to change)
7. [`TODO.md`](TODO.md) — what to work on next
8. [`DEPLOYMENT.md`](DEPLOYMENT.md) — how prod actually runs

---

## The 5 things you absolutely must know

### 1. Next.js 16 — `proxy.ts`, not `middleware.ts`
This project uses **Next.js 16.2.4**. In v16, the file formerly known as `middleware.ts` is now [`src/proxy.ts`](../src/proxy.ts). It uses `auth()` from NextAuth as a wrapper. The matcher applies it to `/admin/:path*` only.

### 2. Public site & admin share `widget-renderer.tsx`
[`src/app/sites/[slug]/page.tsx`](../src/app/sites/[slug]/page.tsx) line 22:
```ts
import { WidgetsCanvas } from "@/components/admin/widget-renderer";
```
Despite living in `components/admin/`, `widget-renderer.tsx`, `landing-preview.tsx`, and `charity-landing-preview.tsx` are part of the **public site rendering path**. A bulk find-replace styling sweep will affect the public landing pages — we learned this the hard way when an `text-white → text-slate-900` regex changed the public site fonts.

**`landing-preview` and `charity-landing-preview`** wrap widgets with edit chrome (the `EditableElement` overlay) for use INSIDE the admin editor. They invoke the same widget renderer, so their visual baseline must match the public site exactly.

If you must restyle, restore from git after: `git checkout HEAD -- src/components/admin/widget-renderer.tsx src/components/admin/landing-preview.tsx src/components/admin/charity-landing-preview.tsx`.

### 3. Multi-tenant isolation is enforced at the **query** level, not RLS
There is no SQLite row-level security. Isolation is achieved by:
- Every server action calling `requireTenantUser()` first
- Every Prisma query including `where: { tenantId: tenant.id }`
- `updateMany` / `deleteMany` (instead of `update` / `delete`) so a tenant-mismatch silently affects 0 rows instead of erroring out with the wrong tenant's row

If you write a new server action, **the first line must be** `const { tenant } = await requireTenantUser();` and every Prisma call must include `tenantId`.

### 4. SUPERADMIN's "active tenant" is in a cookie
`st_active_tenant` cookie tracks which tenant a SUPERADMIN is currently managing. `getActiveTenantId()` reads it. `enterTenant(id)` sets it; `exitTenant()` clears it. This is what makes "act as customer X" work — the same admin pages just resolve a different tenant.

For OWNER/EDITOR users, `tenantId` comes from the JWT directly (no cookie used).

### 5. Production has uncommitted drift
The server (`webapp@46.225.25.221:~/platform/`) clones from GitHub `yo0546673489/construction-sites.git` but is **67+ files ahead** of `origin/main` after a marathon of iterations. Don't run destructive git commands without first syncing. The local Windows working copy at `D:/שולחן עבודה/קלוד/בניית אתר/my-website/` is **not** a git repo at all — it's a raw working tree.

---

## Sensitive areas — extra caution

| Area | Why sensitive |
|---|---|
| `src/proxy.ts` | One bug here locks everyone out of admin |
| `src/auth.ts` | NextAuth v5 beta — beta API; check Next.js docs before changing |
| `src/lib/encryption.ts` | Changing `ENCRYPTION_KEY` breaks all stored Gmail tokens |
| `src/lib/donation-parser.ts` | Hebrew regex + email parsing; subtle bugs cause silent ingestion failures |
| `src/components/admin/widget-renderer.tsx` | Renders public site widgets — see warning #2 above |
| `prisma/schema.prisma` migrations | SQLite; some ALTER ops require recreating tables |
| `next.config.ts` rewrites | Host-based rewrites map subdomains to `/sites/{slug}` |

---

## How to get oriented in 30 minutes

1. **Read `next.config.ts`** — rewrites teach you the URL→tenant mapping.
2. **Read `prisma/schema.prisma`** — 7 models, the data is the spine of the app.
3. **Read `src/auth.ts` + `src/proxy.ts` + `src/lib/auth-helpers.ts`** — auth + tenant resolution.
4. **Read `src/lib/donations-service.ts`** — the meatiest piece of business logic.
5. **Run locally** — `npm install && npx prisma db seed && npm run dev`. Log in as `owner@example.com / owner123`. Click around `/admin/*`.

---

## Pitfalls / lessons learned

- **Bulk regex find-replace on Tailwind classes** is dangerous. The same class can mean different things on a colored vs neutral background (e.g. `text-white` on an emerald button is correct, on a slate-50 card invisible).
- **Hebrew word boundaries** `\b` don't work in JS regex for Hebrew letters. Use `(?<![֐-׿])X(?![֐-׿])` instead.
- **Gmail search with quoted Hebrew** (`"מילה"`) returns 0 results. Use parens: `(מילה)` so Gmail does an AND on the words.
- **Nedarim Plus sends 2 emails per donation** — the original `[נדרים פלוס] התקבלה עסקה חדשה` and a follow-up `[העתק קבלה]` 30s later. Both can match a keyword. The parser at `donation-parser.ts` filters out the receipt copies + form submissions + error/refusal emails.
- **The donation keyword "פרויקט 36" vs "פרוייקט 36"** — Hebrew has variant spellings. The keyword stored in DB must match the email body exactly. We hit this once already (one yod vs two yods in "פרוייקט").
- **`overflow-x-auto` on the admin layout clipped a popover.** That's why `DateRangePicker` is now `position: fixed` (centered modal) instead of `absolute`.

---

## When in doubt

- Check `node_modules/next/dist/docs/` for Next.js 16-specific docs (per `AGENTS.md`).
- Test on `/admin/login` with `owner@example.com / owner123` (demo tenant) before touching prod.
- Don't run `git checkout` without confirming what's uncommitted.
- If a sync/cron job behaves wrong, write a quick `scripts/diag-X.ts` and run with `npx tsx`. There are 3 examples already in `scripts/`.
