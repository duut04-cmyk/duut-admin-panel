import type { ProviderCapability } from "@/data/providerTypes";

/** Must match backend `PROVIDER_CAPABILITY_VALUES` (`provider.constants.ts`). */
export const PROVIDER_CAPABILITY_VALUES = [
  "SERVICEABILITY",
  "AVAILABILITY",
  "PRICING",
  "BOOKING",
  "DRIVER_INFO",
  "DRIVER_RATING",
  "VEHICLE_INFO",
  "LIVE_TRACKING",
  "TRACKING_URL",
  "WEBHOOKS",
  "OTP",
  "CANCELLATION",
] as const satisfies readonly ProviderCapability[];

const capabilitySet = new Set<string>(PROVIDER_CAPABILITY_VALUES);

export const ORCHESTRATION_RELATED_CAPABILITIES: ProviderCapability[] = [
  "SERVICEABILITY",
  "AVAILABILITY",
  "PRICING",
  "BOOKING",
  "CANCELLATION",
];

export type ReplaceProviderCapabilitiesBody = {
  capabilities: ProviderCapability[];
};

export function draftCapabilitiesFromDetail(
  capabilities: ProviderCapability[],
): ProviderCapability[] {
  const allowed = new Set(PROVIDER_CAPABILITY_VALUES);
  return capabilities.filter((item) => allowed.has(item));
}

export function isProviderCapability(value: string): value is ProviderCapability {
  return capabilitySet.has(value);
}

export function validateCapabilitySelection(
  selected: ProviderCapability[],
): string | null {
  for (const value of selected) {
    if (!isProviderCapability(value)) {
      return `Unsupported capability: ${value}.`;
    }
  }
  return null;
}

export function sortCapabilities(
  capabilities: ProviderCapability[],
): ProviderCapability[] {
  const order = new Map(
    PROVIDER_CAPABILITY_VALUES.map((value, index) => [value, index]),
  );
  return [...capabilities].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
}

export function capabilitiesSelectionChanged(
  draft: ProviderCapability[],
  server: ProviderCapability[],
): boolean {
  const a = sortCapabilities(draft);
  const b = sortCapabilities(server);
  if (a.length !== b.length) return true;
  return a.some((value, index) => value !== b[index]);
}

export function buildReplaceCapabilitiesBody(
  selected: ProviderCapability[],
): ReplaceProviderCapabilitiesBody {
  const validationError = validateCapabilitySelection(selected);
  if (validationError) {
    throw new Error(validationError);
  }
  return { capabilities: sortCapabilities(selected) };
}

export function toggleCapabilityInDraft(
  draft: ProviderCapability[],
  capability: ProviderCapability,
  checked: boolean,
): ProviderCapability[] {
  if (!isProviderCapability(capability)) {
    return draft;
  }
  if (checked) {
    if (draft.includes(capability)) return draft;
    return sortCapabilities([...draft, capability]);
  }
  return draft.filter((item) => item !== capability);
}
