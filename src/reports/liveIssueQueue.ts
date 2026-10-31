import type {
  FeedbackReporting,
  OrchestrationReporting,
  ReportingSummary,
} from "@/data/reportingTypes";
import type { ProviderSummary } from "@/data/providerTypes";
import type { IssueItem, IssueSeverity } from "./accountability";

const SEVERITY_RANK: Record<IssueSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function buildLiveIssueQueue(input: {
  summary: ReportingSummary;
  orchestration: OrchestrationReporting | null;
  providers: ProviderSummary[];
  feedback: FeedbackReporting | null;
}): IssueItem[] {
  const issues: IssueItem[] = [];
  const d = input.summary.deliveriesCreated;
  const o = input.summary.orchestrationRuns;

  if (d.cancelled > 0) {
    issues.push({
      id: "cancelled-deliveries",
      severity: d.cancelled / Math.max(d.total, 1) >= 0.25 ? "high" : "medium",
      source: "Delivery",
      issue: "Cancelled deliveries in period",
      entityLabel: `${d.cancelled} cancelled`,
      href: "/deliveries?status=CANCELLED",
    });
  }

  if (d.failed > 0) {
    issues.push({
      id: "failed-deliveries",
      severity: "high",
      source: "Delivery",
      issue: "Failed deliveries in period",
      entityLabel: `${d.failed} failed`,
      href: "/deliveries?status=FAILED",
    });
  }

  if (d.inProgress > 0 && d.total > 0 && d.inProgress / d.total >= 0.3) {
    issues.push({
      id: "in-progress-backlog",
      severity: "medium",
      source: "Delivery",
      issue: "Large share still in progress",
      entityLabel: `${d.inProgress} active`,
      href: "/deliveries",
    });
  }

  if (o.failedRuns > 0) {
    issues.push({
      id: "orch-failed-runs",
      severity: (o.failureRatePercent ?? 0) >= 20 ? "high" : "medium",
      source: "Orchestration",
      issue: "Orchestration runs failed",
      entityLabel: `${o.failedRuns} runs (${o.failureRatePercent ?? 0}%)`,
      href: "/reports",
    });
  }

  for (const provider of input.providers) {
    if (provider.health.status !== "HEALTHY") {
      issues.push({
        id: `provider-${provider.id}`,
        severity: "high",
        source: "Provider",
        issue: provider.health.lastError ?? "Provider health degraded",
        entityLabel: provider.name,
        href: "/providers",
      });
    }
  }

  for (const failure of input.orchestration?.failureReasons ?? []) {
    if (failure.count <= 0) continue;
    issues.push({
      id: `orch-failure-${failure.reason}`,
      severity: failure.count >= 5 ? "high" : "medium",
      source: "Orchestration",
      issue: failure.reason.replaceAll("_", " "),
      entityLabel: `${failure.count} failed runs`,
      href: "/reports",
    });
  }

  for (const tag of input.feedback?.topIssueTags?.slice(0, 5) ?? []) {
    issues.push({
      id: `feedback-${tag.tag}`,
      severity: tag.count >= 3 ? "medium" : "low",
      source: "Feedback",
      issue: tag.tag.replaceAll("_", " "),
      entityLabel: `${tag.count} reports`,
      href: "/reports#reports-feedback",
    });
  }

  return issues.sort((a, b) => {
    const severityDiff = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return a.issue.localeCompare(b.issue);
  });
}
