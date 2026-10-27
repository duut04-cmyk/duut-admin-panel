"use client";

import { useCallback, useState, type FormEvent } from "react";
import type { ProviderService, ProviderServiceType } from "@/data/providerTypes";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/components/Modal";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import AdminCallout from "@/ui/AdminCallout";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import AdminToggle from "@/ui/AdminToggle";
import {
  createProviderService,
  fetchProviderServices,
  updateProviderService,
} from "../api";
import {
  mapServiceConflictError,
  PROVIDER_SERVICE_TYPE_VALUES,
  validateCreateServiceForm,
  validateUpdateServiceForm,
  type ServiceFormFieldErrors,
} from "../providerServiceValidation";
import { formatBoolean } from "./detailFormatting";

type ProviderServicesSectionProps = {
  providerId: string;
  onServicesChange?: (services: ProviderService[]) => void;
};

const serviceTypeOptions = PROVIDER_SERVICE_TYPE_VALUES.map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

type ServiceFormState = {
  code: string;
  name: string;
  serviceType: ProviderServiceType;
  description: string;
  priority: string;
  enabled: boolean;
};

function emptyCreateForm(): ServiceFormState {
  return {
    code: "",
    name: "",
    serviceType: PROVIDER_SERVICE_TYPE_VALUES[0],
    description: "",
    priority: "100",
    enabled: true,
  };
}

function editFormFromService(service: ProviderService) {
  return {
    name: service.name,
    serviceType: service.serviceType,
    description: service.description ?? "",
    priority: String(service.priority),
    enabled: service.enabled,
  };
}

