"use client";

import Button from "@/common/components/Button";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";

type ProviderPageHeaderProps = {
  onAddProvider: () => void;
};

export default function ProviderPageHeader({ onAddProvider }: ProviderPageHeaderProps) {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
            Providers
          </h1>
          <p className="mt-1.5 max-w-2xl text-small leading-snug text-muted-foreground">
            Manage delivery service providers, integrations, and orchestration
            eligibility.
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddProvider}
          className="w-full shrink-0 sm:w-auto"
        >
          Add provider
        </Button>
      </div>
    </header>
  );
}
