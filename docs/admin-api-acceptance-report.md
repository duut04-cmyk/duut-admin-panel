# Admin Panel — Authenticated QA & acceptance report

**Last updated:** 2026-10-27 (final read-only E2E + API acceptance after DB restored)  
**Admin Panel:** `http://localhost:3000`  
**Backend (BFF target):** `http://localhost:5000` (`BACKEND_API_URL`)

## Environment classification

| Aspect                            | Classification                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `NODE_ENV` (backend)              | `development`                                                                           |
| Database                          | **Remote Supabase Postgres** (shared dev) — **read-only** QA only                       |
| Shiprocket booking                | `SHIPROCKET_BOOKING_ENABLED` unset → default **false**                                  |
| Mutations in this pass            | **None** on business data (read-only E2E + GET acceptance; login/session only for auth) |
| Database connectivity (this pass) | **OK** — Supabase pooler reachable; transient outage earlier same day                   |

## Coverage layers

| Layer                         | Tool                          | Status                                                           |
| ----------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| API + HTML smoke (15+ routes) | `npm run qa:acceptance`       | **PASS** (exit 0, ~66s; after DB restored)                       |
| Interactive browser           | `npm run qa:e2e` (Playwright) | **PASS** — **14/14**, **0 failed**, **0 skipped** (~2.9m / 173s) |
| Security (P1 CSRF)            | Vitest via backend            | **PASS** — `admin-panel-csrf*`, `admin-panel-middleware.csrf`    |
| Security (P2 session)         | Vitest via backend            | **PASS** — `admin-panel-session-proxy`                           |
| Security (P3 provider API)    | Vitest via backend            | **PASS** — `provider-health-error`, `provider.admin`             |
| Security (P3 CORS)            | Vitest via backend            | **PASS** — `cors.config.test`                                    |

## Browser tooling

| Item           | Detail                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| System browser | `/usr/bin/google-chrome` available                                                                        |
| Automation     | **`@playwright/test@1.51.1`** (devDependency)                                                             |
| Chromium       | Playwright bundled headless shell                                                                         |
| Auth for E2E   | `e2e/global-setup.ts` — login when `e2e/.auth/admin.json` missing or **> 30 min** old                     |
| Config         | `playwright.config.ts` — `chromium-desktop`, `chromium-mobile` (Pixel 5)                                  |
| Shared helpers | `e2e/helpers.ts` — nav, visible searchbox (duplicate mobile/desktop toolbars), filters, pagination helper |

## Route inventory (15)

Login, overview, customers (+ detail), providers (+ detail), deliveries (+ detail), orchestration (+ delivery + request detail), reports, integrations, settings, design-system.

## Interactive acceptance — baseline (unchanged scenarios)

### Authentication

- Real UI login in global setup when storage state is stale (credentials from `.env.local`, never logged).
- Tests reuse session cookie (`doot_admin_access_token`).

### Desktop / mobile — shell & flows (`e2e/admin-readonly.spec.ts`)

1. **Shell navigation** — Overview → main routes via sidebar or mobile drawer; `/design-system`; return Overview.
2. **List → detail** — Customer, provider (**Edit → Cancel** only), delivery, orchestration request when rows exist.
3. **Overview widgets** — “Recent deliveries” visible; no Application error / Hydration failed.

## Read-only list interactions (`e2e/admin-readonly-interactions.spec.ts`)

All scenarios are **read-only** (search, filter sheet, pagination navigation, Retry after intercepted failure). No saves, toggles, test-connection, or backend mutations.

| Scenario                   | What was verified                                                                                                                                                                                                 | Outcome                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Empty search**           | Token `e2e-no-match-7f3a9c2e` on customers (`GET /api/customers?search=…`), deliveries (`reference=…`), orchestration (`reference=…`), providers (client-side filter)                                             | Empty states: “No customers found”, “No deliveries found”, “No orchestration records”, “No providers found” — desktop + mobile **PASS** |
| **Filter sheets**          | Customers: Status → Active (`status=ACTIVE`); Deliveries: Delivered (`status=DELIVERED`); Providers: Enabled → Disabled only (client-side, **Clear all**); Orchestration: Booking → Confirmed (`bookingStatus=…`) | Expected GET query params or filter UI state; **Clear all** resets — desktop + mobile **PASS**                                          |
| **Pagination**             | Next page when `totalPages > 1` (waits for `page=2` GET)                                                                                                                                                          | **Data-dependent** — see NOT VERIFIED below                                                                                             |
| **Simulated list failure** | `page.route` on `GET /api/customers` (list only) returns **503** until **Retry**; then real BFF GET                                                                                                               | Error callout “Unable to load customers”, ≥2 list GET attempts, list recovers — desktop + mobile **PASS**                               |

