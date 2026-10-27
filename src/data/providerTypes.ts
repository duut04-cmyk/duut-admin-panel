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

export type ProviderCredentialField =
  | "API_KEY"
  | "API_SECRET"
  | "ACCESS_TOKEN"
  | "CLIENT_ID"
  | "CLIENT_SECRET"
  | "USERNAME"
  | "PASSWORD"
  | "ACCOUNT_ID"
  | "WEBHOOK_SECRET";

export type ProviderCredentialsMetadata = {
  configured: boolean;
  fields: Array<{ name: ProviderCredentialField; configured: boolean }>;
};

export type UpsertProviderCredentialsInput = Partial<
  Record<ProviderCredentialField, string>
>;

export type UpsertProviderCredentialsResult = {
  configured: boolean;
};

export type PackageType = "MEDICINE" | "FOOD" | "DOCUMENT" | "OTHER";

export type ProviderServiceType =
  | "BIKE"
  | "SCOOTER"
  | "CAR"
  | "VAN"
  | "TRUCK"
  | "HYPERLOCAL"
  | "SAME_DAY"
  | "EXPRESS"
  | "SCHEDULED";

export type ProviderVehicleType = "BIKE" | "SCOOTER" | "CAR" | "VAN" | "TRUCK";

export type ProviderSettings = {
  timeoutMs: number;
  connectTimeoutMs: number;
  maxRetries: number;
  retryDelayMs: number;
  webhookEnabled: boolean;
  healthCheckEnabled: boolean;
  healthCheckIntervalMs: number;
};

export type ProviderPackageLimits = {
  minWeightKg: number | null;
  maxWeightKg: number | null;
  maxLengthCm: number | null;
  maxWidthCm: number | null;
  maxHeightCm: number | null;
  maxVolumeCm3: number | null;
  supportedPackageTypes: PackageType[];
};

export type ProviderService = {
  id: string;
  code: string;
  name: string;
  serviceType: ProviderServiceType;
  description: string | null;
  enabled: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type ProviderVehicle = {
  id: string;
  vehicleType: ProviderVehicleType;
  enabled: boolean;
  maxWeightKg: number | null;
  maxLengthCm: number | null;
  maxWidthCm: number | null;
  maxHeightCm: number | null;
  createdAt: string;
  updatedAt: string;
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
  settings: ProviderSettings;
  packageLimits: ProviderPackageLimits | null;
  services: ProviderService[];
  vehicles: ProviderVehicle[];
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

export type UpdateProviderStatusInput = {
  status: ProviderStatus;
  enabled?: boolean;
};

export type CreateProviderServiceInput = {
  code: string;
  name: string;
  serviceType: ProviderServiceType;
  description?: string | null;
  enabled?: boolean;
  priority?: number;
};

export type UpdateProviderServiceInput = {
  name?: string;
  serviceType?: ProviderServiceType;
  description?: string | null;
  enabled?: boolean;
  priority?: number;
};

export type CreateProviderVehicleInput = {
  vehicleType: ProviderVehicleType;
  enabled?: boolean;
  maxWeightKg?: number | null;
  maxLengthCm?: number | null;
  maxWidthCm?: number | null;
  maxHeightCm?: number | null;
};

export type UpdateProviderVehicleInput = {
  enabled?: boolean;
  maxWeightKg?: number | null;
  maxLengthCm?: number | null;
  maxWidthCm?: number | null;
  maxHeightCm?: number | null;
};

export type ProviderMetrics = {
  total: number;
  enabled: number;
  orchestrationEnabled: number;
  healthy: number;
};
