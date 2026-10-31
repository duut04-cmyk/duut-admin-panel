"use client";

const NAV_ITEMS = [
  { href: "#issue-queue-heading", label: "Issues" },
  { href: "#health-snapshot-heading", label: "Health" },
  { href: "#provider-accountability-heading", label: "Providers" },
  { href: "#orchestration-accountability-heading", label: "Orchestration" },
  { href: "#customer-accountability-heading", label: "Customers" },
  { href: "#feedback-quality-heading", label: "Feedback" },
] as const;

export default function ReportsSectionNav() {
  return (
    <nav
      aria-label="Jump to report section"
      className="sticky top-0 z-10 -mx-1 overflow-x-auto bg-background/95 px-1 py-2 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80"
    >
      <ul className="flex min-w-max gap-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="inline-flex h-8 items-center rounded-full border border-border bg-[#FFFBF5] px-3 text-caption font-semibold text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
