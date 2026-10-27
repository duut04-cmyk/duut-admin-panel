# Step 3 — Safe QA runbook (read-only on shared Supabase)

**Do not run mutation smokes on shared dev without operator approval.**

## Prerequisites

| Requirement        | Detail                                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| Backend            | `cd backend && npm run dev` → default `http://localhost:5000`                                         |
| Admin              | `cd admin-panel && npm run dev` → default `http://localhost:3000`                                     |
| Admin env          | `.env.local` with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `BACKEND_API_URL` (values never logged by scripts) |
| Backend env        | Valid DB URL; `npx prisma migrate status` shows runtime-settings migrations applied on target DB      |
| Browser (E2E only) | Playwright Chromium (installed via `@playwright/test`)                                                |

## `npm run qa:acceptance`

- **CWD:** `admin-panel`
- **Command:** `node scripts/qa-authenticated-acceptance.mjs`
- **Writes data:** One `POST /api/auth/login` (session/refresh on DB); all other checks are **GET** BFF + HTML.
- **BFF GETs:** `/api/auth/me`, reporting (summary, recent-deliveries, orchestration, feedback, recent-activity), customers, deliveries, providers, orchestrations, integrations/status, settings; plus detail GETs using first list IDs.
- **HTML GETs:** `/login`, `/overview`, list pages, detail pages when IDs exist.
- **Avoid:** Script does not call PATCH, provider test-connection, or settings mutations.

## `npm run qa:e2e`

- **CWD:** `admin-panel`
- **Command:** `playwright test` (2 projects: desktop + mobile, serial, 1 worker)
- **Auth:** `e2e/global-setup.ts` logs in if `e2e/.auth/admin.json` missing or older than 30 minutes (gitignored).
- **Specs:** `admin-readonly.spec.ts` (nav, list→detail, provider **Edit → Cancel** only), `admin-readonly-interactions.spec.ts` (empty search, filters, pagination; customers retry may use **browser-only 503 mock**).
- **Writes:** Possible refresh of `e2e/.auth/admin.json`; `e2e/results.json` reporter output (gitignored).
- **Avoid:** No test-connection, credentials save, settings PATCH, or payment/provider live calls in specs.

## Recommended sequence

```bash
# Terminal 1
cd /home/codedrill/dutt/backend && npm run dev

# Terminal 2
cd /home/codedrill/dutt/admin-panel && npm run dev

# Terminal 3 (wait until both servers respond)
cd /home/codedrill/dutt/admin-panel
npm run qa:acceptance
npm run qa:e2e
```

If E2E hangs on overview/list loads: `rm -f e2e/.auth/admin.json && npm run qa:e2e`.

## Pre-release checks (optional, read-only)

```bash
cd /home/codedrill/dutt/backend && npx prisma migrate status
cd /home/codedrill/dutt/backend && npm run typecheck && npm test
cd /home/codedrill/dutt/admin-panel && npm run typecheck && npm run lint && npm run build
```

## Do not run (unless explicitly approved)

- Provider `POST .../test-connection` / `test-quote`
- Settings `PATCH /api/settings/policies` on shared DB
- `db:reset-data`, Cashfree webhooks, OTP/SMS smokes against real numbers
- Shiprocket probes with live credentials outside sandbox policy
