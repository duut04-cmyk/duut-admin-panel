"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ProviderDetail, UpdateProviderInput } from "@/data/providerTypes";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/components/Modal";
import AdminCallout from "@/ui/AdminCallout";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import AdminStatus from "@/ui/AdminStatus";
import AdminToggle from "@/ui/AdminToggle";
import { updateProvider } from "../api";
import {
  buildProviderUpdatePatch,
  draftFromProvider,
  MAX_PROVIDER_PRIORITY,
  MIN_PROVIDER_PRIORITY,
  operationalFlagsChanged,
  PROVIDER_ENVIRONMENTS,
  type ProviderConfigurationDraft,
  type ProviderConfigurationFieldErrors,
} from "../providerUpdateValidation";
import ProviderEnvironmentBadge from "./ProviderEnvironmentBadge";
import { formatBoolean } from "./detailFormatting";
import {
  integrationStatusLabel,
  integrationStatusVariant,
  providerStatusLabel,
  providerStatusVariant,
} from "./utils";

type ProviderConfigurationSectionProps = {
  provider: ProviderDetail;
  onProviderUpdated: (provider: ProviderDetail) => void;
  mode?: "view" | "edit";
};

const secondaryLinkClassName =
  "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-control border border-border bg-background px-5 text-small font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

const environmentOptions = [
  { value: "SANDBOX", label: "Sandbox" },
  { value: "LIVE", label: "Live" },
];

function ConfirmFlagsModal({
  open,
  onClose,
  onConfirm,
  confirming,
  draft,
  provider,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirming: boolean;
  draft: ProviderConfigurationDraft;
  provider: ProviderDetail;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm operational changes">
      <p className="text-small text-muted-foreground">
        These flags control whether this provider can participate in automatic
        orchestration. Changes apply after the server confirms the update.
      </p>
      <ul className="mt-4 space-y-2 text-small">
        {draft.orchestrationEnabled !== provider.orchestrationEnabled ? (
          <li>
            <strong>Orchestration:</strong>{" "}
            {formatBoolean(provider.orchestrationEnabled)} →{" "}
            {formatBoolean(draft.orchestrationEnabled)}
          </li>
        ) : null}
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
          {confirming ? "Saving…" : "Confirm and save"}
        </Button>
      </div>
    </Modal>
  );
}

