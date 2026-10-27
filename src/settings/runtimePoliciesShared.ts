import type {
  PatchRuntimePoliciesResult,
  RuntimeSettingMeta,
  SettingsRuntime,
  SettingsSnapshot,
} from "@/data/settingsTypes";

export function formatRuntimeSource(source: RuntimeSettingMeta["source"]): string {
  return source === "database" ? "Database override" : "Environment";
}

export function resolveBookingRuntime(
  snapshot: SettingsSnapshot,
): SettingsRuntime["booking"] {
  if (snapshot.runtime?.booking) {
    return snapshot.runtime.booking;
  }
  return {
    quoteMaxAgeSeconds: {
      value: snapshot.policies.booking.quoteMaxAgeSeconds,
      source: "env",
      version: 0,
      restartRequired: false,
    },
    priceTolerancePercent: {
      value: snapshot.policies.booking.priceTolerancePercent,
      source: "env",
      version: 0,
      restartRequired: false,
    },
  };
}

export function resolvePricingRuntime(
  snapshot: SettingsSnapshot,
): SettingsRuntime["pricing"] {
  const effectivePercent = snapshot.policies.pricing?.platformServiceFeePercent ?? 10;
  if (snapshot.runtime?.pricing) {
    return snapshot.runtime.pricing;
  }
  return {
    platformServiceFeePercent: {
      value: effectivePercent,
      source: "env",
      version: 0,
      restartRequired: false,
    },
  };
}

export function buildExpectedVersions(snapshot: SettingsSnapshot): {
  quoteMaxAgeSeconds: number;
  priceTolerancePercent: number;
  platformServiceFeePercent: number;
} {
  const booking = resolveBookingRuntime(snapshot);
  const pricing = resolvePricingRuntime(snapshot);
  return {
    quoteMaxAgeSeconds: booking.quoteMaxAgeSeconds.version,
    priceTolerancePercent: booking.priceTolerancePercent.version,
    platformServiceFeePercent: pricing.platformServiceFeePercent.version,
  };
}

export function applyPatchResultToSnapshot(
  snapshot: SettingsSnapshot,
  patch: PatchRuntimePoliciesResult,
): SettingsSnapshot {
  return {
    ...snapshot,
    policies: {
      ...snapshot.policies,
      booking: {
        quoteMaxAgeSeconds: patch.booking.quoteMaxAgeSeconds.value,
        priceTolerancePercent: patch.booking.priceTolerancePercent.value,
      },
      pricing: {
        platformServiceFeePercent: patch.pricing.platformServiceFeePercent.value,
      },
    },
    runtime: {
      booking: patch.booking,
      pricing: patch.pricing,
    },
    checkedAt: new Date().toISOString(),
  };
}

export function mergeRefreshedSnapshot(
  previous: SettingsSnapshot,
  refreshed: SettingsSnapshot,
): SettingsSnapshot {
  return {
    ...refreshed,
    runtime: refreshed.runtime ?? previous.runtime,
    policies: {
      ...refreshed.policies,
      pricing: refreshed.policies.pricing ?? previous.policies.pricing,
    },
  };
}

export function invalidOverrideWarning(meta: RuntimeSettingMeta): string | null {
  if (meta.storageUnavailable) {
    return "Persistent policy storage could not be read. The value below is the environment default until storage is available (for example after applying database migrations). Saving may fail until storage is fixed.";
  }
  if (!meta.invalidStoredOverride) {
    return null;
  }
  return "The stored database override is invalid. The effective value below uses the environment default until you save a valid override.";
}
