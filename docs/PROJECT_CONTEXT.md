# Project Context — Current State

A snapshot of where the project stands as of the latest deployment. This is the "what's working / what's not / where we stopped" doc.

---

## Live tenants in production

| Slug | Name | Template | Status |
|---|---|---|---|
| `demo` | שיפוצי הדגמה | renovator | Active. The Hebrew renovation contractor demo. SUPERADMIN's main testing tenant. Currently has Gmail + Meta integrations configured (used for testing donation flow). |
| `lp-3` | אתר תרומה (טוב לב חדש) | charity | Created but the Gmail/Meta integrations live on `demo`, not on `lp-3`. **Likely needs revisit** — see Open Items. |

The root domain (`https://www.pro-digital.org`) and `www.pro-digital.org` rewrite to `/sites/demo`. The subdomain `lp3.pro-digital.org` rewrites to `/sites/lp-3` (per `next.config.ts`).

---

## What works ✅

### Core platform
- ✅ Auth (Credentials + JWT, 3 roles)
- ✅ Multi-tenant isolation via `requireTenantUser()` + `where: { tenantId }` everywhere
- ✅ SUPERADMIN can create/list/delete tenants and "enter" any of them (cookie-based active-tenant)
- ✅ User CRUD per tenant (OWNER + EDITOR roles)

### Public sites
- ✅ Both `renovator` and `charity` templates render
- ✅ Lead form submission (renovator) → DB → admin
- ✅ Facebook Pixel + Microsoft Clarity script tags injected per-tenant
- ✅ SEO: dynamic `metadata`, JSON-LD schemas, robots.txt, sitemap.xml
- ✅ Host-based URL rewrites for the demo + lp-3 sites

### Admin pages
- ✅ `/admin` — dashboard home with leads stats
- ✅ `/admin/leads` — table with status, "handled" toggle, expand row, WhatsApp link
- ✅ `/admin/content` — visual editor (renovator: widget canvas; charity: form-based editor)
- ✅ `/admin/analytics` — Microsoft Clarity insights (cached 1h)
- ✅ `/admin/campaigns` — Meta Ads dashboard, **filtered to only campaigns matching configured keywords**
- ✅ `/admin/donations` — donation dashboard with per-keyword breakdown (sections per campaign)
- ✅ `/admin/reports` — cashflow / ROAS report with shareable public link
- ✅ `/admin/settings` — pixel, Clarity, Clarity API token, Meta Ad Account ID
- ✅ `/admin/settings/donations` — Gmail OAuth + keyword management
- ✅ `/admin/users`, `/admin/tenants` — user & tenant management

### Integrations
- ✅ **Meta Marketing API** — `META_SYSTEM_USER_TOKEN` (one shared token), per-tenant `metaAdAccountId`. Fetches campaigns + insights. Filtered by name-substring matching to configured donation keywords.
- ✅ **Gmail OAuth** — full flow: `/api/gmail/connect` → Google consent → `/api/gmail/callback` → tokens encrypted (AES-256-GCM, salt+IV+tag) and stored in `GmailConnection`. Refresh-on-expiry built-in.
- ✅ **Donation sync** — manual via "סנכרן" button (with chosen daysBack range), or via `GET /api/donations/sync` cron endpoint. Parser handles HTML stripping, keyword matching (substring), amount/donor/phone/payment-method extraction.
- ✅ **Microsoft Clarity** — Data Export API (10 calls/day free tier; we cache 1h)
- ✅ **Public shareable reports** — `/r/{token}` with optional password + expiry + view counter

### UI / Design
- ✅ Light theme everywhere on admin (white/slate canvas + emerald-500 accent + rounded-3xl cards)
- ✅ Custom 2-month calendar date range picker (`/admin/donations`, `/admin/campaigns`, `/admin/reports`) — modal-style, supports presets + custom from/to via URL params
- ✅ All admin pages use the modern header pattern (badge pill + 4xl heading + subtitle)
- ✅ Sidebar with active-state glow, gradient avatar, light-theme

---

## What's broken / not finished ⚠️

### Known issues
- ⚠️ **Cron job doesn't auto-trigger.** The endpoint `GET /api/donations/sync` (with `Authorization: Bearer $CRON_SECRET`) exists, but **no actual cron is scheduled** on the server (no PM2 cron, no systemd timer). To enable hourly sync, add to crontab on `webapp@46.225.25.221`:
  ```
  0 * * * * curl -fsSL -H "Authorization: Bearer $CRON_SECRET" https://www.pro-digital.org/api/donations/sync >> /home/webapp/logs/cron.log 2>&1
  ```
