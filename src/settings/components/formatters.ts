export function formatSeconds(value: number): string {
  if (value >= 3600 && value % 3600 === 0) {
    const hours = value / 3600;
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  if (value >= 60 && value % 60 === 0) {
    const minutes = value / 60;
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  return `${value} second${value === 1 ? "" : "s"}`;
}

export function formatMinutes(value: number): string {
  return `${value} minute${value === 1 ? "" : "s"}`;
}

export function formatDays(value: number): string {
  return `${value} day${value === 1 ? "" : "s"}`;
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function formatBoolean(value: boolean): string {
  return value ? "Enabled" : "Disabled";
}

export function formatOptionalUrl(value: string | null): string {
  return value ?? "Not set";
}

export function formatCheckedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
