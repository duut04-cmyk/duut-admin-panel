import type {
  AdminOrchestrationEvaluation,
  AdminOrchestrationPayload,
  AdminSelectedOption,
} from "@/data/orchestrationApiTypes";
import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import { formatDeliveryPhone } from "@/deliveries/deliveryMappers";
import type {
  OrchestrationDecisionView,
  OrchestrationEvaluationRow,
} from "./orchestrationViewTypes";

export function formatProviderLabel(
  providerCode: string,
  providerServiceCode: string | null,
  nameByCode?: ReadonlyMap<string, string>,
): string {
  const named = nameByCode?.get(providerCode);
  if (named) {
    return providerServiceCode ? `${named} · ${providerServiceCode}` : named;
  }
  return providerServiceCode
    ? `${providerCode} · ${providerServiceCode}`
    : providerCode;
}

function isSelectedEvaluation(
  evaluation: AdminOrchestrationEvaluation,
  selected: AdminSelectedOption | null,
): boolean {
  if (!selected) return false;
  if (evaluation.providerCode !== selected.providerCode) return false;
  if (selected.serviceCode && evaluation.providerServiceCode) {
    return evaluation.providerServiceCode === selected.serviceCode;
  }
  return true;
}

function availabilityLabel(evaluation: AdminOrchestrationEvaluation): string {
  if (evaluation.status === "ERROR") {
    return evaluation.errorCategory ?? "Error";
  }
  if (evaluation.status === "INELIGIBLE" || evaluation.status === "SKIPPED") {
    return evaluation.exclusionReasons[0] ?? evaluation.status;
  }
  if (evaluation.availabilityKnown === false) {
    return "Availability unknown";
  }
  if (evaluation.available === false) {
    return "Unavailable";
  }
  if (evaluation.available === true) {
    return evaluation.availableDriverCount != null
      ? `Available (${evaluation.availableDriverCount} drivers)`
      : "Available";
  }
  return evaluation.status;
}

function compatibilityLabel(evaluation: AdminOrchestrationEvaluation): string {
  if (evaluation.serviceable === false) {
    return evaluation.exclusionReasons[0] ?? "Not serviceable";
  }
  if (evaluation.serviceable === true) {
    return "Serviceable";
  }
  return "—";
}

function formatEtaDisplay(estimatedDeliveryAt: string | null): string {
  if (!estimatedDeliveryAt) return "—";
  try {
    return new Date(estimatedDeliveryAt).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function resultForEvaluation(
  evaluation: AdminOrchestrationEvaluation,
  isSelected: boolean,
): { label: string; variant: "accent" | "danger" | "neutral" } {
  if (isSelected) {
    return { label: "Selected", variant: "accent" };
  }
  if (evaluation.status === "INELIGIBLE" || evaluation.status === "ERROR") {
    return {
      label: evaluation.exclusionReasons[0] ?? evaluation.status,
      variant: "danger",
    };
  }
  if (evaluation.status === "ELIGIBLE") {
    return { label: "Not selected", variant: "neutral" };
  }
  return { label: evaluation.status, variant: "neutral" };
}

export function mapEvaluationRows(
  payload: AdminOrchestrationPayload,
  nameByCode?: ReadonlyMap<string, string>,
): OrchestrationEvaluationRow[] {
  const selected = payload.orchestration.selectedOption;
  const selectedEval = payload.orchestration.evaluations.find((evaluation) =>
    isSelectedEvaluation(evaluation, selected),
  );

  return payload.orchestration.evaluations.map((evaluation) => {
    const isSelected = isSelectedEvaluation(evaluation, selected);
    const result = resultForEvaluation(evaluation, isSelected);
    const score = evaluation.score ?? (isSelected ? selectedEval?.score : null) ?? null;

    return {
      id: evaluation.id,
      providerCode: evaluation.providerCode,
      providerLabel: formatProviderLabel(
        evaluation.providerCode,
        evaluation.providerServiceCode,
        nameByCode,
      ),
      status: evaluation.status,
      availabilityLabel: availabilityLabel(evaluation),
      compatibilityLabel: compatibilityLabel(evaluation),
      price: evaluation.quoteAvailable ? evaluation.quoteAmount : null,
      etaDisplay: formatEtaDisplay(evaluation.estimatedDeliveryAt),
      scoreDisplay: score !== null ? score.toFixed(2) : "—",
      rowScore: score !== null ? score.toFixed(2) : "—",
      isSelected,
      resultLabel: result.label,
      resultVariant: result.variant,
    };
  });
}

export function mapDecisionView(
  payload: AdminOrchestrationPayload,
  nameByCode?: ReadonlyMap<string, string>,
): OrchestrationDecisionView {
  const { orchestration } = payload;
  const selected = orchestration.selectedOption;
  const selectedEval = orchestration.evaluations.find((evaluation) =>
    isSelectedEvaluation(evaluation, selected),
  );

  const eligibleCount = orchestration.evaluations.filter(
    (evaluation) => evaluation.status === "ELIGIBLE",
  ).length;

  const availableOptions = orchestration.evaluations.filter(
    (evaluation) =>
      evaluation.status === "ELIGIBLE" &&
      evaluation.available !== false &&
      evaluation.quoteAvailable !== false,
  ).length;

  return {
    selectedProviderCode: selected?.providerCode ?? null,
    selectedProviderLabel: selected
      ? formatProviderLabel(selected.providerCode, selected.serviceCode, nameByCode)
      : "None",
    selectionReason: selected?.selectionReason ?? null,
    servicesEvaluated: orchestration.evaluations.length,
    availableOptions,
    eligibleCount,
    selectedScore: selectedEval?.score ?? null,
    selectedScoreBreakdown: selectedEval?.scoreBreakdown ?? null,
    orchestrationStatus: orchestration.status,
    failureReason: orchestration.failureReason,
    attemptNumber: orchestration.attemptNumber,
    completedAt: orchestration.completedAt,
  };
}

export function hasAdminEvaluations(payload: AdminOrchestrationPayload): boolean {
  return Array.isArray(payload.orchestration.evaluations);
}

export type OrchestrationDeliveryCompact = {
  deliveryId: string;
  reference: string;
  pickupAddress: string;
  dropAddress: string;
  pickupContact: string;
  dropContact: string;
  packageType: string;
  packageWeightKg: number;
  scheduleMode: string;
  specialInstructions: string | null;
  requirements: string[];
};

export function mapDeliveryCompactFromHistory(
  history: DeliveryHistoryDetail,
): OrchestrationDeliveryCompact {
  return {
    deliveryId: history.delivery.id,
    reference: history.delivery.reference,
    pickupAddress: history.pickup.addressText,
    dropAddress: history.drop.addressText,
    pickupContact: `${history.pickup.contactName} · ${formatDeliveryPhone(history.pickup.contactPhone)}`,
    dropContact: `${history.drop.contactName} · ${formatDeliveryPhone(history.drop.contactPhone)}`,
    packageType: history.package.packageType,
    packageWeightKg: history.package.weightKg,
    scheduleMode: history.schedule.mode,
    specialInstructions: history.delivery.specialInstructions,
    requirements: history.package.requirements,
  };
}

export function isOrchestrationNotFoundError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("orchestration") && lower.includes("not found");
}
