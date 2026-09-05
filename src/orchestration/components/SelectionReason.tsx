import AdminCallout from "@/ui/AdminCallout";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type SelectionReasonProps = {
  reason: string | null | undefined;
  selectedServiceName: string;
};

export default function SelectionReason({
  reason,
  selectedServiceName,
}: SelectionReasonProps) {
  const displayReason =
    reason?.trim() || "Selection reason not available.";

  return (
    <section aria-labelledby="selection-reason-heading">
      <AdminSectionHeader
        title="Why this service?"
        description={`Why Dutt selected ${selectedServiceName}.`}
      />

      <AdminCallout variant="accent" className="mt-4">
        {displayReason}
      </AdminCallout>
    </section>
  );
}
