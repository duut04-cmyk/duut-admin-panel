"use client";

type CustomerPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export default function CustomerPagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: CustomerPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-4 pt-4"
      aria-label="Customer list pagination"
    >
      <p className="text-small text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-small font-medium text-foreground transition-colors hover:bg-surface/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-small font-medium text-foreground transition-colors hover:bg-surface/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
