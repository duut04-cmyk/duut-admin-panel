type CustomerDeliveryRouteProps = {
  pickup: { addressText: string };
  drop: { addressText: string };
  className?: string;
};

export default function CustomerDeliveryRoute({
  pickup,
  drop,
  className = "",
}: CustomerDeliveryRouteProps) {
  const from = pickup.addressText.trim();
  const to = drop.addressText.trim();

  return (
    <div
      className={`min-w-0 space-y-1.5 text-small text-muted-foreground ${className}`}
    >
      <p className="break-words leading-snug">
        <span className="font-medium text-foreground/80">Pickup: </span>
        {from}
      </p>
      <p className="break-words leading-snug">
        <span className="font-medium text-foreground/80">Drop: </span>
        {to}
      </p>
    </div>
  );
}
