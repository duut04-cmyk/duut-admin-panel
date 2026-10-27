"use client";

import Link from "next/link";
import type { IssueItem, IssueSeverity } from "@/reports/accountability";
import AdminEmptyState from "@/ui/AdminEmptyState";

type IssueQueueProps = {
  issues: IssueItem[];
};

const severityStyles: Record<IssueSeverity, { pill: string; label: string }> = {
  high: { pill: "bg-red-50 text-red-700", label: "High" },
  medium: { pill: "bg-amber-50 text-amber-700", label: "Medium" },
  low: { pill: "bg-slate-100 text-slate-600", label: "Low" },
};

export default function IssueQueue({ issues }: IssueQueueProps) {
  if (issues.length === 0) {
    return (
      <AdminEmptyState
        title="No open issues"
        description="Everything looks healthy for the selected period."
      />
    );
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="space-y-3 p-4 md:hidden">
        {issues.slice(0, 12).map((issue) => (
          <Link
            key={issue.id}
            href={issue.href}
            className="block rounded-card border border-border/60 p-4 transition-colors hover:border-foreground/20 hover:bg-surface/30"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`rounded px-2 py-0.5 text-caption font-semibold ${severityStyles[issue.severity].pill}`}
              >
                {severityStyles[issue.severity].label}
              </span>
              <span className="text-caption text-muted-foreground">{issue.source}</span>
            </div>
            <p className="mt-2 font-medium text-foreground">{issue.issue}</p>
            <p className="mt-1 text-caption text-muted-foreground">
              {issue.entityLabel}
            </p>
          </Link>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[880px] text-left text-small">
          <caption className="sr-only">Issue queue</caption>
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Severity
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Source
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Issue
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Entity
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {issues.slice(0, 20).map((issue) => (
              <tr key={issue.id} className="border-b border-border/60 last:border-b-0">
                <td className="px-4 py-3 md:px-5">
                  <span
                    className={`inline-flex rounded px-2 py-0.5 text-caption font-semibold ${severityStyles[issue.severity].pill}`}
                  >
                    {severityStyles[issue.severity].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground md:px-5">
                  {issue.source}
                </td>
                <td className="px-4 py-3 text-foreground md:px-5">{issue.issue}</td>
                <td className="px-4 py-3 text-muted-foreground md:px-5">
                  {issue.entityLabel}
                </td>
                <td className="px-4 py-3 md:px-5">
                  <Link
                    href={issue.href}
                    className="font-medium text-accent hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
