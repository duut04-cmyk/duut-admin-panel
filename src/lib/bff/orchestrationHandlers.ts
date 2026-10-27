import { NextResponse } from "next/server";
import {
  buildAdminOrchestrationsListPath,
  isValidOrchestrationRequestId,
  orchestrationRunBackendPath,
} from "./orchestrations";
import { proxyBackendJsonGet, type ProxyBackendJsonDeps } from "./proxyBackendJson";

const INVALID_ORCHESTRATION_ID_MESSAGE = "Invalid orchestration id.";

export async function handleOrchestrationListGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const path = buildAdminOrchestrationsListPath(new URL(request.url).searchParams);
  return proxyBackendJsonGet(path, "Failed to load orchestrations.", deps);
}

export async function handleOrchestrationRunGet(
  orchestrationRequestId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidOrchestrationRequestId(orchestrationRequestId)) {
    return NextResponse.json(
      { success: false, error: INVALID_ORCHESTRATION_ID_MESSAGE },
      { status: 400 },
    );
  }
  return proxyBackendJsonGet(
    orchestrationRunBackendPath(orchestrationRequestId),
    "Failed to load orchestration run.",
    deps,
  );
}
