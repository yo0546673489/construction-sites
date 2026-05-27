# Pro Digital — Multi-tenant Lead & Donation Platform

> **Production:** [https://www.pro-digital.org](https://www.pro-digital.org)
> **Admin:** [https://www.pro-digital.org/admin](https://www.pro-digital.org/admin)

A Hebrew-first SaaS platform that hosts multiple landing pages (one per tenant) and gives each tenant a private admin dashboard for content editing, lead management, Meta Ads tracking, automated donation collection from Gmail, and shareable reports.

> **🤖 New here?** Read [`docs/AI_HANDOFF.md`](docs/AI_HANDOFF.md) first — it's a curated tour for AI/devs joining the project.

---

## What it does

Two flavors of public landing site, sharing one admin:

1. **`renovator`** — Lead-gen landing for renovation contractors. Form submission → DB → admin sees leads.
2. **`charity`** — Donation landing with embedded payment provider links. Donations come back as Nedarim Plus emails → Gmail OAuth → auto-parsed into the donations dashboard with ROAS tracking against Meta Ads.

Each tenant gets:
- Public site at `/sites/{slug}` (or root domain via `next.config` rewrites)
- Visual content editor (`/admin/content`)
- Lead inbox (`/admin/leads`)
- Microsoft Clarity analytics passthrough (`/admin/analytics`)
- Meta Ads dashboard (`/admin/campaigns`)
- Gmail-driven donations dashboard (`/admin/donations`)
- Cashflow / ROAS report (`/admin/reports`) — with public shareable links (`/r/{token}`)
- User & integration settings (`/admin/users`, `/admin/settings`)

A **SUPERADMIN** can create new tenants and "enter" any tenant to manage it.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16.2.4** (App Router) — note: `middleware.ts` was renamed to `proxy.ts` |
| Runtime | Node 22 |
| UI | React 19, Tailwind CSS v4, shadcn/ui (style: `base-nova`) |
| Auth | NextAuth v5 beta (Credentials + JWT sessions) |
| ORM | Prisma 7 with `@prisma/adapter-better-sqlite3` |
| DB | SQLite (`prisma/dev.db` locally, `~/platform/prisma/dev.db` in prod) |
| Charts | Recharts |
| Editor | Tiptap |
| Drag-drop | dnd-kit |
| External APIs | Meta Marketing API (System User Token), Gmail API (OAuth per-tenant), Microsoft Clarity Data Export API |
| Process manager | PM2 (`pro-digital` process) |
| Reverse proxy | Caddy (assumed by `trustHost: true`) |

---

## Quickstart (local dev)

### Prerequisites
- Node 20+
- Git

### Install
```bash
git clone <repo-url>
cd my-website
npm install
```

### Configure `.env`
Copy `.env.example` → `.env`, fill in:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<random 32-byte base64 — openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```
**Optional but needed for full features:**
```env
ENCRYPTION_KEY="<32+ chars hex — openssl rand -hex 32>"
CRON_SECRET="<random>"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
META_API_VERSION="v21.0"
META_SYSTEM_USER_TOKEN="<token from Meta Business Manager>"
GOOGLE_CLIENT_ID="<oauth client id>"
GOOGLE_CLIENT_SECRET="<oauth client secret>"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/gmail/callback"
```

### Initialize DB
```bash
npx prisma migrate deploy
npx prisma db seed
```
Seed creates:
- `admin@example.com / admin123` (SUPERADMIN)
- `owner@example.com / owner123` (OWNER of demo tenant)
- One demo tenant `slug=demo, name="שיפוצי הדגמה"`

### Run
```bash
npm run dev
```
- Public: [http://localhost:3000/sites/demo](http://localhost:3000/sites/demo)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Build & deploy

### Build
```bash
npm run build
```

### Deploy (current setup — manual scp + PM2)
The project is **not on a CI/CD pipeline**. Current workflow:
1. SSH to `webapp@46.225.25.221`, project root `~/platform/`
2. `scp` modified files from local
3. `npm run build` on server
4. `pm2 restart pro-digital --update-env`

The server clones from `https://github.com/yo0546673489/construction-sites.git` but **has 67+ uncommitted files** vs `origin/main` due to recent rapid iteration. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Documentation map

| File | Purpose |
|---|---|
| [`docs/AI_HANDOFF.md`](docs/AI_HANDOFF.md) | **START HERE** — curated tour for new AI/dev |
| [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) | Current state — what works, what's broken |
| [`docs/SYSTEM_MAP.md`](docs/SYSTEM_MAP.md) | Full architecture — all data flows |
| [`docs/DATABASE.md`](docs/DATABASE.md) | All Prisma models + relations + indexes |
| [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) | Internal API routes + external APIs |
| [`docs/FILE_STRUCTURE.md`](docs/FILE_STRUCTURE.md) | Every directory & critical file |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Architectural choices & their reasons |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Production setup, PM2, env vars, drift |
| [`docs/TODO.md`](docs/TODO.md) | Pending work, bugs, technical debt |

---

## Important warnings (read before changing anything)

- **`AGENTS.md`** says: *"This is NOT the Next.js you know"*. Several conventions differ from older Next.js — most notably `proxy.ts` instead of `middleware.ts`. When in doubt, read `node_modules/next/dist/docs/`.
- **The public site (`/sites/[slug]`) imports `widget-renderer.tsx` from `components/admin/`**. Anything that touches `widget-renderer`, `landing-preview`, or `charity-landing-preview` affects the public site — be careful with bulk styling changes.
- **Production has 67+ uncommitted files** vs GitHub `origin/main`. A `git checkout` would wipe weeks of work. Sync to GitHub before destructive ops.
- **No automated tests.** Verify changes by manually loading affected pages.
- **`AUTH_SECRET` and `ENCRYPTION_KEY` must never change in production** — sessions invalidate and Gmail tokens become unrecoverable.
