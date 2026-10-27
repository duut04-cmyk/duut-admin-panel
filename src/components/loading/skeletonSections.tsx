import { ADMIN_DASHBOARD_RAIL_GRID, ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminSkeleton from "@/ui/AdminSkeleton";

export function MetricCardsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div
      className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:[&>*:last-child]:col-span-1 xl:grid-cols-5 [&>*:last-child]:col-span-2"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-card border border-border/60 bg-background p-4 shadow-sm"
        >
          <AdminSkeleton variant="text" className="h-3 w-24 max-w-[70%]" />
          <AdminSkeleton variant="metric" className="mt-3" />
          <AdminSkeleton variant="text" className="mt-3 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SnapshotMetricsSkeleton() {
  return (
    <div
      className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-6"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="rounded-card border border-border/60 bg-background p-4 shadow-sm"
        >
          <AdminSkeleton variant="text" className="h-3 w-20" />
          <AdminSkeleton variant="metric" className="mt-3" />
        </div>
      ))}
    </div>
  );
}

export function FunnelCardSkeleton() {
  return (
    <article
      className="rounded-card border border-border/60 bg-background p-4 shadow-sm sm:p-5"
      aria-hidden="true"
    >
      <AdminSkeleton variant="title" />
      <AdminSkeleton variant="text" className="mt-2 h-3 w-40" />
      <div className="mt-6 flex flex-col items-center gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="w-full" style={{ width: `${100 - index * 8}%` }}>
            <AdminSkeleton variant="row" className="h-12 w-full" />
          </div>
        ))}
      </div>
    </article>
  );
}

export function DecisionSpeedCardSkeleton() {
  return (
    <article
      className="rounded-card border border-border/60 bg-background p-4 shadow-sm sm:p-5"
      aria-hidden="true"
    >
      <AdminSkeleton variant="title" />
      <AdminSkeleton variant="text" className="mt-2 h-3 w-56" />
      <div className="mt-6 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="rounded-lg border border-border/60 p-3">
            <AdminSkeleton variant="text" className="mx-auto h-3 w-16" />
            <AdminSkeleton variant="metric" className="mx-auto mt-2" />
          </div>
        ))}
      </div>
    </article>
  );
}

export function TableCardSkeleton({
  titleWidth = "w-40",
  rows = 5,
}: {
  titleWidth?: string;
  rows?: number;
}) {
  return (
    <article
      className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm"
      aria-hidden="true"
    >
      <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <AdminSkeleton variant="title" className={titleWidth} />
        <AdminSkeleton variant="text" className="mt-2 h-3 w-64 max-w-full" />
      </div>
      <div className="space-y-2 p-4 sm:p-5">
        {Array.from({ length: rows }, (_, index) => (
          <AdminSkeleton key={index} variant="row" />
        ))}
      </div>
    </article>
  );
}

export function ActivityFeedSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <article
      className="flex min-w-0 flex-col rounded-card border border-border/60 bg-background p-4 shadow-sm sm:p-5"
      aria-hidden="true"
    >
      <AdminSkeleton variant="title" className="w-36" />
      <AdminSkeleton variant="text" className="mt-2 h-3 w-48" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <AdminSkeleton key={index} variant="row" className="h-12" />
        ))}
      </div>
    </article>
  );
}

export function TopServicesSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <article
      className="flex h-full flex-col rounded-card border border-border/60 bg-background shadow-sm"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4 sm:px-5">
        <AdminSkeleton variant="title" className="w-32" />
        <AdminSkeleton variant="text" className="h-8 w-24 rounded-md" />
      </div>
      <ul className="flex-1 space-y-5 px-4 pb-4 pt-1 sm:px-5">
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className="space-y-2">
            <div className="flex justify-between gap-3">
              <AdminSkeleton variant="text" className="h-4 w-24" />
              <AdminSkeleton variant="text" className="h-4 w-16" />
            </div>
            <AdminSkeleton variant="text" className="h-1.5 w-full rounded-pill" />
          </li>
        ))}
      </ul>
    </article>
  );
}

