import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
};

const baseClasses =
  "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 disabled:cursor-not-allowed disabled:opacity-40";

export default function AdminIconButton({
  icon,
  label,
  className = "",
  type = "button",
  ...props
}: AdminIconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}

export function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  );
}
