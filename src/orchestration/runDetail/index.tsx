"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { AdminOrchestrationRunDetail } from "@/data/orchestrationApiTypes";
import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import type { ProviderSummary } from "@/data/providerTypes";
import { isValidDeliveryId } from "@/lib/bff/deliveries";
import { isValidOrchestrationRequestId } from "@/lib/bff/orchestrations";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import {
  OrchestrationDetailSkeleton,
  TableCardSkeleton,
} from "@/components/loading/skeletonSections";
import { applyDeliveryHistoryFetch } from "../historyLoad";
import AdminCallout from "@/ui/AdminCallout";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { fetchDeliveryHistory } from "@/deliveries/api";
import { formatListRoute, mapTimeline } from "@/deliveries/deliveryMappers";
import DeliveryTimeline from "@/deliveries/components/DeliveryTimeline";
import { fetchProviders } from "@/providers/api";
import { fetchOrchestrationRun } from "../runApi";
import {
  formatProviderLabel,
  hasAdminEvaluations,
  isOrchestrationNotFoundError,
  mapDecisionView,
  mapDeliveryCompactFromHistory,
  mapEvaluationRows,
} from "../orchestrationMappers";
import {
  deliveryCompactFromRunDetail,
  historyBookingFromRunDetail,
  runDetailToAdminPayload,
} from "../orchestrationRunMappers";
import DeliveryRequestCompact from "../components/DeliveryRequestCompact";
import OrchestrationEvaluationTable from "../components/OrchestrationEvaluationTable";
import OrchestrationHeroMetrics from "../components/OrchestrationHeroMetrics";
import OrchestrationRunDetailPageHeader from "../components/OrchestrationRunDetailPageHeader";
import OrchestrationScoreBreakdown from "../components/OrchestrationScoreBreakdown";
import OutcomeCard from "../components/OutcomeCard";
import SelectionReasonBanner from "../components/SelectionReasonBanner";

type OrchestrationRunDetailProps = {
  orchestrationRequestId: string;
};

function buildProviderNameMap(providers: ProviderSummary[]): Map<string, string> {
  return new Map(
    providers.map((provider) => [
      provider.code,
      provider.displayName?.trim() || provider.name,
    ]),
  );
}

function routeSubtitleFromRun(run: AdminOrchestrationRunDetail): string {
  return formatListRoute({
    id: run.deliveryId,
    reference: run.delivery.reference,
    status: run.status as DeliveryHistoryDetail["delivery"]["status"],
    pickup: { addressText: run.delivery.pickupAddressText, contactName: "" },
    drop: { addressText: run.delivery.dropAddressText, contactName: "" },
    packageType: "FOOD",
    weightKg: 0,
    sizeTier: "MEDIUM",
    schedule: { mode: "ASAP", scheduledAt: null, timezone: "Asia/Kolkata" },
    createdAt: run.orchestration.createdAt,
    updatedAt: run.orchestration.createdAt,
  });
}

