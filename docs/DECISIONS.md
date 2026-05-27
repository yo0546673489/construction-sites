# Decisions

Architectural choices and the reasoning behind them. If you disagree with one, this is the doc to argue against — but read first.

---

## 1. Next.js 16 (App Router)

**Why:** Latest stable. Uses RSC for tenant-scoped data fetching without exposing `tenantId` to the client unnecessarily.

**Don't change:** App Router specifically. Pages router would force redoing all the auth/tenant resolution patterns.

**Notable surprise:** In Next.js 16, the file historically named `middleware.ts` is now `proxy.ts`. The old name still works in some setups but the project uses the new name, per the `AGENTS.md` warning. **Do not rename `proxy.ts` → `middleware.ts`** — the auth wrapper / matcher signatures are subtly different and you'll lock yourself out of admin.

---

## 2. NextAuth v5 (beta) with Credentials + JWT

**Why Credentials + JWT (not OAuth-based login):** Fully custom user table, no third-party identity provider for end-users. Sessions are stateless (JWT) so no `Session` table — simpler.

**Why beta v5:** v4 doesn't support Next.js 16's RSC patterns cleanly. v5 has stable enough APIs for our needs.

**Watch:** beta API can change. If you upgrade, re-test login + the `proxy.ts` `auth(...)` wrapper.

---

## 3. SQLite via Prisma 7 + better-sqlite3 adapter

**Why SQLite:** Single server, low write contention, zero ops cost. The whole DB is < 200KB right now. No reason to host Postgres for this.

**Why Prisma 7 specifically:** It's the version compatible with the `@prisma/adapter-better-sqlite3` package they shipped. Prisma 7 also requires the new `prisma.config.ts` instead of the old `package.json` config block — that's why this project has `prisma.config.ts`.

**When to migrate to Postgres:** When write throughput or multi-server hosting becomes necessary. The migration is mostly mechanical:
1. Change `provider = "sqlite"` → `provider = "postgresql"` in `schema.prisma`
2. Set `DATABASE_URL=postgresql://...`
3. Remove the `adapter` from `db.ts`, use default Prisma client
4. Re-run migrations against fresh Postgres
5. Migrate data with a one-shot script (or `pg_dump` if compat tables exist)

---

## 4. Multi-tenant via "isolated query" pattern (not RLS)

**Why not RLS:** SQLite doesn't support row-level security. We'd need to migrate to Postgres + add RLS policies just for this — overkill for current scale.

**The pattern:**
- Every server action begins with `const { tenant } = await requireTenantUser();`
- Every Prisma query includes `tenantId` in `where` (or as a relation filter)
- For mutations, prefer `updateMany` / `deleteMany` over `update` / `delete` so a wrong-tenant attempt silently affects 0 rows instead of erroring/leaking

**Risk:** Discipline-only. A single forgotten `tenantId` filter in a future server action could leak/edit cross-tenant data. **No linter enforces this.**

**If you want enforcement:** Wrap Prisma in a "tenant-aware client" that auto-injects the filter. Has been considered, not built.

---

## 5. SUPERADMIN "active tenant" cookie

**Why a cookie (not URL):** SUPERADMIN navigates the entire admin UI (`/admin`, `/admin/leads`, etc.) as if they were the OWNER of a specific tenant. Putting `?tenantId=...` in every URL would be ugly and easy to break.

**Cookie:** `st_active_tenant` (httpOnly, sameSite=lax, 7 days). Set by `enterTenant`, cleared by `exitTenant`. Read by `getEffectiveTenantId`.

**Don't:** Make the cookie not-httpOnly. JS doesn't need to read it.

---

## 6. NextAuth `trustHost: true`

**Why:** App runs behind a Caddy reverse proxy in production. Without `trustHost`, NextAuth refuses to honor the `Host` header.

**Risk:** If you ever expose the Next.js port directly (port 3000) to the internet, this becomes a host header spoofing risk. Currently we're behind Caddy so it's fine.

---

## 7. Encryption for Gmail tokens (AES-256-GCM)

**Why encrypt:** Gmail OAuth tokens are credentials that grant read access to user inboxes. If the DB leaks, plaintext tokens give attackers ongoing access to all connected mailboxes. Encryption-at-application-level mitigates DB-only breaches.