### Pagination (shared dev data — run 2026-10-27)

| List          | Desktop (`chromium-desktop`)                              | Mobile (`chromium-mobile`)     |
| ------------- | --------------------------------------------------------- | ------------------------------ |
| Customers     | **NOT VERIFIED** — pagination hidden (`totalPages ≤ 1`)   | **VERIFIED** — page 2 via Next |
| Deliveries    | **NOT VERIFIED** — pagination hidden                      | **VERIFIED** — page 2 via Next |
| Orchestration | **VERIFIED** — page 2 via Next                            | **VERIFIED** — page 2 via Next |
| Providers     | **N/A** — no server pagination UI (full list loaded once) | Same                           |

Annotations are recorded on the pagination test via Playwright `testInfo.annotations` (see `e2e/results.json`).

## Per-route interactive result (Playwright)

| Route / flow                                        | Desktop | Mobile                |
| --------------------------------------------------- | ------- | --------------------- |
| Login (setup)                                       | PASS    | PASS (shared session) |
| `/overview`                                         | PASS    | PASS                  |
| `/customers` + detail + search/filter/retry         | PASS    | PASS                  |
| `/providers` + detail (edit cancel) + search/filter | PASS    | PASS                  |
| `/deliveries` + detail + search/filter              | PASS    | PASS                  |
| `/orchestration` + detail + search/filter           | PASS    | PASS                  |
| `/reports`                                          | PASS    | PASS                  |
| `/integrations`                                     | PASS    | PASS                  |
| `/settings`                                         | PASS    | PASS                  |
| `/design-system`                                    | PASS    | PASS                  |

## Security hardening (verified in code + tests)

### P1 — BFF CSRF (2026-10-27)

- All `/api/*` **POST/PUT/PATCH/DELETE** requests pass through middleware + `evaluateProtectedApiRequest` (`src/lib/auth/apiRequestPolicy.ts`).
- Same-origin via matching `Origin` or `Referer` to `Host`; missing both → **403** before route handlers or backend.
- Login/logout CSRF enforced centrally; acceptance script sends `Origin` on login POST.

### P2 — Stale session after backend 401 (2026-10-27)

- `proxyBackendJson.ts` clears `doot_admin_access_token` when backend returns **401** with `error.code` **`INVALID_ACCESS_TOKEN`** or **`UNAUTHORIZED`** (`src/lib/auth/sessionFromBackend.ts`).
- **403** from BFF proxies does **not** clear the cookie (permission denied with valid session).
- **503** / other errors do not clear the cookie.
- `/api/auth/me` uses the same helper for 401; non-ADMIN **403** still clears cookie (invalid admin session).
- No client-side JWT decoding; backend auth remains authoritative.

**Not implemented (documented tradeoff):** middleware JWT expiry pre-check — would duplicate backend validation.

### P3 — Provider health errors & lifecycle (2026-10-27)

- Admin DTO `health.lastError` sanitized at API boundary (`sanitizeProviderHealthCheckError`): only the canonical `"Provider health check failed."` is returned for stored failures; other upstream/legacy text is collapsed (no credential patterns in responses).
- Generic `PATCH /api/v1/admin/providers/:id` rejects `enabled` (Zod strict); enable/disable via `PATCH .../:id/status` only.
- Admin Panel config save already omits `enabled` from PATCH (`providerUpdateValidation`).

### P3 — Backend CORS (2026-10-27)

**Before:** If both `FRONTEND_URL` and `ADMIN_FRONTEND_URL` were unset, Express CORS used `origin: true` (reflect any Origin) with `credentials: true`.

**After (`src/config/cors.config.ts`):**

- Explicit env URLs → allowlist only.
- Unset in **development** or **test** → `http://localhost:3000` and `http://127.0.0.1:3000`.
- Unset in **production** → deny cross-origin browser requests (no reflective fallback).
- Admin Panel normal use is same-origin BFF + server-side Bearer; CORS mainly affects customer SPA → API browser calls.

**Configure production:** set `FRONTEND_URL` and/or `ADMIN_FRONTEND_URL` to deployed UI origins (see `backend/.env.example`).

## Console & network

- Baseline spec still fails on unplanned BFF **5xx** during navigation tests.
- Retry scenario intentionally produces one **503** on list GET (intercepted in browser only); recovered after Retry.
- **429** on login mitigated by global setup backoff; delete `e2e/.auth/admin.json` if session expired while auth file is still “fresh” (< 30 min).

## Defects fixed in acceptance work

