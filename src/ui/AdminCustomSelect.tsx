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
};

export default function AdminCustomSelect({
  label,
  value,
  onChange,
  options,
  className = "",
}: AdminCustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

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
  }, [open]);

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
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-small text-foreground transition-colors hover:border-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
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

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label ?? "Options"}
          className="absolute top-full z-30 mt-1.5 w-full overflow-hidden rounded-md border border-border bg-background py-1 shadow-sm"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer px-3 py-2 text-left text-small transition-colors hover:bg-surface focus:outline-none focus-visible:bg-surface ${
                    active
                      ? "bg-surface-accent font-medium text-foreground"
                      : "text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