**Implementation:** `lib/encryption.ts`. Per-token: random 64-byte salt + 16-byte IV → PBKDF2 (100k iterations, sha512) → AES-256-GCM. Output is `salt | iv | tag | ciphertext` base64.

**Critical:** `ENCRYPTION_KEY` env var. **Never rotate without re-encrypting all stored tokens** or you'll lose every Gmail connection. There's no key rotation tooling — a rotation would require:
1. New env var (`ENCRYPTION_KEY_NEW`)
2. One-time script: decrypt with old, re-encrypt with new
3. Swap env vars

---

## 8. Meta API: one System User Token

**Why one token:** The `META_SYSTEM_USER_TOKEN` is a System User from a Meta Business Manager that we've made an Admin on every client's Ad Account. Per-tenant individual tokens would mean the per-tenant OAuth flow per platform/login → too much friction.

**Trade-off:** A single rotation invalidates EVERY tenant's Meta integration simultaneously.

**If you ever want per-tenant Meta OAuth:** Mirror the Gmail OAuth pattern (`/api/meta/connect` and `/api/meta/callback`) and store tokens in a new `MetaConnection` model. Significant work.

---

## 9. Donation matching: substring-by-name (vs explicit ID)

**Original design:** Each donation keyword had a `metaCampaignId` field. User would enter the exact Meta campaign ID. Linkage was explicit.

**Why we changed:** UX too friction-y. User pivoted to "match by name substring" — if the donation keyword's `campaignName` (e.g. "מזון לתינוקות") appears as a substring in any Meta campaign's name (e.g. "קמפיין מזון לתינוקות חורף 2026"), they're linked. Many-to-many naturally.

**Current state:** `DonationKeyword.metaCampaignId` column still exists in DB but **is no longer read or written by the app** (vestigial). The matching function is `metaCampaignMatchesKeyword(metaCampaignName, keywordCampaignName)` in `donations-service.ts`.

**Don't:** Re-introduce the `metaCampaignId` field in the UI. It was explicitly removed.

---

## 10. Donation parser: keyword + amount required, everything else best-effort

**Why best-effort:** Email formats vary wildly across donation systems. Requiring all fields would skip valid donations. Marking incomplete ones with `needsReview = true` lets us still ingest + show a UI cue.

**Hard requirements:** 
- A keyword (from `donationKeyword`) must appear in `subject + body` (case-insensitive)
- An amount must be extractable

**Best-effort:** donor name, phone, email, payment method.

**Subject blacklist:** העתק קבלה, קבלה ממוחשבת, שגיאה, סירוב, דוח הוראות, התראת הוראות, התקבל טופס. These are duplicates or non-donations from Nedarim Plus.

---

## 11. Light theme + emerald-500 accent (admin only)

**Why:** User explicitly chose this aesthetic. "אור לא חושך" (light, not dark), "ירוק לבן" (green and white).

**Constraint:** Public site (`/sites/[slug]`) must NOT change. Tenants chose those designs intentionally.

**How achieved:** No CSS-var changes (globals.css remains). Direct Tailwind classes on admin layout/components only. Bulk find-replace nearly broke this — we restored `widget-renderer.tsx`, `landing-preview.tsx`, `charity-landing-preview.tsx` from git.

**Style tokens (informal):**
- Canvas: `bg-slate-50`
- Cards: `bg-white border border-slate-200/70 rounded-3xl shadow-sm`
- Brand: `emerald-500` (active), `emerald-600` (hover), `emerald-50` (tinted bg), `emerald-100` (badge bg), `emerald-700` (text)
- Text: `text-slate-900` (primary), `text-slate-600` (secondary), `text-slate-400` (tertiary)
- Buttons: `rounded-full bg-gradient-to-l from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/30`
- Headings: `text-4xl font-black tracking-tight md:text-5xl`
- Page intro pill: `inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700`

---

## 12. Date range URL convention

**URL:** `?from=YYYY-MM-DD&to=YYYY-MM-DD` (preferred) OR `?range=N` (legacy).

