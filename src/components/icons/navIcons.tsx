import type { ReactNode } from "react";

type IconProps = { className?: string };

function icon(className: string, children: ReactNode) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function OverviewNavIcon({ className = "h-5 w-5" }: IconProps) {
  return icon(
    className,
    <>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </>,
  );
}

export function DeliveriesNavIcon({ className = "h-5 w-5" }: IconProps) {
  return icon(
    className,
    <>
      <path
        d="M3 6h11l2 4v5a1 1 0 0 1-1 1h-1.5M3 6l1.5-2h7L13 6M3 6v10a1 1 0 0 0 1 1h1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="16" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="14" cy="16" r="1.25" fill="currentColor" stroke="none" />
    </>,
  );
}

export function OrchestrationNavIcon({ className = "h-5 w-5" }: IconProps) {
  return icon(
    className,
    <>
      <circle cx="5" cy="10" r="2" />
      <circle cx="15" cy="5" r="2" />
      <circle cx="15" cy="15" r="2" />
      <path d="M7 9.2L13 5.8M7 10.8l6 3.4" strokeLinecap="round" />
    </>,
  );
}

export function ProvidersNavIcon({ className = "h-5 w-5" }: IconProps) {
  return icon(
    className,
    <>
      <path d="M4 17V7l6-3 6 3v10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 17v-4h4v4M8 10h4" strokeLinecap="round" />
    </>,
  );
}

export function CustomersNavIcon({ className = "h-5 w-5" }: IconProps) {
  return icon(
    className,
    <>
      <circle cx="10" cy="7" r="2.5" />
      <path d="M4 17c0-3 2.5-5 6-5s6 2 6 5" strokeLinecap="round" />
    </>,
  );
}

export function ReportsNavIcon({ className = "h-5 w-5" }: IconProps) {
  return icon(
    className,
    <>
      <path d="M5 16V9M10 16V5M15 16v-4" strokeLinecap="round" />
      <path d="M4 16h12" strokeLinecap="round" />
    </>,
  );
}

export function IntegrationsNavIcon({ className = "h-5 w-5" }: IconProps) {
  return icon(
    className,
    <>
      <path d="M8 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path
        d="M12 8h3a1 1 0 0 1 1 1v2M12 12h3a1 1 0 0 0 1-1V9M8 12H5a1 1 0 0 1-1-1V9M8 8H5a1 1 0 0 0-1 1v2"
        strokeLinecap="round"
      />
    </>,
  );
}

export function SettingsNavIcon({ className = "h-5 w-5" }: IconProps) {
  return icon(
    className,
    <>
      <circle cx="10" cy="10" r="2.5" />
      <path
        d="M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5.05 5.05l1.06 1.06M13.89 13.89l1.06 1.06M5.05 14.95l1.06-1.06M13.89 6.11l1.06-1.06"
        strokeLinecap="round"
      />
    </>,
  );
}

export function ChatHelpIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M4 6a6 6 0 0 1 12 0v4a2 2 0 0 1-2 2h-1.5L10 17l-2.5-5H6a2 2 0 0 1-2-2V6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
