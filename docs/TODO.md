# TODO

Pending work. Prioritized.

---

## 🔴 P0 — Do first (data integrity / risk)

### Sync 67 uncommitted files on server to GitHub
- **State:** Server (`webapp@46.225.25.221:~/platform/`) is 67+ files ahead of `origin/main`.
- **Action:** SSH in, `git checkout -b handoff/<date>`, `git add -A && git commit -m "..."`, push to GitHub. Then either merge or open PR for review.
- **Risk if skipped:** Any `git checkout`, `git reset`, or fresh clone from origin will wipe weeks of work.

### Rotate exposed secrets
- **`META_SYSTEM_USER_TOKEN`** — was sent in chat earlier. Regenerate in Meta Business Manager → Settings → System Users → reset token. Update on prod via:
  ```bash
  ssh webapp@46.225.25.221 "cd ~/platform && sed -i 's|^META_SYSTEM_USER_TOKEN=.*|META_SYSTEM_USER_TOKEN=NEW_TOKEN|' .env && pm2 restart pro-digital --update-env"
  ```
- **`GOOGLE_CLIENT_SECRET`** — same story. Regenerate in Google Cloud Console → APIs & Services → Credentials → reset client secret. Update via similar `sed`.
- **Risk if skipped:** Anyone with chat history has full Meta read + Google OAuth client secret.

### Wire up the cron for donation sync
- The `GET /api/donations/sync` endpoint exists with `Authorization: Bearer $CRON_SECRET` auth.
- **No actual cron is running.** Add to crontab on the server:
  ```bash
  ssh webapp@46.225.25.221 "(crontab -l ; echo '0 * * * * curl -fsSL -H \"Authorization: Bearer \$CRON_SECRET\" https://www.pro-digital.org/api/donations/sync >> /home/webapp/logs/cron.log 2>&1') | crontab -"
  ```
- **Risk if skipped:** Donations only sync when someone clicks the button manually.

---

## 🟠 P1 — Important (correctness)

### Fix Hebrew word-boundary regex in donation parser
- **File:** `src/lib/donation-parser.ts`
- **Current bug:** `\bביט\b` regex never matches Hebrew "ביט" because JS `\b` requires `\w` boundary, and Hebrew letters aren't `\w`. Result: most donations have `paymentMethod = null` and `needsReview = true` even when payment method is clearly stated.
- **Fix:**
  ```ts
  ביט: [/(?<![֐-׿])ביט(?![֐-׿])/, /\bbit\b/i],
  // Same pattern for all other Hebrew payment methods
  ```
- **Verify:** Run `scripts/diag-donations.ts` after to confirm `paymentMethod` extraction.

### Replace proportional daily-spend approximation
- **Files:** `src/lib/cashflow-service.ts`, `src/app/admin/campaigns/page.tsx`
- **Current:** When showing daily spend per campaign, we divide total spend evenly across N days (`metaSpend = totalLinkedSpend / daysBack`). Inaccurate — spend varies day-to-day.
- **Fix:** Per-campaign daily insights via `getCampaigns(...time_increment=1)`. Will require a new `getCampaignDailyInsights(campaignId, dateRange)` function in `lib/meta-api.ts` and one extra API call per campaign.

