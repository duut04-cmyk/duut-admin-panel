import type {
  CreateProviderInput,
  CreateProviderServiceInput,
  CreateProviderVehicleInput,
  ProviderCapability,
  ProviderDetail,
  ProviderService,
  ProviderSummary,
  ProviderVehicle,
  UpdateProviderInput,
  UpdateProviderStatusInput,
  UpdateProviderServiceInput,
  UpdateProviderVehicleInput,
  UpsertProviderCredentialsInput,
  UpsertProviderCredentialsResult,
} from "@/data/providerTypes";
import type { ReplaceProviderCapabilitiesBody } from "./providerCapabilities";
import type { ProviderConnectionTestResult } from "./providerConnectionDiagnostics";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

function extractErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message ?? "Request failed.");
  }
  return "Request failed.";
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = (await response.json()) as ApiResponse<T> & {
    error?: string | { message?: string };
  };

  if (!response.ok || !data.success) {
    return { success: false, error: extractErrorMessage(data.error) };
  }

  return { success: true, data: data.data };
}

export async function fetchProviders(): Promise<ApiResponse<ProviderSummary[]>> {
  const response = await fetch("/api/providers", { cache: "no-store" });
  return parseResponse<ProviderSummary[]>(response);
}

export async function fetchProvider(id: string): Promise<ApiResponse<ProviderDetail>> {
  const response = await fetch(`/api/providers/${id}`, { cache: "no-store" });
  return parseResponse<ProviderDetail>(response);
}

export async function createProvider(
  input: CreateProviderInput,
): Promise<ApiResponse<ProviderDetail>> {
  const response = await fetch("/api/providers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderDetail>(response);
}

export async function updateProvider(
  id: string,
  input: UpdateProviderInput,
): Promise<ApiResponse<ProviderDetail>> {
  const response = await fetch(`/api/providers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderDetail>(response);
}

export async function updateProviderStatus(
  providerId: string,
  input: UpdateProviderStatusInput,
): Promise<ApiResponse<ProviderDetail>> {
  const response = await fetch(`/api/providers/${providerId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderDetail>(response);
}

export async function testProviderConnection(
  providerId: string,
): Promise<ApiResponse<ProviderConnectionTestResult>> {
  const response = await fetch(`/api/providers/${providerId}/test-connection`, {
    method: "POST",
  });
  return parseResponse<ProviderConnectionTestResult>(response);
}

export async function upsertProviderCredentials(
  providerId: string,
  input: UpsertProviderCredentialsInput,
): Promise<ApiResponse<UpsertProviderCredentialsResult>> {
  const response = await fetch(`/api/providers/${providerId}/credentials`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<UpsertProviderCredentialsResult>(response);
}

export async function replaceProviderCapabilities(
  id: string,
  capabilities: ProviderCapability[],
): Promise<ApiResponse<ProviderDetail>> {
  const body: ReplaceProviderCapabilitiesBody = { capabilities };
  const response = await fetch(`/api/providers/${id}/capabilities`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse<ProviderDetail>(response);
}

export async function fetchProviderServices(
  providerId: string,
): Promise<ApiResponse<ProviderService[]>> {
  const response = await fetch(`/api/providers/${providerId}/services`, {
    cache: "no-store",
  });
  return parseResponse<ProviderService[]>(response);
}

export async function createProviderService(
  providerId: string,
  input: CreateProviderServiceInput,
): Promise<ApiResponse<ProviderService>> {
  const response = await fetch(`/api/providers/${providerId}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderService>(response);
}

export async function updateProviderService(
  providerId: string,
  serviceId: string,
  input: UpdateProviderServiceInput,
): Promise<ApiResponse<ProviderService>> {
  const response = await fetch(`/api/providers/${providerId}/services/${serviceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderService>(response);
}

export async function fetchProviderVehicles(
  providerId: string,
): Promise<ApiResponse<ProviderVehicle[]>> {
  const response = await fetch(`/api/providers/${providerId}/vehicles`, {
    cache: "no-store",
  });
  return parseResponse<ProviderVehicle[]>(response);
}

export async function createProviderVehicle(
  providerId: string,
  input: CreateProviderVehicleInput,
): Promise<ApiResponse<ProviderVehicle>> {
  const response = await fetch(`/api/providers/${providerId}/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderVehicle>(response);
}

export async function updateProviderVehicle(
  providerId: string,
  vehicleId: string,
  input: UpdateProviderVehicleInput,
): Promise<ApiResponse<ProviderVehicle>> {
  const response = await fetch(`/api/providers/${providerId}/vehicles/${vehicleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderVehicle>(response);
}
