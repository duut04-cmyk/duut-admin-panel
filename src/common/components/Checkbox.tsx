"use client";

import { useId, type InputHTMLAttributes } from "react";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  label: string;
  className?: string;
};

export default function Checkbox({
  label,
  className = "",
  id: idProp,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <label
      htmlFor={id}
      className={`inline-flex cursor-pointer items-center gap-2 ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-border bg-background transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent/40 peer-checked:[&>svg]:opacity-100"
        aria-hidden="true"
      >
        <svg
          className="h-2.5 w-2.5 text-white opacity-0 transition-opacity"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2.5 6l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-small text-foreground">{label}</span>
    </label>
  );
}
