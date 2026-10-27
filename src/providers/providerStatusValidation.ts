import type { ProviderStatus, UpdateProviderStatusInput } from "@/data/providerTypes";

export const PROVIDER_STATUS_VALUES = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
] as const satisfies readonly ProviderStatus[];

const statusSet = new Set<string>(PROVIDER_STATUS_VALUES);

export function isProviderStatus(value: string): value is ProviderStatus {
  return statusSet.has(value);
}

export function buildStatusUpdateBody(
  targetStatus: ProviderStatus,
): UpdateProviderStatusInput {
  if (targetStatus === "SUSPENDED") {
    return { status: "SUSPENDED", enabled: false };
  }
  return { status: targetStatus };
}

export function listSelectableStatusTargets(current: ProviderStatus): ProviderStatus[] {
  return PROVIDER_STATUS_VALUES.filter((status) => status !== current);
}

export function statusChangeRequiresConfirmation(
  current: ProviderStatus,
  target: ProviderStatus,
): boolean {
  return current !== target;
}

export function describeStatusTransitionImpact(
  target: ProviderStatus,
  current: ProviderStatus,
): string[] {
  const lines: string[] = [];

  if (target === current) {
    return ["No change."];
  }

  if (target === "ACTIVE") {
    lines.push(
      "Sets lifecycle status to Active and enables the provider (enabled=true) unless you override enabled in the API.",
    );
    lines.push(
      "Integration status is recalculated from credentials, capabilities, and existing health — not from a new connection test.",
    );
  } else if (target === "INACTIVE") {
    lines.push(
      "Sets lifecycle status to Inactive and disables the provider (enabled=false).",
    );
    lines.push(
      "Integration status will typically show as not configured for orchestration while disabled.",
    );
  } else if (target === "SUSPENDED") {
    lines.push(
      "Sets lifecycle status to Suspended and disables the provider (enabled=false) for safe operational suspension.",
    );
    lines.push(
      "Suspended is not the same as a failed health check; integration status is recalculated from server rules only.",
    );
  }

  lines.push("Orchestration enabled flag is not changed by this endpoint.");
  return lines;
}

const SAFE_STATUS_ERROR_FRAGMENTS = [
  "permission",
  "not found",
  "invalid provider",
  "validation",
  "required",
  "failed to update",
  "failed to change",
];

export function sanitizeStatusUpdateError(message: string | undefined): string {
  const trimmed = (message ?? "").trim();
  if (trimmed.length === 0) {
    return "Failed to update provider status.";
  }
  const lower = trimmed.toLowerCase();
  const looksSafe = SAFE_STATUS_ERROR_FRAGMENTS.some((fragment) =>
    lower.includes(fragment),
  );
  if (!looksSafe || trimmed.length > 240) {
    return "Failed to update provider status.";
  }
  return trimmed;
}
