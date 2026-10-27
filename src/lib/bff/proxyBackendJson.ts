import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "../backendClient";
import {
  applyClearAdminSessionCookie,
  shouldClearAdminSessionOnBackendResponse,
  type BackendErrorEnvelope,
} from "../auth/sessionFromBackend";

export type BackendJsonEnvelope<T = unknown> = BackendErrorEnvelope & {
  success: boolean;
  data?: T;
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

function proxyErrorResponse(
  response: Response,
  data: BackendErrorEnvelope,
  fallbackMessage: string,
): NextResponse {
  const res = NextResponse.json(
    { success: false, error: data.error?.message ?? fallbackMessage },
    { status: response.status || 500 },
  );
  if (shouldClearAdminSessionOnBackendResponse(response, data)) {
    applyClearAdminSessionCookie(res);
  }
  return res;
}

async function proxyBackendJson<T>(
  response: Response,
  data: BackendJsonEnvelope<T>,
  fallbackMessage: string,
  successStatus?: number,
): Promise<NextResponse> {
  if (!response.ok || !data.success) {
    return proxyErrorResponse(response, data, fallbackMessage);
  }

  if (successStatus !== undefined) {
    return NextResponse.json(
      { success: true, data: data.data },
      { status: successStatus },
    );
  }
  return NextResponse.json({ success: true, data: data.data });
}

export async function proxyBackendJsonGet<T>(
  path: string,
  fallbackMessage: string,
  deps: ProxyBackendJsonDeps = defaultDeps,
): Promise<NextResponse> {
  const response = await deps.fetch(path);
  const data = await deps.parse<BackendJsonEnvelope<T>>(response);
  return proxyBackendJson(response, data, fallbackMessage);
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
  return proxyBackendJson(response, data, fallbackMessage);
}

export async function proxyBackendJsonPostNoBody<T>(
  path: string,
  fallbackMessage: string,
  deps: ProxyBackendJsonDeps = defaultDeps,
): Promise<NextResponse> {
  const response = await deps.fetch(path, { method: "POST" });
  const data = await deps.parse<BackendJsonEnvelope<T>>(response);
  return proxyBackendJson(response, data, fallbackMessage, response.status || 200);
}

export async function proxyBackendJsonPost<T>(
  path: string,
  body: unknown,
  fallbackMessage: string,
  deps: ProxyBackendJsonDeps = defaultDeps,
): Promise<NextResponse> {
  const response = await deps.fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await deps.parse<BackendJsonEnvelope<T>>(response);
  return proxyBackendJson(response, data, fallbackMessage, response.status || 201);
}

export async function proxyBackendJsonPut<T>(
  path: string,
  body: unknown,
  fallbackMessage: string,
  deps: ProxyBackendJsonDeps = defaultDeps,
): Promise<NextResponse> {
  const response = await deps.fetch(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await deps.parse<BackendJsonEnvelope<T>>(response);
  return proxyBackendJson(response, data, fallbackMessage);
}
