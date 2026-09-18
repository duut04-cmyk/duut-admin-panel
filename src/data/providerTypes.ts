export type ProviderEnvironment = "SANDBOX" | "LIVE";

export type ProviderStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type ProviderIntegrationStatus =
  "NOT_CONFIGURED" | "CONFIGURED" | "READY" | "ERROR";

export type ProviderHealthStatus = "UNKNOWN" | "HEALTHY" | "UNHEALTHY";

export type ProviderCapability =
  | "SERVICEABILITY"
  | "AVAILABILITY"
  | "PRICING"
  | "BOOKING"
  | "DRIVER_INFO"
  | "DRIVER_RATING"
  | "VEHICLE_INFO"
  | "LIVE_TRACKING"
  | "TRACKING_URL"
  | "WEBHOOKS"
  | "OTP"
  | "CANCELLATION";

export type ProviderHealth = {
  status: ProviderHealthStatus;
  lastCheckedAt: string | null;
  lastError: string | null;
};

export type ProviderCredentialsMetadata = {
  configured: boolean;
  fields: Array<{ name: string; configured: boolean }>;
};

export type ProviderSummary = {
  id: string;
  code: string;
  name: string;
  displayName: string | null;
  environment: ProviderEnvironment;
  status: ProviderStatus;
  enabled: boolean;
  orchestrationEnabled: boolean;
  priority: number;
  integrationStatus: ProviderIntegrationStatus;
  orchestrationEligible: boolean;
  health: ProviderHealth;
  credentials: ProviderCredentialsMetadata;
  capabilities: ProviderCapability[];
  createdAt: string;
  updatedAt: string;
};

export type ProviderDetail = ProviderSummary & {
  description: string | null;
};

export type CreateProviderInput = {
  code: string;
  name: string;
  displayName?: string | null;
  description?: string | null;
  environment?: ProviderEnvironment;
  enabled?: boolean;
  orchestrationEnabled?: boolean;
  priority?: number;
  capabilities?: ProviderCapability[];
};

export type UpdateProviderInput = {
  name?: string;
  displayName?: string | null;
  description?: string | null;
  environment?: ProviderEnvironment;
  enabled?: boolean;
  orchestrationEnabled?: boolean;
  priority?: number;
};

export type ProviderMetrics = {
  total: number;
  enabled: number;
  orchestrationEnabled: number;
  healthy: number;
};
