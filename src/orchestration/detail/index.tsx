"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { AdminOrchestrationPayload } from "@/data/orchestrationApiTypes";
import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import type { ProviderSummary } from "@/data/providerTypes";
import { isValidDeliveryId } from "@/lib/bff/deliveries";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import { OrchestrationDetailSkeleton } from "@/components/loading/skeletonSections";
import AdminCallout from "@/ui/AdminCallout";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { fetchDeliveryHistory } from "@/deliveries/api";
import { formatListRoute, mapTimeline } from "@/deliveries/deliveryMappers";
import { TableCardSkeleton } from "@/components/loading/skeletonSections";
import { applyDeliveryHistoryFetch } from "../historyLoad";
import DeliveryTimeline from "@/deliveries/components/DeliveryTimeline";
import { fetchProviders } from "@/providers/api";
import { fetchOrchestration } from "../api";
import {
  formatProviderLabel,
  hasAdminEvaluations,
  isOrchestrationNotFoundError,
  mapDecisionView,
  mapDeliveryCompactFromHistory,
  mapEvaluationRows,
} from "../orchestrationMappers";
import DeliveryRequestCompact from "../components/DeliveryRequestCompact";
import OrchestrationDetailPageHeader from "../components/OrchestrationDetailPageHeader";
import OrchestrationEvaluationTable from "../components/OrchestrationEvaluationTable";
import OrchestrationHeroMetrics from "../components/OrchestrationHeroMetrics";
import OrchestrationScoreBreakdown from "../components/OrchestrationScoreBreakdown";
import OutcomeCard from "../components/OutcomeCard";
import SelectionReasonBanner from "../components/SelectionReasonBanner";

type OrchestrationDetailProps = {
  deliveryId: string;
};

function buildProviderNameMap(providers: ProviderSummary[]): Map<string, string> {
  return new Map(
    providers.map((provider) => [
      provider.code,
      provider.displayName?.trim() || provider.name,
    ]),
  );
}

function routeSubtitleFromHistory(history: DeliveryHistoryDetail | null): string {
  if (!history) return "Orchestration detail";
  return formatListRoute({
    id: history.delivery.id,
    reference: history.delivery.reference,
    status: history.delivery.status,
    pickup: {
      addressText: history.pickup.addressText,
      contactName: history.pickup.contactName,
    },
    drop: {
      addressText: history.drop.addressText,
      contactName: history.drop.contactName,
    },
    packageType: history.package.packageType,
    weightKg: history.package.weightKg,
    sizeTier: history.package.sizeTier,
    schedule: history.schedule,
    createdAt: history.delivery.createdAt,
    updatedAt: history.delivery.updatedAt,
  });
}

