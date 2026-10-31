"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

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

type AdminGlobalSearchProps = {
  className?: string;
};

function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
}

export default function AdminGlobalSearch({ className = "" }: AdminGlobalSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [modKey] = useState(() =>
    typeof navigator !== "undefined" && isMacPlatform() ? "⌘" : "Ctrl",
  );

  const onPayments = pathname === "/payments" || pathname.startsWith("/payments/");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isChord =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isChord) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (onPayments) {
      if (!trimmed) {
        router.push("/payments");
        return;
      }
      router.push(`/payments?search=${encodeURIComponent(trimmed)}`);
      return;
    }
    if (!trimmed) {
      router.push("/deliveries");
      return;
    }
    router.push(`/deliveries?search=${encodeURIComponent(trimmed)}`);
  };

  const placeholder = onPayments
    ? "Search payments, order IDs, or transaction IDs…"
    : "Search deliveries";
  const ariaLabel = onPayments
    ? "Search payments by order ID, payment ID, or transaction ID"
    : "Search deliveries by reference or UUID";

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative min-w-0 w-full max-w-2xl ${className}`}
      role="search"
    >
      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
        <SearchIcon />
      </div>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full min-w-0 rounded-control border border-border bg-background py-2 pl-10 pr-14 text-small text-foreground placeholder:text-muted-foreground transition-colors hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
        title={ariaLabel}
        aria-label={ariaLabel}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <kbd className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {modKey} K
        </kbd>
      </span>
    </form>
  );
}
