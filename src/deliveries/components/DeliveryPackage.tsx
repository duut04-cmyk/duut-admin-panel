import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import DeliveryDetailCard from "./DeliveryDetailCard";

type DeliveryPackageProps = {
  package: DeliveryHistoryDetail["package"];
};

function formatDimension(value: number | null): string {
  return value === null ? "—" : `${value} cm`;
}

export default function DeliveryPackage({ package: pkg }: DeliveryPackageProps) {
  return (
    <section aria-labelledby="delivery-package-heading">
      <AdminSectionHeader title="Package" />

      <DeliveryDetailCard className="mt-3 p-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-small sm:grid-cols-3">
          <div>
            <dt className="text-caption text-muted-foreground">Type</dt>
            <dd className="mt-0.5 font-medium text-foreground">{pkg.packageType}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Size</dt>
            <dd className="mt-0.5 font-medium text-foreground">{pkg.sizeTier}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Weight</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{pkg.weightKg} kg</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Qty</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{pkg.quantity}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">L × W × H</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {formatDimension(pkg.lengthCm)} × {formatDimension(pkg.widthCm)} ×{" "}
              {formatDimension(pkg.heightCm)}
            </dd>
          </div>
          {pkg.description ? (
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-caption text-muted-foreground">Description</dt>
              <dd className="mt-0.5 text-foreground">{pkg.description}</dd>
            </div>
          ) : null}
          {pkg.requirements.length > 0 ? (
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-caption text-muted-foreground">Handling</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {pkg.requirements.join(" · ")}
              </dd>
            </div>
          ) : null}
        </dl>
      </DeliveryDetailCard>
    </section>
  );
}
