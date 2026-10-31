"use client";

import Link from "next/link";
import { useState } from "react";
import type { FeedbackQualityMetrics } from "@/reports/accountability";
import ListPagination from "@/components/ListPagination";
import AdminEmptyState from "@/ui/AdminEmptyState";

const PAGE_SIZE = 10;

type FeedbackQualitySectionProps = {
  metrics: FeedbackQualityMetrics;
};

function TagPill({ label, count }: { label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-[#fff7ed] px-2.5 py-1 text-caption font-semibold text-accent">
      {label}
      <span className="tabular-nums text-muted-foreground">{count}</span>
    </span>
  );
}

function IssuePill({ label, count }: { label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-caption font-semibold text-red-700">
      {label}
      <span className="tabular-nums">{count}</span>
    </span>
  );
}

export default function FeedbackQualitySection({
  metrics,
}: FeedbackQualitySectionProps) {
  const [page, setPage] = useState(1);

  if (metrics.feedbackCount === 0) {
    return (
      <AdminEmptyState
        title="No feedback in period"
        description="Customer ratings and feedback will appear here for deliveries in the selected range."
      />
    );
  }

  const recent = metrics.recentFeedback;
  const total = recent.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = recent.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Feedback received", value: String(metrics.feedbackCount) },
          {
            label: "Avg driver rating",
            value: `${metrics.avgDriverRating ?? "—"} / 5`,
          },
          {
            label: "Avg delivery rating",
            value: `${metrics.avgDeliveryRating ?? "—"} / 5`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.1)]"
          >
            <p className="text-caption text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-body font-bold tabular-nums tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.1)] sm:p-5">
          <h3 className="text-small font-semibold text-foreground">Positive themes</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {metrics.topPositiveTags.length === 0 ? (
              <p className="text-caption text-muted-foreground">
                No positive tags yet.
              </p>
            ) : (
              metrics.topPositiveTags.map((tag) => (
                <TagPill key={tag.tag} label={tag.label} count={tag.count} />
              ))
            )}
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.1)] sm:p-5">
          <h3 className="text-small font-semibold text-foreground">Issue themes</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {metrics.topIssueTags.length === 0 ? (
              <p className="text-caption text-muted-foreground">
                No issue tags reported.
              </p>
            ) : (
              metrics.topIssueTags.map((tag) => (
                <IssuePill key={tag.tag} label={tag.label} count={tag.count} />
              ))
            )}
          </div>
        </div>
      </div>

      <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h3 className="text-small font-bold text-foreground">Recent feedback</h3>
        </div>
        <ul className="divide-y divide-border">
          {pageItems.map((item) => (
            <li key={item.deliveryId} className="px-4 py-3.5 sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/deliveries/${item.deliveryId}`}
                    className="font-semibold text-accent hover:underline"
                  >
                    {item.deliveryReference}
                  </Link>
                  <p className="mt-0.5 text-caption text-muted-foreground">
                    {new Date(item.submittedAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-small tabular-nums text-muted-foreground">
                  Driver {item.driverRating}/5 · Delivery {item.deliveryRating}/5
                </p>
              </div>
            </li>
          ))}
        </ul>
        <ListPagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
        />
      </article>
    </div>
  );
}