export default function OrchestrationDetail({ deliveryId }: OrchestrationDetailProps) {
  const [payload, setPayload] = useState<AdminOrchestrationPayload | null>(null);
  const [history, setHistory] = useState<DeliveryHistoryDetail | null>(null);
  const [providerNames, setProviderNames] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const invalidId = !isValidDeliveryId(deliveryId);

  const loadDeliveryHistoryOnly = useCallback(
    async (targetDeliveryId: string, isStale: () => boolean = () => false) => {
      if (!isValidDeliveryId(targetDeliveryId)) return;

      setHistoryLoading(true);
      setHistoryError(null);

      const historyResult = await fetchDeliveryHistory(targetDeliveryId);
      if (isStale()) {
        setHistoryLoading(false);
        return;
      }

      const applied = applyDeliveryHistoryFetch(historyResult);
      setHistory(applied.history);
      setHistoryError(applied.historyError);
      setHistoryLoading(false);
    },
    [],
  );

  const loadOrchestrationDetail = useCallback(
    async (isStale: () => boolean = () => false) => {
      if (invalidId) {
        setLoading(false);
        setPayload(null);
        setHistory(null);
        setNotFound(false);
        setLoadError(null);
        setHistoryError(null);
        setHistoryLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);
      setNotFound(false);
      setHistory(null);
      setHistoryError(null);

      const [orchResult, providersResult] = await Promise.all([
        fetchOrchestration(deliveryId),
        fetchProviders(),
      ]);

      if (isStale()) {
        setLoading(false);
        return;
      }

      if (providersResult.success && providersResult.data) {
        setProviderNames(buildProviderNameMap(providersResult.data));
      }

      if (!orchResult.success || !orchResult.data) {
        setLoading(false);
        setPayload(null);
        const message = orchResult.error ?? "Failed to load orchestration.";
        if (isOrchestrationNotFoundError(message)) {
          setNotFound(true);
          setLoadError(null);
        } else {
          setLoadError(message);
        }
        return;
      }

      if (!hasAdminEvaluations(orchResult.data)) {
        setLoading(false);
        setLoadError("Orchestration response is missing admin evaluation data.");
        setPayload(null);
        return;
      }

      setPayload(orchResult.data);
      setLoading(false);

      await loadDeliveryHistoryOnly(deliveryId, isStale);
    },
    [deliveryId, invalidId, loadDeliveryHistoryOnly],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadOrchestrationDetail(isStale);
    },
    [loadOrchestrationDetail],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadOrchestrationDetail();
  });

  const { run: retryHistory, busy: retryingHistory } = useExclusiveAsync(async () => {
    await loadDeliveryHistoryOnly(deliveryId);
  });

  const nameByCode = providerNames;

  const decision = useMemo(
    () => (payload ? mapDecisionView(payload, nameByCode) : null),
    [payload, nameByCode],
  );

  const evaluations = useMemo(
    () => (payload ? mapEvaluationRows(payload, nameByCode) : []),
    [payload, nameByCode],
  );

  const timelineEvents = useMemo(
    () => (history ? mapTimeline(history) : []),
    [history],
  );

  const bookingProviderLabel = useMemo(() => {
    const booking = history?.booking;
    if (!booking) return null;
    return formatProviderLabel(booking.providerCode, booking.serviceCode, nameByCode);
  }, [history, nameByCode]);

  if (invalidId) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Orchestration
            </h1>
            <p className="mt-1 text-small text-muted-foreground">Invalid delivery id</p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Invalid delivery id"
            description="Open orchestration from a delivery UUID on the deliveries list."
            action={
              <Link
                href="/orchestration"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to orchestration
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
              Orchestration
            </h1>
            <p className="mt-1 text-small text-muted-foreground">
              Loading orchestration…
            </p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <OrchestrationDetailSkeleton />
        </AdminContainer>
      </AdminShell>
    );
  }

  if (notFound) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Orchestration
            </h1>
            <p className="mt-1 text-small text-muted-foreground">
              Orchestration not found
            </p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Orchestration not found"
            description={`No orchestration record exists for delivery ID "${deliveryId}".`}
            action={
              <Link
                href="/orchestration"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to orchestration
              </Link>
            }
          />
        </AdminContainer>
      </AdminShell>
    );
  }

  if (loadError || !payload || !decision) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Orchestration
            </h1>
            <p className="mt-1 text-small text-muted-foreground">
              Could not load orchestration
            </p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <AdminLoadErrorCallout
            title="Failed to load orchestration"
            onRetry={() => void retryLoad()}
            retrying={retrying}
          >
            <p>{loadError ?? "An unexpected error occurred."}</p>
          </AdminLoadErrorCallout>
        </AdminContainer>
      </AdminShell>
    );
  }

  const routeSubtitle = routeSubtitleFromHistory(history);
  const deliveryCompact = history ? mapDeliveryCompactFromHistory(history) : null;

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <OrchestrationDetailPageHeader
          deliveryId={deliveryId}
          reference={history?.delivery.reference ?? null}
          routeSubtitle={routeSubtitle}
          deliveryStatus={history?.delivery.status ?? null}
        />
      }
    >
      <AdminContainer flushTop className="space-y-6 pb-10 lg:space-y-8">
        {historyError && !historyLoading ? (
          <AdminLoadErrorCallout
            title="Failed to load delivery history"
            onRetry={() => void retryHistory()}
            retrying={retryingHistory}
          >
            <p>{historyError}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {decision.failureReason ? (
          <AdminCallout variant="warning" title="Orchestration failed">
            {decision.failureReason}
          </AdminCallout>
        ) : null}

        <OrchestrationHeroMetrics
          decision={decision}
          bookingStatus={history?.booking?.status ?? null}
        />

        <SelectionReasonBanner
          reason={decision.selectionReason}
          selectedServiceName={decision.selectedProviderLabel}
        />

        <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
          <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
            {historyLoading ? (
              <TableCardSkeleton titleWidth="w-40" rows={4} />
            ) : deliveryCompact ? (
              <DeliveryRequestCompact delivery={deliveryCompact} />
            ) : (
              <section aria-labelledby="delivery-request-compact-heading">
                <h2 id="delivery-request-compact-heading" className="sr-only">
                  Delivery request
                </h2>
                <p className="text-small text-muted-foreground">
                  Delivery request details are unavailable without history.
                </p>
              </section>
            )}
            <OutcomeCard
              booking={history?.booking ?? null}
              providerLabel={bookingProviderLabel}
            />
          </aside>

          <div className="min-w-0 space-y-6 xl:order-1">
            <OrchestrationEvaluationTable evaluations={evaluations} />
            <OrchestrationScoreBreakdown
              selectedProviderLabel={decision.selectedProviderLabel}
              totalScore={decision.selectedScore}
              breakdown={decision.selectedScoreBreakdown}
            />
          </div>
        </div>

        {historyLoading ? (
          <TableCardSkeleton titleWidth="w-36" rows={3} />
        ) : timelineEvents.length > 0 ? (
          <DeliveryTimeline events={timelineEvents} />
        ) : (
          <section>
            <p className="text-small text-muted-foreground">
              {history
                ? "No delivery timeline events recorded yet."
                : "Timeline requires delivery history."}
            </p>
          </section>
        )}

        <nav
          aria-label="Orchestration actions"
          className="flex flex-wrap gap-4 border-t border-border/60 pt-6"
        >
          <Link
            href="/orchestration"
            className="text-small font-medium text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Back to orchestration
          </Link>
          <Link
            href={`/deliveries/${deliveryId}`}
            className="text-small font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View delivery →
          </Link>
        </nav>
      </AdminContainer>
    </AdminShell>
  );
}
