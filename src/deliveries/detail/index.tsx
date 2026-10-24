"use client";

import Link from "next/link";
import { useState } from "react";
import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import { isValidDeliveryId } from "@/lib/bff/deliveries";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminCallout from "@/ui/AdminCallout";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { fetchDeliveryHistory } from "../api";
import { mapTimeline } from "../deliveryMappers";
import DeliveryBooking from "../components/DeliveryBooking";
import DeliveryDetailPageHeader from "../components/DeliveryDetailPageHeader";
import DeliveryHeroMetrics from "../components/DeliveryHeroMetrics";
import DeliveryOrchestrationLink from "../components/DeliveryOrchestrationLink";
import DeliveryPackage from "../components/DeliveryPackage";
import DeliveryRequirements from "../components/DeliveryRequirements";
import DeliveryRoute from "../components/DeliveryRoute";
import DeliveryTimeline from "../components/DeliveryTimeline";
import DeliveryDetailExtras from "../components/DeliveryDetailExtras";

type DeliveryDetailProps = {
  deliveryId: string;
};

export default function DeliveryDetail({ deliveryId }: DeliveryDetailProps) {
  const [history, setHistory] = useState<DeliveryHistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const invalidId = !isValidDeliveryId(deliveryId);

  useLoadedAsync(
    async (isStale) => {
      if (invalidId) {
        setLoading(false);
        setHistory(null);
        setNotFound(false);
        setLoadError(null);
        return;
      }

      setLoading(true);
      setLoadError(null);
      setNotFound(false);

      const result = await fetchDeliveryHistory(deliveryId);

      if (isStale()) return;

      setLoading(false);

      if (!result.success || !result.data) {
        setHistory(null);
        const message = result.error ?? "Failed to load delivery.";
        if (message.toLowerCase().includes("not found")) {
          setNotFound(true);
          setLoadError(null);
        } else {
          setLoadError(message);
        }
        return;
      }

      setHistory(result.data);
    },
    [deliveryId, invalidId],
  );

  if (invalidId) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Deliveries
            </h1>
            <p className="mt-1 text-small text-muted-foreground">Invalid delivery id</p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Invalid delivery id"
            description="Use a valid delivery UUID or search by DOOT reference on the deliveries list."
            action={
              <Link
                href="/deliveries"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to deliveries
              </Link>
            }
          />
        </AdminContainer>
      </AdminShell>
    );
  }

  if (loading) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Deliveries
            </h1>
            <p className="mt-1 text-small text-muted-foreground">Loading delivery…</p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <p className="text-small text-muted-foreground">Loading delivery…</p>
        </AdminContainer>
      </AdminShell>
    );
  }

  if (notFound || !history) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Deliveries
            </h1>
            <p className="mt-1 text-small text-muted-foreground">Delivery not found</p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          {loadError ? (
            <AdminCallout variant="warning" title="Unable to load delivery">
              {loadError}
            </AdminCallout>
          ) : (
            <AdminEmptyState
              title="Delivery not found"
              description={`No delivery record exists for id "${deliveryId}".`}
              action={
                <Link
                  href="/deliveries"
                  className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Back to deliveries
                </Link>
              }
            />
          )}
        </AdminContainer>
      </AdminShell>
    );
  }

  const timeline = mapTimeline(history);

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={<DeliveryDetailPageHeader history={history} />}
    >
      <AdminContainer flushTop className="space-y-6 pb-10 lg:space-y-8">
        {loadError ? (
          <AdminCallout variant="warning" title="Unable to refresh delivery">
            {loadError}
          </AdminCallout>
        ) : null}

        <DeliveryHeroMetrics history={history} />

        <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
          <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
            <DeliveryRequirements
              schedule={history.schedule}
              specialInstructions={history.delivery.specialInstructions}
            />
            {history.booking ? <DeliveryBooking booking={history.booking} /> : null}
            <DeliveryDetailExtras history={history} />
          </aside>

          <div className="min-w-0 space-y-6 xl:order-1">
            <DeliveryRoute pickup={history.pickup} drop={history.drop} />
            <DeliveryPackage package={history.package} />
            <DeliveryTimeline events={timeline} />
          </div>
        </div>

        <DeliveryOrchestrationLink
          deliveryId={history.delivery.id}
          orchestration={history.orchestration}
        />
      </AdminContainer>
    </AdminShell>
  );
}
