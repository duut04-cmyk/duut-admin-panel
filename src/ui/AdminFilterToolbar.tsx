"use client";

import { useRef, useState, type ReactNode } from "react";
import { useDrawerA11y } from "@/components/useDrawerA11y";
import { CloseIcon } from "@/components/AdminIconButton";

function FilterIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M3 5h14M5 10h10M8 15h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type AdminFilterToolbarProps = {
  headingId: string;
  resultSummary: string;
  search: ReactNode;
  period: ReactNode;
  sheetTitle?: string;
  sheetContent: ReactNode;
  sheetActiveCount: number;
  totalActiveCount: number;
  onClearFilters: () => void;
  activeFilterChips?: ReactNode;
};

export default function AdminFilterToolbar({
  headingId,
  resultSummary,
  search,
  period,
  sheetTitle = "Filters",
  sheetContent,
  sheetActiveCount,
  totalActiveCount,
  onClearFilters,
  activeFilterChips,
}: AdminFilterToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeSheet = () => setSheetOpen(false);

  useDrawerA11y(sheetOpen, closeSheet, sheetRef);

  const filtersButton = (
    <button
      type="button"
      onClick={() => setSheetOpen(true)}
      className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control border border-border/60 bg-background text-small font-medium text-foreground shadow-sm transition-colors hover:border-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto sm:px-3"
      aria-haspopup="dialog"
      aria-expanded={sheetOpen}
      aria-label={
        sheetActiveCount > 0 ? `Filters, ${sheetActiveCount} active` : "Filters"
      }
    >
      <span className="relative inline-flex">
        <FilterIcon />
        {sheetActiveCount > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-0.5 text-[10px] font-bold leading-none text-background sm:hidden">
            {sheetActiveCount}
          </span>
        ) : null}
      </span>
      <span className="hidden sm:inline">Filters</span>
      {sheetActiveCount > 0 ? (
        <span className="hidden rounded-full bg-surface-accent px-1.5 py-0.5 text-caption font-semibold text-accent sm:inline">
          {sheetActiveCount}
        </span>
      ) : null}
    </button>
  );

  const activeSummary =
    totalActiveCount > 0 ? (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-small">
        {activeFilterChips ? (
          <div className="flex flex-wrap items-center gap-1.5">{activeFilterChips}</div>
        ) : null}
        <button
          type="button"
          onClick={onClearFilters}
          className="font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Clear all
        </button>
      </div>
    ) : null;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {sheetTitle}
      </h2>

      {/* Mobile: search → filters row with centered count */}
      <div className="flex flex-col gap-2 sm:hidden">
        {search}
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-small text-muted-foreground">
            {resultSummary}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {period}
            {filtersButton}
          </div>
        </div>
        {activeSummary}
      </div>

      {/* Tablet/desktop: search toolbar + summary below */}
      <div className="hidden flex-col gap-2 sm:flex sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">{search}</div>
        <div className="flex shrink-0 gap-2">
          <div className="shrink-0">{period}</div>
          {filtersButton}
        </div>
      </div>

      <div className="mt-2 hidden flex-wrap items-center gap-x-2 gap-y-1.5 text-small sm:flex">
        <span className="text-muted-foreground">{resultSummary}</span>
        {totalActiveCount > 0 ? (
          <>
            {activeFilterChips ? (
              <>
                <span className="text-muted-foreground" aria-hidden="true">
                  ·
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeFilterChips}
                </div>
              </>
            ) : null}
            <button
              type="button"
              onClick={onClearFilters}
              className="font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Clear all
            </button>
          </>
        ) : null}
      </div>

      {sheetOpen ? (
        <div className="fixed inset-0 z-50" role="presentation">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/30 motion-safe:animate-[fade-in_0.2s_ease-out]"
            aria-label="Close filters"
            onClick={closeSheet}
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${headingId}-sheet-title`}
            className="absolute inset-x-0 bottom-0 flex max-h-[min(80vh,520px)] flex-col rounded-t-xl border border-border bg-background shadow-lg motion-safe:animate-[slide-in-up_0.25s_ease-out] sm:left-auto sm:right-6 sm:bottom-6 sm:w-[min(100%,380px)] sm:rounded-xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
              <h3
                id={`${headingId}-sheet-title`}
                className="text-body font-semibold text-foreground"
              >
                {sheetTitle}
              </h3>
              <button
                type="button"
                onClick={closeSheet}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Close filters"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
              {sheetContent}
            </div>
            <div className="border-t border-border px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={closeSheet}
                className="h-10 w-full cursor-pointer rounded-control bg-foreground text-small font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