### Implement Gmail pagination for > 500 results
- **File:** `src/lib/gmail-api.ts > searchMessages`
- **Current:** Capped at `maxResults=500` (Gmail's per-request max). If a tenant has > 500 matching emails in the chosen window, only first 500 are processed.
- **Fix:** Loop with `pageToken` until `nextPageToken` is null. Add a sane upper bound (e.g. 5000) to prevent runaway sync.

### Add retry / backoff for Meta API rate limits
- **File:** `src/lib/meta-api.ts > metaFetch`
- **Current:** A single 429 throws and breaks `/admin/campaigns`.
- **Fix:** On 429 or 5xx, retry up to 3 times with exponential backoff. Log to console.

---

## 🟡 P2 — UX papercuts

### Migrate `charity-content-editor.tsx` to new theme
- 1700-line component still has dark-theme classes mixed with new light theme. Functional but visually inconsistent.
- Approach: incremental rewrite, section by section. NOT a bulk find-replace (we already saw what that does to widget renderers).

### `/admin/analytics` — clean up leftover dark-theme classes
- A few `bg-emerald-500 text-black` for active tab states should become `text-white` for proper contrast.

### Add empty-state for `/admin/users` when only OWNER exists
- Currently shows the table with one row + the "add user" form. Could be a friendlier "no team members yet" CTA.

### Per-keyword chart showing donations vs spend together
- Currently `/admin/donations > KeywordSection` only shows daily donations. Spend chart is on `/admin/campaigns`. Joining them on one chart would be the killer view.

### Image upload UI
- `uploadthing` is installed but no UI. All image fields in content editors require manual URL paste. Wire up the UploadButton.

### `paymentMethod` cleanup
- Once the regex is fixed (P1 item above), backfill existing `Donation` rows by re-parsing their `rawSnippet`. Then update the `needsReview` flags accordingly.

---

## 🟢 P3 — Nice to have

### Drop vestigial `metaCampaignId` column from `DonationKeyword`
- Field is no longer read or written. Removing requires a migration.
- Low priority — schema bloat is minimal.

### Delete dead code
- `src/lib/king-content.ts` + `src/components/king/` — old "king" template, no tenants use it.
- `static-export/` directory — old artifacts.
- `next-themes`, `zustand`, `uploadthing` deps from `package.json` if confirmed unused.

### Image optimization for content editor previews
- `landing-preview.tsx` and `charity-landing-preview.tsx` may render full hi-res images. Could use `next/image` with sizes.

### Better impersonation banner UX
- Currently a thin yellow strip. A more obvious "you are inside [tenant]" indicator would prevent accidental cross-tenant edits.

### Add CAPTCHA / rate limit to public lead form
- `submitLead` is unauthenticated. No abuse seen yet but a single attacker could flood any tenant's lead inbox.

### Sentry / error tracking
- Errors currently only go to PM2 logs (`/home/webapp/logs/error.log`). A real error tracker would catch silent issues earlier.

### Convert from SQLite to Postgres
- When concurrent write contention starts mattering. Migration path documented in `DECISIONS.md` #3.

---

## 🟣 Refactors (when code feels painful)

### Extract `normalizeRange` helper
- It's currently duplicated inline in `donations-service.ts` and `cashflow-service.ts`. Move to `lib/date-range.ts`.

### "Tenant-scoped Prisma client" wrapper
- Currently every server action manually adds `tenantId` to `where`. A wrapper would auto-inject it and make leak-via-omission impossible. See `DECISIONS.md` #4.

### Generic `<DataCard>` component
- The "rounded-3xl border bg-white shadow-sm + colored icon + label/value" pattern repeats across `DonationKPIs`, `KPICards`, `CashflowKPIs`. Extract.

### Server action error envelope as a helper
- Every action duplicates `if (...) return {ok: false, error: '...'} as const`. Create `bail(err)` and `ok(data)` helpers.

---

## ❌ Closed / Resolved (recently shipped, listed for context)

- ✅ Light theme + emerald palette across admin
- ✅ Date range picker (custom, 2-month, modal style)
- ✅ Per-keyword breakdown on `/admin/donations`
- ✅ Per-keyword groups on `/admin/campaigns`
- ✅ Insights panel moved to bottom of `/admin/reports`
- ✅ Donation parser blacklist for receipt copies + form submissions
- ✅ 3 duplicate Donation rows cleaned from DB
- ✅ Gmail OAuth (`/api/gmail/connect`, `/api/gmail/callback`)
- ✅ Donation sync API + `daysBack` parameter
- ✅ Meta Ad Account ID UI in `/admin/settings`
- ✅ Setup-required state for `/admin/campaigns`
- ✅ Nedarim Plus parser + amount/donor extraction
- ✅ Shareable reports (`/r/{token}`)
