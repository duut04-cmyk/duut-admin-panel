"use client";

import type { ReactNode } from "react";
import Button from "@/common/components/Button";
import AdminCallout from "@/ui/AdminCallout";

type AdminLoadErrorCalloutProps = {
  title: string;
  children: ReactNode;
  onRetry: () => void;
  retrying?: boolean;
};

export default function AdminLoadErrorCallout({
  title,
  children,
  onRetry,
  retrying = false,
}: AdminLoadErrorCalloutProps) {
  return (
    <AdminCallout variant="warning" title={title}>
      {children}
      <Button
        type="button"
        className="mt-3"
        onClick={onRetry}
        disabled={retrying}
        aria-busy={retrying}
      >
        {retrying ? "Retrying…" : "Retry"}
      </Button>
    </AdminCallout>
  );
}
