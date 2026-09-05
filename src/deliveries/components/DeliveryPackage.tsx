import type { DeliveryPackage as DeliveryPackageType } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

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

      <AdminCard className="mt-4 p-5 md:p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-caption text-muted-foreground">Type</dt>
            <dd className="mt-0.5 font-medium text-foreground">{pkg.type}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Weight</dt>
            <dd className="mt-0.5 tabular-nums">{pkg.weightKg} kg</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Length</dt>
            <dd className="mt-0.5 tabular-nums">{pkg.lengthCm} cm</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Width</dt>
            <dd className="mt-0.5 tabular-nums">{pkg.widthCm} cm</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Height</dt>
            <dd className="mt-0.5 tabular-nums">{pkg.heightCm} cm</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Volume</dt>
            <dd className="mt-0.5 tabular-nums">
              {pkg.volumeCm3.toLocaleString()} cm³
            </dd>
          </div>
        </dl>
      </AdminCard>
    </section>
  );
}
