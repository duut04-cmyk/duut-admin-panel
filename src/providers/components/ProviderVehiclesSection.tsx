"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import type { ProviderVehicle, ProviderVehicleType } from "@/data/providerTypes";
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
  createProviderVehicle,
  fetchProviderVehicles,
  updateProviderVehicle,
} from "../api";
import {
  mapVehicleConflictError,
  PROVIDER_VEHICLE_TYPE_VALUES,
  validateCreateVehicleForm,
  validateUpdateVehicleForm,
  type VehicleFormFieldErrors,
} from "../providerVehicleValidation";
import { formatBoolean, formatOptionalNumber } from "./detailFormatting";

type ProviderVehiclesSectionProps = {
  providerId: string;
  onVehiclesChange?: (vehicles: ProviderVehicle[]) => void;
};

const vehicleTypeOptions = PROVIDER_VEHICLE_TYPE_VALUES.map((value) => ({
  value,
  label: value,
}));

function limitsFormFromVehicle(vehicle: ProviderVehicle) {
  return {
    enabled: vehicle.enabled,
    maxWeightKg: vehicle.maxWeightKg == null ? "" : String(vehicle.maxWeightKg),
    maxLengthCm: vehicle.maxLengthCm == null ? "" : String(vehicle.maxLengthCm),
    maxWidthCm: vehicle.maxWidthCm == null ? "" : String(vehicle.maxWidthCm),
    maxHeightCm: vehicle.maxHeightCm == null ? "" : String(vehicle.maxHeightCm),
  };
}

function emptyCreateForm(vehicleType: ProviderVehicleType) {
  return {
    vehicleType,
    enabled: true,
    maxWeightKg: "",
    maxLengthCm: "",
    maxWidthCm: "",
    maxHeightCm: "",
  };
}

