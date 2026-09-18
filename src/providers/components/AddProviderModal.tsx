"use client";

import { useState, type FormEvent } from "react";
import Button from "@/common/components/Button";
import Checkbox from "@/common/components/Checkbox";
import Input from "@/common/components/Input";
import Modal from "@/common/components/Modal";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import type { CreateProviderInput, ProviderEnvironment } from "@/data/providerTypes";

type AddProviderModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    input: CreateProviderInput,
  ) => Promise<{ success: boolean; error?: string }>;
};

const environmentOptions = [
  { value: "SANDBOX", label: "Sandbox" },
  { value: "LIVE", label: "Live" },
];

const initialForm = {
  code: "",
  name: "",
  displayName: "",
  description: "",
  environment: "SANDBOX" as ProviderEnvironment,
  enabled: false,
  orchestrationEnabled: false,
};

export default function AddProviderModal({
  open,
  onClose,
  onSubmit,
}: AddProviderModalProps) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetAndClose = () => {
    setForm(initialForm);
    setError(null);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const input: CreateProviderInput = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      displayName: form.displayName.trim() || null,
      description: form.description.trim() || null,
      environment: form.environment,
      enabled: form.enabled,
      orchestrationEnabled: form.orchestrationEnabled,
    };

    const result = await onSubmit(input);

    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Failed to create provider.");
      return;
    }

    resetAndClose();
  };

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Add provider"
      className="max-w-[480px]"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="provider-code"
            className="mb-1.5 block text-small font-medium"
          >
            Code
          </label>
          <Input
            id="provider-code"
            value={form.code}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                code: event.target.value.toUpperCase(),
              }))
            }
            placeholder="BORZO"
            required
            autoComplete="off"
          />
          <p className="mt-1 text-caption text-muted-foreground">
            Uppercase letters, numbers, and underscores.
          </p>
        </div>

        <div>
          <label
            htmlFor="provider-name"
            className="mb-1.5 block text-small font-medium"
          >
            Name
          </label>
          <Input
            id="provider-name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Borzo"
            required
          />
        </div>

        <div>
          <label
            htmlFor="provider-display-name"
            className="mb-1.5 block text-small font-medium"
          >
            Display name
          </label>
          <Input
            id="provider-display-name"
            value={form.displayName}
            onChange={(event) =>
              setForm((current) => ({ ...current, displayName: event.target.value }))
            }
            placeholder="Optional customer-facing name"
          />
        </div>

        <div>
          <label
            htmlFor="provider-description"
            className="mb-1.5 block text-small font-medium"
          >
            Description
          </label>
          <textarea
            id="provider-description"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            rows={3}
            placeholder="Optional description"
            className="w-full rounded-control border border-border bg-background px-4 py-3 text-body text-foreground placeholder:text-muted-foreground transition-colors hover:border-foreground/25 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        </div>

        <AdminCustomSelect
          label="Environment"
          value={form.environment}
          options={environmentOptions}
          onChange={(environment) =>
            setForm((current) => ({
              ...current,
              environment: environment as ProviderEnvironment,
            }))
          }
        />

        <div className="space-y-3 rounded-control border border-border/60 bg-surface/30 p-4">
          <Checkbox
            label="Enable provider"
            checked={form.enabled}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                enabled: event.target.checked,
                orchestrationEnabled: event.target.checked
                  ? current.orchestrationEnabled
                  : false,
              }))
            }
          />
          <Checkbox
            label="Enable orchestration"
            checked={form.orchestrationEnabled}
            disabled={!form.enabled}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                orchestrationEnabled: event.target.checked,
              }))
            }
          />
        </div>

        {error ? (
          <p className="text-small text-admin-danger" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={resetAndClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create provider"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
