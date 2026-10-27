"use client";

import { useId, type ButtonHTMLAttributes } from "react";

type AdminToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  checked: boolean;
  label: string;
  description?: string;
  onCheckedChange: (checked: boolean) => void;
};

export default function AdminToggle({
  checked,
  label,
  description,
  onCheckedChange,
  disabled,
  className = "",
  ...props
}: AdminToggleProps) {
  const id = useId();

  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div className="min-w-0">
        <label htmlFor={id} className="text-small font-medium text-foreground">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-caption text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 ${
          checked
            ? "border-accent bg-accent"
            : "border-border bg-surface hover:border-foreground/20"
        }`}
        {...props}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
