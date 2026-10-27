import type {
  ProviderDetail,
  ProviderEnvironment,
  UpdateProviderInput,
} from "@/data/providerTypes";

export const MIN_PROVIDER_PRIORITY = 0;
export const MAX_PROVIDER_PRIORITY = 1000;
export const MAX_PROVIDER_DISPLAY_NAME_LENGTH = 100;
export const MAX_PROVIDER_DESCRIPTION_LENGTH = 500;

export const PROVIDER_ENVIRONMENTS = [
  "SANDBOX",
  "LIVE",
] as const satisfies readonly ProviderEnvironment[];

export type ProviderConfigurationDraft = {
  displayName: string;
  description: string;
  environment: ProviderEnvironment;
  priority: string;
  orchestrationEnabled: boolean;
};

export type ProviderConfigurationFieldErrors = Partial<
  Record<
    "displayName" | "description" | "environment" | "priority" | "orchestrationEnabled",
    string
  >
>;

export function draftFromProvider(
  provider: ProviderDetail,
): ProviderConfigurationDraft {
  return {
    displayName: provider.displayName ?? "",
    description: provider.description ?? "",
    environment: provider.environment,
    priority: String(provider.priority),
    orchestrationEnabled: provider.orchestrationEnabled,
  };
}

export function normalizeDisplayNameInput(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export function validatePriorityInput(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "Priority is required.";
  }
  if (!/^-?\d+$/.test(trimmed)) {
    return "Priority must be a whole number.";
  }
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) {
    return "Priority must be a whole number.";
  }
  if (parsed < MIN_PROVIDER_PRIORITY || parsed > MAX_PROVIDER_PRIORITY) {
    return `Priority must be between ${MIN_PROVIDER_PRIORITY} and ${MAX_PROVIDER_PRIORITY}.`;
  }
  return null;
}

export function validateEnvironment(value: string): value is ProviderEnvironment {
  return (PROVIDER_ENVIRONMENTS as readonly string[]).includes(value);
}

export function validateProviderConfigurationDraft(
  draft: ProviderConfigurationDraft,
  provider: ProviderDetail,
): ProviderConfigurationFieldErrors {
  const errors: ProviderConfigurationFieldErrors = {};

  const displayTrimmed = draft.displayName.trim();
  if (displayTrimmed.length > MAX_PROVIDER_DISPLAY_NAME_LENGTH) {
    errors.displayName = `Display name must be at most ${MAX_PROVIDER_DISPLAY_NAME_LENGTH} characters.`;
  }

  const descriptionTrimmed = draft.description.trim();
  if (descriptionTrimmed.length > MAX_PROVIDER_DESCRIPTION_LENGTH) {
    errors.description = `Description must be at most ${MAX_PROVIDER_DESCRIPTION_LENGTH} characters.`;
  }

  if (!validateEnvironment(draft.environment)) {
    errors.environment = "Environment must be Sandbox or Live.";
  }

  const priorityError = validatePriorityInput(draft.priority);
  if (priorityError) {
    errors.priority = priorityError;
  }

  if (draft.orchestrationEnabled && !provider.enabled) {
    errors.orchestrationEnabled =
      "Enable the provider in the Lifecycle status section before turning on orchestration.";
  }

  if (provider.status === "SUSPENDED" && draft.orchestrationEnabled) {
    errors.orchestrationEnabled =
      "Orchestration cannot be enabled while the provider is suspended.";
  }

  return errors;
}

export function operationalFlagsChanged(
  draft: ProviderConfigurationDraft,
  provider: ProviderDetail,
): boolean {
  return draft.orchestrationEnabled !== provider.orchestrationEnabled;
}

export function buildProviderUpdatePatch(
  draft: ProviderConfigurationDraft,
  provider: ProviderDetail,
):
  | { patch: UpdateProviderInput }
  | { error: string; fieldErrors?: ProviderConfigurationFieldErrors } {
  const fieldErrors = validateProviderConfigurationDraft(draft, provider);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Fix the highlighted fields before saving.", fieldErrors };
  }

  const patch: UpdateProviderInput = {};
  const nextDisplayName = normalizeDisplayNameInput(draft.displayName);
  const currentDisplayName = provider.displayName;
  if (nextDisplayName !== currentDisplayName) {
    patch.displayName = nextDisplayName;
  }

  const nextDescription = normalizeDisplayNameInput(draft.description);
  const currentDescription = provider.description;
  if (nextDescription !== currentDescription) {
    patch.description = nextDescription;
  }

  if (draft.environment !== provider.environment) {
    patch.environment = draft.environment;
  }

  const nextPriority = Number(draft.priority.trim());
  if (nextPriority !== provider.priority) {
    patch.priority = nextPriority;
  }

  if (draft.orchestrationEnabled !== provider.orchestrationEnabled) {
    patch.orchestrationEnabled = draft.orchestrationEnabled;
  }

  if (Object.keys(patch).length === 0) {
    return { error: "No changes to save." };
  }

  return { patch };
}
