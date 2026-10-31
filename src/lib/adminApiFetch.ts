import { clearAdminSessionCache } from "@/lib/auth/adminSessionCache";
import { redirectToLoginOnUnauthorized } from "@/lib/auth/redirectOnUnauthorized";

/**
 * Browser fetch to admin BFF routes. On 401, clears client session cache and
 * redirects to login (cookie is cleared by the BFF response).
 */
export async function adminApiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401) {
    clearAdminSessionCache();
    redirectToLoginOnUnauthorized(response);
  }
  return response;
}
