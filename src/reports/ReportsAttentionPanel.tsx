import Link from "next/link";
import type { CustomerAccountabilityRow, IssueItem } from "./accountability";

const severityDot: Record<IssueItem["severity"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-slate-400",
};

const severityLabel: Record<IssueItem["severity"], string> = {
  high: "High",
  medium: "Med",
  low: "Low",
};

type ReportsAttentionPanelProps = {
  issues: IssueItem[];
  atRiskCustomers: CustomerAccountabilityRow[];
};

export function ReportsAttentionPanel({
  issues,
  atRiskCustomers,
}: ReportsAttentionPanelProps) {
  const topIssues = issues.slice(0, 8);
  const showRisk =
    topIssues.length < 6 ? atRiskCustomers.slice(0, 6 - topIssues.length) : [];
  const empty = topIssues.length === 0 && showRisk.length === 0;

  return (
    <section
      aria-labelledby="reports-attention-heading"
      className="rounded-card border border-border/60 bg-background p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="reports-attention-heading"
            className="text-base font-semibold text-foreground"
          >
            Needs attention
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Ranked by severity — open the linked queue to act
          </p>
        </div>
        {issues.length > 0 ? (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-caption font-medium text-red-700">
            {issues.length}
          </span>
        ) : null}
      </div>

      {empty ? (
        <p className="mt-4 text-small text-muted-foreground">
          Nothing urgent right now.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {topIssues.map((issue) => (
            <li key={issue.id} className="py-3 first:pt-0 last:pb-0">
              <Link
                href={issue.href}
                className="group flex items-start gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${severityDot[issue.severity]}`}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="block text-small font-medium text-foreground group-hover:text-accent">
                      {issue.issue}
                    </span>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {severityLabel[issue.severity]}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-caption text-muted-foreground">
                    {issue.source}
                    {issue.entityLabel ? ` · ${issue.entityLabel}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          ))}
          {showRisk.map((customer) => (
            <li key={customer.id} className="py-3 first:pt-0 last:pb-0">
              <Link
                href={`/customers/${customer.id}`}
                className="group flex items-start gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-small font-medium text-foreground group-hover:text-accent">
                    At-risk customer
                  </span>
                  <span className="mt-0.5 block text-caption text-muted-foreground">
                    {customer.name || customer.email || customer.id}
                    {customer.riskNote ? ` · ${customer.riskNote}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
