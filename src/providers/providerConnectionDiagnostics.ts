import type { ProviderDetail, ProviderEnvironment } from "@/data/providerTypes";
import { providerDetailPayloadOmitsSecretKeys } from "./providerDetailContract";

export type ProviderConnectionTestResult = {
  providerCode: string;
  environment: string;
  connected: boolean;
  latencyMs: number;
};

const SAFE_TEST_CONNECTION_ERROR_FRAGMENTS = [
  "permission",
  "not found",
  "invalid provider",
  "not configured",
  "not ready",
  "disabled",
  "does not support",
  "adapter is not available",
  "failed to test",
  "validation",
  "unauthorized",
];

export function isTestConnectionAllowedForEnvironment(
  environment: ProviderEnvironment,
): boolean {
  return environment === "SANDBOX";
}

export function testConnectionDisabledReason(provider: ProviderDetail): string | null {
  if (!isTestConnectionAllowedForEnvironment(provider.environment)) {
    return "Connection tests are disabled for Live providers until operator policy explicitly allows them.";
  }
  if (!provider.enabled) {
    return "Enable this provider before running a connection test.";
  }
  if (provider.integrationStatus === "NOT_CONFIGURED") {
    return "Configure credentials and capabilities before running a connection test.";
  }
  return null;
}

export function isTestConnectionActionAvailable(provider: ProviderDetail): boolean {
  return testConnectionDisabledReason(provider) === null;
}

export function sanitizeTestConnectionError(message: string | undefined): string {
  const trimmed = (message ?? "").trim();
  if (trimmed.length === 0) {
    return "Connection test failed.";
  }
  const lower = trimmed.toLowerCase();
  const looksSafe = SAFE_TEST_CONNECTION_ERROR_FRAGMENTS.some((fragment) =>
    lower.includes(fragment),
  );
  if (!looksSafe || trimmed.length > 240) {
    return "Connection test failed.";
  }
  return trimmed;
}

export function connectionTestResultOmitsSecrets(
  result: ProviderConnectionTestResult,
): boolean {
  return providerDetailPayloadOmitsSecretKeys(result);
}
