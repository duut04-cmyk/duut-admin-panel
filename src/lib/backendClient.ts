import { getAccessToken } from "./backendAuth";

type BackendFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export function getBackendApiUrl(): string | null {
  const url = process.env.BACKEND_API_URL?.trim();
  return url || null;
}

export async function backendFetch(
  path: string,
  options: BackendFetchOptions = {},
): Promise<Response> {
  const baseUrl = getBackendApiUrl();
  if (!baseUrl) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: "BACKEND_API_URL is not configured." },
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const token = await getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });
}

export async function parseBackendJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}
