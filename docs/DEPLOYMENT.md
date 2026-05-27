# Deployment

How the production system actually runs. The current state is "manual deploy via scp" — there's no CI/CD.

---

## Production environment

| Thing | Value |
|---|---|
| Server | `webapp@46.225.25.221` (SSH) |
| Project root | `/home/webapp/platform/` |
| Process manager | PM2, process name `pro-digital` |
| Entry | `node_modules/next/dist/bin/next start` (port 3000, hostname 127.0.0.1) |
| Reverse proxy | Caddy (assumed; based on `auth.ts > trustHost: true`). Domain: `pro-digital.org` + `lp3.pro-digital.org` |
| Logs | `/home/webapp/logs/out.log`, `/home/webapp/logs/error.log` |
| DB | `/home/webapp/platform/prisma/dev.db` (SQLite file) |
| Node | v22 |
| Repo origin | `https://github.com/yo0546673489/construction-sites.git` |

---

## PM2 config

`ecosystem.config.js`:
```js
module.exports = {
  apps: [{
    name: "pro-digital",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    cwd: "/home/webapp/platform",
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      HOSTNAME: "127.0.0.1",
    },
    max_memory_restart: "2G",
    error_file: "/home/webapp/logs/error.log",
    out_file: "/home/webapp/logs/out.log",
    time: true,
    autorestart: true,
  }],
};
```

Notable:
- **fork mode** (single process). No clustering — SQLite + better-sqlite3 doesn't multi-process well.
- **autorestart: true** — recovers from crashes.
- **max_memory_restart: 2G** — kills+restarts if RSS exceeds 2GB.
- **HOSTNAME: 127.0.0.1** — only listens on loopback. Caddy fronts it from the public IP.

---

## Environment variables (production)

Set in `~/platform/.env`. As of latest check, the keys are:

| Key | Required | Purpose |
|---|---|---|
| `NODE_ENV` | yes | Should be `production` |
| `DATABASE_URL` | yes | `file:./dev.db` (SQLite path relative to project root) |
| `AUTH_SECRET` | yes | NextAuth JWT signing. **Never rotate in prod** — invalidates all sessions. |
| `NEXTAUTH_URL` | yes | `https://www.pro-digital.org` |
| `AUTH_TRUST_HOST` | yes | `true` — needed because we're behind Caddy |
| `ENCRYPTION_KEY` | yes | 32+ chars hex. Used to derive AES-256-GCM key for Gmail tokens. **Never rotate without re-encrypting tokens.** |
| `CRON_SECRET` | yes | Bearer token for `GET /api/donations/sync` cron endpoint |
| `NEXT_PUBLIC_BASE_URL` | yes | `https://www.pro-digital.org`. Used to build shareable report URLs. |
| `META_API_VERSION` | yes | `v21.0` |
| `META_SYSTEM_USER_TOKEN` | yes | Token for Meta Marketing API. Granted Admin on each tenant's Ad Account. |
| `GOOGLE_CLIENT_ID` | yes (for Gmail) | OAuth client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | yes (for Gmail) | OAuth client secret |
| `GOOGLE_REDIRECT_URI` | yes (for Gmail) | `https://www.pro-digital.org/api/gmail/callback`. **Must match Google Cloud Console exactly.** |

To inspect (with values masked):
```bash
ssh webapp@46.225.25.221 "cd ~/platform && grep -E '^[A-Z]' .env | sed 's|=.*|=***|'"
```

To update one variable:
```bash
ssh webapp@46.225.25.221 "cd ~/platform && sed -i 's|^META_SYSTEM_USER_TOKEN=.*|META_SYSTEM_USER_TOKEN=NEW|' .env && pm2 restart pro-digital --update-env"
```

⚠️ `--update-env` flag is **required** — without it, PM2 keeps the old environment from when the process was first started.

---

## Current deploy workflow (manual)

There is **no CI/CD**. Each deploy is hands-on.

### Standard deploy (single file change)
From local machine:
```bash
# 1. Edit file locally
# 2. scp to server
scp src/path/to/file.tsx webapp@46.225.25.221:~/platform/src/path/to/file.tsx

# 3. Build + restart on server
ssh webapp@46.225.25.221 "cd ~/platform && npm run build && pm2 restart pro-digital --update-env"
```

### Multi-file deploy (preferred when touching many files)
Use a single combined SSH command to minimize round-trips. Example pattern (used many times in handoff conversation):
```bash
scp src/a.tsx src/b.tsx ... webapp@46.225.25.221:/tmp/ \
  && ssh webapp@46.225.25.221 "cp /tmp/a.tsx ~/platform/src/path/a.tsx && cp /tmp/b.tsx ... && cd ~/platform && npm run build && pm2 restart pro-digital --update-env"
```

### Verify after restart
```bash
ssh webapp@46.225.25.221 "pm2 logs pro-digital --lines 30 --nostream"
```
Look for `Ready in N ms` — that confirms Next.js started cleanly.

---

## Build characteristics

