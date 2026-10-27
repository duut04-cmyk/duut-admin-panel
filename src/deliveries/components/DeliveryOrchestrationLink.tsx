import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type DeliveryOrchestrationLinkProps = {
  deliveryId: string;
  orchestration: DeliveryHistoryDetail["orchestration"];
};

export default function DeliveryOrchestrationLink({
  orchestration,
}: DeliveryOrchestrationLinkProps) {
  const selected = orchestration?.selectedOption;

  return (
    <section aria-labelledby="delivery-orchestration-link-heading">
      <AdminSectionHeader
        title="Orchestration summary"
        description="Latest selected provider option from delivery history when available."
      />

      <aside className="mt-4 rounded-lg border border-accent/20 bg-orange-50/60 px-4 py-3.5">
        {selected ? (
          <p className="text-small leading-snug text-foreground">
            <span className="font-semibold">{selected.providerCode}</span>
            {selected.serviceCode ? (
              <span className="text-muted-foreground"> · {selected.serviceCode}</span>
            ) : null}
            {selected.selectionReason ? (
              <span className="mt-1 block text-muted-foreground">
                {selected.selectionReason}
              </span>
            ) : null}
          </p>
        ) : (
          <p className="text-small text-muted-foreground">
            No selected provider option is recorded for this delivery yet.
          </p>
        )}
      </aside>
    </section>
  );
}
