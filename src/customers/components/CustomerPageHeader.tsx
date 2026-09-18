"use client";

import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";

export default function CustomerPageHeader() {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        Customers
      </h1>
      <p className="mt-1.5 max-w-2xl text-small leading-snug text-muted-foreground">
        View and manage customer accounts, activity, and delivery history.
      </p>
    </header>
  );
}
