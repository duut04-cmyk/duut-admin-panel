/**
 * Local authenticated acceptance runner (BFF + HTML smoke).
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env.local — never logs secret values.
 * Usage: node scripts/qa-authenticated-acceptance.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_BASE = process.env.ADMIN_BASE_URL?.trim() || "http://localhost:3000";
const COOKIE_NAME = "doot_admin_access_token";

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(
      ".env.local missing (ADMIN_EMAIL, ADMIN_PASSWORD, BACKEND_API_URL).",
    );
  }
  const out = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function parseSetCookieHeader(setCookie) {
  if (!setCookie) return null;
  const part = setCookie.split(";")[0];
  const eq = part.indexOf("=");
  if (eq <= 0) return null;
  return `${part.slice(0, eq).trim()}=${part.slice(eq + 1).trim()}`;
}

async function login(email, password) {
  const adminOrigin = new URL(ADMIN_BASE).origin;
  const res = await fetch(`${ADMIN_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: adminOrigin,
    },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  const cookies = [];
  if (typeof res.headers.getSetCookie === "function") {
    for (const raw of res.headers.getSetCookie()) {
      const c = parseSetCookieHeader(raw);
      if (c) cookies.push(c);
    }
  } else {
    const single = res.headers.get("set-cookie");
    const c = parseSetCookieHeader(single);
    if (c) cookies.push(c);
  }
  return {
    ok: res.ok && json.success === true,
    status: res.status,
    cookies,
    error: json.error,
  };
}

function cookieHeader(cookies) {
  return cookies.join("; ");
}

async function apiGet(cookies, pathname) {
  const res = await fetch(`${ADMIN_BASE}${pathname}`, {
    headers: { Cookie: cookieHeader(cookies) },
    redirect: "manual",
  });
  let json = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    json = await res.json().catch(() => null);
  }
  return { status: res.status, json, ok: res.ok };
}

async function pageGet(cookies, pathname) {
  const res = await fetch(`${ADMIN_BASE}${pathname}`, {
    headers: { Cookie: cookieHeader(cookies) },
    redirect: "manual",
  });
  const text = await res.text();
  const location = res.headers.get("location");
  return {
    status: res.status,
    location,
    htmlLength: text.length,
    hasNextError: /Application error|Hydration failed/i.test(text),
    redirectedToLogin: location?.includes("/login") ?? false,
    bodySnippet: text.slice(0, 500),
  };
}

function reportingRangeQuery() {
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  const q = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });
  return q.toString();
}

function pickFirstItemId(json, field = "id") {
  const items = json?.data?.items;
  if (!Array.isArray(items) || items.length === 0) return null;
  const first = items[0];
  return first[field] ?? first.id ?? null;
}

async function main() {
  const env = loadEnvLocal();
  const email = env.ADMIN_EMAIL?.trim();
  const password = env.ADMIN_PASSWORD;
  const backendUrl = env.BACKEND_API_URL?.trim();

  if (!email || !password) {
    console.error(
      JSON.stringify({
        success: false,
        error: "ADMIN_EMAIL/ADMIN_PASSWORD not in .env.local",
      }),
    );
    process.exit(1);
  }

  const report = {
    success: true,
    at: new Date().toISOString(),
    adminBase: ADMIN_BASE,
    backendConfigured: Boolean(backendUrl),
    backendHost: backendUrl ? new URL(backendUrl).host : null,
    environmentClass: "remote-database-dev-backend-local",
    login: null,
    bff: [],
    pages: [],
    ids: {},
  };

  const loginResult = await login(email, password);
  report.login = {
    ok: loginResult.ok,
    status: loginResult.status,
    cookieCount: loginResult.cookies.length,
    error: loginResult.ok ? undefined : String(loginResult.error ?? "login failed"),
  };

  if (!loginResult.ok || loginResult.cookies.length === 0) {
    report.success = false;
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  const cookies = loginResult.cookies;

  const rangeQs = reportingRangeQuery();

  const bffChecks = [
    ["/api/auth/me", "me"],
    [`/api/reporting/summary?${rangeQs}`, "reporting.summary"],
    [
      `/api/reporting/recent-deliveries?${rangeQs}&limit=5`,
      "reporting.recentDeliveries",
    ],
    [`/api/reporting/orchestration?${rangeQs}`, "reporting.orchestration"],
    [`/api/reporting/feedback?${rangeQs}&recentLimit=5`, "reporting.feedback"],
    ["/api/reporting/recent-activity?limit=5&hours=24", "reporting.recentActivity"],
    ["/api/customers?limit=5", "customers.list"],
    ["/api/deliveries?limit=5", "deliveries.list"],
    ["/api/providers", "providers.list"],
    ["/api/integrations/status", "integrations.status"],
    ["/api/settings", "settings"],
  ];

  for (const [path, key] of bffChecks) {
    const r = await apiGet(cookies, path);
    const success = r.json?.success === true;
    report.bff.push({
      key,
      path,
      status: r.status,
      apiSuccess: success,
      ok: r.status === 200 && success,
    });
  }

  const custRes = await apiGet(cookies, "/api/customers?limit=1");
  const delRes = await apiGet(cookies, "/api/deliveries?limit=1");
  const provRes = await apiGet(cookies, "/api/providers");

  report.ids.customerId = pickFirstItemId(custRes.json, "id");
  report.ids.deliveryId = pickFirstItemId(delRes.json, "id");
  const provItems = provRes.json?.data;
  report.ids.providerId =
    Array.isArray(provItems) && provItems[0]?.id ? provItems[0].id : null;

  if (report.ids.customerId) {
    const r = await apiGet(cookies, `/api/customers/${report.ids.customerId}`);
    report.bff.push({
      key: "customers.detail",
      path: `/api/customers/${report.ids.customerId}`,
      status: r.status,
      apiSuccess: r.json?.success === true,
      ok: r.status === 200 && r.json?.success === true,
    });
  }
  if (report.ids.deliveryId) {
    for (const suffix of ["/history", ""]) {
      const p =
        suffix === "/history"
          ? `/api/deliveries/${report.ids.deliveryId}/history`
          : `/api/deliveries/${report.ids.deliveryId}`;
      const r = await apiGet(cookies, p);
      report.bff.push({
        key: suffix ? "deliveries.history" : "deliveries.detail",
        path: p,
        status: r.status,
        apiSuccess: r.json?.success === true,
        ok: r.status === 200 && r.json?.success === true,
      });
    }
  }
  if (report.ids.providerId) {
    const r = await apiGet(cookies, `/api/providers/${report.ids.providerId}`);
    report.bff.push({
      key: "providers.detail",
      path: `/api/providers/${report.ids.providerId}`,
      status: r.status,
      apiSuccess: r.json?.success === true,
      ok: r.status === 200 && r.json?.success === true,
    });
  }
  const pageRoutes = [
    "/login",
    "/overview",
    "/customers",
    "/providers",
    "/deliveries",
    "/reports",
    "/integrations",
    "/settings",
    "/design-system",
  ];
  if (report.ids.customerId) {
    pageRoutes.push(`/customers/${report.ids.customerId}`);
  }
  if (report.ids.providerId) {
    pageRoutes.push(`/providers/${report.ids.providerId}`);
  }
  if (report.ids.deliveryId) {
    pageRoutes.push(`/deliveries/${report.ids.deliveryId}`);
  }

  for (const route of pageRoutes) {
    const p = await pageGet(cookies, route);
    const isLogin = route === "/login";
    const ok = isLogin
      ? p.status === 200 || p.status === 307
      : p.status === 200 && !p.redirectedToLogin && !p.hasNextError;
    report.pages.push({
      route,
      status: p.status,
      redirectedToLogin: p.redirectedToLogin,
      hasNextError: p.hasNextError,
      ok,
    });
  }

  report.success =
    report.login.ok &&
    report.bff.every((b) => b.ok) &&
    report.pages.filter((p) => p.route !== "/login").every((p) => p.ok);

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.success ? 0 : 1);
}

main().catch((err) => {
  console.error(JSON.stringify({ success: false, error: String(err.message ?? err) }));
  process.exit(1);
});
