import type { ProviderEnvironment } from "@/data/providerTypes";
import { environmentLabel } from "./utils";

type ProviderEnvironmentBadgeProps = {
  environment: ProviderEnvironment;
  className?: string;
};

export default function ProviderEnvironmentBadge({
  environment,
  className = "",
}: ProviderEnvironmentBadgeProps) {
  const isLive = environment === "LIVE";

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-caption font-semibold uppercase tracking-wide ${
        isLive
          ? "bg-admin-danger/10 text-admin-danger"
          : "bg-surface-accent text-accent"
      } ${className}`}
    >
      {environmentLabel(environment)}
    </span>
  );
}
