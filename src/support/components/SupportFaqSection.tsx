"use client";

import { useMemo, useState } from "react";
import { FAQ_CATEGORIES, SUPPORT_FAQ_ITEMS, type FaqItem } from "../faqContent";

function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SupportFaqSection() {
  const [activeCategory, setActiveCategory] = useState<FaqItem["category"] | "all">(
    "all",
  );
  const [openId, setOpenId] = useState<string | null>(SUPPORT_FAQ_ITEMS[0]?.id ?? null);

  const items = useMemo(() => {
    if (activeCategory === "all") return SUPPORT_FAQ_ITEMS;
    return SUPPORT_FAQ_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="overflow-hidden rounded-card border border-border/60 bg-background p-5 shadow-sm md:p-6">
      <h2 className="text-body font-bold text-foreground md:text-body-lg">
        Frequently asked questions
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Clear answers about deliveries, providers, integrations, and admin access.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-pill px-3.5 py-1.5 text-caption font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            activeCategory === "all"
              ? "bg-accent text-accent-foreground"
              : "bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {FAQ_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`rounded-pill px-3.5 py-1.5 text-caption font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              activeCategory === category.id
                ? "bg-accent text-accent-foreground"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-5 divide-y divide-border border-t border-border">
        {items.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div key={item.id} className="py-4">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full cursor-pointer items-start justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-expanded={isOpen}
              >
                <span className="text-small font-semibold text-foreground md:text-body">
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen ? (
                <p className="mt-3 text-small leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
