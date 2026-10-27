import { NextResponse } from "next/server";
import {
  isValidProviderId,
  isValidProviderSubResourceId,
  providerCapabilitiesBackendPath,
  providerCredentialsBackendPath,
  providerDetailBackendPath,
  providerTestConnectionBackendPath,
  providerStatusBackendPath,
  providerServiceBackendPath,
  providerServicesBackendPath,
  providerVehicleBackendPath,
  providerVehiclesBackendPath,
} from "./providers";
import {
  proxyBackendJsonGet,
  proxyBackendJsonPatch,
  proxyBackendJsonPost,
  proxyBackendJsonPostNoBody,
  proxyBackendJsonPut,
  type ProxyBackendJsonDeps,
} from "./proxyBackendJson";
import type {
  CreateProviderServiceInput,
  CreateProviderVehicleInput,
  UpdateProviderInput,
  UpdateProviderStatusInput,
  UpdateProviderServiceInput,
  UpdateProviderVehicleInput,
  UpsertProviderCredentialsInput,
} from "@/data/providerTypes";
import type { ReplaceProviderCapabilitiesBody } from "@/providers/providerCapabilities";

const INVALID_PROVIDER_ID_MESSAGE = "Invalid provider id.";
const INVALID_SUB_RESOURCE_ID_MESSAGE = "Invalid resource id.";

function rejectInvalidProviderId(): NextResponse {
  return NextResponse.json(
    { success: false, error: INVALID_PROVIDER_ID_MESSAGE },
    { status: 400 },
  );
}

function rejectInvalidSubResourceId(): NextResponse {
  return NextResponse.json(
    { success: false, error: INVALID_SUB_RESOURCE_ID_MESSAGE },
    { status: 400 },
  );
}

export async function handleProviderDetailGet(
  providerId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();

  return proxyBackendJsonGet(
    providerDetailBackendPath(providerId),
    "Failed to load provider.",
    deps,
  );
}

export async function handleProviderDetailPatch(
  providerId: string,
  body: UpdateProviderInput,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();

  return proxyBackendJsonPatch(
    providerDetailBackendPath(providerId),
    body,
    "Failed to update provider.",
    deps,
  );
}

export async function handleProviderCapabilitiesPut(
  providerId: string,
  body: ReplaceProviderCapabilitiesBody,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();

  return proxyBackendJsonPut(
    providerCapabilitiesBackendPath(providerId),
    body,
    "Failed to update provider capabilities.",
    deps,
  );
}

export async function handleProviderStatusPatch(
  providerId: string,
  body: UpdateProviderStatusInput,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();

  return proxyBackendJsonPatch(
    providerStatusBackendPath(providerId),
    body,
    "Failed to update provider status.",
    deps,
  );
}

export async function handleProviderTestConnectionPost(
  providerId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();

  return proxyBackendJsonPostNoBody(
    providerTestConnectionBackendPath(providerId),
    "Failed to test provider connection.",
    deps,
  );
}

export async function handleProviderCredentialsPut(
  providerId: string,
  body: UpsertProviderCredentialsInput,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();

  return proxyBackendJsonPut(
    providerCredentialsBackendPath(providerId),
    body,
    "Failed to save provider credentials.",
    deps,
  );
}

export async function handleProviderServicesListGet(
  providerId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();
  return proxyBackendJsonGet(
    providerServicesBackendPath(providerId),
    "Failed to load provider services.",
    deps,
  );
}

export async function handleProviderServiceCreatePost(
  providerId: string,
  body: CreateProviderServiceInput,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();
  return proxyBackendJsonPost(
    providerServicesBackendPath(providerId),
    body,
    "Failed to create provider service.",
    deps,
  );
}

export async function handleProviderServiceUpdatePatch(
  providerId: string,
  serviceId: string,
  body: UpdateProviderServiceInput,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();
  if (!isValidProviderSubResourceId(serviceId)) return rejectInvalidSubResourceId();
  return proxyBackendJsonPatch(
    providerServiceBackendPath(providerId, serviceId),
    body,
    "Failed to update provider service.",
    deps,
  );
}

export async function handleProviderVehiclesListGet(
  providerId: string,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();
  return proxyBackendJsonGet(
    providerVehiclesBackendPath(providerId),
    "Failed to load provider vehicles.",
    deps,
  );
}

export async function handleProviderVehicleCreatePost(
  providerId: string,
  body: CreateProviderVehicleInput,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();
  return proxyBackendJsonPost(
    providerVehiclesBackendPath(providerId),
    body,
    "Failed to create provider vehicle.",
    deps,
  );
}

export async function handleProviderVehicleUpdatePatch(
  providerId: string,
  vehicleId: string,
  body: UpdateProviderVehicleInput,
  deps?: ProxyBackendJsonDeps,
): Promise<NextResponse> {
  if (!isValidProviderId(providerId)) return rejectInvalidProviderId();
  if (!isValidProviderSubResourceId(vehicleId)) return rejectInvalidSubResourceId();
  return proxyBackendJsonPatch(
    providerVehicleBackendPath(providerId, vehicleId),
    body,
    "Failed to update provider vehicle.",
    deps,
  );
}
