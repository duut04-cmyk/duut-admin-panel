import type { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, clearAccessTokenCookieOptions } from "./cookies";

/** Backend `error.code` values that mean the bearer session is no longer valid. */
export const SESSION_INVALID_BACKEND_ERROR_CODES = new Set([
  "UNAUTHORIZED",
  "INVALID_ACCESS_TOKEN",
  "TOKEN_EXPIRED",
]);

export type BackendErrorEnvelope = {
  success?: boolean;
  error?: { message?: string; code?: string };
};

/**
 * Whether to clear the admin session cookie after a backend response.
 * Only explicit authentication failures (401 + known codes) — not permission denials.
 */
export function shouldClearAdminSessionOnBackendResponse(
  response: Response,
  data: BackendErrorEnvelope,
): boolean {
  if (response.status !== 401) {
    return false;
  }
  const code = data.error?.code;
  if (!code) {
    return false;
  }
  return SESSION_INVALID_BACKEND_ERROR_CODES.has(code);
}

export function applyClearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", clearAccessTokenCookieOptions());
}
