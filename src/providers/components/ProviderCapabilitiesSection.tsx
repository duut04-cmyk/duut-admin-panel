"use client";

import { useState, type FormEvent } from "react";
import type { ProviderCapability, ProviderDetail } from "@/data/providerTypes";
import Button from "@/common/components/Button";
import Checkbox from "@/common/components/Checkbox";
import Modal from "@/common/components/Modal";
import AdminCallout from "@/ui/AdminCallout";
import { replaceProviderCapabilities } from "../api";
import {
  buildReplaceCapabilitiesBody,
  capabilitiesSelectionChanged,
  draftCapabilitiesFromDetail,
  ORCHESTRATION_RELATED_CAPABILITIES,
  PROVIDER_CAPABILITY_VALUES,
  toggleCapabilityInDraft,
} from "../providerCapabilities";
import { formatCapabilityLabel } from "./detailFormatting";
import { integrationStatusLabel } from "./utils";

type ProviderCapabilitiesSectionProps = {
  provider: ProviderDetail;
  onProviderUpdated: (provider: ProviderDetail) => void;
};

function ConfirmCapabilitiesModal({
  open,
  onClose,
  onConfirm,
  confirming,
  draft,
  server,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirming: boolean;
  draft: ProviderCapability[];
  server: ProviderCapability[];
}) {
  const removed = server.filter((item) => !draft.includes(item));
  const added = draft.filter((item) => !server.includes(item));
  const affectsOrchestration =
    removed.some((item) => ORCHESTRATION_RELATED_CAPABILITIES.includes(item)) ||
    added.some((item) => ORCHESTRATION_RELATED_CAPABILITIES.includes(item));

  return (
    <Modal open={open} onClose={onClose} title="Replace provider capabilities">
      <p className="text-small text-muted-foreground">
        Capabilities are replaced as a complete set. Integration status and
        orchestration eligibility will update from the server response after save.
      </p>
      {affectsOrchestration ? (
        <p className="mt-3 text-small text-foreground">
          This change includes orchestration-related capabilities (serviceability,
          pricing, booking, and similar). Provider readiness and orchestration
          participation may change.
        </p>
      ) : null}
      {(added.length > 0 || removed.length > 0) && (
        <ul className="mt-4 space-y-2 text-small">
          {added.length > 0 ? (
            <li>
              <strong>Adding:</strong> {added.map(formatCapabilityLabel).join(", ")}
            </li>
          ) : null}
          {removed.length > 0 ? (
            <li>
              <strong>Removing:</strong> {removed.map(formatCapabilityLabel).join(", ")}
            </li>
          ) : null}
        </ul>
      )}
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

export default function ProviderCapabilitiesSection({
  provider,
  onProviderUpdated,
}: ProviderCapabilitiesSectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProviderCapability[]>(() =>
    draftCapabilitiesFromDetail(provider.capabilities),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const serverCapabilities = draftCapabilitiesFromDetail(provider.capabilities);

  const startEditing = () => {
    setDraft(serverCapabilities);
    setFormError(null);
    setSaveStatus("idle");
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(serverCapabilities);
    setFormError(null);
    setSaveStatus("idle");
    setEditing(false);
  };

  const submitCapabilities = async (capabilities: ProviderCapability[]) => {
    if (saving) return;
    setSaving(true);
    setFormError(null);
    setSaveStatus("idle");

    let body;
    try {
      body = buildReplaceCapabilitiesBody(capabilities);
    } catch (error) {
      setSaving(false);
      setConfirmOpen(false);
      setSaveStatus("error");
      setFormError(
        error instanceof Error ? error.message : "Invalid capability selection.",
      );
      return;
    }

    const result = await replaceProviderCapabilities(provider.id, body.capabilities);

    setSaving(false);
    setConfirmOpen(false);

    if (!result.success || !result.data) {
      setSaveStatus("error");
      setFormError(result.error ?? "Failed to update capabilities.");
      return;
    }

    onProviderUpdated(result.data);
    setDraft(draftCapabilitiesFromDetail(result.data.capabilities));
    setEditing(false);
    setSaveStatus("success");
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setFormError(null);
    setSaveStatus("idle");

    if (!capabilitiesSelectionChanged(draft, serverCapabilities)) {
      setFormError("No changes to save.");
      setSaveStatus("error");
      return;
    }

    setConfirmOpen(true);
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <div>
          <h2 className="text-subheading font-semibold leading-snug text-foreground">
            Capabilities
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Adapter capabilities registered for this provider. Saving replaces the full
            set.
          </p>
        </div>
        {!editing ? (
          <Button type="button" variant="secondary" onClick={startEditing}>
            Edit
          </Button>
        ) : null}
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {saveStatus === "success" ? (
          <AdminCallout variant="success" title="Saved" className="mb-4">
            Capabilities updated. Integration status:{" "}
            {integrationStatusLabel(provider.integrationStatus)}. Orchestration
            eligible: {provider.orchestrationEligible ? "Yes" : "No"} (from server).
          </AdminCallout>
        ) : null}

        {formError && saveStatus === "error" ? (
          <AdminCallout variant="warning" title="Could not save" className="mb-4">
            {formError}
          </AdminCallout>
        ) : null}

        {!editing ? (
          serverCapabilities.length === 0 ? (
            <p className="text-small text-muted-foreground">
              No capabilities configured.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {serverCapabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-md border border-border/60 bg-surface px-2.5 py-1 text-caption font-medium text-foreground"
                >
                  {formatCapabilityLabel(capability)}
                </li>
              ))}
            </ul>
          )
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <fieldset>
              <legend className="sr-only">Provider capabilities</legend>
              <ul className="grid gap-3 sm:grid-cols-2">
                {PROVIDER_CAPABILITY_VALUES.map((capability) => (
                  <li key={capability}>
                    <Checkbox
                      id={`provider-capability-${capability}`}
                      label={formatCapabilityLabel(capability)}
                      checked={draft.includes(capability)}
                      onChange={(event) =>
                        setDraft((current) =>
                          toggleCapabilityInDraft(
                            current,
                            capability,
                            event.target.checked,
                          ),
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            </fieldset>
            {draft.length === 0 ? (
              <p className="text-caption text-muted-foreground">
                No capabilities selected. The backend allows an empty set; integration
                may show as not configured until capabilities are added again.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save capabilities"}
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

      <ConfirmCapabilitiesModal
        open={confirmOpen}
        onClose={() => {
          if (saving) return;
          setConfirmOpen(false);
        }}
        onConfirm={() => void submitCapabilities(draft)}
        confirming={saving}
        draft={draft}
        server={serverCapabilities}
      />
    </section>
  );
}