| Issue                   | Root cause                                          | Fix                                                    |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| E2E login selector      | Label matched “Show password”                       | `input[name="password"]`                               |
| Playwright install      | Peer below Next 16                                  | `@playwright/test@1.51.1`                              |
| Mobile nav              | Hidden sidebar                                      | `openNavLink()` drawer + `goto` fallback               |
| Duplicate search inputs | Mobile + desktop toolbars both in DOM               | `visibleSearchbox()` helper                            |
| Retry test flake        | Strict-mode double fetch succeeded after single 503 | Fail all list GETs until Retry enables passthrough     |
| Stale auth file         | JWT expired while setup skipped re-login            | Remove `e2e/.auth/admin.json` and re-run (operational) |

**No Admin Panel production UI code changes** in this interaction pass (E2E + docs only).

## Final read-only acceptance (2026-10-27)

**Preflight:** `GET http://localhost:5000/health` → **200**; `GET http://localhost:3000/login` → **200**. Backend + Admin Panel dev servers running. Dirty working trees preserved.

### `npm run qa:acceptance` (same day, before E2E)

- **Exit code:** **0** (~66s)
- **Login:** success (session cookie obtained)
- **BFF:** all configured list + detail GET checks **ok**
- **HTML:** all smoke routes **ok** (including detail pages when IDs present)

### `npm run qa:e2e`

- **Command:** `npm run qa:e2e` → `playwright test`
- **Totals:** **14 passed**, **0 failed**, **0 skipped** (Playwright stats: `expected: 14`, `duration: ~173s`, wall ~**2.9m**)
- **Projects:** `chromium-desktop` (7/7), `chromium-mobile` (7/7)
- **Specs:** `admin-readonly-interactions.spec.ts` (4×2), `admin-readonly.spec.ts` (3×2)
- **Pagination annotations** (`e2e/results.json`): desktop — customers page 2 verified; deliveries/orchestration hidden (`totalPages ≤ 1`); mobile — customers + deliveries page 2 verified; providers N/A (no server pagination UI)
- **Auth:** reused `e2e/.auth/admin.json` (global setup skipped re-login while file under 30 min old)
- **No** production UI or assertion changes

### Static checks (final pass)

| Command                          | Result   |
| -------------------------------- | -------- |
| `git diff --check` (backend)     | **PASS** |
| `git diff --check` (admin-panel) | **PASS** |

### Read-only acceptance verdict

**Supports** read-only Admin Panel acceptance for the established QA suite (API smoke + Playwright) against local dev + shared remote DB, **after** DB connectivity was restored. **Not** full product/release readiness.

### Earlier same-day blocker (resolved)

Morning run failed when Supabase pooler was unreachable (`Can't reach database server`). DNS/TCP and `SELECT 1` succeeded after recovery; acceptance + E2E then passed.

## Automated checks (backend unit regression)

| Command                          | Result                                 |
| -------------------------------- | -------------------------------------- |
| `npm test` (backend, full suite) | **891 passed** in **146** files (~21s) |
| `npm run qa:e2e`                 | **14/14 passed** (final pass)          |
| `npm run qa:acceptance`          | **PASS** (final pass)                  |

## External / operational actions

**Confirmed not triggered:** test-connection, test-quote, booking, cancellation, re-orchestrate, OTP/SMS, payments/refunds, migrations, deploy.

## Remaining NOT VERIFIED

- **Customers / deliveries pagination on desktop** when shared dev `totalPages ≤ 1` (data-dependent; latest E2E: desktop deliveries/orchestration pagination **not verified** this run).
- **Provider list pagination** — not implemented (by design).
- Date-range / period header filters (only sheet selects exercised).
- Settings PATCH, provider credentials/status/diagnostics actions, customer PATCH.
- Invalid-password login message (optional manual).
- End-to-end UI test of cookie clear after live backend 401 (covered by unit tests on proxy layer).
- Full release readiness — **not claimed**.

## Residual security / ops notes

- **Production CORS:** must set `FRONTEND_URL` / `ADMIN_FRONTEND_URL` on the API host; empty production config denies cross-origin (intentional).
- **Admin mutations:** CSRF same-origin on BFF remains required; CORS is not a substitute for auth/CSRF.
- **Provider health UI:** operators only see canonical failure text unless new approved messages are added to the sanitizer allowlist.

## Coverage matrix

Unchanged integration scope: `docs/admin-api-coverage.md` (54 COMPLETE integration actions; 5 BLOCKED).

## How to re-run

```bash
# Backend + admin dev servers running
cd admin-panel
npm run qa:e2e
npm run qa:acceptance   # optional smoke
```

If tests hang on overview or list loads, refresh auth: `rm -f e2e/.auth/admin.json && npm run qa:e2e`.
