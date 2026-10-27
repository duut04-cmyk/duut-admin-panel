import type {
  CreateProviderVehicleInput,
  ProviderVehicleType,
  UpdateProviderVehicleInput,
} from "@/data/providerTypes";

export const MAX_WEIGHT_KG = 10_000;
export const MAX_DIMENSION_CM = 10_000;

export const PROVIDER_VEHICLE_TYPE_VALUES = [
  "BIKE",
  "SCOOTER",
  "CAR",
  "VAN",
  "TRUCK",
] as const satisfies readonly ProviderVehicleType[];

const vehicleTypeSet = new Set<string>(PROVIDER_VEHICLE_TYPE_VALUES);

export type VehicleFormFieldErrors = Partial<
  Record<
    | "vehicleType"
    | "maxWeightKg"
    | "maxLengthCm"
    | "maxWidthCm"
    | "maxHeightCm"
    | "enabled",
    string
  >
>;

export function isProviderVehicleType(value: string): value is ProviderVehicleType {
  return vehicleTypeSet.has(value);
}

function parseOptionalPositive(
  value: string,
  label: string,
  max: number,
): number | null | string {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return `${label} must be a positive number.`;
  }
  if (parsed > max) {
    return `${label} is too large.`;
  }
  return parsed;
}

export function validateCreateVehicleForm(input: {
  vehicleType: string;
  enabled: boolean;
  maxWeightKg: string;
  maxLengthCm: string;
  maxWidthCm: string;
  maxHeightCm: string;
}):
  | { body: CreateProviderVehicleInput }
  | { fieldErrors: VehicleFormFieldErrors; error: string } {
  const fieldErrors: VehicleFormFieldErrors = {};
  if (!isProviderVehicleType(input.vehicleType)) {
    fieldErrors.vehicleType = "Select a valid vehicle type.";
  }

  const maxWeightKg = parseOptionalPositive(
    input.maxWeightKg,
    "Max weight",
    MAX_WEIGHT_KG,
  );
  if (typeof maxWeightKg === "string") fieldErrors.maxWeightKg = maxWeightKg;
  const maxLengthCm = parseOptionalPositive(
    input.maxLengthCm,
    "Max length",
    MAX_DIMENSION_CM,
  );
  if (typeof maxLengthCm === "string") fieldErrors.maxLengthCm = maxLengthCm;
  const maxWidthCm = parseOptionalPositive(
    input.maxWidthCm,
    "Max width",
    MAX_DIMENSION_CM,
  );
  if (typeof maxWidthCm === "string") fieldErrors.maxWidthCm = maxWidthCm;
  const maxHeightCm = parseOptionalPositive(
    input.maxHeightCm,
    "Max height",
    MAX_DIMENSION_CM,
  );
  if (typeof maxHeightCm === "string") fieldErrors.maxHeightCm = maxHeightCm;

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, error: "Fix the highlighted fields before saving." };
  }

  return {
    body: {
      vehicleType: input.vehicleType as ProviderVehicleType,
      enabled: input.enabled,
      maxWeightKg: maxWeightKg as number | null,
      maxLengthCm: maxLengthCm as number | null,
      maxWidthCm: maxWidthCm as number | null,
      maxHeightCm: maxHeightCm as number | null,
    },
  };
}

export function validateUpdateVehicleForm(input: {
  enabled: boolean;
  maxWeightKg: string;
  maxLengthCm: string;
  maxWidthCm: string;
  maxHeightCm: string;
}):
  | { body: UpdateProviderVehicleInput }
  | { fieldErrors: VehicleFormFieldErrors; error: string } {
  const fieldErrors: VehicleFormFieldErrors = {};

  const maxWeightKg = parseOptionalPositive(
    input.maxWeightKg,
    "Max weight",
    MAX_WEIGHT_KG,
  );
  if (typeof maxWeightKg === "string") fieldErrors.maxWeightKg = maxWeightKg;
  const maxLengthCm = parseOptionalPositive(
    input.maxLengthCm,
    "Max length",
    MAX_DIMENSION_CM,
  );
  if (typeof maxLengthCm === "string") fieldErrors.maxLengthCm = maxLengthCm;
  const maxWidthCm = parseOptionalPositive(
    input.maxWidthCm,
    "Max width",
    MAX_DIMENSION_CM,
  );
  if (typeof maxWidthCm === "string") fieldErrors.maxWidthCm = maxWidthCm;
  const maxHeightCm = parseOptionalPositive(
    input.maxHeightCm,
    "Max height",
    MAX_DIMENSION_CM,
  );
  if (typeof maxHeightCm === "string") fieldErrors.maxHeightCm = maxHeightCm;

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, error: "Fix the highlighted fields before saving." };
  }

  return {
    body: {
      enabled: input.enabled,
      maxWeightKg: maxWeightKg as number | null,
      maxLengthCm: maxLengthCm as number | null,
      maxWidthCm: maxWidthCm as number | null,
      maxHeightCm: maxHeightCm as number | null,
    },
  };
}

export function mapVehicleConflictError(message: string | undefined): string {
  const lower = (message ?? "").toLowerCase();
  if (lower.includes("already") || lower.includes("conflict")) {
    return "This vehicle type is already configured for this provider.";
  }
  return message ?? "Failed to create vehicle.";
}