- **Build time:** ~30-60 seconds for incremental, ~2-3 min for cold.
- **Memory:** Build can spike to ~1.5GB. The 2GB `max_memory_restart` is generous.
- **Output:** `.next/` directory.

---

## Git drift situation (current snapshot)

- **Server has 67+ uncommitted modifications** vs `origin/main`.
- **Local Windows working copy** at `D:/שולחן עבודה/קלוד/בניית אתר/my-website/` is **not a git repo** (no `.git/`). It's a raw working tree synced from server via the scp workflow.
- **GitHub state** (`yo0546673489/construction-sites.git`) is at commit `5717a03` (`feat: campaigns + donations + cashflow + shareable reports + Gmail OAuth`). Anything after that exists only on the server (and in the local working tree).

To resolve drift safely (recommended next step):
```bash
ssh webapp@46.225.25.221
cd ~/platform
git checkout -b handoff/light-theme-and-features-$(date +%Y%m%d)
git add -A
git status   # review what's staged
git commit -m "feat: light-theme dashboard, custom date picker, per-keyword breakdowns, donation parser hardening"
git push -u origin handoff/light-theme-and-features-...
# Then create PR, review, merge to main
```

---

## SSL / Domains

Handled by Caddy. Domains:
- `pro-digital.org` and `www.pro-digital.org` → Caddy → Next.js port 3000 → `next.config.ts > rewrites` → `/sites/demo`
- `lp3.pro-digital.org` → Caddy → Next.js port 3000 → rewrite → `/sites/lp-3`

The Caddy config is **not in this repo** — it lives on the server itself (likely `/etc/caddy/Caddyfile`).

---

## Database backup

**Currently:** None automated. The DB is a single file at `~/platform/prisma/dev.db`.

**Manual backup:**
```bash
ssh webapp@46.225.25.221 "cp ~/platform/prisma/dev.db ~/backups/dev.db.$(date +%Y%m%d-%H%M%S)"
```

**Recommended:** Add a daily cron:
```bash
0 3 * * * cp /home/webapp/platform/prisma/dev.db /home/webapp/backups/dev.db.$(date +\%Y\%m\%d) && find /home/webapp/backups -name 'dev.db.*' -mtime +30 -delete
```

---

## Rollback procedure

If a deploy breaks something:

### Option A: Restore previous code
1. Identify the file(s) that broke. Check `pm2 logs pro-digital --err`.
2. If you know the previous version (e.g. from your local machine), `scp` it back over.
3. `npm run build && pm2 restart pro-digital --update-env`.

### Option B: Restart only (if the issue is transient)
```bash
ssh webapp@46.225.25.221 "pm2 restart pro-digital --update-env"
```

### Option C: Restore from git (DANGEROUS — wipes uncommitted work)
DO NOT USE without first backing up `~/platform/` directory.

---

## Known production gotchas

1. **Always pass `--update-env` to `pm2 restart`** after editing `.env`. Otherwise the process runs with stale env.
2. **`npm run build` must succeed before restart** — PM2 will keep the old build running until restart.
3. **Don't `npm install` on server during traffic** — package upgrades can take >1 minute and the build may fail.
4. **`prisma migrate dev` is for local only.** On prod use `npx prisma migrate deploy` (no schema diffing, no dev-mode reset).
5. **`prisma db seed` on prod will create the demo users** — almost certainly not what you want. Don't run it on prod unless first time.

---

## Setting up a new server (greenfield deploy)

If you ever stand up a fresh box, the rough order:

1. Install Node 22, npm.
2. Install PM2 globally: `npm i -g pm2`.
3. Install Caddy. Create `/etc/caddy/Caddyfile` with reverse proxy to `127.0.0.1:3000` for each domain.
4. `git clone git@github.com:yo0546673489/construction-sites.git ~/platform`.
5. Copy `.env.example` to `.env`. Fill in all required vars. Generate `AUTH_SECRET`, `ENCRYPTION_KEY`, `CRON_SECRET` with `openssl rand`.
6. `cd ~/platform && npm install`.
7. `npx prisma migrate deploy`.
8. `npx prisma db seed` (only on first install).
9. `npm run build`.
10. `pm2 start ecosystem.config.js`.
11. `pm2 save && pm2 startup` (so PM2 restarts on reboot).
12. Make sure `/home/webapp/logs/` exists (PM2 writes there).
13. Set up the cron (`crontab -e`):
    ```
    0 * * * * curl -fsSL -H "Authorization: Bearer YOUR_CRON_SECRET" https://www.pro-digital.org/api/donations/sync >> /home/webapp/logs/cron.log 2>&1
    ```
14. Add daily DB backup (see above).
15. Verify by visiting `/admin/login` and logging in with the seed credentials.

---

## Monitoring

**Currently:** None. PM2 keeps the process alive and logs to disk. There's no uptime monitoring, no alerting.

**Recommended:** Set up something like UptimeRobot to ping `https://www.pro-digital.org/` every 5 minutes.
