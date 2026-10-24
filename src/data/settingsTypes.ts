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
};

export type SettingsRuntime = {
  booking: {
    quoteMaxAgeSeconds: RuntimeSettingMeta;
    priceTolerancePercent: RuntimeSettingMeta;
  };
};

export type PatchBookingPoliciesResult = {
  booking: SettingsRuntime["booking"];
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
