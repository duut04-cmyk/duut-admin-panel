import type {
  PatchRuntimePoliciesRequestBody,
  SettingsSnapshot,
} from "@/data/settingsTypes";
import { buildExpectedVersions, resolvePricingRuntime } from "./runtimePoliciesShared";

export type PlatformServiceFeeDraft = {
  platformServiceFeePercent: string;
};

export function draftFromPricingRuntime(
  runtime: ReturnType<typeof resolvePricingRuntime>,
): PlatformServiceFeeDraft {
  return {
    platformServiceFeePercent: String(runtime.platformServiceFeePercent.value),
  };
}

export function validatePlatformServiceFeeDraft(
  draft: PlatformServiceFeeDraft,
): { valid: true } | { valid: false; error: string } {
  const raw = draft.platformServiceFeePercent.trim();
  if (raw.length === 0) {
    return { valid: false, error: "Platform service fee is required." };
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > 100) {
    return {
      valid: false,
      error: "Enter a whole number from 0 to 100.",
    };
  }
  return { valid: true };
}

export function buildPatchPricingPoliciesBody(input: {
  draft: PlatformServiceFeeDraft;
  snapshot: SettingsSnapshot;
}): PatchRuntimePoliciesRequestBody | { error: string; fieldError?: string } {
  const validation = validatePlatformServiceFeeDraft(input.draft);
  if (!validation.valid) {
    return {
      error: "Fix validation errors before saving.",
      fieldError: validation.error,
    };
  }

  const runtime = resolvePricingRuntime(input.snapshot);
  const platformServiceFeePercent = Number(
    input.draft.platformServiceFeePercent.trim(),
  );

  if (platformServiceFeePercent === runtime.platformServiceFeePercent.value) {
    return { error: "No changes to save." };
  }

  return {
    pricing: { platformServiceFeePercent },
    expectedVersions: buildExpectedVersions(input.snapshot),
  };
}
