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
  const { booking, auth, deliveryOtp, orchestration } = policies;

  return (
    <ReportsSection
      id="settings-policies"
      title="Operational policies"
      description="Business rules applied across booking, auth, delivery OTP, and orchestration. Values are read-only and require a deployment to change."
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-small font-semibold text-foreground">Booking & quotes</h3>
          <SettingsKeyValueCard
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
        </div>

        <div className="space-y-2">
          <h3 className="text-small font-semibold text-foreground">Auth & sessions</h3>
          <SettingsKeyValueCard
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
                hint: "PASSWORD_RESET_VERIFICATION_TOKEN_EXPIRY_SECONDS",
              },
              {
                label: "Email verification OTP",
                value: formatMinutes(auth.emailVerificationOtpExpiryMinutes),
                hint: "Hardcoded in auth.constants.ts",
              },
              {
                label: "OTP resend cooldown",
                value: formatSeconds(auth.otpResendCooldownSeconds),
                hint: "Hardcoded in auth.constants.ts",
              },
            ]}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-small font-semibold text-foreground">Delivery OTP</h3>
          <SettingsKeyValueCard
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
        </div>

        <div className="space-y-2">
          <h3 className="text-small font-semibold text-foreground">Orchestration</h3>
          <SettingsKeyValueCard
            items={[
              {
                label: "Require known cancellation policy",
                value: formatBoolean(orchestration.requireKnownCancellationPolicy),
                hint: "Hardcoded in orchestration.constants.ts",
              },
              {
                label: "Best-option score weights",
                value: `Price ${orchestration.scoreWeights.price}, ETA ${orchestration.scoreWeights.eta}, Availability ${orchestration.scoreWeights.availability}, Priority ${orchestration.scoreWeights.providerPriority}, Quality ${orchestration.scoreWeights.serviceQuality}`,
                hint: "Hardcoded in orchestration.constants.ts",
              },
            ]}
          />
        </div>
      </div>
    </ReportsSection>
  );
}
