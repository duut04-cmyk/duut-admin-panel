"use client";

import type { SettingsPolicies } from "@/data/settingsTypes";
import ReportsSection from "@/reports/components/ReportsSection";
import SettingsKeyValueCard from "./SettingsKeyValueCard";
import {
  formatBoolean,
  formatDays,
  formatMinutes,
  formatPercent,
  formatSeconds,
} from "./formatters";

type PoliciesSectionProps = {
  policies: SettingsPolicies;
};

export default function PoliciesSection({ policies }: PoliciesSectionProps) {
  const { booking, pricing, auth, deliveryOtp, orchestration } = policies;

  return (
    <ReportsSection
      id="settings-policies"
      title="Policies"
      description="Business rules"
    >
      <div className="grid min-w-0 gap-3 lg:grid-cols-2">
        <SettingsKeyValueCard
          title="Booking"
          items={[
            {
              label: "Quote max age",
              value: formatSeconds(booking.quoteMaxAgeSeconds),
              hint: "BOOKING_QUOTE_MAX_AGE_SECONDS",
            },
            {
              label: "Price tolerance",
              value: formatPercent(booking.priceTolerancePercent),
              hint: "BOOKING_PRICE_TOLERANCE_PERCENT",
            },
          ]}
        />

        <SettingsKeyValueCard
          title="Pricing"
          items={[
            {
              label: "Platform service fee",
              value: formatPercent(pricing.platformServiceFeePercent),
              hint: "PLATFORM_SERVICE_FEE_PERCENT",
            },
            {
              label: "GST",
              value: "18% fixed",
            },
          ]}
        />

        <SettingsKeyValueCard
          title="Auth & sessions"
          items={[
            {
              label: "Access token lifetime",
              value: auth.jwtAccessExpiresIn,
              hint: "JWT_ACCESS_EXPIRES_IN",
            },
            {
              label: "Refresh token lifetime",
              value: formatDays(auth.refreshTokenExpiresInDays),
              hint: "REFRESH_TOKEN_EXPIRES_IN_DAYS",
            },
            {
              label: "Password hashing rounds",
              value: String(auth.bcryptRounds),
              hint: "BCRYPT_ROUNDS",
            },
            {
              label: "Password reset window",
              value: formatSeconds(auth.passwordResetTokenExpirySeconds),
              hint: "PASSWORD_RESET_TOKEN_EXPIRY",
            },
            {
              label: "Email verification OTP",
              value: formatMinutes(auth.emailVerificationOtpExpiryMinutes),
              hint: "Code",
            },
            {
              label: "OTP resend cooldown",
              value: formatSeconds(auth.otpResendCooldownSeconds),
              hint: "Code",
            },
          ]}
        />

        <SettingsKeyValueCard
          title="Delivery OTP"
          items={[
            {
              label: "OTP expiry",
              value: formatSeconds(deliveryOtp.expirySeconds),
              hint: "OTP_EXPIRY_SECONDS",
            },
            {
              label: "Max attempts",
              value: String(deliveryOtp.maxAttempts),
              hint: "OTP_MAX_ATTEMPTS",
            },
            {
              label: "Generation cooldown",
              value: formatSeconds(deliveryOtp.generationCooldownSeconds),
              hint: "OTP_GENERATION_COOLDOWN_SECONDS",
            },
          ]}
        />

        <SettingsKeyValueCard
          title="Orchestration"
          items={[
            {
              label: "Known cancellation policy",
              value: formatBoolean(orchestration.requireKnownCancellationPolicy),
              hint: "Code",
            },
            {
              label: "Score weights",
              value: `Price ${orchestration.scoreWeights.price} · ETA ${orchestration.scoreWeights.eta} · Avail ${orchestration.scoreWeights.availability} · Priority ${orchestration.scoreWeights.providerPriority} · Quality ${orchestration.scoreWeights.serviceQuality}`,
              hint: "Code",
            },
          ]}
        />
      </div>
    </ReportsSection>
  );
}
