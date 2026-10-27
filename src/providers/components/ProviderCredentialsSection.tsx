"use client";

import { useState, type FormEvent } from "react";
import type {
  ProviderDetail,
  UpsertProviderCredentialsInput,
} from "@/data/providerTypes";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/components/Modal";
import AdminCallout from "@/ui/AdminCallout";
import AdminStatus from "@/ui/AdminStatus";
import { fetchProvider, upsertProviderCredentials } from "../api";
import {
  buildCredentialsPutBody,
  credentialFieldUsesPasswordInput,
  credentialFieldsBeingRotated,
  emptyCredentialFormValues,
  formatCredentialFieldLabel,
  PROVIDER_CREDENTIAL_FIELD_VALUES,
  sanitizeCredentialSaveError,
  type CredentialFormFieldErrors,
  type CredentialFormValues,
} from "../providerCredentialValidation";
import { formatBoolean } from "./detailFormatting";
import { integrationStatusLabel } from "./utils";

type ProviderCredentialsSectionProps = {
  provider: ProviderDetail;
  onProviderUpdated: (provider: ProviderDetail) => void;
};

function ConfirmRotationModal({
  open,
  onClose,
  onConfirm,
  confirming,
  fields,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirming: boolean;
  fields: string[];
}) {
  return (
    <Modal open={open} onClose={onClose} title="Replace stored credentials?">
      <p className="text-small text-muted-foreground">
        The following fields already have stored values. Saving will replace them with
        the new values you entered. Previous values cannot be recovered.
      </p>
      <ul className="mt-4 list-inside list-disc text-small">
        {fields.map((field) => (
          <li key={field} className="font-mono text-caption">
            {field}
          </li>
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
          {confirming ? "Saving…" : "Confirm and save"}
        </Button>
      </div>
    </Modal>
  );
}

export default function ProviderCredentialsSection({
  provider,
  onProviderUpdated,
}: ProviderCredentialsSectionProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CredentialFormValues>(() =>
    emptyCredentialFormValues(),
  );
  const [fieldErrors, setFieldErrors] = useState<CredentialFormFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingBody, setPendingBody] = useState<UpsertProviderCredentialsInput | null>(
    null,
  );
  const [rotationFields, setRotationFields] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const metadata = provider.credentials;

  const clearSensitiveState = () => {
    setForm(emptyCredentialFormValues());
    setFieldErrors({});
    setPendingBody(null);
    setRotationFields([]);
  };

  const startEditing = () => {
    clearSensitiveState();
    setFormError(null);
    setSaveStatus("idle");
    setEditing(true);
  };

  const handleCancel = () => {
    clearSensitiveState();
    setFormError(null);
    setSaveStatus("idle");
    setConfirmOpen(false);
    setEditing(false);
  };

  const submitCredentials = async (body: UpsertProviderCredentialsInput) => {
    if (saving) return;
    setSaving(true);
    setFormError(null);
    setSaveStatus("idle");

    const result = await upsertProviderCredentials(provider.id, body);

    if (!result.success || !result.data) {
      setSaving(false);
      setSaveStatus("error");
      setFormError(sanitizeCredentialSaveError(result.error));
      setConfirmOpen(false);
      return;
    }

    const refreshed = await fetchProvider(provider.id);
    setConfirmOpen(false);
    setPendingBody(null);
    setRotationFields([]);
    setSaving(false);

    if (!refreshed.success || !refreshed.data) {
      setSaveStatus("error");
      setFormError(
        sanitizeCredentialSaveError(
          refreshed.error ??
            "Credentials were saved but metadata could not be refreshed.",
        ),
      );
      return;
    }

    onProviderUpdated(refreshed.data);
    clearSensitiveState();
    setEditing(false);
    setSaveStatus("success");
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setFieldErrors({});
    setFormError(null);
    setSaveStatus("idle");

    const built = buildCredentialsPutBody(form);
    if ("fieldErrors" in built) {
      setFieldErrors(built.fieldErrors);
      setFormError(built.error);
      setSaveStatus("error");
      return;
    }

    const rotating = credentialFieldsBeingRotated(built.body, metadata);
    if (rotating.length > 0) {
      setPendingBody(built.body);
      setRotationFields(rotating);
      setConfirmOpen(true);
      return;
    }

    void submitCredentials(built.body);
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <div>
          <h2 className="text-subheading font-semibold leading-snug text-foreground">
            Credentials
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Write-only secret storage. Saved values are encrypted and cannot be viewed
            again. Only fields you enter are updated; omitted fields keep their stored
            values. Saving does not validate credentials against the provider.
          </p>
        </div>
        {!editing ? (
          <Button type="button" variant="secondary" onClick={startEditing}>
            Update credentials
          </Button>
        ) : null}
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {saveStatus === "success" ? (
          <AdminCallout variant="success" title="Saved" className="mb-4">
            Credential metadata updated. Integration status:{" "}
            {integrationStatusLabel(provider.integrationStatus)} (from server).
          </AdminCallout>
        ) : null}

        {formError && saveStatus === "error" ? (
          <AdminCallout variant="warning" title="Could not save" className="mb-4">
            {formError}
          </AdminCallout>
        ) : null}

        <dl className="mb-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-caption font-medium text-muted-foreground">
              Configured
            </dt>
            <dd className="mt-1 text-small">{formatBoolean(metadata.configured)}</dd>
          </div>
        </dl>

        {metadata.fields.length === 0 ? (
          <p className="text-small text-muted-foreground">
            No credential fields tracked.
          </p>
        ) : (
          <ul className="space-y-2">
            {metadata.fields.map((field) => (
              <li
                key={field.name}
                className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2 text-small"
              >
                <span className="font-mono text-caption">{field.name}</span>
                <AdminStatus
                  variant={field.configured ? "success" : "pending"}
                  label={field.configured ? "Configured" : "Not set"}
                />
              </li>
            ))}
          </ul>
        )}

        {editing ? (
          <form
            onSubmit={handleSave}
            className="mt-6 space-y-4 border-t border-border pt-6"
          >
            <p className="text-caption text-muted-foreground">
              Leave a field blank to keep its current stored value unchanged.
            </p>
            <ul className="space-y-4">
              {PROVIDER_CREDENTIAL_FIELD_VALUES.map((field) => (
                <li key={field}>
                  <label
                    htmlFor={`provider-credential-${field}`}
                    className="mb-1.5 block text-small font-medium text-foreground"
                  >
                    {formatCredentialFieldLabel(field)}
                    <span className="ml-2 font-normal text-muted-foreground">
                      ({field})
                    </span>
                  </label>
                  <Input
                    id={`provider-credential-${field}`}
                    type={credentialFieldUsesPasswordInput(field) ? "password" : "text"}
                    value={form[field]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    error={!!fieldErrors[field]}
                    autoComplete="off"
                    spellCheck={false}
                    data-1p-ignore
                  />
                  {fieldErrors[field] ? (
                    <p className="mt-1 text-caption text-muted-foreground">
                      {fieldErrors[field]}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save credentials"}
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
        ) : null}
      </div>

      <ConfirmRotationModal
        open={confirmOpen}
        onClose={() => {
          if (saving) return;
          setConfirmOpen(false);
          setPendingBody(null);
          setRotationFields([]);
        }}
        onConfirm={() => {
          if (!pendingBody || saving) return;
          void submitCredentials(pendingBody);
        }}
        confirming={saving}
        fields={rotationFields}
      />
    </section>
  );
}
