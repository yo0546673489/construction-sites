# System Map — End-to-end Architecture

Every flow, top to bottom.

---

## High-level topology

```
                                 ┌─────────────────────────┐
                                 │  Browser (RTL Hebrew)   │
                                 └────────────┬────────────┘
                                              │ HTTPS
                                              ▼
                                  ┌──────────────────────┐
                                  │   Caddy reverse-proxy│   (assumed by trustHost:true)
                                  │   *.pro-digital.org  │
                                  └────────────┬─────────┘
                                              │ :3000 over loopback
                                              ▼
        ┌───────────────────────────────────────────────────────────────┐
        │                  Next.js 16 (App Router)                      │
        │                  Process: PM2 "pro-digital"                   │
        │                  Path: /home/webapp/platform                  │
        │                                                               │
        │   ┌──────────────────┐         ┌──────────────────┐         │
        │   │ proxy.ts         │         │ App router pages │         │
        │   │ guards /admin/*  │────────▶│  /admin/*        │         │
        │   └──────────────────┘         │  /sites/[slug]   │         │
        │                                │  /r/[token]      │         │
        │                                │  /api/*          │         │
        │                                └────────┬─────────┘         │
        │                                         │                   │
        │   ┌──────────────────┐                  ▼                   │
        │   │ NextAuth (JWT)   │◀──── auth() ──── server components   │
        │   │ src/auth.ts      │      requireTenantUser()             │
        │   └──────────────────┘                                       │
        │                                         │                   │
        │   ┌──────────────────────────────┐      ▼                   │
        │   │ Prisma 7 (better-sqlite3)    │◀─ src/lib/db.ts          │
        │   │ src/lib/*.ts services        │                          │
        │   └────────────┬─────────────────┘                          │
        │                │                                            │
        └────────────────┼────────────────────────────────────────────┘
                         │
                         ▼
              ┌────────────────────┐
              │  prisma/dev.db     │   (SQLite file on disk)
              └────────────────────┘

External APIs reached out from server-side code:
  • Meta Graph API           graph.facebook.com    (System User token from .env)
  • Gmail API                gmail.googleapis.com  (per-tenant OAuth tokens, encrypted)
  • Microsoft Clarity        clarity.ms            (per-tenant API token)
  • Google OAuth             accounts.google.com   (Gmail consent flow)
```

---

## Auth & request lifecycle

