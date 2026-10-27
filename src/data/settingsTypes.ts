export type SettingsPlatform = {
  appName: string;
  nodeEnv: string;
  port: number;
  frontendUrl: string | null;
  adminFrontendUrl: string | null;
};

export type SettingsBookingPolicies = {
  quoteMaxAgeSeconds: number;
  priceTolerancePercent: number;
};

export type SettingsPricingPolicies = {
  platformServiceFeePercent: number;
};

export type SettingsAuthPolicies = {
  jwtAccessExpiresIn: string;
  refreshTokenExpiresInDays: number;
  bcryptRounds: number;
  passwordResetTokenExpirySeconds: number;
  emailVerificationOtpExpiryMinutes: number;
  otpResendCooldownSeconds: number;
};

export type SettingsDeliveryOtpPolicies = {
  expirySeconds: number;
  maxAttempts: number;
  generationCooldownSeconds: number;
};

export type SettingsOrchestrationPolicies = {
  requireKnownCancellationPolicy: boolean;
  scoreWeights: {
    price: number;
    eta: number;
    availability: number;
    providerPriority: number;
    serviceQuality: number;
  };
};

export type SettingsPolicies = {
  booking: SettingsBookingPolicies;
  pricing: SettingsPricingPolicies;
  auth: SettingsAuthPolicies;
  deliveryOtp: SettingsDeliveryOtpPolicies;
  orchestration: SettingsOrchestrationPolicies;
};

export type SettingsFlags = {
  mockProviderAdapter: boolean;
  developmentMode: boolean;
};

export type RuntimeSettingMeta = {
  value: number;
  source: "env" | "database";
  version: number;
  restartRequired: false;
  invalidStoredOverride?: true;
  storageUnavailable?: true;
};

export type SettingsRuntime = {
  booking: {
    quoteMaxAgeSeconds: RuntimeSettingMeta;
    priceTolerancePercent: RuntimeSettingMeta;
  };
  pricing: {
    platformServiceFeePercent: RuntimeSettingMeta;
  };
};

export type PatchRuntimePoliciesRequestBody = {
  booking?: {
    quoteMaxAgeSeconds?: number;
    priceTolerancePercent?: number;
  };
  pricing?: {
    platformServiceFeePercent?: number;
  };
  expectedVersions: {
    quoteMaxAgeSeconds: number;
    priceTolerancePercent: number;
    platformServiceFeePercent: number;
  };
};

export type PatchRuntimePoliciesResult = {
  booking: SettingsRuntime["booking"];
  pricing: SettingsRuntime["pricing"];
  audit: {
    outcome: "updated" | "no_change";
    changes: Array<{
      key: string;
      previousValue: number;
      newValue: number;
      previousVersion: number;
      newVersion: number;
    }>;
  };
};

/** @deprecated Use PatchRuntimePoliciesResult */
export type PatchBookingPoliciesResult = PatchRuntimePoliciesResult;

export type SettingsSnapshot = {
  platform: SettingsPlatform;
  policies: SettingsPolicies;
  flags: SettingsFlags;
  runtime?: SettingsRuntime;
  checkedAt: string;
};

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  status: string;
  role: string;
};
