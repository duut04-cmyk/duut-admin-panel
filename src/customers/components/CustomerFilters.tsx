"use client";

import { useMemo } from "react";
import Input from "@/common/components/Input";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import AdminFilterChip from "@/ui/AdminFilterChip";
import AdminFilterToolbar from "@/ui/AdminFilterToolbar";

export type CustomerFilterState = {
  search: string;
  status: "all" | "ACTIVE" | "SUSPENDED";
  emailVerified: "all" | "verified" | "unverified";
};

export const DEFAULT_CUSTOMER_FILTERS: CustomerFilterState = {
  search: "",
  status: "all",
  emailVerified: "all",
};

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
];

const verifiedOptions = [
  { value: "all", label: "All customers" },
  { value: "verified", label: "Verified email" },
  { value: "unverified", label: "Unverified email" },
];

type CustomerFiltersProps = {
  filters: CustomerFilterState;
  onChange: (filters: CustomerFilterState) => void;
  resultCount: number;
};

function labelForOption(
  options: { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function countActiveFilters(filters: CustomerFilterState): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.status !== "all") count += 1;
  if (filters.emailVerified !== "all") count += 1;
  return count;
}

function countSheetActiveFilters(filters: CustomerFilterState): number {
  let count = 0;
  if (filters.status !== "all") count += 1;
  if (filters.emailVerified !== "all") count += 1;
  return count;
}

export default function CustomerFilters({
  filters,
  onChange,
  resultCount,
}: CustomerFiltersProps) {
  const totalActiveCount = countActiveFilters(filters);
  const sheetActiveCount = countSheetActiveFilters(filters);

  const resultSummary = useMemo(() => {
    const noun = resultCount === 1 ? "customer" : "customers";
    return `${resultCount.toLocaleString()} ${noun}`;
  }, [resultCount]);

  const activeFilterChips = (
    <>
      {filters.status !== "all" ? (
        <AdminFilterChip
          label={labelForOption(statusOptions, filters.status)}
          onRemove={() => onChange({ ...filters, status: "all" })}
        />
      ) : null}
      {filters.emailVerified !== "all" ? (
        <AdminFilterChip
          label={labelForOption(verifiedOptions, filters.emailVerified)}
          onRemove={() => onChange({ ...filters, emailVerified: "all" })}
        />
      ) : null}
    </>
  );

  const sheetContent = (
    <div className="space-y-4">
      <AdminCustomSelect
        label="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(status) =>
          onChange({
            ...filters,
            status: status as CustomerFilterState["status"],
          })
        }
      />
      <AdminCustomSelect
        label="Email verified"
        value={filters.emailVerified}
        options={verifiedOptions}
        onChange={(emailVerified) =>
          onChange({
            ...filters,
            emailVerified: emailVerified as CustomerFilterState["emailVerified"],
          })
        }
      />
    </div>
  );

  return (
    <AdminFilterToolbar
      headingId="customer-filters-heading"
      resultSummary={resultSummary}
      sheetTitle="Customer filters"
      sheetContent={sheetContent}
      sheetActiveCount={sheetActiveCount}
      totalActiveCount={totalActiveCount}
      onClearFilters={() => onChange(DEFAULT_CUSTOMER_FILTERS)}
      activeFilterChips={activeFilterChips}
      search={
        <Input
          type="search"
          placeholder="Search by name, email, or phone…"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          aria-label="Search customers"
        />
      }
      period={<span className="hidden" aria-hidden="true" />}
    />
  );
}
