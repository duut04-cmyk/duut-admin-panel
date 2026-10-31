"use client";

import Link from "next/link";
import ReportsSection from "@/reports/components/ReportsSection";

function RelatedLinkCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-card border border-border/60 bg-background p-4 shadow-sm transition-colors hover:border-accent/40 hover:bg-surface/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <h3 className="text-body font-semibold text-foreground group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-1 flex-1 text-small text-muted-foreground">{description}</p>
      <span className="mt-3 text-small font-medium text-accent">Open →</span>
    </Link>
  );
}

export default function RelatedPagesSection() {
  return (
    <ReportsSection id="settings-related" title="Also see" description="Related pages">
      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        <RelatedLinkCard
          title="Integrations"
          description="Email, auth, database, and encryption status."
          href="/integrations"
        />
        <RelatedLinkCard
          title="Providers"
          description="Delivery partner APIs, credentials, and eligibility."
          href="/providers"
        />
      </div>
    </ReportsSection>
  );
}
