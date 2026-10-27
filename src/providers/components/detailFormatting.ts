import type { PackageType } from "@/data/providerTypes";

export function formatProviderDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatOptionalNumber(value: number | null, unit: string): string {
  if (value == null) return "—";
  return `${value} ${unit}`;
}

export function formatPackageTypes(types: PackageType[]): string {
  if (types.length === 0) return "None configured";
  return types.join(", ");
}

export function formatBoolean(value: boolean): string {
  return value ? "Yes" : "No";
}

export function formatCapabilityLabel(capability: string): string {
  return capability
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isProviderNotFoundError(message: string | undefined): boolean {
  if (!message) return false;
  const lower = message.toLowerCase();
  return lower.includes("not found") || lower.includes("provider not found");
}
