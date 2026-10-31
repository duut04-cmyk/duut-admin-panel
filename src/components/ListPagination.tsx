"use client";

type ListPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

function ChevronLeft({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M12.5 5L7.5 10l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M7.5 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ListPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: ListPaginationProps) {
  if (total <= pageSize) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);
  const canPrev = current > 1;
  const canNext = current < totalPages;

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 md:px-6">
      <p className="text-caption text-muted-foreground sm:text-small">
        Showing{" "}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        of <span className="font-medium text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(current - 1)}
          disabled={!canPrev}
          className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-[6px] border border-border bg-white px-3 text-caption font-semibold text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Previous page"
        >
          <ChevronLeft />
          Prev
        </button>
        <span className="min-w-16 text-center text-caption font-medium text-muted-foreground">
          {current} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(current + 1)}
          disabled={!canNext}
          className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-[6px] border border-border bg-white px-3 text-caption font-semibold text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Next page"
        >
          Next
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
