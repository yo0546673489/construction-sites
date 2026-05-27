# API Reference

All HTTP routes (internal), all server actions, all external APIs.

---

## Internal HTTP routes

### Auth

#### `GET /api/auth/[...nextauth]` and `POST /api/auth/[...nextauth]`
NextAuth's catch-all handler. Defined in `src/app/api/auth/[...nextauth]/route.ts` — just re-exports `handlers.GET` and `handlers.POST` from `src/auth.ts`.

Endpoints provided automatically by NextAuth:
- `GET /api/auth/session` — current session JSON
- `POST /api/auth/signin/credentials` — login (preferred path is via the `signIn` server action)
- `POST /api/auth/signout` — logout (used by sidebar logout button)
- `GET /api/auth/csrf` — CSRF token

Auth: not required (these ARE the auth endpoints).

---

### Gmail OAuth

#### `GET /api/gmail/connect`
Kicks off Google OAuth.
**Auth:** required (any session). Resolves effective tenant via cookie/JWT.
**Behavior:** builds OAuth URL with state = `base64url(JSON({tenantId, nonce}))` → 302 redirect to `accounts.google.com`.
**Scopes requested:** `gmail.readonly`, `userinfo.email`, `access_type=offline`, `prompt=consent` (forces refresh token issuance).

#### `GET /api/gmail/callback?code=...&state=...`
Handles Google's redirect after consent.
**Auth:** required (must be the same user who started the flow).
**Behavior:**
1. Validates `state` matches current tenant
2. `exchangeCodeForTokens(code)` against `oauth2.googleapis.com/token`
3. `getUserEmail(access_token)` against `googleapis.com/oauth2/v2/userinfo`
4. `saveGmailConnection(tenantId, tokens, email)` — encrypts and stores tokens
5. Redirects to `/admin/settings/donations?success=1` (or `?error=...`)

---

### Donations

#### `POST /api/donations/sync`
Manual sync trigger from "סנכרן" button.
**Auth:** required (session). Resolves effective tenant.
**Body:** `{daysBack?: number}` (default 7, capped 1-365)
**Behavior:** calls `syncTenantDonations(tenantId, daysBack)`.
**Returns:**
```json
{
  "success": true,
  "newDonations": 12,
  "totalProcessed": 50,
  "errors": []
}
```

#### `GET /api/donations/sync`
Cron endpoint — bulk-syncs ALL tenants with `syncEnabled=true`.
**Auth:** `Authorization: Bearer $CRON_SECRET` header (env var). 401 otherwise.
**Behavior:** iterates `gmailConnection.findMany({syncEnabled: true})` → `syncTenantDonations(t.tenantId, 2)` each (last 2 days).
**Returns:**
```json
{ "total": 5, "success": 5, "failed": 0 }
```
**NOTE:** No external scheduler currently calls this in production. See PROJECT_CONTEXT.md.

---

## Server Actions

Server actions are RSC's RPC. Defined with `"use server"` directive. Called like normal functions from client components.

### Auth & users

