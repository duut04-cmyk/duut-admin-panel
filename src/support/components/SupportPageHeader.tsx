"use client";

import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";

export default function SupportPageHeader() {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
        Support
      </p>
      <h1 className="mt-1 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        Help &amp; support
      </h1>
      <p className="mt-1.5 max-w-2xl text-small leading-snug text-muted-foreground">
        Answers about deliveries, providers, integrations, and account access — plus how
        to reach the Doot team.
      </p>
    </header>
  );
}