export default function ProviderServicesSection({
  providerId,
  onServicesChange,
}: ProviderServicesSectionProps) {
  const [services, setServices] = useState<ProviderService[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [createFieldErrors, setCreateFieldErrors] = useState<ServiceFormFieldErrors>(
    {},
  );
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [editTarget, setEditTarget] = useState<ProviderService | null>(null);
  const [editForm, setEditForm] = useState(() =>
    editFormFromService({
      id: "",
      code: "",
      name: "",
      serviceType: "BIKE",
      description: null,
      enabled: true,
      priority: 0,
      createdAt: "",
      updatedAt: "",
    }),
  );
  const [editFieldErrors, setEditFieldErrors] = useState<ServiceFormFieldErrors>({});
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const applyServices = useCallback(
    (next: ProviderService[]) => {
      setServices(next);
      onServicesChange?.(next);
    },
    [onServicesChange],
  );

  const loadServices = useCallback(
    async (isStale: () => boolean = () => false) => {
      setLoading(true);
      setLoadError(null);

      const result = await fetchProviderServices(providerId);

      if (isStale()) return;

      setLoading(false);

      if (!result.success || !result.data) {
        applyServices([]);
        setLoadError(result.error ?? "Failed to load provider services.");
        return;
      }

      applyServices(result.data);
    },
    [applyServices, providerId],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadServices(isStale);
    },
    [loadServices],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadServices();
  });

  const openCreate = () => {
    setCreateForm(emptyCreateForm());
    setCreateFieldErrors({});
    setCreateError(null);
    setCreateOpen(true);
  };

  const openEdit = (service: ProviderService) => {
    setEditTarget(service);
    setEditForm(editFormFromService(service));
    setEditFieldErrors({});
    setEditError(null);
    setSaveSuccess(null);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creating) return;

    setCreateError(null);
    setCreateFieldErrors({});

    const validated = validateCreateServiceForm({
      code: createForm.code,
      name: createForm.name,
      serviceType: createForm.serviceType,
      description: createForm.description,
      priority: createForm.priority,
    });

    if ("fieldErrors" in validated) {
      setCreateFieldErrors(validated.fieldErrors);
      setCreateError(validated.error);
      return;
    }

    setCreating(true);
    const result = await createProviderService(providerId, {
      ...validated.body,
      enabled: createForm.enabled,
    });
    setCreating(false);

    if (!result.success || !result.data) {
      setCreateError(mapServiceConflictError(result.error));
      return;
    }

    setCreateOpen(false);
    setSaveSuccess(`Service “${result.data.code}” created.`);
    await loadServices();
  };

  const handleEditSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editTarget || savingEdit) return;

    setEditError(null);
    setEditFieldErrors({});

    const validated = validateUpdateServiceForm({
      name: editForm.name,
      serviceType: editForm.serviceType,
      description: editForm.description,
      priority: editForm.priority,
      enabled: editForm.enabled,
    });

    if ("fieldErrors" in validated) {
      setEditFieldErrors(validated.fieldErrors);
      setEditError(validated.error);
      return;
    }

    setSavingEdit(true);
    const result = await updateProviderService(
      providerId,
      editTarget.id,
      validated.body,
    );
    setSavingEdit(false);

    if (!result.success || !result.data) {
      setEditError(result.error ?? "Failed to update service.");
      return;
    }

    setEditTarget(null);
    setSaveSuccess(`Service “${result.data.code}” updated.`);
    await loadServices();
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <div>
          <h2 className="text-subheading font-semibold leading-snug text-foreground">
            Services
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Service codes offered by this provider. Create and edit only; removal is not
            exposed by the admin API.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={openCreate}
          disabled={loading || !!loadError}
        >
          Add service
        </Button>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {saveSuccess ? (
          <AdminCallout variant="success" title="Saved" className="mb-4">
            {saveSuccess}
          </AdminCallout>
        ) : null}

        {loading ? (
          <p className="text-small text-muted-foreground">Loading services…</p>
        ) : loadError ? (
          <AdminLoadErrorCallout
            title="Unable to load services"
            onRetry={() => void retryLoad()}
            retrying={retrying}
          >
            {loadError}
          </AdminLoadErrorCallout>
        ) : services.length === 0 ? (
          <p className="text-small text-muted-foreground">No services configured.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-small">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Code
                  </th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Type
                  </th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Enabled
                  </th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Priority
                  </th>
                  <th className="py-2 font-semibold text-muted-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-3 pr-4 font-mono text-caption">{service.code}</td>
                    <td className="py-3 pr-4">{service.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {service.serviceType}
                    </td>
                    <td className="py-3 pr-4">{formatBoolean(service.enabled)}</td>
                    <td className="py-3 pr-4 tabular-nums">{service.priority}</td>
                    <td className="py-3 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => openEdit(service)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={() => !creating && setCreateOpen(false)}
        title="Add service"
      >
        {createError ? (
          <AdminCallout variant="warning" title="Could not create" className="mb-4">
            {createError}
          </AdminCallout>
        ) : null}
        <form onSubmit={(event) => void handleCreate(event)} className="space-y-4">
          <div>
            <label
              htmlFor="service-code"
              className="mb-1.5 block text-small font-medium"
            >
              Code
            </label>
            <Input
              id="service-code"
              value={createForm.code}
              onChange={(event) =>
                setCreateForm((c) => ({ ...c, code: event.target.value }))
              }
              error={!!createFieldErrors.code}
              autoComplete="off"
            />
            {createFieldErrors.code ? (
              <p className="mt-1 text-caption text-muted-foreground">
                {createFieldErrors.code}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="service-name"
              className="mb-1.5 block text-small font-medium"
            >
              Name
            </label>
            <Input
              id="service-name"
              value={createForm.name}
              onChange={(event) =>
                setCreateForm((c) => ({ ...c, name: event.target.value }))
              }
              error={!!createFieldErrors.name}
            />
            {createFieldErrors.name ? (
              <p className="mt-1 text-caption text-muted-foreground">
                {createFieldErrors.name}
              </p>
            ) : null}
          </div>
          <div>
            <label className="mb-1.5 block text-small font-medium">Service type</label>
            <AdminCustomSelect
              value={createForm.serviceType}
              options={serviceTypeOptions}
              onChange={(value) =>
                setCreateForm((c) => ({
                  ...c,
                  serviceType: value as ProviderServiceType,
                }))
              }
            />
            {createFieldErrors.serviceType ? (
              <p className="mt-1 text-caption text-muted-foreground">
                {createFieldErrors.serviceType}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="service-description"
              className="mb-1.5 block text-small font-medium"
            >
              Description
            </label>
            <Input
              id="service-description"
              value={createForm.description}
              onChange={(event) =>
                setCreateForm((c) => ({ ...c, description: event.target.value }))
              }
              error={!!createFieldErrors.description}
            />
            {createFieldErrors.description ? (
              <p className="mt-1 text-caption text-muted-foreground">
                {createFieldErrors.description}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="service-priority"
              className="mb-1.5 block text-small font-medium"
            >
              Priority
            </label>
            <Input
              id="service-priority"
              inputMode="numeric"
              value={createForm.priority}
              onChange={(event) =>
                setCreateForm((c) => ({ ...c, priority: event.target.value }))
              }
              error={!!createFieldErrors.priority}
            />
            {createFieldErrors.priority ? (
              <p className="mt-1 text-caption text-muted-foreground">
                {createFieldErrors.priority}
              </p>
            ) : null}
          </div>
          <AdminToggle
            label="Enabled"
            checked={createForm.enabled}
            onCheckedChange={(enabled) => setCreateForm((c) => ({ ...c, enabled }))}
          />
          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create service"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={editTarget != null}
        onClose={() => !savingEdit && setEditTarget(null)}
        title={editTarget ? `Edit ${editTarget.code}` : "Edit service"}
      >
        {editError ? (
          <AdminCallout variant="warning" title="Could not save" className="mb-4">
            {editError}
          </AdminCallout>
        ) : null}
        {editTarget ? (
          <form onSubmit={(event) => void handleEditSave(event)} className="space-y-4">
            <p className="text-small text-muted-foreground">
              Code <span className="font-mono text-caption">{editTarget.code}</span>{" "}
              cannot be changed after creation.
            </p>
            <div>
              <label
                htmlFor="edit-service-name"
                className="mb-1.5 block text-small font-medium"
              >
                Name
              </label>
              <Input
                id="edit-service-name"
                value={editForm.name}
                onChange={(event) =>
                  setEditForm((c) => ({ ...c, name: event.target.value }))
                }
                error={!!editFieldErrors.name}
              />
              {editFieldErrors.name ? (
                <p className="mt-1 text-caption text-muted-foreground">
                  {editFieldErrors.name}
                </p>
              ) : null}
            </div>
            <div>
              <label className="mb-1.5 block text-small font-medium">
                Service type
              </label>
              <AdminCustomSelect
                value={editForm.serviceType}
                options={serviceTypeOptions}
                onChange={(value) =>
                  setEditForm((c) => ({
                    ...c,
                    serviceType: value as ProviderServiceType,
                  }))
                }
              />
              {editFieldErrors.serviceType ? (
                <p className="mt-1 text-caption text-muted-foreground">
                  {editFieldErrors.serviceType}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="edit-service-description"
                className="mb-1.5 block text-small font-medium"
              >
                Description
              </label>
              <Input
                id="edit-service-description"
                value={editForm.description}
                onChange={(event) =>
                  setEditForm((c) => ({ ...c, description: event.target.value }))
                }
                error={!!editFieldErrors.description}
              />
              {editFieldErrors.description ? (
                <p className="mt-1 text-caption text-muted-foreground">
                  {editFieldErrors.description}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="edit-service-priority"
                className="mb-1.5 block text-small font-medium"
              >
                Priority
              </label>
              <Input
                id="edit-service-priority"
                inputMode="numeric"
                value={editForm.priority}
                onChange={(event) =>
                  setEditForm((c) => ({ ...c, priority: event.target.value }))
                }
                error={!!editFieldErrors.priority}
              />
              {editFieldErrors.priority ? (
                <p className="mt-1 text-caption text-muted-foreground">
                  {editFieldErrors.priority}
                </p>
              ) : null}
            </div>
            <AdminToggle
              label="Enabled"
              checked={editForm.enabled}
              onCheckedChange={(enabled) => setEditForm((c) => ({ ...c, enabled }))}
            />
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditTarget(null)}
                disabled={savingEdit}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={savingEdit}>
                {savingEdit ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </section>
  );
}
