import { NextResponse } from "next/server";
import { proxyBackendJsonPatch, type ProxyBackendJsonDeps } from "./proxyBackendJson";

type PatchBookingPoliciesBody = {
  booking?: {
    quoteMaxAgeSeconds?: number;
    priceTolerancePercent?: number;
  };
  expectedVersions: {
    quoteMaxAgeSeconds: number;
    priceTolerancePercent: number;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function parsePatchBookingPoliciesBody(
  raw: unknown,
): PatchBookingPoliciesBody | string {
  if (!isRecord(raw)) {
    return "Invalid request body.";
  }

  const expected = raw.expectedVersions;
  if (!isRecord(expected)) {
    return "expectedVersions is required.";
  }
  if (!isNonNegativeInt(expected.quoteMaxAgeSeconds)) {
    return "expectedVersions.quoteMaxAgeSeconds must be a non-negative integer.";
  }
  if (!isNonNegativeInt(expected.priceTolerancePercent)) {
    return "expectedVersions.priceTolerancePercent must be a non-negative integer.";
  }

  const bookingRaw = raw.booking;
  if (bookingRaw === undefined) {
    return "At least one booking policy field must be provided.";
  }
  if (!isRecord(bookingRaw)) {
    return "booking must be an object.";
  }

  const booking: PatchBookingPoliciesBody["booking"] = {};
  if ("quoteMaxAgeSeconds" in bookingRaw) {
    if (!isPositiveInt(bookingRaw.quoteMaxAgeSeconds)) {
      return "booking.quoteMaxAgeSeconds must be a positive integer.";
    }
    booking.quoteMaxAgeSeconds = bookingRaw.quoteMaxAgeSeconds;
  }
  if ("priceTolerancePercent" in bookingRaw) {
    const value = bookingRaw.priceTolerancePercent;
    if (typeof value !== "number" || value < 0 || value > 100) {
      return "booking.priceTolerancePercent must be between 0 and 100.";
    }
    booking.priceTolerancePercent = value;
  }

  if (
    booking.quoteMaxAgeSeconds === undefined &&
    booking.priceTolerancePercent === undefined
  ) {
    return "At least one booking policy field must be provided.";
  }

  for (const key of Object.keys(bookingRaw)) {
    if (key !== "quoteMaxAgeSeconds" && key !== "priceTolerancePercent") {
      return `Unknown booking policy field: ${key}`;
    }
  }

  return {
    booking,
    expectedVersions: {
      quoteMaxAgeSeconds: expected.quoteMaxAgeSeconds,
      priceTolerancePercent: expected.priceTolerancePercent,
    },
  };
}

export async function handleSettingsPoliciesPatch(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const parsed = parsePatchBookingPoliciesBody(rawBody);
  if (typeof parsed === "string") {
    return NextResponse.json({ success: false, error: parsed }, { status: 400 });
  }

  return proxyBackendJsonPatch(
    "/api/v1/admin/settings/policies",
    parsed,
    "Failed to update settings policies.",
    deps,
  );
}
