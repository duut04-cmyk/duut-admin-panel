type AdminSkeletonVariant = "text" | "title" | "metric" | "row" | "card";

type AdminSkeletonProps = {
  variant?: AdminSkeletonVariant;
  className?: string;
};

const variantClasses: Record<AdminSkeletonVariant, string> = {
  text: "h-4 w-full max-w-xs rounded",
  title: "h-5 w-48 max-w-full rounded",
  metric: "h-9 w-24 max-w-full rounded",
  row: "h-14 w-full rounded-md",
  card: "h-32 w-full rounded-lg",
};

export default function AdminSkeleton({
  variant = "text",
  className = "",
}: AdminSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-surface ${variantClasses[variant]} ${className}`}
    />
  );
}
