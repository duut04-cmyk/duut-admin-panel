"use client";

import { useState } from "react";
import type { ProviderDetail, ProviderStatus } from "@/data/providerTypes";
import Button from "@/common/components/Button";
import Modal from "@/common/components/Modal";
import AdminCallout from "@/ui/AdminCallout";
import AdminStatus from "@/ui/AdminStatus";
import { updateProviderStatus } from "../api";
import {
  buildStatusUpdateBody,
  describeStatusTransitionImpact,
  listSelectableStatusTargets,
  sanitizeStatusUpdateError,
  statusChangeRequiresConfirmation,
} from "../providerStatusValidation";
import {
  integrationStatusLabel,
  integrationStatusVariant,
  providerStatusLabel,
  providerStatusVariant,
} from "./utils";

type ProviderStatusSectionProps = {
  provider: ProviderDetail;
  onProviderUpdated: (provider: ProviderDetail) => void;
};

function ConfirmStatusChangeModal({
  open,
  onClose,
  onConfirm,
  confirming,
  provider,
  targetStatus,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirming: boolean;
  provider: ProviderDetail;
  targetStatus: ProviderStatus;
}) {
  const impact = describeStatusTransitionImpact(targetStatus, provider.status);

  return (
    <Modal open={open} onClose={onClose} title="Change provider lifecycle status?">
      <p className="text-small text-muted-foreground">
        This updates the registry lifecycle status for <strong>{provider.name}</strong>{" "}
        ({provider.code}). Changes apply after the server confirms the update.
      </p>
      <ul className="mt-4 space-y-2 text-small">
        <li>
          <strong>From:</strong> {providerStatusLabel(provider.status)} (enabled:{" "}
          {provider.enabled ? "Yes" : "No"})
        </li>
        <li>
          <strong>To:</strong> {providerStatusLabel(targetStatus)}
        </li>
      </ul>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-caption text-muted-foreground">
        {impact.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={confirming}
        >
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} disabled={confirming}>
          {confirming ? "Updating…" : "Confirm change"}
        </Button>
      </div>
    </Modal>
  );
}

export default function ProviderStatusSection({
  provider,
  onProviderUpdated,
}: ProviderStatusSectionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<ProviderStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const targets = listSelectableStatusTargets(provider.status);

  const openConfirm = (target: ProviderStatus) => {
    if (saving) return;
    if (!statusChangeRequiresConfirmation(provider.status, target)) return;
    setFormError(null);
    setSaveStatus("idle");
    setPendingTarget(target);
    setConfirmOpen(true);
  };

  const submitStatusChange = async (target: ProviderStatus) => {
    if (saving) return;
    setSaving(true);
    setFormError(null);
    setSaveStatus("idle");

    const body = buildStatusUpdateBody(target);
    const result = await updateProviderStatus(provider.id, body);

    setSaving(false);
    setConfirmOpen(false);
    setPendingTarget(null);

    if (!result.success || !result.data) {
      setSaveStatus("error");
      setFormError(sanitizeStatusUpdateError(result.error));
      return;
    }

    onProviderUpdated(result.data);
    setSaveStatus("success");
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <h2 className="text-subheading font-semibold leading-snug text-foreground">
          Lifecycle status
        </h2>
        <p className="mt-1 text-small text-muted-foreground">
          Registry status (Active, Inactive, Suspended). Separate from configuration
          toggles and connection diagnostics. Suspended applies enabled=false for safe
          suspension.
        </p>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {saveStatus === "success" ? (
          <AdminCallout variant="success" title="Status updated" className="mb-4">
            Current status: {providerStatusLabel(provider.status)}. Enabled:{" "}
            {provider.enabled ? "Yes" : "No"}. Integration:{" "}
            {integrationStatusLabel(provider.integrationStatus)} (from server).
          </AdminCallout>
        ) : null}

        {formError && saveStatus === "error" ? (
          <AdminCallout
            variant="warning"
            title="Could not update status"
            className="mb-4"
          >
            {formError}
            {pendingTarget == null && targets.length > 0 ? (
              <Button
                type="button"
                className="mt-3"
                variant="secondary"
                disabled={saving}
                onClick={() => setSaveStatus("idle")}
              >
                Dismiss
              </Button>
            ) : null}
          </AdminCallout>
        ) : null}

        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-caption font-medium text-muted-foreground">
              Current status
            </dt>
            <dd className="mt-1">
              <AdminStatus
                variant={providerStatusVariant(provider.status)}
                label={providerStatusLabel(provider.status)}
              />
            </dd>
          </div>
          <div>
            <dt className="text-caption font-medium text-muted-foreground">
              Enabled flag
            </dt>
            <dd className="mt-1 text-small">{provider.enabled ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-caption font-medium text-muted-foreground">
              Integration status
            </dt>
            <dd className="mt-1">
              <AdminStatus
                variant={integrationStatusVariant(provider.integrationStatus)}
                label={integrationStatusLabel(provider.integrationStatus)}
              />
            </dd>
          </div>
        </dl>

        {targets.length === 0 ? (
          <p className="mt-4 text-small text-muted-foreground">
            No other lifecycle statuses are available to select.
          </p>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3">
            {targets.map((target) => (
              <Button
                key={target}
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={() => openConfirm(target)}
              >
                Set {providerStatusLabel(target)}
              </Button>
            ))}
          </div>
        )}
      </div>

      {pendingTarget ? (
        <ConfirmStatusChangeModal
          open={confirmOpen}
          onClose={() => {
            if (saving) return;
            setConfirmOpen(false);
            setPendingTarget(null);
          }}
          onConfirm={() => {
            if (!pendingTarget) return;
            void submitStatusChange(pendingTarget);
          }}
          confirming={saving}
          provider={provider}
          targetStatus={pendingTarget}
        />
      ) : null}
    </section>
  );
}
