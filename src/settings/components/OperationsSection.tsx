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
    <ReportsSection
      id="settings-operations"
      title="Operations & flags"
      description="Runtime toggles visible to operators. These are environment-driven and read-only in the admin panel."
    >
      <SettingsKeyValueCard
        items={[
          {
            label: "Mock provider adapter",
            value: formatBoolean(flags.mockProviderAdapter),
            hint: "ENABLE_MOCK_PROVIDER_ADAPTER",
          },
          {
            label: "Borzo webhooks",
            value: formatBoolean(flags.borzoWebhooksEnabled),
            hint: "BORZO_WEBHOOKS_ENABLED — see Integrations for signing status",
          },
          {
            label: "Development mode",
            value: formatBoolean(flags.developmentMode),
            hint: "NODE_ENV === development",
          },
        ]}
      />
    </ReportsSection>
  );
}
