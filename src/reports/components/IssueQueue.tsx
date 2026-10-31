"use client";

import Link from "next/link";
import { useState } from "react";
import type { IssueItem, IssueSeverity } from "@/reports/accountability";
import ListPagination from "@/components/ListPagination";

const PAGE_SIZE = 10;

type IssueQueueProps = {
  issues: IssueItem[];
};

const severityStyles: Record<IssueSeverity, { pill: string; label: string }> = {
  high: { pill: "bg-red-50 text-red-700", label: "High" },
  medium: { pill: "bg-amber-50 text-amber-700", label: "Medium" },
  low: { pill: "bg-slate-100 text-slate-600", label: "Low" },
};

const thClass =
  "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5";

export default function IssueQueue({ issues }: IssueQueueProps) {
  const [page, setPage] = useState(1);
  const total = issues.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageIssues = issues.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (issues.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-[10px] border border-emerald-200 bg-emerald-50/70 px-4 py-3.5 sm:px-5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M3.5 8.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-small font-semibold text-foreground">No open issues</p>
          <p className="mt-0.5 text-caption text-muted-foreground">
            Nothing needs action for this period — review health metrics below if you
            want more detail.
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
      <div className="space-y-3 p-4 md:hidden">
        {pageIssues.map((issue) => (
          <Link
            key={issue.id}
            href={issue.href}
            className="block rounded-[10px] border border-border p-4 transition-colors hover:border-foreground/20 hover:bg-surface/30"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-caption font-semibold ${severityStyles[issue.severity].pill}`}
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
            <tr className="border-b border-border bg-[#FFFBF5]/60">
              <th className={thClass}>Severity</th>
              <th className={thClass}>Source</th>
              <th className={thClass}>Issue</th>
              <th className={thClass}>Entity</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageIssues.map((issue) => (
              <tr
                key={issue.id}
                className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/40"
              >
                <td className="px-4 py-3 md:px-5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-caption font-semibold ${severityStyles[issue.severity].pill}`}
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
                    className="font-semibold text-accent hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ListPagination
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </article>
  );
}
