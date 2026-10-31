/** Format INR amount strings for admin Payments UI (₹ with Indian grouping). */
export function formatInrAmount(amount: string | number): string {
  const numeric = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(numeric)) {
    return `₹${String(amount)}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numeric);
}

/** Compact axis labels: ₹2L, ₹50K, ₹1.2Cr */
export function formatInrCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 10_000_000) {
    return `${sign}₹${(abs / 10_000_000).toFixed(abs >= 100_000_000 ? 0 : 1)}Cr`;
  }
  if (abs >= 100_000) {
    return `${sign}₹${(abs / 100_000).toFixed(abs >= 1_000_000 ? 0 : 1)}L`;
  }
  if (abs >= 1_000) {
    return `${sign}₹${(abs / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  }
  return `${sign}₹${Math.round(abs)}`;
}

export function parseMoneyNumber(amount: string | number): number {
  const numeric = typeof amount === "number" ? amount : Number(amount);
  return Number.isFinite(numeric) ? numeric : 0;
}
