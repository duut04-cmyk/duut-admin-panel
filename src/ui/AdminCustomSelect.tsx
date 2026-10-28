"use client";

import { useEffect, useId, useRef, useState } from "react";

export type CustomSelectOption = {
  value: string;
  label: string;
};

type AdminCustomSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  className?: string;
  /**
   * `dropdown` — floating menu (default). Avoid inside scroll containers with overflow.
   * `panel` — in-flow option list for filter sheets and modals.
   */
  variant?: "dropdown" | "panel";
};

function OptionButton({
  option,
  active,
  onPick,
}: {
  option: CustomSelectOption;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onPick}
      className={`flex w-full cursor-pointer px-3 py-2.5 text-left text-small transition-colors hover:bg-surface focus:outline-none focus-visible:bg-surface ${
        active ? "bg-surface-accent font-medium text-foreground" : "text-foreground"
      }`}
    >
      {option.label}
    </button>
  );
}

export default function AdminCustomSelect({
  label,
  value,
  onChange,
  options,
  className = "",
  variant = "dropdown",
}: AdminCustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (variant !== "dropdown" || !open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, variant]);

  if (variant === "panel") {
    return (
      <div className={`min-w-0 ${className}`}>
        {label ? (
          <span className="mb-1.5 block text-caption font-medium text-muted-foreground">
            {label}
          </span>
        ) : null}
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label ?? "Options"}
          className="w-full overflow-hidden rounded-md border border-border bg-background py-1"
        >
          {options.map((option) => (
            <li key={option.value} role="presentation">
              <OptionButton
                option={option}
                active={option.value === value}
                onPick={() => onChange(option.value)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      {label && (
        <span className="mb-1.5 block text-caption font-medium text-muted-foreground">
          {label}
        </span>
      )}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-control border border-border bg-background px-3 text-small text-foreground transition-colors hover:border-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
      >
        <span className="truncate">{selected?.label ?? "Select"}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label ?? "Options"}
          className="absolute top-full z-30 mt-1.5 max-h-60 min-w-full w-full overflow-y-auto rounded-md border border-border bg-background py-1 shadow-sm"
        >
          {options.map((option) => (
            <li key={option.value} role="presentation">
              <OptionButton
                option={option}
                active={option.value === value}
                onPick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
