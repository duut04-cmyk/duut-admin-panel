import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "../backendClient";

export type BackendJsonEnvelope<T = unknown> = {
  success: boolean;
  data?: T;
  error?: { message?: string };
};

type BackendFetchFn = typeof backendFetch;

export type ProxyBackendJsonDeps = {
  fetch: BackendFetchFn;
  parse: typeof parseBackendJson;
};

const defaultDeps: ProxyBackendJsonDeps = {
  fetch: backendFetch,
  parse: parseBackendJson,
};

export async function proxyBackendJsonGet<T>(
  path: string,
  fallbackMessage: string,
  deps: ProxyBackendJsonDeps = defaultDeps,
): Promise<NextResponse> {
  const response = await deps.fetch(path);
  const data = await deps.parse<BackendJsonEnvelope<T>>(response);

  if (!response.ok || !data.success) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? fallbackMessage },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ success: true, data: data.data });
}

export async function proxyBackendJsonPatch<T>(
  path: string,
  body: unknown,
  fallbackMessage: string,
  deps: ProxyBackendJsonDeps = defaultDeps,
): Promise<NextResponse> {
  const response = await deps.fetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  const data = await deps.parse<BackendJsonEnvelope<T>>(response);

  if (!response.ok || !data.success) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? fallbackMessage },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ success: true, data: data.data });
}