| File | Function | Auth | Effect |
|---|---|---|---|
| `app/admin/login/page.tsx` | `handleLogin(formData)` | none | `signIn("credentials")` then redirect |
| `app/admin/users/actions.ts` | `createUser(formData)` | OWNER+ | Creates User in current tenant |
| `app/admin/users/actions.ts` | `deleteUser(userId)` | OWNER+ | Deletes User (only same tenant; can't delete self or SUPERADMIN) |

### Tenants (SUPERADMIN-only)

| Function | Effect |
|---|---|
| `createTenant(formData)` | Creates Tenant + initial OWNER. Validates slug regex `^[a-z0-9-]{2,40}$`, password ≥6, etc. Picks initial content based on `template` field. |
| `deleteTenant(tenantId)` | Cascade-deletes Tenant and all child records. |
| `enterTenant(tenantId)` | Sets `st_active_tenant` cookie + redirect to `/admin`. |
| `exitTenant()` | Clears cookie + redirect to `/admin/tenants`. |

### Leads

| Function | Effect |
|---|---|
| `submitLead({tenantId, name, phone, area})` | **Public — no auth.** Creates Lead. Validates tenant exists+published. |
| `updateLeadStatus(leadId, status)` | Updates status; `updateMany` with tenant scope. |
| `deleteLead(leadId)` | Deletes; tenant-scoped. |
| `toggleLeadHandled(leadId, handled)` | Toggles `handled` boolean. |

### Content

| Function | Effect |
|---|---|
| `saveContent(payload)` | Validates JSON, merges via `parseSiteContent`/`parseCharityContent` (which fills missing defaults), stores in `Tenant.content`. Revalidates `/sites/[slug]` and `/admin`. |
| `togglePublished(boolean)` | Sets `Tenant.published`. |

### Settings (per-tenant integrations)

| Function | Effect |
|---|---|
| `updateFacebookPixel(input)` | Validates code (must include `fbq` + connect.facebook.net) OR auto-wraps a bare numeric Pixel ID into the standard template. |
| `updateClarityCode(input)` | Validates code OR accepts bare project ID. |
| `updateClarityApiToken(input)` | Stores; min 30 chars. |
| `updateMetaAdAccountId(input)` | Validates `act_X` format, auto-prefixes if user types just digits. |

### Donation settings

| Function | Effect |
|---|---|
| `disconnectGmail()` | Deletes the `GmailConnection` row. |
| `createKeywordAction({keyword, campaignName, color?})` | Creates `DonationKeyword`. Revalidates donations + campaigns + reports. |
| `updateKeywordAction(id, partial)` | Tenant-scoped update. Revalidates. |
| `deleteKeywordAction(id)` | Tenant-scoped delete. |

### Reports (sharing)

| Function | Effect |
|---|---|
| `createShareableReport(input)` | Creates `ShareableReport` with random base64url token. Returns `{token, url}`. |
| `deleteReport(reportId)` | Tenant-scoped delete. |
| `getReports()` | Lists tenant's reports. |

---

## External APIs we call

### Meta Graph API (Marketing)
- **Base:** `https://graph.facebook.com/${META_API_VERSION}` (default `v21.0`)
- **Auth:** `?access_token=$META_SYSTEM_USER_TOKEN` query param. One global token; the System User must have Admin role on each tenant's Ad Account inside Business Manager.
- **Endpoints used:**
  - `GET /act_X/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time,insights.time_range({"since":"...","until":"..."}){spend,impressions,clicks,ctr,cpc,actions,cost_per_action_type}&limit=100`
  - `GET /act_X/insights?fields=...&time_range={...}` — account-wide totals
  - `GET /act_X/insights?fields=...&time_range={...}&time_increment=1` — daily breakdown
  - `GET /act_X?fields=name,currency` — verify access
- **Caching:** `next: { revalidate: 300 }` (5 minutes) on every fetch.
- **Rate limits:** Meta enforces app-level limits. **No retry/backoff implemented.** A 429 will throw and break `/admin/campaigns`.

### Gmail API
- **Base:** `https://gmail.googleapis.com/gmail/v1`
- **Auth:** `Authorization: Bearer ${access_token}` (per-tenant, refreshed automatically when within 5 minutes of expiry).
- **Endpoints used:**
  - `GET /users/me/messages?q=ENCODED_QUERY&maxResults=N` — search (max 500 in our calls; Gmail caps at 500/page)
  - `GET /users/me/messages/{id}?format=full` — fetch one message
- **OAuth endpoints:** `https://accounts.google.com/o/oauth2/v2/auth`, `https://oauth2.googleapis.com/token`, `https://www.googleapis.com/oauth2/v2/userinfo`
- **Caching:** none. Sync runs on demand.
- **Rate limits:** standard Gmail quotas (250 user-quota-units/sec; well under our usage).

### Microsoft Clarity Data Export API
- **Endpoint:** `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays={1|2|3}`
- **Auth:** `Authorization: Bearer ${clarity_api_token}` (per-tenant).
- **Caching:** `next: { revalidate: 3600 }` (1 hour).
- **Rate limit:** Free tier = 10 calls/day. Cache keeps us at ≤24/day even under heavy use.

### Google OAuth
- **Endpoints:** `accounts.google.com/o/oauth2/v2/auth`, `oauth2.googleapis.com/token`, `googleapis.com/oauth2/v2/userinfo`
- **Auth:** `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
- **Redirect:** `GOOGLE_REDIRECT_URI` (must match exactly what's registered in Google Cloud Console)

### Unsplash (images)
- Only as a CDN host (whitelisted in `next.config.ts > images.remotePatterns`). No API calls.

---

## Caching strategy

| Layer | TTL | Reason |
|---|---|---|
| Meta `getCampaigns` / `getAccountSummary` | 5 min | API isn't free; data doesn't change minute-to-minute |
| Clarity `fetchClarityInsights` | 1 hour | Free tier rate limit (10/day) |
| Public report `/r/{token}` | 5 min (`revalidate = 300`) | Reduce load from refreshes |
| `/admin/analytics` page-level | 1 hour (`revalidate = 3600`) | Aligns with Clarity cache |
| All other admin pages | None (force-dynamic via `auth()` + tenantId in Prisma) |  |

---

## Webhooks
**None.** No inbound webhooks from any service.

---

## Error envelope conventions

Server actions return `{ ok: true, ...data } | { ok: false, error: string }`. Client unwraps and shows a toast on `!ok`.

API routes return either `NextResponse.json({...}, { status })` or a redirect.

---

## Public site → Lead form (the only public write)

- Endpoint: `submitLead` server action, called from `<LeadForm>` (client component) on `/sites/[slug]`.
- No auth — anyone can submit (anti-spam relies on the obscurity of `tenantId` and on form validation).
- Sends `{tenantId, name, phone, area}`. tenantId comes from the page's server props.
- Spamming a different `tenantId` would just create a lead under that other tenant (no data leak).
- **No CAPTCHA, no rate limit.** Realistic next step if abuse appears.