export function OverviewPageSkeleton() {
  return (
    <div className={`grid min-w-0 gap-6 ${ADMIN_DASHBOARD_RAIL_GRID}`} aria-busy="true">
      <div className="min-w-0 space-y-6">
        <MetricCardsSkeleton />
        <div className="grid min-w-0 gap-6 xl:grid-cols-2 xl:items-start">
          <FunnelCardSkeleton />
          <DecisionSpeedCardSkeleton />
        </div>
        <TableCardSkeleton rows={6} />
      </div>
      <aside className="grid min-w-0 grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-1 xl:flex xl:flex-col xl:gap-6">
        <ActivityFeedSkeleton />
        <TopServicesSkeleton />
      </aside>
    </div>
  );
}

export function IssueQueueSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <AdminSkeleton key={index} variant="row" className="h-16" />
      ))}
    </div>
  );
}

export function ReportsPageSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <SnapshotMetricsSkeleton />
      <div>
        <AdminSkeleton variant="title" className="mb-3 w-32" />
        <IssueQueueSkeleton />
      </div>
      <TableCardSkeleton titleWidth="w-48" rows={4} />
      <div className="space-y-4">
        <AdminSkeleton variant="title" className="w-56" />
        <MetricCardsSkeleton count={4} />
        <TableCardSkeleton rows={4} />
      </div>
      <TableCardSkeleton titleWidth="w-44" rows={4} />
      <TableCardSkeleton titleWidth="w-40" rows={3} />
    </div>
  );
}

export function ListRowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <AdminSkeleton key={index} variant="row" />
      ))}
    </div>
  );
}

export function DeliveryDetailSkeleton() {
  return (
    <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID}`} aria-busy="true">
      <div className="min-w-0 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <AdminSkeleton key={index} variant="card" className="h-24" />
          ))}
        </div>
        <AdminSkeleton variant="card" className="h-40" />
        <AdminSkeleton variant="card" className="h-48" />
        <AdminSkeleton variant="card" className="h-36" />
      </div>
      <aside className="min-w-0 space-y-6">
        <AdminSkeleton variant="card" className="h-56" />
        <AdminSkeleton variant="card" className="h-40" />
      </aside>
    </div>
  );
}

export function OrchestrationDetailSkeleton() {
  return (
    <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID}`} aria-busy="true">
      <div className="min-w-0 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <AdminSkeleton key={index} variant="card" className="h-24" />
          ))}
        </div>
        <AdminSkeleton variant="card" className="h-28" />
        <TableCardSkeleton rows={5} />
      </div>
      <aside className="min-w-0 space-y-6">
        <AdminSkeleton variant="card" className="h-48" />
        <AdminSkeleton variant="card" className="h-64" />
      </aside>
    </div>
  );
}

export function CustomerDetailSkeleton() {
  return (
    <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID}`} aria-busy="true">
      <div className="min-w-0 space-y-6">
        <AdminSkeleton variant="card" className="h-44" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <AdminSkeleton key={index} variant="card" className="h-20" />
          ))}
        </div>
      </div>
      <aside className="min-w-0">
        <TableCardSkeleton rows={4} />
      </aside>
    </div>
  );
}

export function ProviderDetailSkeleton() {
  return (
    <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID}`} aria-busy="true">
      <div className="min-w-0 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <AdminSkeleton key={index} variant="card" className="h-24" />
          ))}
        </div>
        <TableCardSkeleton titleWidth="w-40" rows={4} />
        <TableCardSkeleton titleWidth="w-48" rows={3} />
        <TableCardSkeleton titleWidth="w-36" rows={4} />
      </div>
      <aside className="min-w-0 space-y-6">
        <AdminSkeleton variant="card" className="h-40" />
        <TableCardSkeleton titleWidth="w-44" rows={5} />
      </aside>
    </div>
  );
}

export function IntegrationStatusSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <AdminSkeleton key={index} variant="card" className="h-24" />
        ))}
      </div>
      {Array.from({ length: 2 }, (_, section) => (
        <div key={section} className="space-y-3">
          <AdminSkeleton variant="title" className="w-48" />
          <AdminSkeleton variant="text" className="h-3 w-full max-w-lg" />
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 2 }, (_, index) => (
              <AdminSkeleton key={index} variant="card" className="h-36" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <AdminSkeleton variant="card" className="h-28" />
      <AdminSkeleton variant="card" className="h-52" />
      <AdminSkeleton variant="card" className="h-44" />
      <AdminSkeleton variant="card" className="h-40" />
      <AdminSkeleton variant="card" className="h-36" />
    </div>
  );
}
