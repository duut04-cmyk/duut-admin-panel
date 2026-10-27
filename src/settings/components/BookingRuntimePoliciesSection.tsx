"use client";

import { useState, type FormEvent } from "react";
import type { SettingsSnapshot } from "@/data/settingsTypes";
import Button from "@/common/components/Button";
import ReportsSection from "@/reports/components/ReportsSection";
import AdminCallout from "@/ui/AdminCallout";
import { patchRuntimePolicies } from "../api";
import {
  applyPatchResultToSnapshot,
  buildPatchBookingPoliciesBody,
  draftFromRuntime,
  formatRuntimeSource,
  invalidOverrideWarning,
  resolveBookingRuntime,
  type BookingPolicyDraft,
  type BookingPolicyFieldErrors,
} from "../bookingPoliciesPatch";
import { formatPercent, formatSeconds } from "./formatters";
import RuntimePolicyField from "./RuntimePolicyField";

type BookingRuntimePoliciesSectionProps = {
  snapshot: SettingsSnapshot;
  onSnapshotChange: (snapshot: SettingsSnapshot) => void;
  onRefreshSnapshot: () => Promise<void>;
};

export default function BookingRuntimePoliciesSection({
  snapshot,
  onSnapshotChange,
  onRefreshSnapshot,
}: BookingRuntimePoliciesSectionProps) {
  const runtime = resolveBookingRuntime(snapshot);
  const [draft, setDraft] = useState<BookingPolicyDraft>(() =>
    draftFromRuntime(runtime),
  );
  const [fieldErrors, setFieldErrors] = useState<BookingPolicyFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setFormError(null);
    setFieldErrors({});
    setSaveStatus("idle");

    const bodyResult = buildPatchBookingPoliciesBody({
      draft,
      snapshot,
    });

    if ("error" in bodyResult) {
      setSaving(false);
      setFormError(bodyResult.error);
      if (bodyResult.fieldErrors) {
        setFieldErrors(bodyResult.fieldErrors);
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
      setFormError(result.error ?? "Failed to save booking policies.");
      return;
    }

    const nextSnapshot = applyPatchResultToSnapshot(snapshot, result.data);
    onSnapshotChange(nextSnapshot);
    setDraft(draftFromRuntime(result.data.booking));
    setSaving(false);
    setSaveStatus("success");
  };

  return (
    <ReportsSection
      id="settings-booking-runtime"
      title="Booking runtime policies"
      description="Adjust quote freshness and price tolerance at runtime. Only these two values can be saved here; other policies remain deployment-managed."
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <RuntimePolicyField
            label="Quote max age"
            unit="seconds"
            envHint="BOOKING_QUOTE_MAX_AGE_SECONDS"
            effectiveDisplay={formatSeconds(runtime.quoteMaxAgeSeconds.value)}
            sourceLabel={formatRuntimeSource(runtime.quoteMaxAgeSeconds.source)}
            version={runtime.quoteMaxAgeSeconds.version}
            restartRequired={runtime.quoteMaxAgeSeconds.restartRequired}
            inputId="booking-quote-max-age"
            value={draft.quoteMaxAgeSeconds}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, quoteMaxAgeSeconds: value }))
            }
            error={fieldErrors.quoteMaxAgeSeconds}
            disabled={saving}
            invalidOverrideMessage={invalidOverrideWarning(runtime.quoteMaxAgeSeconds)}
          />
          <RuntimePolicyField
            label="Price tolerance"
            unit="percent"
            envHint="BOOKING_PRICE_TOLERANCE_PERCENT"
            effectiveDisplay={formatPercent(runtime.priceTolerancePercent.value)}
            sourceLabel={formatRuntimeSource(runtime.priceTolerancePercent.source)}
            version={runtime.priceTolerancePercent.version}
            restartRequired={runtime.priceTolerancePercent.restartRequired}
            inputId="booking-price-tolerance"
            value={draft.priceTolerancePercent}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, priceTolerancePercent: value }))
            }
            error={fieldErrors.priceTolerancePercent}
            disabled={saving}
            invalidOverrideMessage={invalidOverrideWarning(
              runtime.priceTolerancePercent,
            )}
          />
        </div>

        {formError ? (
          <AdminCallout variant="warning" title="Could not save">
            {formError}
          </AdminCallout>
        ) : null}

        {saveStatus === "success" ? (
          <AdminCallout variant="success" title="Saved">
            Booking policies were updated from the server response. Database overrides
            take effect on the next booking confirmation without a restart.
          </AdminCallout>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save booking policies"}
          </Button>
          <p className="text-caption text-muted-foreground">
            Saves only changed fields with optimistic versioning ( v
            {runtime.quoteMaxAgeSeconds.version} / v
            {runtime.priceTolerancePercent.version}
            ).
          </p>
        </div>
      </form>
    </ReportsSection>
  );
}
