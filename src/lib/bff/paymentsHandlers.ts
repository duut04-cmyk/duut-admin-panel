import { NextResponse } from "next/server";
import { proxyBackendJsonGet, type ProxyBackendJsonDeps } from "./proxyBackendJson";

function isIsoDateTime(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function parseRange(
  searchParams: URLSearchParams,
): { from: string; to: string } | string {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to) return "from and to query parameters are required.";
  if (!isIsoDateTime(from) || !isIsoDateTime(to)) {
    return "from and to must be ISO-8601 datetimes.";
  }
  return { from, to };
}

function buildPath(base: string, searchParams: URLSearchParams): string | string {
  const range = parseRange(searchParams);
  if (typeof range === "string") return range;
  const params = new URLSearchParams();
  params.set("from", range.from);
  params.set("to", range.to);
  for (const key of [
    "page",
    "limit",
    "status",
    "gateway",
    "deliveryReference",
    "search",
    "paidFrom",
    "paidTo",
    "activityFrom",
    "activityTo",
    "granularity",
    "processedFrom",
    "processedTo",
    "requestedFrom",
    "requestedTo",
  ]) {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  }
  return `${base}?${params.toString()}`;
}

export async function handlePaymentsListGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.searchParams);
  if (!params.has("page")) params.set("page", "1");
  if (!params.has("limit")) params.set("limit", "10");
  const path = `/api/v1/admin/payments?${params.toString()}`;
  return proxyBackendJsonGet(path, "Failed to load payments.", deps);
}

export async function handlePaymentsSummaryGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const path = buildPath(
    "/api/v1/admin/payments/summary",
    new URL(request.url).searchParams,
  );
  if (typeof path === "string" && path.startsWith("from and")) {
    return NextResponse.json({ success: false, error: path }, { status: 400 });
  }
  return proxyBackendJsonGet(path, "Failed to load payment summary.", deps);
}

export async function handlePaymentDetailGet(
  paymentId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  return proxyBackendJsonGet(
    `/api/v1/admin/payments/${encodeURIComponent(paymentId)}`,
    "Failed to load payment detail.",
    deps,
  );
}

export async function handleRefundsListGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.searchParams);
  if (!params.has("page")) params.set("page", "1");
  if (!params.has("limit")) params.set("limit", "10");
  const path = `/api/v1/admin/refunds?${params.toString()}`;
  return proxyBackendJsonGet(path, "Failed to load refunds.", deps);
}

export async function handleFinanceTimeseriesGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const path = buildPath(
    "/api/v1/admin/finance/timeseries",
    new URL(request.url).searchParams,
  );
  if (typeof path === "string" && !path.startsWith("/api")) {
    return NextResponse.json({ success: false, error: path }, { status: 400 });
  }
  return proxyBackendJsonGet(path, "Failed to load finance timeseries.", deps);
}

export async function handleFinanceReconciliationGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.searchParams);
  const from = params.get("from");
  const to = params.get("to");
  let path = "/api/v1/admin/finance/reconciliation";
  if (from && to) {
    if (!isIsoDateTime(from) || !isIsoDateTime(to)) {
      return NextResponse.json(
        { success: false, error: "from and to must be ISO-8601 datetimes." },
        { status: 400 },
      );
    }
    params.set("from", from);
    params.set("to", to);
    path = `${path}?${params.toString()}`;
  } else if (params.has("limit")) {
    path = `${path}?limit=${encodeURIComponent(params.get("limit")!)}`;
  }
  return proxyBackendJsonGet(path, "Failed to load reconciliation.", deps);
}
