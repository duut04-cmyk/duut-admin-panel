import type {
  PatchRuntimePoliciesRequestBody,
  SettingsRuntime,
  SettingsSnapshot,
} from "@/data/settingsTypes";
import { buildExpectedVersions, resolveBookingRuntime } from "./runtimePoliciesShared";

export type BookingPolicyField = "quoteMaxAgeSeconds" | "priceTolerancePercent";

export type BookingPolicyDraft = {
  quoteMaxAgeSeconds: string;
  priceTolerancePercent: string;
};

export type BookingPolicyFieldErrors = Partial<Record<BookingPolicyField, string>>;

export {
  applyPatchResultToSnapshot,
  formatRuntimeSource,
  mergeRefreshedSnapshot,
  resolveBookingRuntime,
  invalidOverrideWarning,
} from "./runtimePoliciesShared";

export function draftFromRuntime(
  runtime: SettingsRuntime["booking"],
): BookingPolicyDraft {
  return {
    quoteMaxAgeSeconds: String(runtime.quoteMaxAgeSeconds.value),
    priceTolerancePercent: String(runtime.priceTolerancePercent.value),
  };
}

export function validateBookingPolicyDraft(
  draft: BookingPolicyDraft,
): { valid: true } | { valid: false; fieldErrors: BookingPolicyFieldErrors } {
  const fieldErrors: BookingPolicyFieldErrors = {};

  const quoteRaw = draft.quoteMaxAgeSeconds.trim();
  if (quoteRaw.length === 0) {
    fieldErrors.quoteMaxAgeSeconds = "Quote max age is required.";
  } else {
    const quote = Number(quoteRaw);
    if (!Number.isFinite(quote) || !Number.isInteger(quote) || quote <= 0) {
      fieldErrors.quoteMaxAgeSeconds = "Enter a positive whole number of seconds.";
    }
  }

  const toleranceRaw = draft.priceTolerancePercent.trim();
  if (toleranceRaw.length === 0) {
    fieldErrors.priceTolerancePercent = "Price tolerance is required.";
  } else {
    const tolerance = Number(toleranceRaw);
    if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > 100) {
      fieldErrors.priceTolerancePercent = "Enter a number from 0 to 100.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { valid: false, fieldErrors };
  }
  return { valid: true };
}

export function buildPatchBookingPoliciesBody(input: {
  draft: BookingPolicyDraft;
  snapshot: SettingsSnapshot;
}):
  | PatchRuntimePoliciesRequestBody
  | { error: string; fieldErrors?: BookingPolicyFieldErrors } {
  const validation = validateBookingPolicyDraft(input.draft);
  if (!validation.valid) {
    return {
      error: "Fix validation errors before saving.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const runtime = resolveBookingRuntime(input.snapshot);
  const quoteMaxAgeSeconds = Number(input.draft.quoteMaxAgeSeconds.trim());
  const priceTolerancePercent = Number(input.draft.priceTolerancePercent.trim());

  const booking: NonNullable<PatchRuntimePoliciesRequestBody["booking"]> = {};

  if (quoteMaxAgeSeconds !== runtime.quoteMaxAgeSeconds.value) {
    booking.quoteMaxAgeSeconds = quoteMaxAgeSeconds;
  }
  if (priceTolerancePercent !== runtime.priceTolerancePercent.value) {
    booking.priceTolerancePercent = priceTolerancePercent;
  }

  if (
    booking.quoteMaxAgeSeconds === undefined &&
    booking.priceTolerancePercent === undefined
  ) {
    return { error: "No changes to save." };
  }

  return {
    booking,
    expectedVersions: buildExpectedVersions(input.snapshot),
  };
}
