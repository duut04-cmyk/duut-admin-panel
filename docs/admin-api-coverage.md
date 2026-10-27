# Admin Panel — Backend API coverage matrix

Last updated: integration completion pass (provider config lifecycle, mock cleanup).

## Summary counts

| Status             | Count |
| ------------------ | ----: |
| **COMPLETE**       |    54 |
| **PARTIAL**        |     0 |
| **MISSING**        |     0 |
| **BLOCKED**        |     5 |
| **NOT APPLICABLE** |     6 |

Counts cover **meaningful page actions** in the matrix below (one row per action).

## Conventions

- **BFF**: Next.js route under `admin-panel/src/app/api/**` forwarding session cookies to the backend.
- **Backend**: Express routes mounted from `backend/src/routes/index.ts` (prefix `/api/v1` unless noted).
- **Auth**: Admin UI requires authenticated session; backend enforces `ADMIN` role on admin mounts.

---

## Auth

| Action       | Client                   | BFF                     | Backend      | Status   | Evidence                           |
| ------------ | ------------------------ | ----------------------- | ------------ | -------- | ---------------------------------- |
| Login        | `POST` via login form    | `POST /api/auth/login`  | admin login  | COMPLETE | `src/app/api/auth/login/route.ts`  |
| Logout       | —                        | `POST /api/auth/logout` | admin logout | COMPLETE | `src/app/api/auth/logout/route.ts` |
| Session / me | `useAdminSessionContext` | `GET /api/auth/me`      | auth me      | COMPLETE | `src/app/api/auth/me/route.ts`     |

---

## Overview (`/overview`)

| Action            | Client API              | BFF                                    | Backend                        | Status   | Notes                                          |
| ----------------- | ----------------------- | -------------------------------------- | ------------------------------ | -------- | ---------------------------------------------- |
| Reporting summary | `fetchReportingSummary` | `GET /api/reporting/summary`           | `GET /admin/reporting/summary` | COMPLETE | `src/reporting/api.ts`, `reportingHandlers.ts` |
| Recent deliveries | `fetchRecentDeliveries` | `GET /api/reporting/recent-deliveries` | admin reporting                | COMPLETE |                                                |
| Recent activity   | `fetchRecentActivity`   | `GET /api/reporting/recent-activity`   | admin reporting                | COMPLETE | `OverviewRecentActivityFeed`                   |
| Greeting          | session account         | —                                      | —                              | COMPLETE | `lib/adminDisplayName.ts` + session name       |

---

## Customers

| Action                            | Client API       | BFF                         | Backend                    | Status   |
| --------------------------------- | ---------------- | --------------------------- | -------------------------- | -------- |
| List (search, status, pagination) | `fetchCustomers` | `GET /api/customers`        | `GET /admin/customers`     | COMPLETE |
| Detail                            | `fetchCustomer`  | `GET /api/customers/[id]`   | `GET /admin/customers/:id` | COMPLETE |
| Update status                     | `updateCustomer` | `PATCH /api/customers/[id]` | admin customer PATCH       | COMPLETE |

Evidence: `src/customers/api.ts`, `src/app/api/customers/**`.

---

## Deliveries

| Action                     | Client API             | BFF                                | Backend                             | Status         | Notes                             |
| -------------------------- | ---------------------- | ---------------------------------- | ----------------------------------- | -------------- | --------------------------------- |
| List (filters, pagination) | `fetchDeliveries`      | `GET /api/deliveries`              | `GET /admin/deliveries`             | COMPLETE       |                                   |
| Detail (full history DTO)  | `fetchDeliveryHistory` | `GET /api/deliveries/[id]/history` | `GET /admin/deliveries/:id/history` | COMPLETE       | Authoritative admin detail        |
| Orchestration link         | navigation             | —                                  | —                                   | COMPLETE       | `/orchestration/[deliveryId]`     |
| Detail via generic GET     | —                      | `GET /api/deliveries/[id]`         | `GET /api/v1/deliveries/:id`        | NOT APPLICABLE | BFF exists; UI uses admin history |
| Driver / tracking ops      | —                      | —                                  | `/admin/deliveries/.../operational` | BLOCKED        | No admin UI by design             |

Evidence: `src/deliveries/api.ts`, `src/lib/bff/deliveryHandlers.ts`.

---

## Orchestration

| Action                   | Client API                     | BFF                            | Backend                             | Status   |
| ------------------------ | ------------------------------ | ------------------------------ | ----------------------------------- | -------- |
| List + filters           | `fetchOrchestrations`          | `GET /api/orchestrations`      | `GET /admin/orchestrations`         | COMPLETE |
| Run detail by request id | `fetchOrchestrationRun`        | `GET /api/orchestrations/[id]` | admin orchestration detail          | COMPLETE |
| Detail by delivery id    | `fetchOrchestration` + history | `GET .../orchestration`        | `GET /deliveries/:id/orchestration` | COMPLETE | ADMIN allowed in `loadAuthorizedDelivery` |
| Trigger re-orchestrate   | —                              | POST customer orchestrate      | side effects                        | BLOCKED  | Not exposed in admin UI                   |

Evidence: `src/orchestration/listApi.ts`, `runApi.ts`, `api.ts`.

---

## Providers

