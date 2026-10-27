"use client";

import { useState } from "react";
import type { DeliveryEvent } from "@/data/orchestrationTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import AdminTabs, { AdminTabPanel } from "@/ui/AdminTabs";
import OrchestrationDetailCard from "./OrchestrationDetailCard";
import TimelineEventPill from "./TimelineEventPill";
import { EVENT_LABELS, formatTimestamp, formatTraceTimestamp } from "./utils";

type LifecyclePanelProps = {
  events: DeliveryEvent[];
};

const LIFECYCLE_TABS = [
  { id: "timeline", label: "Timeline" },
  { id: "trace", label: "Operational trace" },
] as const;

type LifecycleTabId = (typeof LIFECYCLE_TABS)[number]["id"];

function TimelineContent({ events }: { events: DeliveryEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <div className="max-w-3xl">
      <ol className="relative space-y-0">
        {sorted.map((event, index) => {
          const isLast = index === sorted.length - 1;
          return (
            <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className="absolute left-[7px] top-4 h-full w-px bg-border/60"
                  aria-hidden="true"
                />
              )}
              <span
                className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-background bg-orange-500 ring-2 ring-orange-500/20"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
                  <p className="font-medium text-foreground">
                    {EVENT_LABELS[event.type]}
                  </p>
                  <time
                    dateTime={event.timestamp}
                    className="text-caption tabular-nums text-muted-foreground"
                  >
                    {formatTimestamp(event.timestamp)}
                  </time>
                </div>
                <TimelineEventPill eventType={event.type} className="mt-1.5" />
                {event.description && (
                  <p className="mt-2 text-small text-muted-foreground">
                    {event.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TraceContent({ events }: { events: DeliveryEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <ol
      className="grid list-none gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Orchestration operational trace"
    >
      {sorted.map((event) => (
        <li key={event.id} className="flex gap-3">
          <span
            className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-background bg-orange-500 ring-2 ring-orange-500/20"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
              <p className="font-medium text-foreground">{EVENT_LABELS[event.type]}</p>
              <time
                dateTime={event.timestamp}
                className="text-caption tabular-nums text-muted-foreground"
              >
                {formatTraceTimestamp(event.timestamp)}
              </time>
            </div>
            <TimelineEventPill eventType={event.type} className="mt-1.5" />
            {event.description && (
              <p className="mt-2 text-small text-muted-foreground">
                {event.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function LifecyclePanel({ events }: LifecyclePanelProps) {
  const [activeTab, setActiveTab] = useState<LifecycleTabId>("timeline");

  return (
    <section aria-labelledby="lifecycle-panel-heading">
      <AdminSectionHeader
        title="Lifecycle"
        description="Full lifecycle from request to outcome."
      />

      <OrchestrationDetailCard className="mt-4 p-5 md:p-6">
        <AdminTabs
          tabs={[...LIFECYCLE_TABS]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as LifecycleTabId)}
          aria-label="Orchestration lifecycle views"
        />

        <AdminTabPanel
          id="panel-lifecycle-timeline"
          tabId="tab-lifecycle-timeline"
          active={activeTab === "timeline"}
        >
          <TimelineContent events={events} />
        </AdminTabPanel>

        <AdminTabPanel
          id="panel-lifecycle-trace"
          tabId="tab-lifecycle-trace"
          active={activeTab === "trace"}
        >
          <TraceContent events={events} />
        </AdminTabPanel>
      </OrchestrationDetailCard>
    </section>
  );
}
