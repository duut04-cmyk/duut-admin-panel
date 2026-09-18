"use client";

import type { SettingsPlatform } from "@/data/settingsTypes";
import ReportsSection from "@/reports/components/ReportsSection";
import EnvironmentBadge from "./EnvironmentBadge";
import SettingsKeyValueCard from "./SettingsKeyValueCard";
import { formatOptionalUrl } from "./formatters";

type PlatformSectionProps = {
  platform: SettingsPlatform;
};

export default function PlatformSection({ platform }: PlatformSectionProps) {
  return (
    <ReportsSection
      id="settings-platform"
      title="Platform overview"
      description="Runtime identity and application URLs."
      action={<EnvironmentBadge nodeEnv={platform.nodeEnv} />}
    >
      <SettingsKeyValueCard
        items={[
          { label: "Application name", value: platform.appName },
          { label: "Environment", value: platform.nodeEnv },
          { label: "API port", value: String(platform.port) },
          {
            label: "Customer app URL",
            value: formatOptionalUrl(platform.frontendUrl),
            hint: "FRONTEND_URL",
          },
          {
            label: "Admin app URL",
            value: formatOptionalUrl(platform.adminFrontendUrl),
            hint: "ADMIN_FRONTEND_URL",
          },
        ]}
      />
    </ReportsSection>
  );
}
