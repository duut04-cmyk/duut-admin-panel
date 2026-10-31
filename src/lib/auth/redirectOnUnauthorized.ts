/**
 * After a BFF 401 (cookie cleared server-side), send the browser to login.
 * Returns true when a redirect was started.
 */
export function redirectToLoginOnUnauthorized(response: Response): boolean {
  if (response.status !== 401) {
    return false;
  }
  if (typeof window === "undefined") {
    return false;
  }

  const from = `${window.location.pathname}${window.location.search}`;
  const loginUrl = new URL("/login", window.location.origin);
  if (from && from !== "/login") {
    loginUrl.searchParams.set("from", from);
  }
  window.location.replace(loginUrl.toString());
  return true;
}