export default function OrchestrationRunDetail({
  orchestrationRequestId,
}: OrchestrationRunDetailProps) {
  const [run, setRun] = useState<AdminOrchestrationRunDetail | null>(null);
  const [history, setHistory] = useState<DeliveryHistoryDetail | null>(null);
  const [providerNames, setProviderNames] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const invalidId = !isValidOrchestrationRequestId(orchestrationRequestId);

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

  const loadRunDetail = useCallback(
    async (isStale: () => boolean = () => false) => {
      if (invalidId) {
        setLoading(false);
        setRun(null);
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

      const [runResult, providersResult] = await Promise.all([
        fetchOrchestrationRun(orchestrationRequestId),
        fetchProviders(),
      ]);

      if (isStale()) {
        setLoading(false);
        return;
      }

      if (providersResult.success && providersResult.data) {
        setProviderNames(buildProviderNameMap(providersResult.data));
      }

      if (!runResult.success || !runResult.data) {
        setLoading(false);
        setRun(null);
        const message = runResult.error ?? "Failed to load orchestration run.";
        if (isOrchestrationNotFoundError(message)) {
          setNotFound(true);
          setLoadError(null);
        } else {
          setLoadError(message);
        }
        return;
      }

      const payload = runDetailToAdminPayload(runResult.data);
      if (!hasAdminEvaluations(payload)) {
        setLoading(false);
        setRun(null);
        setLoadError("Orchestration response is missing admin evaluation data.");
        return;
      }

      setRun(runResult.data);
      setLoading(false);

      await loadDeliveryHistoryOnly(runResult.data.deliveryId, isStale);
    },
    [orchestrationRequestId, invalidId, loadDeliveryHistoryOnly],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadRunDetail(isStale);
    },
    [loadRunDetail],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadRunDetail();
  });

  const { run: retryHistory, busy: retryingHistory } = useExclusiveAsync(async () => {
    if (!run?.deliveryId) return;
    await loadDeliveryHistoryOnly(run.deliveryId);
  });

  const payload = useMemo(() => (run ? runDetailToAdminPayload(run) : null), [run]);

  const decision = useMemo(
    () => (payload ? mapDecisionView(payload, providerNames) : null),
    [payload, providerNames],
  );

  const evaluations = useMemo(
    () => (payload ? mapEvaluationRows(payload, providerNames) : []),
    [payload, providerNames],
  );

  const timelineEvents = useMemo(
    () => (history ? mapTimeline(history) : []),
    [history],
  );

  const bookingForOutcome = useMemo(() => {
    if (history?.booking) return history.booking;
    return run ? historyBookingFromRunDetail(run) : null;
  }, [history, run]);

  const bookingProviderLabel = useMemo(() => {
    const booking = bookingForOutcome;
    if (!booking || !run) return null;
    return formatProviderLabel(
      booking.providerCode,
      booking.serviceCode,
      providerNames,
    );
  }, [bookingForOutcome, run, providerNames]);

  if (invalidId) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Orchestration
            </h1>
            <p className="mt-1 text-small text-muted-foreground">
              Invalid orchestration id
            </p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Invalid orchestration id"
            description="Open a run from the orchestration list or use a valid orchestration UUID."
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
              Loading orchestration run…
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
              Orchestration run not found
            </p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Orchestration run not found"
            description={`No orchestration record exists for id "${orchestrationRequestId}".`}
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

  if (loadError || !run || !payload || !decision) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Orchestration
            </h1>
            <p className="mt-1 text-small text-muted-foreground">
              Could not load orchestration run
            </p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <AdminLoadErrorCallout
            title="Failed to load orchestration run"
            onRetry={() => void retryLoad()}
            retrying={retrying}
          >
            <p>{loadError ?? "An unexpected error occurred."}</p>
          </AdminLoadErrorCallout>
        </AdminContainer>
      </AdminShell>
    );
  }

  const deliveryCompact = history
    ? mapDeliveryCompactFromHistory(history)
    : deliveryCompactFromRunDetail(run);

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <OrchestrationRunDetailPageHeader
          orchestrationRequestId={run.orchestration.id}
          attemptNumber={run.orchestration.attemptNumber}
          deliveryReference={run.delivery.reference}
          routeSubtitle={routeSubtitleFromRun(run)}
          deliveryStatus={run.status as DeliveryHistoryDetail["delivery"]["status"]}
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
          bookingStatus={bookingForOutcome?.status ?? null}
        />

        <SelectionReasonBanner
          reason={decision.selectionReason}
          selectedServiceName={decision.selectedProviderLabel}
        />

        <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
          <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
            <DeliveryRequestCompact delivery={deliveryCompact} />
            <OutcomeCard
              booking={bookingForOutcome}
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
          aria-label="Orchestration run actions"
          className="flex flex-wrap gap-4 border-t border-border/60 pt-6"
        >
          <Link
            href="/orchestration"
            className="text-small font-medium text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Back to orchestration
          </Link>
          {isValidDeliveryId(run.deliveryId) ? (
            <>
              <Link
                href={`/deliveries/${run.deliveryId}`}
                className="text-small font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View delivery →
              </Link>
              <Link
                href={`/orchestration/${run.deliveryId}`}
                className="text-small font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Latest orchestration for delivery →
              </Link>
            </>
          ) : null}
        </nav>
      </AdminContainer>
    </AdminShell>
  );
}
