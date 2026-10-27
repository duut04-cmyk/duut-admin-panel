import { NextResponse } from "next/server";
import {
  buildAdminDeliveriesListPath,
  deliveryDetailBackendPath,
  deliveryHistoryBackendPath,
  deliveryOrchestrationBackendPath,
  isValidDeliveryId,
} from "./deliveries";
import {
  proxyBackendJsonGet,
  type BackendJsonEnvelope,
  type ProxyBackendJsonDeps,
} from "./proxyBackendJson";

const INVALID_DELIVERY_ID_MESSAGE = "Invalid delivery id.";

export async function handleDeliveryListGet(
  request: Request,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  const path = buildAdminDeliveriesListPath(new URL(request.url).searchParams);
  return proxyBackendJsonGet(path, "Failed to load deliveries.", deps);
}

export async function handleDeliveryDetailGet(
  deliveryId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidDeliveryId(deliveryId)) {
    return NextResponse.json(
      { success: false, error: INVALID_DELIVERY_ID_MESSAGE },
      { status: 400 },
    );
  }
  return proxyBackendJsonGet(
    deliveryDetailBackendPath(deliveryId),
    "Failed to load delivery.",
    deps,
  );
}

export async function handleDeliveryHistoryGet(
  deliveryId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidDeliveryId(deliveryId)) {
    return NextResponse.json(
      { success: false, error: INVALID_DELIVERY_ID_MESSAGE },
      { status: 400 },
    );
  }
  return proxyBackendJsonGet(
    deliveryHistoryBackendPath(deliveryId),
    "Failed to load delivery history.",
    deps,
  );
}

export async function handleDeliveryOrchestrationGet(
  deliveryId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidDeliveryId(deliveryId)) {
    return NextResponse.json(
      { success: false, error: INVALID_DELIVERY_ID_MESSAGE },
      { status: 400 },
    );
  }
  return proxyBackendJsonGet(
    deliveryOrchestrationBackendPath(deliveryId),
    "Failed to load orchestration.",
    deps,
  );
}

export type { BackendJsonEnvelope, ProxyBackendJsonDeps };
