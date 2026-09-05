import Link from "next/link";

type DeliveryActionsProps = {
  deliveryId: string;
};

export default function DeliveryActions({ deliveryId }: DeliveryActionsProps) {
  return (
    <nav
      aria-label="Delivery actions"
      className="flex flex-wrap gap-4 border-t border-border pt-6"
    >
      <Link
        href="/deliveries"
        className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ← Back to deliveries
      </Link>
      <Link
        href={`/orchestration/${deliveryId}`}
        className="text-small font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        View orchestration →
      </Link>
    </nav>
  );
}
