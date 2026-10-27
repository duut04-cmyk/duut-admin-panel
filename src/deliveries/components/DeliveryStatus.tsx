import { DeliveryStatusPill } from "./DeliveryStatusPill";

type DeliveryStatusProps = {
  status: string;
  className?: string;
};

export default function DeliveryStatus({
  status,
  className = "",
}: DeliveryStatusProps) {
  return <DeliveryStatusPill status={status} className={className} />;
}
