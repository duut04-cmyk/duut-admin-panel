type HeaderReader = {
  get(name: string): string | null;
};

function hostsMatch(expectedHost: string, candidateUrl: string): boolean {
  try {
    return new URL(candidateUrl).host === expectedHost;
  } catch {
    return false;
  }
}

/**
 * Validates browser mutation requests (POST/PUT/PATCH/DELETE) against the Host header.
 *
 * - If `Origin` is present, it must match `Host`.
 * - Else if `Referer` is present, its origin must match `Host`.
 * - Else reject (non-browser clients without origin metadata are not trusted).
 */
export function isSameOriginMutation(headers: HeaderReader): boolean {
  const host = headers.get("host")?.trim();
  if (!host) {
    return false;
  }

  const origin = headers.get("origin")?.trim();
  if (origin) {
    return hostsMatch(host, origin);
  }

  const referer = headers.get("referer")?.trim();
  if (referer) {
    return hostsMatch(host, referer);
  }

  return false;
}

/** @deprecated Prefer isSameOriginMutation — delegates for legacy call sites. */
export function isSameOriginPost(request: Request): boolean {
  return isSameOriginMutation(request.headers);
}

export const CSRF_REJECTION_MESSAGE = "Invalid request.";
