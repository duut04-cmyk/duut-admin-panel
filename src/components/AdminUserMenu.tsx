"use client";

import { useEffect, useRef, useState } from "react";
import { mockAdminUser } from "@/data/mockAdminUser";

function ChevronDownIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-muted-foreground"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminUserMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { name, initials, email } = mockAdminUser;

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
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-control py-1.5 pl-1.5 pr-2 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-caption font-bold text-accent-foreground"
          aria-hidden="true"
        >
          {initials}
        </span>
        <span className="hidden text-small font-medium text-foreground sm:inline">
          {name}
        </span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-56 rounded-card border border-border bg-background py-1 shadow-md"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="text-small font-semibold text-foreground">{name}</p>
            <p className="text-caption text-muted-foreground">{email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer px-4 py-2.5 text-left text-small text-foreground transition-colors hover:bg-surface"
            onClick={() => setOpen(false)}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
