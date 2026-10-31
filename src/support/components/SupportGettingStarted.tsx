import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Check ops health",
    description:
      "Start on Overview or Reports for cancel rates, matching issues, and what needs attention.",
  },
  {
    number: "2",
    title: "Inspect deliveries and partners",
    description:
      "Open Deliveries for status and timeline detail, then Providers for credentials and partner health.",
  },
  {
    number: "3",
    title: "Verify services and policies",
    description:
      "Use Integrations for email, auth, and database status, and Settings for platform and policy snapshots.",
  },
] as const;

export default function SupportGettingStarted() {
  return (
    <section className="overflow-hidden rounded-card border border-border/60 bg-background p-5 shadow-sm md:p-6">
      <h2 className="text-body font-bold text-foreground md:text-body-lg">
        Getting started
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        A simple path for investigating platform issues in admin.
      </p>

      <ol className="mt-5 space-y-4">
        {steps.map((step) => (
          <li key={step.number} className="flex gap-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-caption font-bold text-accent-foreground">
              {step.number}
            </span>
            <div>
              <h3 className="text-small font-bold text-foreground md:text-body">
                {step.title}
              </h3>
              <p className="mt-1 text-small leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
        <Link
          href="/reports"
          className="inline-flex h-10 items-center rounded-pill bg-accent px-5 text-small font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Open Reports
        </Link>
        <Link
          href="/deliveries"
          className="inline-flex h-10 items-center rounded-pill border border-border bg-background px-5 text-small font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View deliveries
        </Link>
      </div>
    </section>
  );
}