export default function ProviderConfigurationSection({
  provider,
  onProviderUpdated,
  mode = "view",
}: ProviderConfigurationSectionProps) {
  const router = useRouter();
  const isEditPage = mode === "edit";
  const [draft, setDraft] = useState<ProviderConfigurationDraft>(() =>
    draftFromProvider(provider),
  );
  const [fieldErrors, setFieldErrors] = useState<ProviderConfigurationFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPatch, setPendingPatch] = useState<UpdateProviderInput | null>(null);

  const handleCancel = () => {
    setDraft(draftFromProvider(provider));
    setFieldErrors({});
    setFormError(null);
    setSaveStatus("idle");
    if (isEditPage) {
      router.push(`/providers/${provider.id}`);
    }
  };

  const submitPatch = async (patch: NonNullable<typeof pendingPatch>) => {
    if (saving) return;
    setSaving(true);
    setFormError(null);
    setSaveStatus("idle");

    const result = await updateProvider(provider.id, patch);

    setSaving(false);
    setConfirmOpen(false);
    setPendingPatch(null);

    if (!result.success || !result.data) {
      setSaveStatus("error");
      setFormError(result.error ?? "Failed to update provider.");
      return;
    }

    onProviderUpdated(result.data);
    setDraft(draftFromProvider(result.data));
    if (isEditPage) {
      router.push(`/providers/${provider.id}`);
      return;
    }
    setSaveStatus("success");
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setFieldErrors({});
    setFormError(null);
    setSaveStatus("idle");

    const built = buildProviderUpdatePatch(draft, provider);
    if ("error" in built) {
      setFormError(built.error);
      if (built.fieldErrors) {
        setFieldErrors(built.fieldErrors);
      }
      setSaveStatus("error");
      return;
    }

    if (operationalFlagsChanged(draft, provider)) {
      setPendingPatch(built.patch);
      setConfirmOpen(true);
      return;
    }

    void submitPatch(built.patch);
  };

  const viewGrid = (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <dt className="text-caption font-medium text-muted-foreground">Display name</dt>
        <dd className="mt-1 text-small text-foreground">
          {provider.displayName ?? "—"}
        </dd>
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <dt className="text-caption font-medium text-muted-foreground">Description</dt>
        <dd className="mt-1 text-small text-foreground">
          {provider.description ?? "—"}
        </dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">Environment</dt>
        <dd className="mt-1">
          <ProviderEnvironmentBadge environment={provider.environment} />
        </dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">Priority</dt>
        <dd className="mt-1 tabular-nums text-small">{provider.priority}</dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">Status</dt>
        <dd className="mt-1">
          <AdminStatus
            variant={providerStatusVariant(provider.status)}
            label={providerStatusLabel(provider.status)}
          />
        </dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">Enabled</dt>
        <dd className="mt-1 text-small">{formatBoolean(provider.enabled)}</dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">
          Orchestration enabled
        </dt>
        <dd className="mt-1 text-small">
          {formatBoolean(provider.orchestrationEnabled)}
        </dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">
          Orchestration eligible
        </dt>
        <dd className="mt-1 text-small">
          {formatBoolean(provider.orchestrationEligible)}
        </dd>
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
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <div>
          <h2 className="text-subheading font-semibold leading-snug text-foreground">
            Configuration and operational flags
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Profile fields and orchestration participation. Activation and lifecycle
            status are managed in the Lifecycle status section.
          </p>
        </div>
        {!isEditPage ? (
          <Link
            href={`/providers/${provider.id}/edit`}
            className={secondaryLinkClassName}
          >
            Edit details
          </Link>
        ) : null}
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {saveStatus === "success" && !isEditPage ? (
          <AdminCallout variant="success" title="Saved" className="mb-4">
            Provider configuration was updated.
          </AdminCallout>
        ) : null}

        {formError && saveStatus === "error" ? (
          <AdminCallout variant="warning" title="Could not save" className="mb-4">
            {formError}
          </AdminCallout>
        ) : null}

        {!isEditPage ? (
          viewGrid
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label
                htmlFor="provider-display-name"
                className="mb-1.5 block text-small font-medium text-foreground"
              >
                Display name
              </label>
              <Input
                id="provider-display-name"
                value={draft.displayName}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    displayName: event.target.value,
                  }))
                }
                error={Boolean(fieldErrors.displayName)}
                autoComplete="off"
              />
              {fieldErrors.displayName ? (
                <p className="mt-1 text-caption text-destructive">
                  {fieldErrors.displayName}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="provider-description"
                className="mb-1.5 block text-small font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="provider-description"
                rows={3}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-small text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              {fieldErrors.description ? (
                <p className="mt-1 text-caption text-destructive">
                  {fieldErrors.description}
                </p>
              ) : null}
            </div>

            <div>
              <span className="mb-1.5 block text-small font-medium text-foreground">
                Environment
              </span>
              <AdminCustomSelect
                value={draft.environment}
                options={environmentOptions}
                onChange={(value) => {
                  if ((PROVIDER_ENVIRONMENTS as readonly string[]).includes(value)) {
                    setDraft((current) => ({
                      ...current,
                      environment: value as ProviderConfigurationDraft["environment"],
                    }));
                  }
                }}
              />
              {fieldErrors.environment ? (
                <p className="mt-1 text-caption text-destructive">
                  {fieldErrors.environment}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="provider-priority"
                className="mb-1.5 block text-small font-medium text-foreground"
              >
                Priority
              </label>
              <Input
                id="provider-priority"
                inputMode="numeric"
                value={draft.priority}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, priority: event.target.value }))
                }
                error={Boolean(fieldErrors.priority)}
              />
              <p className="mt-1 text-caption text-muted-foreground">
                Integer from {MIN_PROVIDER_PRIORITY} to {MAX_PROVIDER_PRIORITY}.
              </p>
              {fieldErrors.priority ? (
                <p className="mt-1 text-caption text-destructive">
                  {fieldErrors.priority}
                </p>
              ) : null}
            </div>

            <div className="space-y-3 rounded-md border border-border/60 p-4">
              <p className="text-small font-medium text-foreground">
                Orchestration participation
              </p>
              <AdminToggle
                checked={draft.orchestrationEnabled}
                label="Orchestration enabled"
                disabled={!provider.enabled || provider.status === "SUSPENDED"}
                onCheckedChange={(orchestrationEnabled) =>
                  setDraft((current) => ({ ...current, orchestrationEnabled }))
                }
              />
              {fieldErrors.orchestrationEnabled ? (
                <p className="text-caption text-destructive">
                  {fieldErrors.orchestrationEnabled}
                </p>
              ) : null}
              {!provider.enabled || provider.status === "SUSPENDED" ? (
                <p className="text-caption text-muted-foreground">
                  Enable the provider in the Lifecycle status section before turning on
                  orchestration.
                </p>
              ) : (
                <p className="text-caption text-muted-foreground">
                  Changing orchestration participation may affect automatic routing. You
                  will be asked to confirm before saving.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      <ConfirmFlagsModal
        open={confirmOpen}
        onClose={() => {
          if (saving) return;
          setConfirmOpen(false);
          setPendingPatch(null);
        }}
        onConfirm={() => {
          if (pendingPatch) {
            void submitPatch(pendingPatch);
          }
        }}
        confirming={saving}
        draft={draft}
        provider={provider}
      />
    </section>
  );
}