export default function ProviderVehiclesSection({
  providerId,
  onVehiclesChange,
}: ProviderVehiclesSectionProps) {
  const [vehicles, setVehicles] = useState<ProviderVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(() => emptyCreateForm("BIKE"));
  const [createFieldErrors, setCreateFieldErrors] = useState<VehicleFormFieldErrors>(
    {},
  );
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [editTarget, setEditTarget] = useState<ProviderVehicle | null>(null);
  const [editForm, setEditForm] = useState(() =>
    limitsFormFromVehicle({
      id: "",
      vehicleType: "BIKE",
      enabled: true,
      maxWeightKg: null,
      maxLengthCm: null,
      maxWidthCm: null,
      maxHeightCm: null,
      createdAt: "",
      updatedAt: "",
    }),
  );
  const [editFieldErrors, setEditFieldErrors] = useState<VehicleFormFieldErrors>({});
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const usedVehicleTypes = useMemo(
    () => new Set(vehicles.map((vehicle) => vehicle.vehicleType)),
    [vehicles],
  );

  const availableCreateTypes = useMemo(
    () => PROVIDER_VEHICLE_TYPE_VALUES.filter((type) => !usedVehicleTypes.has(type)),
    [usedVehicleTypes],
  );

  const applyVehicles = useCallback(
    (next: ProviderVehicle[]) => {
      setVehicles(next);
      onVehiclesChange?.(next);
    },
    [onVehiclesChange],
  );

  const loadVehicles = useCallback(
    async (isStale: () => boolean = () => false) => {
      setLoading(true);
      setLoadError(null);

      const result = await fetchProviderVehicles(providerId);

      if (isStale()) return;

      setLoading(false);

      if (!result.success || !result.data) {
        applyVehicles([]);
        setLoadError(result.error ?? "Failed to load provider vehicles.");
        return;
      }

      applyVehicles(result.data);
    },
    [applyVehicles, providerId],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadVehicles(isStale);
    },
    [loadVehicles],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadVehicles();
  });

  const openCreate = () => {
    const defaultType = availableCreateTypes[0] ?? "BIKE";
    setCreateForm(emptyCreateForm(defaultType));
    setCreateFieldErrors({});
    setCreateError(null);
    setCreateOpen(true);
  };

  const openEdit = (vehicle: ProviderVehicle) => {
    setEditTarget(vehicle);
    setEditForm(limitsFormFromVehicle(vehicle));
    setEditFieldErrors({});
    setEditError(null);
    setSaveSuccess(null);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creating) return;

    setCreateError(null);
    setCreateFieldErrors({});

    const validated = validateCreateVehicleForm(createForm);

    if ("fieldErrors" in validated) {
      setCreateFieldErrors(validated.fieldErrors);
      setCreateError(validated.error);
      return;
    }

    setCreating(true);
    const result = await createProviderVehicle(providerId, validated.body);
    setCreating(false);

    if (!result.success || !result.data) {
      setCreateError(mapVehicleConflictError(result.error));
      return;
    }

    setCreateOpen(false);
    setSaveSuccess(`${result.data.vehicleType} vehicle configuration created.`);
    await loadVehicles();
  };

  const handleEditSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editTarget || savingEdit) return;

    setEditError(null);
    setEditFieldErrors({});

    const validated = validateUpdateVehicleForm(editForm);

    if ("fieldErrors" in validated) {
      setEditFieldErrors(validated.fieldErrors);
      setEditError(validated.error);
      return;
    }

    setSavingEdit(true);
    const result = await updateProviderVehicle(
      providerId,
      editTarget.id,
      validated.body,
    );
    setSavingEdit(false);

    if (!result.success || !result.data) {
      setEditError(result.error ?? "Failed to update vehicle.");
      return;
    }

    setEditTarget(null);
    setSaveSuccess(`${result.data.vehicleType} vehicle configuration updated.`);
    await loadVehicles();
  };

  const createTypeOptions = vehicleTypeOptions.filter((option) =>
    availableCreateTypes.includes(option.value as ProviderVehicleType),
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <div>
          <h2 className="text-subheading font-semibold leading-snug text-foreground">
            Vehicles
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Per-vehicle-type capacity limits. Each type can appear once per provider.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={openCreate}
          disabled={loading || !!loadError || availableCreateTypes.length === 0}
        >
          Add vehicle
        </Button>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {saveSuccess ? (
          <AdminCallout variant="success" title="Saved" className="mb-4">
            {saveSuccess}
          </AdminCallout>
        ) : null}

        {loading ? (
          <p className="text-small text-muted-foreground">Loading vehicles…</p>
        ) : loadError ? (
          <AdminLoadErrorCallout
            title="Unable to load vehicles"
            onRetry={() => void retryLoad()}
            retrying={retrying}
          >
            {loadError}
          </AdminLoadErrorCallout>
        ) : vehicles.length === 0 ? (
          <p className="text-small text-muted-foreground">No vehicles configured.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-small">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Type
                  </th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Enabled
                  </th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Max weight
                  </th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">
                    Max dimensions (L×W×H cm)
                  </th>
                  <th className="py-2 font-semibold text-muted-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-3 pr-4">{vehicle.vehicleType}</td>
                    <td className="py-3 pr-4">{formatBoolean(vehicle.enabled)}</td>
                    <td className="py-3 pr-4">
                      {formatOptionalNumber(vehicle.maxWeightKg, "kg")}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {[vehicle.maxLengthCm, vehicle.maxWidthCm, vehicle.maxHeightCm]
                        .map((v) => (v == null ? "—" : String(v)))
                        .join(" × ")}
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => openEdit(vehicle)}
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
        title="Add vehicle"
      >
        {createError ? (
          <AdminCallout variant="warning" title="Could not create" className="mb-4">
            {createError}
          </AdminCallout>
        ) : null}
        <form onSubmit={(event) => void handleCreate(event)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-small font-medium">Vehicle type</label>
            <AdminCustomSelect
              value={createForm.vehicleType}
              options={createTypeOptions}
              onChange={(value) =>
                setCreateForm((c) => ({
                  ...c,
                  vehicleType: value as ProviderVehicleType,
                }))
              }
            />
            {createFieldErrors.vehicleType ? (
              <p className="mt-1 text-caption text-muted-foreground">
                {createFieldErrors.vehicleType}
              </p>
            ) : null}
          </div>
          <LimitFields
            prefix="create"
            values={createForm}
            fieldErrors={createFieldErrors}
            onChange={(patch) => setCreateForm((c) => ({ ...c, ...patch }))}
          />
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
            <Button type="submit" disabled={creating || createTypeOptions.length === 0}>
              {creating ? "Creating…" : "Create vehicle"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={editTarget != null}
        onClose={() => !savingEdit && setEditTarget(null)}
        title={editTarget ? `Edit ${editTarget.vehicleType}` : "Edit vehicle"}
      >
        {editError ? (
          <AdminCallout variant="warning" title="Could not save" className="mb-4">
            {editError}
          </AdminCallout>
        ) : null}
        {editTarget ? (
          <form onSubmit={(event) => void handleEditSave(event)} className="space-y-4">
            <p className="text-small text-muted-foreground">
              Vehicle type <strong>{editTarget.vehicleType}</strong> is fixed after
              creation.
            </p>
            <LimitFields
              prefix="edit"
              values={editForm}
              fieldErrors={editFieldErrors}
              onChange={(patch) => setEditForm((c) => ({ ...c, ...patch }))}
            />
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

function LimitFields({
  prefix,
  values,
  fieldErrors,
  onChange,
}: {
  prefix: string;
  values: {
    maxWeightKg: string;
    maxLengthCm: string;
    maxWidthCm: string;
    maxHeightCm: string;
  };
  fieldErrors: VehicleFormFieldErrors;
  onChange: (patch: Partial<typeof values>) => void;
}) {
  const fields = [
    { key: "maxWeightKg" as const, label: "Max weight (kg)" },
    { key: "maxLengthCm" as const, label: "Max length (cm)" },
    { key: "maxWidthCm" as const, label: "Max width (cm)" },
    { key: "maxHeightCm" as const, label: "Max height (cm)" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label
            htmlFor={`${prefix}-${key}`}
            className="mb-1.5 block text-small font-medium"
          >
            {label}
          </label>
          <Input
            id={`${prefix}-${key}`}
            inputMode="decimal"
            value={values[key]}
            onChange={(event) => onChange({ [key]: event.target.value })}
            error={!!fieldErrors[key]}
            placeholder="Optional"
          />
          {fieldErrors[key] ? (
            <p className="mt-1 text-caption text-muted-foreground">
              {fieldErrors[key]}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
