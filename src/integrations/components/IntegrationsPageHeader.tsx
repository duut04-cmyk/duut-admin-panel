"use client";

import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";

export default function IntegrationsPageHeader() {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        Integrations
      </h1>
      <p className="mt-1.5 max-w-2xl text-small leading-snug text-muted-foreground">
        Connect and monitor third-party services and APIs that power Doot — email,
        authentication, database, webhooks, and security.
      </p>
      <p className="mt-2 text-caption text-muted-foreground">
        Delivery partner APIs are managed under{" "}
        <span className="font-medium text-foreground">Providers</span>, not here.
      </p>
    </header>
  );
}
