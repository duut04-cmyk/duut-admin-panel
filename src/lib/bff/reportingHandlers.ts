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
  for (const key of ["limit", "hours", "recentLimit"]) {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  }
  return `${base}?${params.toString()}`;
}

export async function handleReportingSummaryGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const path = buildPath(
    "/api/v1/admin/reporting/summary",
    new URL(request.url).searchParams,
  );
  if (typeof path === "string" && path.includes("required")) {
    return NextResponse.json({ success: false, error: path }, { status: 400 });
  }
  return proxyBackendJsonGet(String(path), "Failed to load reporting summary.", deps);
}

export async function handleReportingOrchestrationGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const path = buildPath(
    "/api/v1/admin/reporting/orchestration",
    new URL(request.url).searchParams,
  );
  if (typeof path === "string" && !path.startsWith("/api")) {
    return NextResponse.json({ success: false, error: path }, { status: 400 });
  }
  return proxyBackendJsonGet(
    String(path),
    "Failed to load orchestration reporting.",
    deps,
  );
}

export async function handleReportingRecentDeliveriesGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const path = buildPath(
    "/api/v1/admin/reporting/recent-deliveries",
    new URL(request.url).searchParams,
  );
  if (typeof path === "string" && !path.startsWith("/api")) {
    return NextResponse.json({ success: false, error: path }, { status: 400 });
  }
  return proxyBackendJsonGet(String(path), "Failed to load recent deliveries.", deps);
}

export async function handleReportingRecentActivityGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const searchParams = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  const limit = searchParams.get("limit");
  const hours = searchParams.get("hours");
  if (limit) params.set("limit", limit);
  if (hours) params.set("hours", hours);
  const path = `/api/v1/admin/reporting/recent-activity?${params.toString()}`;
  return proxyBackendJsonGet(path, "Failed to load recent activity.", deps);
}

export async function handleReportingFeedbackGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const path = buildPath(
    "/api/v1/admin/reporting/feedback",
    new URL(request.url).searchParams,
  );
  if (typeof path === "string" && !path.startsWith("/api")) {
    return NextResponse.json({ success: false, error: path }, { status: 400 });
  }
  return proxyBackendJsonGet(String(path), "Failed to load feedback reporting.", deps);
}