### Login
1. User → `GET /admin/login` (page is unprotected by `proxy.ts`)
2. Form submits → server action `handleLogin` → `signIn("credentials", ...)`
3. NextAuth `authorize()` → `prisma.user.findUnique({email})` → `bcrypt.compare(password)`
4. On success → JWT issued with `{role, tenantId}` claims
5. Cookie set (NextAuth's `next-auth.session-token`); redirect to `callbackUrl`

### Every protected request
1. Browser → `/admin/{anything}`
2. **`src/proxy.ts`** runs (Next.js 16's `middleware.ts` replacement)
3. Calls `auth()` → checks `next-auth.session-token` cookie → reads JWT
4. If no auth → redirect to `/admin/login?callbackUrl=...`
5. If auth → request continues, hits the page's RSC

### Inside a server component
```ts
const { tenant, user } = await requireTenantUser();
//                       │
//                       ├── auth() → session
//                       ├── if SUPERADMIN: getActiveTenantId() from cookie
//                       │   else: tenantId from JWT
//                       ├── prisma.tenant.findUnique({where: {id: tenantId}})
//                       └── returns {user, tenant}
```

This pattern is used by **every** admin server component except `/admin/login` itself.

---

## URL → Tenant resolution

Two paths to a tenant page:

### Path A: Direct slug (`/sites/{slug}`)
```
GET /sites/demo
   │
   ▼
src/app/sites/[slug]/page.tsx
   ├── prisma.tenant.findUnique({where: {slug}})
   ├── if !tenant.published → notFound()
   ├── if tenant.template === "charity":
   │      parseCharityContent(tenant.content) → <CharityLanding>
   └── else: parseSiteContent(tenant.content) → renovator UI
              (also renders custom widgets via WidgetsCanvas)
```

### Path B: Host-based rewrite (`/`)
```
next.config.ts → rewrites().beforeFiles:
   host = www.pro-digital.org  →  /sites/demo
   host = lp3.pro-digital.org  →  /sites/lp-3
```
Browser URL stays clean (no redirect), Next.js internally serves the slug page.

---

## Public-site → Lead flow (renovator)

```
Visitor on https://www.pro-digital.org (= /sites/demo internally)
   │
   ├── Fills LeadForm component (name, phone, area)
   ├── Form submits → server action submitLead({tenantId, name, phone, area})
   │      └── src/app/sites/actions.ts
   │             ├── validate (length, required)
   │             ├── prisma.tenant.findUnique({id: tenantId, published: true})
   │             └── prisma.lead.create({tenantId, name, phone, area, status:"NEW"})
   │
   └── Server returns {ok:true} → form shows "תודה" toast

Later — admin views:
   /admin/leads (OWNER/EDITOR of that tenant)
   └── prisma.lead.findMany({where: {tenantId}, orderBy: createdAt desc})
       → <LeadsTable> → click status → updateLeadStatus action → revalidatePath
```

---

## Donation flow (charity, automated)

This is the most complex flow in the app.

### Setup
1. SUPERADMIN/OWNER → `/admin/settings/donations`
2. Click "חבר Gmail" → `GET /api/gmail/connect`
3. Server builds Google OAuth URL, redirects browser to `accounts.google.com`
4. User consents (gmail.readonly + userinfo.email scopes)
5. Google → `GET /api/gmail/callback?code=...`
6. Server: `exchangeCodeForTokens(code)` → fetch userinfo → `saveGmailConnection`
7. Tokens encrypted via `lib/encryption.ts` (AES-256-GCM with PBKDF2-derived key from `ENCRYPTION_KEY`) and stored in `GmailConnection`
8. OWNER adds **donation keywords** in `KeywordsManager` (e.g. campaign name "מזון לתינוקות" + email keyword "פרויקט 36")

### Sync (manual or cron)
- **Manual:** `/admin/donations` → click "סנכרן N ימים" button
  - `POST /api/donations/sync` with `{daysBack: N}` body
  - `auth()` → `getEffectiveTenantId` → `syncTenantDonations(tenantId, N)`
- **Cron:** `GET /api/donations/sync` with `Authorization: Bearer $CRON_SECRET`
  - Iterates over all `GmailConnection` rows with `syncEnabled=true`
  - Calls `syncTenantDonations(tenantId, 2)` for each (last 2 days)
  - Returns `{total, success, failed}` summary
  - **NOTE:** No actual cron is wired up in production — see PROJECT_CONTEXT.md

### Inside `syncTenantDonations`
```
syncTenantDonations(tenantId, daysBack)
   │
   ├── getValidAccessToken(tenantId)
   │     ├── decrypt(stored accessToken)
   │     ├── if expired (with 5-min buffer):
   │     │     refreshAccessToken(decrypted refreshToken)
   │     │     update DB with new tokens
   │     └── return access_token (or null on refresh failure)
   │
   ├── prisma.donationKeyword.findMany({tenantId, isActive:true})
   ├── buildSearchQuery(keywords, daysBack)
   │     → "(keyword1) OR (keyword2) after:YYYY/MM/DD"
   │     (NOT quoted — Hebrew quoted phrases return 0 hits)
   │
   ├── searchMessages(token, query, maxResults=500)
   │     → GET https://gmail.googleapis.com/gmail/v1/users/me/messages
   │     → returns array of {id, threadId}
   │
   ├── prisma.donation.findMany — fetch existing emailMessageIds (dedupe)
   │
   ├── for each new message:
   │     ├── getMessage(token, id) — fetch full body, decode base64url
   │     ├── parseEmail({subject, body, from, date, keywords})
   │     │     ├── if subject is העתק קבלה / קבלה ממוחשבת / שגיאה / סירוב / דוח / התראת / טופס → null
   │     │     ├── stripHtml(body) → cleanBody
   │     │     ├── matchKeyword(subject + cleanBody, keywords) — substring match
   │     │     ├── extractAmount(text) — first matching regex from AMOUNT_PATTERNS
   │     │     ├── extractDonorName, extractPhone, extractPaymentMethod
   │     │     ├── detectParserSource (nedarim_plus / jgive / cardcom / paypal / matara / universal)
   │     │     ├── needsReview = !donorName || !paymentMethod
   │     │     └── return {amount, currency, donorName, donorPhone, paymentMethod,
   │     │                 matchedKeyword, parserSource, needsReview, rawSnippet}
   │     │
   │     └── prisma.donation.create({...parsed, emailMessageId: id (UNIQUE)})
   │
   ├── prisma.gmailConnection.update({lastSyncAt: now})
   └── return {success, newDonations, totalProcessed, errors}
```

### Display
`/admin/donations` page:
1. `getDonationSummary(tenantId, {since, until})` — aggregates: totalAmount, totalCount, avg, uniqueDonors, byCampaign, dailyData, recentDonations
2. `getDonationSummaryByKeyword(tenantId, {since, until})` — array of per-keyword summaries (each with own dailyData + recent5)
3. Renders `DonationKPIs` (overall) + `KeywordSection` per keyword

---

## Meta Ads flow

### Setup (per-tenant)
1. `/admin/settings` → MetaAdAccountSection → enter `act_123456789` → `updateMetaAdAccountId` action → stored in `Tenant.metaAdAccountId`
2. The platform's `META_SYSTEM_USER_TOKEN` (single token in `.env`) must already be granted Admin access to this Ad Account inside Meta Business Manager.

### Display: `/admin/campaigns`
1. Read `parseDateRange` from URL → `{since, until}`
2. `getCampaigns(adAccountId, {since, until})` → all campaigns + insights from Meta Graph API
3. Read `donationKeyword` rows for tenant
4. Filter `allCampaigns` to ones whose `name.toLowerCase().includes(keyword.campaignName.toLowerCase())`
5. Group filtered campaigns by their matched keyword
6. Render: overall summary card + one `CampaignGroup` per keyword (with KPIs + per-keyword `CampaignsTable`)

### Display: `/admin/reports` (cashflow)
1. `getCashflowSummary(tenantId, {since, until})` joins:
   - All donations in range
   - All Meta campaigns in range (filtered by name match to keywords)
   - All keywords (active)
2. Per-keyword: Meta spend (sum of matched campaigns) vs donations (sum from DB) → ROAS
3. Daily aggregation: total Meta spend (proportionally split across N days, since per-day-per-campaign isn't fetched), total donations from DB
4. Auto-generated insights (`generateInsights`) — top campaign by ROAS, losing campaigns, day-of-week analysis, week-over-week trend

---

## Shareable report flow

### Create
`/admin/reports` → `<ShareReportButton>` → `createShareableReport({title, showSpend, ...})` action
- Generates `token = crypto.randomBytes(24).toString('base64url')`
- Stores `ShareableReport` row with optional password + expiry + dateRangeDays (defaults to 30)
- Returns `{url: NEXT_PUBLIC_BASE_URL + "/r/" + token}`

### View
`GET /r/{token}` → `src/app/r/[token]/page.tsx`
- Fetches `ShareableReport` by token (UNIQUE indexed)
- 404 if missing or `!isActive`
- "Expired" view if `expiresAt < now`
- Password gate if `report.password` set and URL lacks `?pwd=...`
- Increments `viewCount` + `lastViewedAt`
- Calls `getCashflowSummary(tenant.id, dateRangeDays)` (legacy — still uses `daysBack` number, not the new `{since, until}` shape)
- Renders `<PublicReportView>` with the show-X flags toggling sections

---

## Microsoft Clarity flow (analytics)

### Setup
- Tenant pastes Clarity script tag in `/admin/settings` → stored in `Tenant.clarityCode` → injected into `/sites/[slug]` head via `<ClarityScript>` component
- Tenant pastes API token in `/admin/settings` → stored in `Tenant.clarityApiToken`

### Display: `/admin/analytics`
1. If no token → "no token" view
2. Else: `fetchClarityInsights(token, days)` → POST to `clarity.ms/export-data/api/v1/project-live-insights?numOfDays=N`
3. Cached for 1 hour via Next's `next: {revalidate: 3600}` (free tier = 10 calls/day; cache keeps us under the limit)
4. `summarizeInsights(data)` → KPIs + breakdowns
5. `<AnalyticsDashboard>` renders charts

---

## State management

There is **no client-side global state library** in active use (zustand is in deps but not imported anywhere I checked). State lives in:
- **URL search params** for filters/ranges (`?from`, `?to`, `?range`, `?days`, `?success`, `?error`)
- **React component state** (`useState`) inside client components
- **Server state** = Prisma queries every render (RSC). Mutations call `revalidatePath()` to bust cache.
- **Cookies:**
  - `next-auth.session-token` — auth JWT
  - `st_active_tenant` — SUPERADMIN's currently entered tenant
- **JWT claims** — role + tenantId

Toasts via `sonner` (mounted in root layout via `<Toaster>`).

---

## Background jobs

**There is no job queue.** All "background" work is:
1. The `GET /api/donations/sync` endpoint, intended to be hit by external cron — **but nothing currently calls it on a schedule**.
2. Server actions triggered by user clicks (sync button, etc.).

If we ever need true async (e.g. webhook-triggered processing), we'd add Inngest or a queue. None exist now.

---

## File-storage

**No file uploads currently.** `uploadthing` is in package.json but unused. Image fields in content editors expect manual URL paste (`unsplash.com`, etc.). The only `next/image` remote pattern is `images.unsplash.com`.

---

## Email

We **read** Gmail (per-tenant OAuth) but never **send** any email. No SMTP, no transactional service.
