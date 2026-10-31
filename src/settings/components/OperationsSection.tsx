"use client";

import type { SettingsFlags } from "@/data/settingsTypes";
import ReportsSection from "@/reports/components/ReportsSection";
import SettingsKeyValueCard from "./SettingsKeyValueCard";
import { formatBoolean } from "./formatters";

type OperationsSectionProps = {
  flags: SettingsFlags;
};

export default function OperationsSection({ flags }: OperationsSectionProps) {
  return (
    <ReportsSection id="settings-operations" title="Operations" description="Flags">
      <SettingsKeyValueCard
        items={[
          {
            label: "Mock provider adapter",
            value: formatBoolean(flags.mockProviderAdapter),
            hint: "ENABLE_MOCK_PROVIDER_ADAPTER",
          },
          {
            label: "Development mode",
            value: formatBoolean(flags.developmentMode),
            hint: "NODE_ENV",
          },
        ]}
      />
    </ReportsSection>
  );
}
