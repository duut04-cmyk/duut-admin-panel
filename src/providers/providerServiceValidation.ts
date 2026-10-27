import type {
  CreateProviderServiceInput,
  ProviderServiceType,
  UpdateProviderServiceInput,
} from "@/data/providerTypes";

export const MAX_SERVICE_CODE_LENGTH = 64;
export const MAX_SERVICE_NAME_LENGTH = 100;
export const MAX_SERVICE_DESCRIPTION_LENGTH = 500;
export const MIN_PROVIDER_PRIORITY = 0;
export const MAX_PROVIDER_PRIORITY = 1000;

export const PROVIDER_SERVICE_TYPE_VALUES = [
  "BIKE",
  "SCOOTER",
  "CAR",
  "VAN",
  "TRUCK",
  "HYPERLOCAL",
  "SAME_DAY",
  "EXPRESS",
  "SCHEDULED",
] as const satisfies readonly ProviderServiceType[];

const serviceTypeSet = new Set<string>(PROVIDER_SERVICE_TYPE_VALUES);

const SERVICE_CODE_REGEX = /^[A-Z0-9_]+$/;

export type ServiceFormFieldErrors = Partial<
  Record<
    "code" | "name" | "serviceType" | "description" | "priority" | "enabled",
    string
  >
>;

export function isProviderServiceType(value: string): value is ProviderServiceType {
  return serviceTypeSet.has(value);
}

export function validateServiceCode(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  if (normalized.length === 0) return "Service code is required.";
  if (normalized.length > MAX_SERVICE_CODE_LENGTH) {
    return `Service code must be at most ${MAX_SERVICE_CODE_LENGTH} characters.`;
  }
  if (!SERVICE_CODE_REGEX.test(normalized)) {
    return "Service code must be uppercase letters, numbers, and underscores.";
  }
  return null;
}

export function validateServiceName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) return "Name is required.";
  if (trimmed.length > MAX_SERVICE_NAME_LENGTH) {
    return `Name must be at most ${MAX_SERVICE_NAME_LENGTH} characters.`;
  }
  return null;
}

export function validateServicePriorityInput(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "Priority is required.";
  if (!/^-?\d+$/.test(trimmed)) return "Priority must be a whole number.";
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) return "Priority must be a whole number.";
  if (parsed < MIN_PROVIDER_PRIORITY || parsed > MAX_PROVIDER_PRIORITY) {
    return `Priority must be between ${MIN_PROVIDER_PRIORITY} and ${MAX_PROVIDER_PRIORITY}.`;
  }
  return null;
}

export function validateCreateServiceForm(input: {
  code: string;
  name: string;
  serviceType: string;
  description: string;
  priority: string;
}):
  | { body: CreateProviderServiceInput }
  | { fieldErrors: ServiceFormFieldErrors; error: string } {
  const fieldErrors: ServiceFormFieldErrors = {};
  const codeError = validateServiceCode(input.code);
  if (codeError) fieldErrors.code = codeError;
  const nameError = validateServiceName(input.name);
  if (nameError) fieldErrors.name = nameError;
  if (!isProviderServiceType(input.serviceType)) {
    fieldErrors.serviceType = "Select a valid service type.";
  }
  const desc = input.description.trim();
  if (desc.length > MAX_SERVICE_DESCRIPTION_LENGTH) {
    fieldErrors.description = `Description must be at most ${MAX_SERVICE_DESCRIPTION_LENGTH} characters.`;
  }
  const priorityError = validateServicePriorityInput(input.priority);
  if (priorityError) fieldErrors.priority = priorityError;

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, error: "Fix the highlighted fields before saving." };
  }

  return {
    body: {
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      serviceType: input.serviceType as ProviderServiceType,
      description: desc.length > 0 ? desc : null,
      priority: Number(input.priority.trim()),
    },
  };
}

export function validateUpdateServiceForm(input: {
  name: string;
  serviceType: string;
  description: string;
  priority: string;
  enabled: boolean;
}):
  | { body: UpdateProviderServiceInput }
  | { fieldErrors: ServiceFormFieldErrors; error: string } {
  const fieldErrors: ServiceFormFieldErrors = {};
  const nameError = validateServiceName(input.name);
  if (nameError) fieldErrors.name = nameError;
  if (!isProviderServiceType(input.serviceType)) {
    fieldErrors.serviceType = "Select a valid service type.";
  }
  const desc = input.description.trim();
  if (desc.length > MAX_SERVICE_DESCRIPTION_LENGTH) {
    fieldErrors.description = `Description must be at most ${MAX_SERVICE_DESCRIPTION_LENGTH} characters.`;
  }
  const priorityError = validateServicePriorityInput(input.priority);
  if (priorityError) fieldErrors.priority = priorityError;

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, error: "Fix the highlighted fields before saving." };
  }

  return {
    body: {
      name: input.name.trim(),
      serviceType: input.serviceType as ProviderServiceType,
      description: desc.length > 0 ? desc : null,
      priority: Number(input.priority.trim()),
      enabled: input.enabled,
    },
  };
}

export function mapServiceConflictError(message: string | undefined): string {
  const lower = (message ?? "").toLowerCase();
  if (lower.includes("already exists") || lower.includes("conflict")) {
    return "A service with this code already exists for this provider.";
  }
  return message ?? "Failed to create service.";
}
