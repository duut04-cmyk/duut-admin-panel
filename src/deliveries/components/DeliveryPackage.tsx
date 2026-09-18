import type { DeliveryPackage as DeliveryPackageType } from "@/data/orchestrationTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import DeliveryDetailCard from "./DeliveryDetailCard";

type DeliveryPackageProps = {
  package: DeliveryPackageType;
};

export default function DeliveryPackage({ package: pkg }: DeliveryPackageProps) {
  return (
    <section aria-labelledby="delivery-package-heading">
      <AdminSectionHeader
        title="Package"
        description="Package details for this delivery."
      />

      <DeliveryDetailCard className="mt-4 p-4 md:p-5">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Type</dt>
            <dd className="mt-0.5 font-medium text-foreground">{pkg.type}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Weight</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{pkg.weightKg} kg</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Length</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{pkg.lengthCm} cm</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Width</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{pkg.widthCm} cm</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Height</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{pkg.heightCm} cm</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Volume</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {pkg.volumeCm3.toLocaleString()} cm³
            </dd>
          </div>
        </dl>
      </DeliveryDetailCard>
    </section>
  );
}
