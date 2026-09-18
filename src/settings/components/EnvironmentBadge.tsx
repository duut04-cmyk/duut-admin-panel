import AdminBadge from "@/ui/AdminBadge";

type EnvironmentBadgeProps = {
  nodeEnv: string;
};

export default function EnvironmentBadge({ nodeEnv }: EnvironmentBadgeProps) {
  const variant =
    nodeEnv === "production"
      ? "success"
      : nodeEnv === "development"
        ? "accent"
        : "warning";

  return (
    <AdminBadge variant={variant} className="uppercase tracking-wide">
      {nodeEnv}
    </AdminBadge>
  );
}
