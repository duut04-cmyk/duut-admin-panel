const PROVIDER_ID_UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidProviderId(providerId: string): boolean {
  const trimmed = providerId.trim();
  if (trimmed !== providerId || trimmed.length === 0) {
    return false;
  }
  if (trimmed.includes("/") || trimmed.includes("..")) {
    return false;
  }
  return PROVIDER_ID_UUID_PATTERN.test(trimmed);
}

export function providerDetailBackendPath(providerId: string): string {
  return `/api/v1/admin/providers/${providerId}`;
}

export function providerCapabilitiesBackendPath(providerId: string): string {
  return `/api/v1/admin/providers/${providerId}/capabilities`;
}

export function providerCredentialsBackendPath(providerId: string): string {
  return `/api/v1/admin/providers/${providerId}/credentials`;
}

export function providerTestConnectionBackendPath(providerId: string): string {
  return `/api/v1/admin/providers/${providerId}/test-connection`;
}

export function providerStatusBackendPath(providerId: string): string {
  return `/api/v1/admin/providers/${providerId}/status`;
}

export function isValidProviderSubResourceId(id: string): boolean {
  return isValidProviderId(id);
}

export function providerServicesBackendPath(providerId: string): string {
  return `/api/v1/admin/providers/${providerId}/services`;
}

export function providerServiceBackendPath(
  providerId: string,
  serviceId: string,
): string {
  return `/api/v1/admin/providers/${providerId}/services/${serviceId}`;
}

export function providerVehiclesBackendPath(providerId: string): string {
  return `/api/v1/admin/providers/${providerId}/vehicles`;
}

export function providerVehicleBackendPath(
  providerId: string,
  vehicleId: string,
): string {
  return `/api/v1/admin/providers/${providerId}/vehicles/${vehicleId}`;
}
