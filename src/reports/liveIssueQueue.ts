import type {
  FeedbackReporting,
  OrchestrationReporting,
  ReportingSummary,
} from "@/data/reportingTypes";
import type { ProviderSummary } from "@/data/providerTypes";
import type { IssueItem } from "./accountability";

export function buildLiveIssueQueue(input: {
  summary: ReportingSummary;
  orchestration: OrchestrationReporting | null;
  providers: ProviderSummary[];
  feedback: FeedbackReporting | null;
}): IssueItem[] {
  const issues: IssueItem[] = [];

  for (const provider of input.providers) {
    if (provider.health.status !== "HEALTHY") {
      issues.push({
        id: `provider-${provider.id}`,
        severity: "high",
        source: "Provider",
        issue: provider.health.lastError ?? "Provider health degraded",
        entityLabel: provider.name,
        href: `/providers`,
      });
    }
  }

  for (const failure of input.orchestration?.failureReasons ?? []) {
    if (failure.count <= 0) continue;
    issues.push({
      id: `orch-failure-${failure.reason}`,
      severity: "medium",
      source: "Orchestration",
      issue: failure.reason,
      entityLabel: `${failure.count} failed runs`,
      href: "/reports",
    });
  }

  if (input.summary.deliveriesCreated.failed > 0) {
    issues.push({
      id: "failed-deliveries",
      severity: "high",
      source: "Delivery",
      issue: "Deliveries currently in FAILED status (created in period)",
      entityLabel: `${input.summary.deliveriesCreated.failed}`,
      href: "/deliveries",
    });
  }

  for (const tag of input.feedback?.topIssueTags ?? []) {
    issues.push({
      id: `feedback-${tag.tag}`,
      severity: "low",
      source: "Feedback",
      issue: tag.tag.replaceAll("_", " "),
      entityLabel: `${tag.count} reports`,
      href: "/reports#feedback-quality-heading",
    });
  }

  return issues;
}
