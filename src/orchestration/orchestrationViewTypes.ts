import type { BackendScoreBreakdown } from "@/data/orchestrationApiTypes";

export type OrchestrationEvaluationRow = {
  id: string;
  providerCode: string;
  providerLabel: string;
  status: string;
  availabilityLabel: string;
  compatibilityLabel: string;
  price: number | null;
  etaDisplay: string;
  scoreDisplay: string;
  rowScore: string;
  isSelected: boolean;
  resultLabel: string;
  resultVariant: "accent" | "danger" | "neutral";
};

export type OrchestrationDecisionView = {
  selectedProviderCode: string | null;
  selectedProviderLabel: string;
  selectionReason: string | null;
  servicesEvaluated: number;
  availableOptions: number;
  eligibleCount: number;
  selectedScore: number | null;
  selectedScoreBreakdown: BackendScoreBreakdown | null;
  orchestrationStatus: string;
  failureReason: string | null;
  attemptNumber: number;
  completedAt: string | null;
};
