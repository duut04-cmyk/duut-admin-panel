"use client";

import { useMemo } from "react";
import Input from "@/common/components/Input";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import AdminFilterChip from "@/ui/AdminFilterChip";
import AdminFilterToolbar from "@/ui/AdminFilterToolbar";

export type ProviderFilterState = {
  search: string;
  environment: "all" | "SANDBOX" | "LIVE";
  status: "all" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  enabled: "all" | "enabled" | "disabled";
};

export const DEFAULT_PROVIDER_FILTERS: ProviderFilterState = {
  search: "",
  environment: "all",
  status: "all",
  enabled: "all",
};

const environmentOptions = [
  { value: "all", label: "All environments" },
  { value: "SANDBOX", label: "Sandbox" },
  { value: "LIVE", label: "Live" },
];

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

const enabledOptions = [
  { value: "all", label: "All providers" },
  { value: "enabled", label: "Enabled only" },
  { value: "disabled", label: "Disabled only" },
];

type ProviderFiltersProps = {
  filters: ProviderFilterState;
  onChange: (filters: ProviderFilterState) => void;
  resultCount: number;
};

function labelForOption(
  options: { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function countActiveFilters(filters: ProviderFilterState): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.environment !== "all") count += 1;
  if (filters.status !== "all") count += 1;
  if (filters.enabled !== "all") count += 1;
  return count;
}

function countSheetActiveFilters(filters: ProviderFilterState): number {
  let count = 0;
  if (filters.environment !== "all") count += 1;
  if (filters.status !== "all") count += 1;
  if (filters.enabled !== "all") count += 1;
  return count;
}

export default function ProviderFilters({
  filters,
  onChange,
  resultCount,
}: ProviderFiltersProps) {
  const totalActiveCount = countActiveFilters(filters);
  const sheetActiveCount = countSheetActiveFilters(filters);

  const resultSummary = useMemo(() => {
    const noun = resultCount === 1 ? "provider" : "providers";
    return `${resultCount.toLocaleString()} ${noun}`;
  }, [resultCount]);

  const activeFilterChips = (
    <>
      {filters.environment !== "all" ? (
        <AdminFilterChip
          label={labelForOption(environmentOptions, filters.environment)}
          onRemove={() => onChange({ ...filters, environment: "all" })}
        />
      ) : null}
      {filters.status !== "all" ? (
        <AdminFilterChip
          label={labelForOption(statusOptions, filters.status)}
          onRemove={() => onChange({ ...filters, status: "all" })}
        />
      ) : null}
      {filters.enabled !== "all" ? (
        <AdminFilterChip
          label={labelForOption(enabledOptions, filters.enabled)}
          onRemove={() => onChange({ ...filters, enabled: "all" })}
        />
      ) : null}
    </>
  );

  const sheetContent = (
    <div className="space-y-4">
      <AdminCustomSelect
        label="Environment"
        value={filters.environment}
        options={environmentOptions}
        onChange={(environment) =>
          onChange({
            ...filters,
            environment: environment as ProviderFilterState["environment"],
          })
        }
      />
      <AdminCustomSelect
        label="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(status) =>
          onChange({
            ...filters,
            status: status as ProviderFilterState["status"],
          })
        }
      />
      <AdminCustomSelect
        label="Enabled"
        value={filters.enabled}
        options={enabledOptions}
        onChange={(enabled) =>
          onChange({
            ...filters,
            enabled: enabled as ProviderFilterState["enabled"],
          })
        }
      />
    </div>
  );

  return (
    <AdminFilterToolbar
      headingId="provider-filters-heading"
      resultSummary={resultSummary}
      sheetTitle="Provider filters"
      sheetContent={sheetContent}
      sheetActiveCount={sheetActiveCount}
      totalActiveCount={totalActiveCount}
      onClearFilters={() => onChange(DEFAULT_PROVIDER_FILTERS)}
      activeFilterChips={activeFilterChips}
      search={
        <Input
          type="search"
          placeholder="Search by code or name…"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          aria-label="Search providers"
        />
      }
      period={<span className="hidden" aria-hidden="true" />}
    />
  );
}
