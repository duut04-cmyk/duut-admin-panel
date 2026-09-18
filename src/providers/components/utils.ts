import type {
  ProviderEnvironment,
  ProviderHealthStatus,
  ProviderIntegrationStatus,
  ProviderMetrics,
  ProviderStatus,
  ProviderSummary,
} from "@/data/providerTypes";
type AdminStatusVariant =
  "operational" | "active" | "pending" | "success" | "failed" | "cancelled" | "warning";

export function getProviderMetrics(providers: ProviderSummary[]): ProviderMetrics {
  return {
    total: providers.length,
    enabled: providers.filter((p) => p.enabled).length,
    orchestrationEnabled: providers.filter((p) => p.orchestrationEnabled).length,
    healthy: providers.filter((p) => p.health.status === "HEALTHY").length,
  };
}

export function formatProviderDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function providerStatusVariant(status: ProviderStatus): AdminStatusVariant {
  switch (status) {
    case "ACTIVE":
      return "operational";
    case "SUSPENDED":
      return "warning";
    case "INACTIVE":
    default:
      return "pending";
  }
}

export function providerStatusLabel(status: ProviderStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "SUSPENDED":
      return "Suspended";
    default:
      return status;
  }
}

export function integrationStatusVariant(
  status: ProviderIntegrationStatus,
): AdminStatusVariant {
  switch (status) {
    case "READY":
      return "success";
    case "CONFIGURED":
      return "active";
    case "ERROR":
      return "failed";
    case "NOT_CONFIGURED":
    default:
      return "pending";
  }
}

export function integrationStatusLabel(status: ProviderIntegrationStatus): string {
  switch (status) {
    case "NOT_CONFIGURED":
      return "Not configured";
    case "CONFIGURED":
      return "Configured";
    case "READY":
      return "Ready";
    case "ERROR":
      return "Error";
    default:
      return status;
  }
}

export function healthStatusVariant(status: ProviderHealthStatus): AdminStatusVariant {
  switch (status) {
    case "HEALTHY":
      return "success";
    case "UNHEALTHY":
      return "failed";
    case "UNKNOWN":
    default:
      return "pending";
  }
}

export function healthStatusLabel(status: ProviderHealthStatus): string {
  switch (status) {
    case "HEALTHY":
      return "Healthy";
    case "UNHEALTHY":
      return "Unhealthy";
    case "UNKNOWN":
    default:
      return "Unknown";
  }
}

export function environmentLabel(environment: ProviderEnvironment): string {
  return environment === "LIVE" ? "Live" : "Sandbox";
}