- ⚠️ **Daily Meta spend breakdown is approximated.** The `getCampaigns` API returns total spend per campaign for the date range but no per-day breakdown per campaign. So in `/admin/campaigns` the daily chart spreads `totalSpend / N days` evenly across days, and in `/admin/reports` the `dailyData[].metaSpend` is similarly approximated. To fix properly, fetch `insights.time_increment=1` per campaign individually.
- ⚠️ **Gmail search hits 500-message cap.** `searchMessages(...maxResults=500)` is the max we request without pagination. If a tenant has > 500 emails matching a keyword in the chosen window, only the first 500 are processed. Pagination via `pageToken` is not implemented.
- ⚠️ **Donation parser `paymentMethod` regex is broken for Hebrew.** Uses `\b` word boundaries which JS regex doesn't apply to Hebrew letters. So `\bביט\b` between two spaces never matches. Result: most donations have `paymentMethod=null` and `needsReview=true`. Fix: replace `\b...\b` with negative lookarounds for Hebrew Unicode block.
- ⚠️ **No retry/backoff for Meta API rate limits.** A single 429 from Meta will throw and break the whole `/admin/campaigns` page.
- ⚠️ **No image upload UI on admin.** The `uploadthing` packages are installed but no UploadButton is wired anywhere. Image fields in content editors expect manual URL paste.

### Visual / UX papercuts
- The **content editor pages** (`/admin/content` for charity) still mix old dark-theme classes with the new light theme (this is a 1700-line component we didn't fully migrate). It's usable but inconsistent.
- The **`/admin/analytics` page** has some leftover dark-theme classes (still references `bg-emerald-500 text-black` for active tabs).
- **No empty-state for `/admin/users`** when only the OWNER exists (just shows the table with one row).

---

## What's in progress 🚧

Nothing actively in progress at the moment of handoff. The last completed feature was the **per-keyword breakdown on `/admin/donations`** + the **modal-style date range picker** that pushes URL params (`?from=YYYY-MM-DD&to=YYYY-MM-DD`) consumed by all 3 dashboard pages.

---

## Open items (carry-overs from earlier sessions)

These were noted as TODO in `~/.claude/projects/.../memory/project_lp3_admin_pending.md`:

1. **Meta `META_SYSTEM_USER_TOKEN` rotation pending.** The token was exposed in chat once — should be regenerated in Meta Business Manager and updated via `sed -i` in `~/platform/.env` on prod.
2. **Google OAuth `GOOGLE_CLIENT_SECRET` rotation pending.** Same issue — was sent in chat. Should be regenerated in Google Cloud Console and updated.

---

## Latest deploys (recent activity)

In the last work session we shipped:
1. Light/emerald redesign across all admin pages
2. `keywords-manager` simplified (removed `metaCampaignId` field; matching is now by `campaignName` substring against Meta campaign names)
3. Per-keyword sections on `/admin/donations`
4. Per-keyword groups on `/admin/campaigns`
5. Cleaned 3 receipt-copy duplicates from `Donation` table
6. Added `[העתק קבלה]`, `קבלה ממוחשבת`, `שגיאה`, `סירוב`, `דוח הוראות`, `התראת הוראות`, `התקבל טופס` to parser skip list
7. Custom date range picker (2-month calendar, presets, modal)
8. `/admin/reports` redesigned + insights moved to bottom

After all that, **production has 67+ uncommitted files** vs `origin/main`.

---

## Where we stopped

Last task was the docs handoff (this!). Before that:
- User noted that the **insights panel was at the top of `/admin/reports`** and asked to move it to the bottom — DONE in the same session.
- Before that, user asked to redesign the date picker like Meta's — DONE; switched to centered modal after the popover got clipped by `overflow-x-auto`.

---

## Next likely tasks (predicted, not committed)

1. Sync the 67 uncommitted files to GitHub `origin/main` (or to a new branch). High priority — current state is fragile.
2. Set up the cron job for auto-sync (1 line in crontab).
3. Rotate the Meta + Google secrets that were exposed.
4. Fix the `paymentMethod` regex for Hebrew.
5. Implement per-campaign daily spend (kill the proportional approximation).
6. Migrate from SQLite to Postgres (when scale demands it; SQLite is fine for now at the current usage).
