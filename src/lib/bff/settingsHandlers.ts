import { NextResponse } from "next/server";
import { proxyBackendJsonPatch, type ProxyBackendJsonDeps } from "./proxyBackendJson";

type PatchRuntimePoliciesBody = {
  booking?: {
    quoteMaxAgeSeconds?: number;
    priceTolerancePercent?: number;
  };
  pricing?: {
    platformServiceFeePercent?: number;
  };
  expectedVersions: {
    quoteMaxAgeSeconds: number;
    priceTolerancePercent: number;
    platformServiceFeePercent: number;
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

function isPlatformServiceFeePercent(value: unknown): value is number {
  return (
    typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100
  );
}

function parseExpectedVersions(
  raw: unknown,
): PatchRuntimePoliciesBody["expectedVersions"] | string {
  if (!isRecord(raw)) {
    return "expectedVersions is required.";
  }
  if (!isNonNegativeInt(raw.quoteMaxAgeSeconds)) {
    return "expectedVersions.quoteMaxAgeSeconds must be a non-negative integer.";
  }
  if (!isNonNegativeInt(raw.priceTolerancePercent)) {
    return "expectedVersions.priceTolerancePercent must be a non-negative integer.";
  }
  if (!isNonNegativeInt(raw.platformServiceFeePercent)) {
    return "expectedVersions.platformServiceFeePercent must be a non-negative integer.";
  }
  return {
    quoteMaxAgeSeconds: raw.quoteMaxAgeSeconds,
    priceTolerancePercent: raw.priceTolerancePercent,
    platformServiceFeePercent: raw.platformServiceFeePercent,
  };
}

function parsePatchRuntimePoliciesBody(
  raw: unknown,
): PatchRuntimePoliciesBody | string {
  if (!isRecord(raw)) {
    return "Invalid request body.";
  }

  const expectedVersions = parseExpectedVersions(raw.expectedVersions);
  if (typeof expectedVersions === "string") {
    return expectedVersions;
  }

  const bookingRaw = raw.booking;
  const pricingRaw = raw.pricing;

  const booking: PatchRuntimePoliciesBody["booking"] = {};
  if (bookingRaw !== undefined) {
    if (!isRecord(bookingRaw)) {
      return "booking must be an object.";
    }
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
    for (const key of Object.keys(bookingRaw)) {
      if (key !== "quoteMaxAgeSeconds" && key !== "priceTolerancePercent") {
        return `Unknown booking policy field: ${key}`;
      }
    }
  }

  const pricing: PatchRuntimePoliciesBody["pricing"] = {};
  if (pricingRaw !== undefined) {
    if (!isRecord(pricingRaw)) {
      return "pricing must be an object.";
    }
    if ("platformServiceFeePercent" in pricingRaw) {
      if (!isPlatformServiceFeePercent(pricingRaw.platformServiceFeePercent)) {
        return "pricing.platformServiceFeePercent must be a whole number from 0 to 100.";
      }
      pricing.platformServiceFeePercent = pricingRaw.platformServiceFeePercent;
    }
    for (const key of Object.keys(pricingRaw)) {
      if (key !== "platformServiceFeePercent") {
        return `Unknown pricing policy field: ${key}`;
      }
    }
  }

  const hasBookingField =
    booking.quoteMaxAgeSeconds !== undefined ||
    booking.priceTolerancePercent !== undefined;
  const hasPricingField = pricing.platformServiceFeePercent !== undefined;

  if (!hasBookingField && !hasPricingField) {
    return "At least one allowlisted runtime policy field must be provided.";
  }

  const body: PatchRuntimePoliciesBody = { expectedVersions };

  if (hasBookingField) {
    body.booking = booking;
  }
  if (hasPricingField) {
    body.pricing = pricing;
  }

  return body;
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

  const parsed = parsePatchRuntimePoliciesBody(rawBody);
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
