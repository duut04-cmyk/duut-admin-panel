"use client";

import AdminCustomSelect from "./AdminCustomSelect";

export type AdminDateRangeOption = {
  value: string;
  label: string;
};

const defaultOptions: AdminDateRangeOption[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom" },
];

type AdminDateRangeProps = {
  value: string;
  onChange: (value: string) => void;
  options?: AdminDateRangeOption[];
  label?: string;
  className?: string;
};

export default function AdminDateRange({
  value,
  onChange,
  options = defaultOptions,
  label = "Date range",
  className = "",
}: AdminDateRangeProps) {
  return (
    <AdminCustomSelect
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      className={className}
    />
  );
}
