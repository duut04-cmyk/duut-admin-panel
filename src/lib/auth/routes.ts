const PUBLIC_PAGE_PATHS = new Set(["/", "/login"]);

const PUBLIC_API_PREFIXES = ["/api/auth/login", "/api/auth/logout"] as const;

export function isPublicPagePath(pathname: string): boolean {
  return PUBLIC_PAGE_PATHS.has(pathname);
}

export function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function hasAdminSessionCookie(
  cookieHeader: string | null | undefined,
): boolean {
  if (!cookieHeader) {
    return false;
  }
  return cookieHeader.split(";").some((part) => {
    const trimmed = part.trim();
    return trimmed.startsWith("doot_admin_access_token=");
  });
}
