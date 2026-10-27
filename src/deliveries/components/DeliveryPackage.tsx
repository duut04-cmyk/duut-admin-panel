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
      <AdminSectionHeader
        title="Package"
        description="Package details for this delivery."
      />

      <DeliveryDetailCard className="mt-4 p-4 md:p-5">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Type</dt>
            <dd className="mt-0.5 font-medium text-foreground">{pkg.packageType}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Size tier</dt>
            <dd className="mt-0.5 font-medium text-foreground">{pkg.sizeTier}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Weight</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{pkg.weightKg} kg</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Quantity</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{pkg.quantity}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Length</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {formatDimension(pkg.lengthCm)}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Width</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {formatDimension(pkg.widthCm)}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Height</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {formatDimension(pkg.heightCm)}
            </dd>
          </div>
          {pkg.description ? (
            <div className="col-span-2">
              <dt className="text-caption text-muted-foreground">Description</dt>
              <dd className="mt-0.5 text-foreground">{pkg.description}</dd>
            </div>
          ) : null}
          {pkg.requirements.length > 0 ? (
            <div className="col-span-2">
              <dt className="text-caption text-muted-foreground">
                Handling requirements
              </dt>
              <dd className="mt-0.5">
                <ul className="list-inside list-disc space-y-1 font-medium text-foreground">
                  {pkg.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
      </DeliveryDetailCard>
    </section>
  );
}
