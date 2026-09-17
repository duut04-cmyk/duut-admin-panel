"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-muted-foreground"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminGlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/deliveries");
      return;
    }
    router.push(`/deliveries?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative min-w-0 w-full max-w-2xl"
      role="search"
    >
      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
        <SearchIcon />
      </div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search deliveries..."
        className="h-10 w-full min-w-0 rounded-[var(--radius-control)] border border-border bg-background py-2 pl-10 pr-4 text-small text-foreground placeholder:text-muted-foreground transition-colors hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
        title="Search by delivery ID, location, or service"
        aria-label="Search deliveries"
      />
    </form>
  );
}