**Why both:** Legacy pages used `range=30`. New picker writes `from/to`. Helper `parseDateRange()` accepts both (legacy fallback). When the user picks a preset that ends today, the URL still uses `from/to` (we don't write `range=` anymore).

---

## 13. DateRangePicker as a centered modal (vs popover)

**Original:** Absolute-positioned popover anchored to the trigger button.

**Why we changed:** The admin layout has `overflow-x-auto` to handle wide content. That property clipped the popover when it extended past the parent's right edge. Switching to `position: fixed` + center-translate makes the popover a true modal — never clipped.

**Trade-off:** Modal is slightly more "in your face" than a popover. We gain reliability across all viewport sizes.

---

## 14. Insights panel at the BOTTOM of `/admin/reports`

**Why:** User feedback. The insights panel was originally near the top (after the header). User wanted KPIs/charts/tables first, insights as a "summary" at the bottom.

---

## 15. Manual deploy via scp + pm2 restart

**Why:** Project is in active development with rapid iteration; CI overhead wasn't worth it yet.

**Trade-off:** Server has 67+ uncommitted files vs GitHub. Risk of losing work if someone runs `git checkout` on the server.

**To migrate to CI:** GitHub Actions workflow that on push to main:
1. SSHs to the server
2. `git fetch && git checkout origin/main` (carefully — back up first!)
3. `npm ci && npm run build`
4. `pm2 restart pro-digital --update-env`

Doing this requires first reconciling the drift (commit the 67 files to a branch).

---

## 16. PM2 (vs systemd, vs a Docker setup)

**Why PM2:** Simple Node-aware process manager. Built-in log rotation. `pm2 restart` is one command.

**No Docker:** The Node process is the only thing on the box (besides Caddy). Docker adds overhead without solving any current problem.

---

## 17. Single `META_SYSTEM_USER_TOKEN` in `.env` (not per-tenant)

See decision #8.

---

## 18. Storing `clarityCode` and `facebookPixelCode` as full `<script>` blocks

**Why:** Tenants paste exactly what Facebook/Clarity gives them in their Settings UI. No parsing, no risk of misinterpreting. We just inject as-is into the public `<head>`.

**Trade-off:** XSS attack surface IF a malicious SUPERADMIN (the only role that can set these for non-self tenants) injects `<script>alert(1)</script>`. Mitigated by: only OWNER+ can edit own tenant; SUPERADMIN is implicitly trusted.

---

## 19. Hebrew-first UI but `dir="rtl"` only at `<html>`

**Why:** All admin layouts and pages assume RTL by default via `<html dir="rtl">` in `app/layout.tsx`. Individual `dir="rtl"` on subtrees is rare.

**Watch:** Some shadcn primitives don't auto-flip. Be explicit when you build components with directional layouts (start/end vs left/right Tailwind utilities).

---

## 20. `revalidatePath` after mutations

**Why:** RSC cache otherwise serves stale data. Every server action that mutates DB calls `revalidatePath` for affected pages.

**Pattern:**
```ts
await prisma.donation.create(...);
revalidatePath('/admin/donations');
revalidatePath('/admin/campaigns');  // if it could affect this view too
```

**Bug risk:** Forget to revalidate → user sees stale data after action. There's no automation.

---

## Things that have been tried and failed

1. **Bulk find-replace of `text-white → text-slate-900`** across all admin files. Broke buttons (white text on emerald background became dark on emerald, ugly). Now we always check button bg before such replaces, OR use targeted edits.
2. **Quoted Hebrew Gmail search** (`"פרויקט 36"`). Returns 0 hits. Use parens: `(פרויקט 36)`.
3. **Word-boundary `\b` regex on Hebrew** (`\bביט\b`). Doesn't match (Hebrew letters aren't `\w`). Use Unicode lookarounds: `(?<![֐-׿])ביט(?![֐-׿])`. Not yet fixed in `donation-parser.ts`.
4. **`getDateRange(days)` returning fixed "last N days from today"**. Broke when user wanted custom from/to (e.g. last month). Replaced with `parseDateRange` that returns explicit `since/until`.

---

## Things that are intentionally NOT done

- **No tests.** Manual QA only. Justification: rapid iteration; project is small. When it stabilizes, prioritize integration tests for `donations-service` and `cashflow-service`.
- **No TypeScript strict-null-checks per-file overrides.** The codebase is `strict: true` globally; survive with explicit `?? defaults`.
- **No Sentry/error tracking.** Errors go to PM2 logs only.
- **No analytics on admin actions.** Per privacy preference.
- **No internationalization framework.** Hebrew-only for now. If we add English, use `next-intl` or similar.
