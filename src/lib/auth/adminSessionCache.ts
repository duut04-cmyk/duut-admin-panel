import type { AdminAccount } from "@/data/settingsTypes";

/** Share one in-flight /me across Strict Mode remounts and short remount windows. */
export const ADMIN_SESSION_CACHE_MS = 2_000;

let inFlightAccount: Promise<AdminAccount | null> | null = null;
let cachedAccount: { at: number; account: AdminAccount | null } | null = null;

export function clearAdminSessionCache(): void {
  cachedAccount = null;
  inFlightAccount = null;
}

export function readCachedAdminAccount(
  maxAgeMs: number = ADMIN_SESSION_CACHE_MS,
): AdminAccount | null | undefined {
  if (!cachedAccount) return undefined;
  if (Date.now() - cachedAccount.at >= maxAgeMs) return undefined;
  return cachedAccount.account;
}

export function getInFlightAdminAccount(): Promise<AdminAccount | null> | null {
  return inFlightAccount;
}

export function setInFlightAdminAccount(
  promise: Promise<AdminAccount | null> | null,
): void {
  inFlightAccount = promise;
}

export function writeCachedAdminAccount(account: AdminAccount | null): void {
  cachedAccount = { at: Date.now(), account };
}
