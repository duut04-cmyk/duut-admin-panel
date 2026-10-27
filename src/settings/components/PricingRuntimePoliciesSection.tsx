"use client";

import { useState, type FormEvent } from "react";
import type { SettingsSnapshot } from "@/data/settingsTypes";
import Button from "@/common/components/Button";
import ReportsSection from "@/reports/components/ReportsSection";
import AdminCallout from "@/ui/AdminCallout";
import { patchRuntimePolicies } from "../api";
import {
  applyPatchResultToSnapshot,
  formatRuntimeSource,
  invalidOverrideWarning,
  resolvePricingRuntime,
} from "../runtimePoliciesShared";
import {
  buildPatchPricingPoliciesBody,
  draftFromPricingRuntime,
  type PlatformServiceFeeDraft,
} from "../pricingPoliciesPatch";
import { formatPercent } from "./formatters";
import RuntimePolicyField from "./RuntimePolicyField";

type PricingRuntimePoliciesSectionProps = {
  snapshot: SettingsSnapshot;
  onSnapshotChange: (snapshot: SettingsSnapshot) => void;
  onRefreshSnapshot: () => Promise<void>;
};

export default function PricingRuntimePoliciesSection({
  snapshot,
  onSnapshotChange,
  onRefreshSnapshot,
}: PricingRuntimePoliciesSectionProps) {
  const runtime = resolvePricingRuntime(snapshot);
  const [draft, setDraft] = useState<PlatformServiceFeeDraft>(() =>
    draftFromPricingRuntime(runtime),
  );
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setFormError(null);
    setFieldError(undefined);
    setSaveStatus("idle");

    const bodyResult = buildPatchPricingPoliciesBody({
      draft,
      snapshot,
    });

    if ("error" in bodyResult) {
      setSaving(false);
      setFormError(bodyResult.error);
      if (bodyResult.fieldError) {
        setFieldError(bodyResult.fieldError);
      }
      setSaveStatus("error");
      return;
    }

    const result = await patchRuntimePolicies(bodyResult);

    if (result.status === 409) {
      setSaving(false);
      setSaveStatus("error");
      setFormError(
        result.error ??
          "Another admin updated these policies. Refreshing the latest values — review and try again.",
      );
      await onRefreshSnapshot();
      return;
    }

    if (result.status === 503) {
      setSaving(false);
      setSaveStatus("error");
      setFormError(
        result.error ??
          "Persistent policy storage is unavailable. Apply the backend database migration before saving overrides.",
      );
      return;
    }

    if (!result.success || !result.data) {
      setSaving(false);
      setSaveStatus("error");
      setFormError(result.error ?? "Failed to save platform service fee.");
      return;
    }

    const nextSnapshot = applyPatchResultToSnapshot(snapshot, result.data);
    onSnapshotChange(nextSnapshot);
    setDraft(draftFromPricingRuntime(result.data.pricing));
    setSaving(false);
    setSaveStatus("success");
  };

  const feeMeta = runtime.platformServiceFeePercent;

  return (
    <ReportsSection
      id="settings-pricing-runtime"
      title="Pricing"
      description="Configure the Doot platform service fee applied to newly generated customer quotes. GST remains fixed at 18% and is not editable here. Changing this fee does not retroactively alter existing priced quotes or payments."
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <RuntimePolicyField
          label="Platform service fee"
          unit="percent"
          envHint="PLATFORM_SERVICE_FEE_PERCENT"
          effectiveDisplay={formatPercent(feeMeta.value)}
          sourceLabel={formatRuntimeSource(feeMeta.source)}
          version={feeMeta.version}
          restartRequired={feeMeta.restartRequired}
          inputId="pricing-platform-service-fee"
          value={draft.platformServiceFeePercent}
          onChange={(value) => setDraft({ platformServiceFeePercent: value })}
          error={fieldError}
          disabled={saving}
          invalidOverrideMessage={invalidOverrideWarning(feeMeta)}
        />

        {formError ? (
          <AdminCallout variant="warning" title="Could not save">
            {formError}
          </AdminCallout>
        ) : null}

        {saveStatus === "success" ? (
          <AdminCallout variant="success" title="Saved">
            Platform service fee was updated from the server response. New quotes will
            use this percentage; existing quote snapshots keep their frozen pricing.
          </AdminCallout>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save platform service fee"}
          </Button>
          <p className="text-caption text-muted-foreground">
            Saves with optimistic versioning (v{feeMeta.version}).
          </p>
        </div>
      </form>
    </ReportsSection>
  );
}
