# File Structure

Every directory and key file. Marked 🔥 for "critical / change with care", ⚠️ for "shared with public site", 🧪 for "diagnostic / scripts".

---

## Top level

```
my-website/
├── .env                       — Local env (gitignored)
├── .env.example               — Template
├── AGENTS.md                  — "This is NOT the Next.js you know"; warns about Next.js 16 differences
├── CLAUDE.md                  — Re-references AGENTS.md
├── README.md                  — Project intro
├── components.json            — shadcn config (style: base-nova, RTL: false despite being Hebrew-first)
├── eslint.config.mjs          — Next.js 16 ESLint config (flat config)
├── ecosystem.config.js     🔥 — PM2 config for production process
├── next.config.ts          🔥 — Image whitelist + host-based rewrites for subdomain → /sites/{slug}
├── next-env.d.ts              — Next.js generated types
├── package.json               — Deps; pinned to React 19, Next 16.2.4, Prisma 7
├── postcss.config.mjs         — Tailwind v4 plugin
├── prisma.config.ts        🔥 — Prisma 7 config (schema path + seed cmd + DATABASE_URL)
├── tsconfig.json              — `@/*` → `./src/*` path alias
├── docs/                      — This documentation
├── prisma/                    — DB schema + migrations + seed
├── public/                    — Static assets
├── scripts/                🧪 — Diagnostic / provisioning scripts (run via npx tsx)
├── src/                       — All app code
└── static-export/             — Old static export artifacts (probably stale; not used at runtime)
```

---

## `prisma/`

```
prisma/
├── schema.prisma           🔥 — All 7 models. See docs/DATABASE.md.
├── seed.ts                    — Idempotent seed for dev users + demo tenant
├── dev.db                     — SQLite file (LOCAL only). Production has its own at ~/platform/prisma/dev.db.
└── migrations/             🔥 — 7 migrations, ordered by timestamp
    ├── migration_lock.toml
    ├── 20260428095915_init/
    ├── 20260428115901_add_template/
    ├── 20260430104439_add_handled_and_pixel/
    ├── 20260430113001_pixel_code_field/
    ├── 20260501064726_add_clarity_code/
    ├── 20260501065436_add_clarity_api_token/
    └── 20260505141752_add_meta_campaigns_and_donations/   ← latest, biggest
```

⚠️ **Do not edit applied migration files.** Create a new one (`npx prisma migrate dev --name X`).

---

## `scripts/` 🧪

Standalone TypeScript scripts. Pattern: `npx tsx scripts/X.ts`. They use `import 'dotenv/config'` and the project's `prisma` singleton.

| File | Purpose |
|---|---|
| `diag-donations.ts` | End-to-end diagnostic for donation sync (DB state + Gmail queries + parser test) |
| `diag-tenants.ts` | List all tenants/users/gmail/keywords across the DB |
| `seed-test-leads.ts` | Bulk-insert test leads |
| `seed-king.ts` | Provision a "king" template tenant (legacy template, see `lib/king-content.ts`) |
| `create-charity-tenant.ts` | Create a new charity tenant with default content |
| `blank-charity-tenant.ts` | Create a charity tenant with empty/blank content |
| `migrate-charity-tenant.ts` | Migrate a charity tenant's content to the latest schema version |
| `migrate-renovator-tenant.ts` | Same, for renovator |

Plus runtime debug scripts created in this session that may still exist on prod under `~/platform/scripts/` but not in local: `dedupe.ts`, `find-dups.ts`, `check-kw.ts`, `fix-and-sync.ts`, `run-sync.ts`, `set-ad-account.ts`, etc.

---

## `src/`

```
src/
├── auth.ts                 🔥 — NextAuth v5 config: Credentials provider + JWT + role/tenantId claims
├── proxy.ts                🔥 — Next.js 16's middleware. Guards /admin/* (NOT middleware.ts!)
├── app/                       — All routes (App Router)
├── components/                — UI components
├── hooks/                     — React hooks (currently just use-mobile)
└── lib/                       — Server-side utilities, services, schemas
```

---

## `src/app/`

### Routes

```
app/
├── layout.tsx                 — Root layout: <html dir="rtl" lang="he">, Heebo font, Toaster
├── page.tsx                   — / fallback (rewrite handles real /sites/demo render)
├── globals.css                — Tailwind v4 + shadcn theme tokens
├── robots.ts                  — Dynamic robots.txt (blocks /admin, AI bots)
├── sitemap.ts                 — Dynamic sitemap.xml (root + each published /sites/{slug})
├── favicon.ico
├── api/
│   ├── auth/[...nextauth]/route.ts  — NextAuth catch-all (just re-exports)
│   ├── donations/sync/route.ts      — POST=manual, GET=cron (with bearer)
│   └── gmail/
│       ├── connect/route.ts         — Build OAuth URL, redirect
│       └── callback/route.ts        — Exchange code, save tokens
├── r/[token]/page.tsx               — Public shareable report (NOT inside /admin)
├── sites/
│   ├── [slug]/page.tsx          ⚠️ — Public landing renderer (renovator OR charity branch)
│   └── actions.ts               — submitLead (public; no auth)
└── admin/                          — Protected by proxy.ts
    ├── layout.tsx               🔥 — Light theme + sidebar + impersonation banner
    ├── page.tsx                    — Dashboard home (KPIs + recent leads + quick action)
    ├── login/page.tsx              — Login (only unprotected admin route)
    ├── analytics/page.tsx          — Clarity insights
    ├── campaigns/page.tsx          — Meta Ads dashboard (filtered by name match to keywords)
    ├── content/{page.tsx,actions.ts} — Visual content editor (template-aware)
    ├── donations/page.tsx          — Donation dashboard (per-keyword sections)
    ├── leads/{page.tsx,actions.ts} — Lead inbox + status updates
    ├── reports/{page.tsx,actions.ts} — Cashflow/ROAS + shareable links
    ├── settings/
    │   ├── page.tsx                — Pixel + Clarity + Clarity token + Meta Ad Account
    │   ├── actions.ts              — All four updaters
    │   └── donations/{page.tsx,actions.ts} — Gmail connection + keywords manager
    ├── tenants/{page.tsx,actions.ts} — SUPERADMIN only: create/list/delete/enter
    └── users/{page.tsx,actions.ts}   — Per-tenant user management
```

---

## `src/components/`

```
components/
├── ui/                        — shadcn/ui primitives (button, input, dialog, table, ...)
├── admin/                     — Admin dashboard chrome
│   ├── sidebar.tsx         🔥 — Sidebar with nav, active-state glow, user card
│   ├── leads-table.tsx        — Leads inbox table + expand rows
│   ├── tenants-manager.tsx    — Create/list/delete/enter tenants (SUPERADMIN)
│   ├── users-manager.tsx      — User CRUD per tenant
│   ├── settings-form.tsx      — 4 sections: Meta Ad Account, FB Pixel, Clarity, Clarity API Token
│   ├── analytics-dashboard.tsx — Clarity insights charts
│   ├── content-editor.tsx     — Visual editor for renovator template
│   ├── charity-content-editor.tsx ⚠️ — Visual editor for charity (1700 lines!)
│   ├── widget-renderer.tsx ⚠️ — RENDERS PUBLIC SITE WIDGETS — used by /sites/[slug] too
│   ├── widget-library.tsx     — Drag-drop sidebar of available widget types
│   ├── widget-settings.tsx    — Per-widget property editor
│   ├── widget-list-canvas.tsx — Sortable list of widgets
│   ├── landing-preview.tsx ⚠️ — In-editor preview of renovator landing
│   ├── charity-landing-preview.tsx ⚠️ — In-editor preview of charity landing
│   ├── editable-element.tsx   — Wraps a text element with edit chrome (overlay handles)
│   ├── editable-region.tsx    — Wraps a region with edit chrome
│   ├── text-style-panel.tsx   — Font/color/align panel for renovator editor
│   ├── charity-text-style-panel.tsx — Same, for charity
│   └── content-fields.tsx     — Form-style inputs for content fields
│
├── shared/
│   ├── date-range-picker.tsx 🔥 — Custom 2-month calendar with presets, modal-style
│   └── error-state.tsx        — Generic error card
│
├── donations/                 — Donation-flow UI
│   ├── donation-kpis.tsx      — 4-card overall KPIs
│   ├── donations-by-day-chart.tsx — Daily bar chart (recharts)
│   ├── donations-by-campaign.tsx  — Per-campaign comparison bars
│   ├── recent-donations.tsx   — Table
│   ├── gmail-connection-card.tsx — Show connected email + disconnect button
│   ├── gmail-not-connected.tsx — Empty state + "connect" CTA
│   ├── connection-status.tsx  — Success/error banner after OAuth
│   ├── keywords-manager.tsx   — Add/edit/delete keywords (no metaCampaignId field anymore)
│   └── sync-button.tsx        — Calls POST /api/donations/sync with chosen daysBack
│
├── campaigns/                 — Meta Ads UI
│   ├── kpi-cards.tsx          — 4 metric cards
│   ├── spend-chart.tsx        — Daily spend chart
│   ├── campaigns-table.tsx    — Table of campaigns
│   └── setup-required.tsx     — Empty state when no metaAdAccountId
│
├── reports/                   — Cashflow/shareable reports UI
│   ├── cashflow-kpis.tsx
│   ├── cashflow-chart.tsx
│   ├── cashflow-table.tsx
│   ├── campaign-roas-table.tsx
│   ├── insights-panel.tsx     — Auto-generated text insights
│   ├── share-report-button.tsx — Modal to create a shareable link
│   ├── public-report-view.tsx — Layout for /r/{token} pages
│   └── password-prompt.tsx    — Used when ShareableReport.password is set
│
├── charity/                ⚠️ — All used by /sites/[slug] when template=charity
│   ├── charity-landing.tsx     — Top-level layout
│   ├── hero-split.tsx, hero-typewriter.tsx — Hero variants
│   ├── reels-horizontal.tsx, ken-burns-gallery.tsx, video-story.tsx — Media sections
│   ├── story-section.tsx, emotional-section.tsx, emotional-break.tsx
│   ├── live-feed.tsx           — Live donations feed (mock)
│   ├── impact-counter.tsx, urgency-bar.tsx, top-banner.tsx
│   ├── delayed-popup.tsx       — Auto-popup after 15s
│   ├── sticky-donate.tsx       — Sticky bottom CTA
│   ├── floating-particles.tsx, reveal.tsx, big-video.tsx
│
├── renovator/              ⚠️ — Used by /sites/[slug] when template=renovator
│   ├── before-after.tsx
│   ├── floating-proof.tsx
│   ├── incoming-messages.tsx
│   ├── testimonial-card.tsx
│   └── whatsapp-chat.tsx
│
├── king/                      — Old "king" template (largely unused?)
│   └── king-landing.tsx
│
├── seo/
│   ├── json-ld.tsx
│   └── schemas.tsx            — LocalBusiness, NGO, WebSite JSON-LD
│
├── lead-form.tsx           ⚠️ — The form on the public site that creates a Lead
├── facebook-pixel.tsx      ⚠️ — Injects Pixel <script> into public site
├── clarity-script.tsx      ⚠️ — Injects Clarity <script> into public site
├── whatsapp-button.tsx     ⚠️ — Public-site floating WhatsApp button
├── typewriter.tsx          ⚠️ — Public-site typewriter effect
├── pain-list.tsx           ⚠️ — Public-site renovator section
└── counter.tsx             ⚠️ — Public-site number counter animation
```

---

## `src/lib/`

```
lib/
├── db.ts                   🔥 — Prisma singleton (better-sqlite3 adapter)
├── auth-helpers.ts         🔥 — requireUser/requireSuperAdmin/requireTenantUser/getEffectiveTenantId
├── active-tenant.ts        🔥 — st_active_tenant cookie helpers
├── encryption.ts           🔥 — AES-256-GCM encrypt/decrypt for Gmail tokens
├── gmail-api.ts            🔥 — All Gmail API calls + OAuth flow + saveGmailConnection
├── meta-api.ts             🔥 — All Meta Marketing API calls + verifyAdAccountAccess
├── clarity-api.ts             — Microsoft Clarity Data Export API
├── donation-parser.ts      🔥 — Email → ParsedDonation. Hebrew regex. The ingest brain.
├── donations-service.ts    🔥 — Sync + summary aggregations (overall + per-keyword) + keyword CRUD
├── cashflow-service.ts     🔥 — Joins donations × Meta campaigns for ROAS view + auto-insights
├── content.ts              🔥 — SiteContent (renovator) schema + parsers + style helpers
├── charity-content.ts      🔥 — CharitySiteContent schema + parsers
├── king-content.ts            — Legacy "king" template content (unused?)
├── element-registry.ts        — Map of editable element keys (for renovator editor)
├── charity-element-registry.ts — Same, for charity
├── widgets.ts                 — Widget type definitions
├── icon-map.tsx               — Lucide icon name → component mapping
├── feature-types.ts        🔥 — Shared TypeScript types: AccountSummary, DonationSummary, CashflowSummary, etc.
├── date-range.ts           🔥 — parseDateRange / formatHebrewDate / formatISODate (consumed by date picker + page route handlers)
└── utils.ts                   — `cn()` and other tiny utils
```

---

## `src/hooks/`

| File | Purpose |
|---|---|
| `use-mobile.ts` | `useMediaQuery` for responsive logic |

---

## `src/components/ui/`

shadcn/ui-generated primitives. Do not hand-edit unless extending intentionally:
```
alert-dialog, avatar, button, card, dialog, dropdown-menu, input, label,
select, separator, sheet, sidebar, skeleton, sonner, switch, table, tabs,
textarea, tooltip
```

(`sonner` is the toast component, mounted in root layout.)

---

## `public/`

Static assets — images, favicons. Files are served at `/` (so `public/foo.png` → `https://.../foo.png`).

---

## `static-export/`

Old artifacts from a previous static export attempt. **Probably safe to delete** — not referenced by current build. Verify with `grep -r static-export src/` before removing.

---

## "Cold paths" — code likely unused

- `src/lib/king-content.ts` and `src/components/king/` — the "king" template existed before `charity` was added. No tenants currently use it. Consider deleting if no one objects.
- `static-export/` directory.
- `uploadthing` packages in `package.json` — installed, never imported.
- `next-themes` — installed, no `<ThemeProvider>` in tree.
- `zustand` — installed, no `create()` calls in src.

---

## Entry points

- **Public site:** `src/app/sites/[slug]/page.tsx` (or root via rewrite)
- **Admin:** `src/app/admin/layout.tsx` → `src/app/admin/page.tsx` (after `proxy.ts` lets you through)
- **Cron sync:** `GET /api/donations/sync` (with `Authorization` bearer)
- **OAuth start:** `GET /api/gmail/connect`
- **Server bootstrap:** `prisma/seed.ts`
- **PM2:** `ecosystem.config.js` → `node_modules/next/dist/bin/next start`
