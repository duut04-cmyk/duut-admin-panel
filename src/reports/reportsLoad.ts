import type { CustomerSummary } from "@/data/customerTypes";
import type {
  FeedbackReporting,
  OrchestrationReporting,
  ReportingSummary,
} from "@/data/reportingTypes";
import type { ProviderSummary } from "@/data/providerTypes";

export type ReportsSectionKey =
  "orchestration" | "feedback" | "providers" | "customers";

export type ApiFetchResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ReportsLoadSuccess = {
  success: true;
  summary: ReportingSummary;
  orchestration: OrchestrationReporting | null;
  feedback: FeedbackReporting | null;
  providers: ProviderSummary[] | null;
  customers: CustomerSummary[] | null;
  customerTotal: number | null;
  failedSections: ReportsSectionKey[];
};

export type ReportsLoadFailure = {
  success: false;
  error: string;
};

export type ReportsLoadResult = ReportsLoadSuccess | ReportsLoadFailure;

const SECTION_LABELS: Record<ReportsSectionKey, string> = {
  orchestration: "Orchestration accountability",
  feedback: "Feedback and quality",
  providers: "Provider accountability",
  customers: "Customer accountability",
};

export function reportsPartialFailureMessage(
  failedSections: ReportsSectionKey[],
): string | null {
  if (failedSections.length === 0) return null;
  const names = failedSections.map((key) => SECTION_LABELS[key]);
  if (names.length === 1) {
    return `${names[0]} could not be loaded. Other sections below may still be available.`;
  }
  return `These sections could not be loaded: ${names.join(", ")}. Other sections below may still be available.`;
}

type CustomerListPayload = {
  items: CustomerSummary[];
  total?: number;
};

export function assembleReportsLoadResult(input: {
  summaryResult: ApiFetchResult<ReportingSummary>;
  orchestrationResult: ApiFetchResult<OrchestrationReporting>;
  feedbackResult: ApiFetchResult<FeedbackReporting>;
  providersResult: ApiFetchResult<ProviderSummary[]>;
  customersResult: ApiFetchResult<CustomerListPayload>;
}): ReportsLoadResult {
  const {
    summaryResult,
    orchestrationResult,
    feedbackResult,
    providersResult,
    customersResult,
  } = input;

  if (!summaryResult.success || !summaryResult.data) {
    return {
      success: false,
      error: summaryResult.error ?? "Failed to load reporting summary.",
    };
  }

  const failedSections: ReportsSectionKey[] = [];
  if (!orchestrationResult.success) failedSections.push("orchestration");
  if (!feedbackResult.success) failedSections.push("feedback");
  if (!providersResult.success) failedSections.push("providers");
  if (!customersResult.success) failedSections.push("customers");

  return {
    success: true,
    summary: summaryResult.data,
    orchestration: orchestrationResult.success
      ? (orchestrationResult.data ?? null)
      : null,
    feedback: feedbackResult.success ? (feedbackResult.data ?? null) : null,
    providers: providersResult.success ? (providersResult.data ?? []) : null,
    customers: customersResult.success ? (customersResult.data?.items ?? []) : null,
    customerTotal: customersResult.success
      ? (customersResult.data?.total ?? null)
      : null,
    failedSections,
  };
}
