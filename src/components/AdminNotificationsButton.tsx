"use client";

import { useEffect, useRef, useState } from "react";

function BellIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M10 3.5a4 4 0 0 0-4 4v2.5l-1.5 2.5h11L14 10V7.5a4 4 0 0 0-4-4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 15.5a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

type AdminNotificationsButtonProps = {
  hasUnread?: boolean;
};

export default function AdminNotificationsButton({
  hasUnread = false,
}: AdminNotificationsButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-control text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <BellIcon />
        {hasUnread && (
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-admin-danger ring-2 ring-background"
            aria-hidden="true"
          />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-card border border-border bg-background p-4 shadow-md">
          <p className="text-small font-semibold text-foreground">Notifications</p>
          <p className="mt-2 text-caption text-muted-foreground">
            No new notifications.
          </p>
        </div>
      )}
    </div>
  );
}
