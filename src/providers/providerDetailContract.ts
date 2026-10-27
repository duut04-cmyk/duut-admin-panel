import type { ProviderCredentialsMetadata } from "@/data/providerTypes";

/** Keys that must never appear in admin UI provider detail payloads. */
export const FORBIDDEN_PROVIDER_DETAIL_SECRET_KEYS = [
  "ciphertext",
  "iv",
  "authTag",
  "API_KEY",
  "API_SECRET",
  "ACCESS_TOKEN",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "USERNAME",
  "PASSWORD",
  "ACCOUNT_ID",
  "WEBHOOK_SECRET",
] as const;

export function isProviderCredentialsMetadataOnly(
  credentials: ProviderCredentialsMetadata,
): boolean {
  if (typeof credentials.configured !== "boolean") return false;
  if (!Array.isArray(credentials.fields)) return false;
  return credentials.fields.every(
    (field) =>
      typeof field.name === "string" &&
      typeof field.configured === "boolean" &&
      !("value" in field),
  );
}

export function providerDetailPayloadOmitsSecretKeys(payload: unknown): boolean {
  const serialized = JSON.stringify(payload);
  return !FORBIDDEN_PROVIDER_DETAIL_SECRET_KEYS.some((key) => {
    if (key === "API_KEY" || key === "API_SECRET") {
      return serialized.includes(`"${key}":`);
    }
    return serialized.includes(`"${key}"`);
  });
}