| Action             | Client API                  | BFF                                | Backend                | Status   | Notes                        |
| ------------------ | --------------------------- | ---------------------------------- | ---------------------- | -------- | ---------------------------- |
| List               | `fetchProviders`            | `GET /api/providers`               | `GET /admin/providers` | COMPLETE |                              |
| Create             | `createProvider`            | `POST /api/providers`              | admin POST             | COMPLETE |                              |
| Detail GET         | `fetchProvider`             | `GET /api/providers/[id]`          | admin GET              | COMPLETE |                              |
| Profile PATCH      | `updateProvider`            | `PATCH /api/providers/[id]`        | admin PATCH            | COMPLETE | No `enabled` in config patch |
| Lifecycle status   | `updateProviderStatus`      | `PATCH /api/providers/[id]/status` | admin status           | COMPLETE | List toggle + Status section |
| Orchestration flag | `updateProvider`            | PATCH                              | admin PATCH            | COMPLETE | Config section only          |
| Credentials PUT    | `updateProviderCredentials` | `PUT .../credentials`              | admin credentials      | COMPLETE | Write-only in UI             |
| Test connection    | `testProviderConnection`    | `POST .../test-connection`         | admin test-connection  | COMPLETE | SANDBOX-only in UI           |
| Capabilities       | `fetchProviderCapabilities` | `GET .../capabilities`             | admin capabilities     | COMPLETE |                              |
| Services CRUD      | provider services API       | `/api/providers/[id]/services*`    | admin services         | COMPLETE |                              |
| Vehicles CRUD      | provider vehicles API       | `/api/providers/[id]/vehicles*`    | admin vehicles         | COMPLETE |                              |
| Test quote         | —                           | —                                  | `POST .../test-quote`  | BLOCKED  | Policy: no UI                |

Evidence: `src/providers/api.ts`, `providerListLifecycle.ts`, `ProviderStatusSection`, `ProviderConfigurationSection`.

---

## Reports (`/reports`)

| Action                       | Client API                             | BFF                            | Backend         | Status   |
| ---------------------------- | -------------------------------------- | ------------------------------ | --------------- | -------- |
| Snapshot metrics             | `fetchReportingSummary` + mappers      | reporting BFF                  | admin reporting | COMPLETE |
| Orchestration accountability | `fetchOrchestrationReporting`          | `/api/reporting/orchestration` | admin           | COMPLETE |
| Feedback quality             | `fetchFeedbackReporting`               | `/api/reporting/feedback`      | admin           | COMPLETE |
| Provider rows                | `fetchProviders` + `liveReportMappers` | providers BFF                  | admin providers | COMPLETE |
| Customer sample              | `fetchCustomers`                       | customers BFF                  | admin customers | COMPLETE |
| Issue queue                  | `buildLiveIssueQueue`                  | derived from live APIs         | —               | COMPLETE |

Legacy mock orchestration helpers removed from `reports/accountability.ts`.

---

## Integrations

| Action           | Client API                | BFF                            | Backend                   | Status   |
| ---------------- | ------------------------- | ------------------------------ | ------------------------- | -------- |
| Status dashboard | `fetchIntegrationsStatus` | `GET /api/integrations/status` | admin integrations status | COMPLETE |

---

## Settings

| Action                 | Client API      | BFF                            | Backend        | Status   |
| ---------------------- | --------------- | ------------------------------ | -------------- | -------- |
| Snapshot GET           | `fetchSettings` | `GET /api/settings`            | admin settings | COMPLETE |
| Booking policies PATCH | settings API    | `PATCH /api/settings/policies` | admin settings | COMPLETE |
| Pricing policies PATCH | settings API    | policies route                 | admin settings | COMPLETE |

---

## Design system & removed mock paths

| Item                                      | Status         | Notes                                               |
| ----------------------------------------- | -------------- | --------------------------------------------------- |
| `/design-system`                          | NOT APPLICABLE | No backend                                          |
| `OverviewRightRail` / mock live activity  | NOT APPLICABLE | Removed (unused)                                    |
| `mockAdminUser`                           | NOT APPLICABLE | Replaced by `lib/adminDisplayName.ts`               |
| Legacy props-based `LiveActivityFeed.tsx` | NOT APPLICABLE | Removed; `OverviewRecentActivityFeed` uses live API |

---

## Blockers (require product/backend approval)

1. **Provider test-quote** — backend `POST /admin/providers/:id/test-quote`; intentionally no admin UI.
2. **Delivery operational APIs** — driver refresh, tracking refresh, simulate; no admin UI.
3. **Re-orchestrate from admin** — customer POST `/:id/orchestrate`; not exposed (external side effects).
4. **SUSPENDED vs orchestration resolver** — UI sends `enabled: false` on suspend; backend eligibility may still treat edge cases; document-only unless backend change approved.
5. **Generic delivery GET BFF** — optional future use; history endpoint is sufficient for admin detail today.

---

## Safety boundaries (unchanged)

- Cashfree, refunds, GST, OTP/SMS, orchestration scoring/selection/fallback, Shiprocket booking disabled (`SHIPROCKET_BOOKING_ENABLED=false`).
- No database migrations or production backend logic changes as part of admin UI integration.
- Credentials remain write-only; diagnostics SANDBOX-only; no live provider calls in automated tests.

---

## Verification

- Backend: `npm test -- --run admin-panel-` in `backend/`
- Admin panel: `npm run typecheck`, `npm run lint`, `npm run build` in `admin-panel/`
- Browser: smoke check 2026-10-27 — unauthenticated `curl` returned `200` for `/login` and `307` redirect to login for protected routes (middleware). Full authenticated UI pass **NOT VERIFIED** in this session (requires admin credentials and manual click-through).
