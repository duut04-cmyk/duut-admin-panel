/**
 * DEV ONLY — Admin design system component showcase.
 * Remove before production launch.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import AdminBadge from "@/ui/AdminBadge";
import AdminCallout from "@/ui/AdminCallout";
import AdminCard from "@/ui/AdminCard";
import AdminChartCard from "@/ui/AdminChartCard";
import AdminContainer from "@/components/AdminContainer";
import AdminDataRow from "@/ui/AdminDataRow";
import AdminDateRange from "@/ui/AdminDateRange";
import AdminEmptyState from "@/ui/AdminEmptyState";
import AdminFilter from "@/ui/AdminFilter";
import AdminMetricCard from "@/ui/AdminMetricCard";
import AdminProgress from "@/ui/AdminProgress";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import AdminSelect from "@/ui/AdminSelect";
import AdminShell from "@/components/AdminShell";
import AdminSkeleton from "@/ui/AdminSkeleton";
import AdminStatus from "@/ui/AdminStatus";
import AdminTabs, { AdminTabPanel } from "@/ui/AdminTabs";
import AdminTrend from "@/ui/AdminTrend";

function ShowcaseSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="border-b border-border pb-2 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function AdminDesignSystem() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilter, setActiveFilter] = useState("status");
  const [dateRange, setDateRange] = useState("7d");
  const [statusFilter, setStatusFilter] = useState("all");

  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "delivered", label: "Delivered" },
    { id: "failed", label: "Failed" },
  ];

  return (
    <AdminShell
      title="Design system"
      subtitle="Admin UI primitives — development only"
    >
      <AdminContainer className="space-y-10">
        <p className="text-caption font-medium uppercase tracking-wider text-muted-foreground">
          Development only — component showcase, not a dashboard
        </p>

        <ShowcaseSection title="Section header">
          <AdminSectionHeader
            title="Operations performance"
            description="How Dutt is performing across recent delivery activity."
            action={
              <Link
                href="#"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View all →
              </Link>
            }
          />
        </ShowcaseSection>

        <ShowcaseSection title="Metric cards">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard
              label="Total deliveries"
              value="148"
              supportingText="from previous period"
              trend={{ value: "+18.4%", direction: "positive" }}
            />
            <AdminMetricCard
              label="Active deliveries"
              value="23"
              supportingText="currently in progress"
            />
            <AdminMetricCard
              label="Booking success"
              value="95.3%"
              trend={{ value: "+4.1%", direction: "positive" }}
            />
            <AdminMetricCard
              label="Average booking time"
              value="3.2 sec"
              trend={{ value: "-3.2%", direction: "negative" }}
            />
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Trend indicators">
          <div className="flex flex-wrap gap-4">
            <AdminTrend value="+18.4%" direction="positive" />
            <AdminTrend value="-3.2%" direction="negative" />
            <AdminTrend value="0.0%" direction="neutral" />
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Status indicators">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <AdminStatus variant="operational" label="Operational" />
            <AdminStatus variant="active" label="In transit" />
            <AdminStatus variant="success" label="Delivered" />
            <AdminStatus variant="pending" label="Pending" />
            <AdminStatus variant="failed" label="Failed" />
            <AdminStatus variant="warning" label="Warning" />
            <AdminStatus variant="cancelled" label="Cancelled" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <AdminBadge variant="neutral">Badge — neutral</AdminBadge>
            <AdminBadge variant="accent">Badge — accent</AdminBadge>
            <AdminBadge variant="success">Badge — success</AdminBadge>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Data rows">
          <AdminCard className="p-0 px-4 md:px-5">
            <AdminDataRow
              primary="DUTT-1042"
              secondary="Mumbai → Mumbai"
              metadata="2.5 kg"
              status={<AdminStatus variant="active" label="In transit" />}
              trailing={<span className="text-caption text-muted-foreground">Today</span>}
            />
            <AdminDataRow
              primary="Decision #8821"
              secondary="4 options evaluated"
              metadata="Selected in 1.8s"
              status={<AdminStatus variant="success" label="Booked" />}
            />
            <AdminDataRow
              primary="Activity log entry"
              secondary="Orchestration completed"
              metadata="14:32"
              status={<AdminStatus variant="operational" label="Operational" />}
            />
          </AdminCard>
        </ShowcaseSection>

        <ShowcaseSection title="Tabs">
          <AdminTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
          {tabs.map((tab) => (
            <AdminTabPanel
              key={tab.id}
              id={`panel-${tab.id}`}
              tabId={`tab-${tab.id}`}
              active={activeTab === tab.id}
            >
              <p className="text-small text-muted-foreground">
                Tab content for &ldquo;{tab.label}&rdquo; — static placeholder.
              </p>
            </AdminTabPanel>
          ))}
        </ShowcaseSection>

        <ShowcaseSection title="Filters & controls">
          <div className="flex flex-wrap gap-2">
            <AdminFilter
              label="Status"
              active={activeFilter === "status"}
              onClick={() => setActiveFilter("status")}
            />
            <AdminFilter
              label="Date"
              active={activeFilter === "date"}
              onClick={() => setActiveFilter("date")}
            />
            <AdminFilter
              label="Delivery type"
              active={activeFilter === "type"}
              onClick={() => setActiveFilter("type")}
            />
            <AdminFilter
              label="Result"
              active={activeFilter === "result"}
              onClick={() => setActiveFilter("result")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AdminSelect
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </AdminSelect>
            <AdminDateRange value={dateRange} onChange={setDateRange} />
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Progress">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminProgress label="Booking success" value={95.3} tone="success" />
            <AdminProgress label="Selection success" value={98.2} tone="default" />
            <AdminProgress label="Warning threshold" value={72} tone="warning" />
            <AdminProgress label="Failure rate" value={4.7} tone="danger" />
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Empty state">
          <AdminEmptyState
            title="No deliveries yet"
            description="Delivery activity will appear here once requests start coming through Dutt."
          />
        </ShowcaseSection>

        <ShowcaseSection title="Skeleton">
          <div className="space-y-3">
            <AdminSkeleton variant="title" />
            <AdminSkeleton variant="metric" />
            <AdminSkeleton variant="text" />
            <AdminSkeleton variant="row" />
            <AdminSkeleton variant="card" />
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Chart card">
          <AdminChartCard
            title="Delivery volume"
            description="Last 7 days"
            action={
              <span className="text-caption text-muted-foreground">Static preview</span>
            }
          >
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border bg-surface/50 text-small text-muted-foreground">
              Chart area — SVG in future phase
            </div>
          </AdminChartCard>
        </ShowcaseSection>

        <ShowcaseSection title="Callouts">
          <div className="space-y-3">
            <AdminCallout variant="neutral">
              Dutt evaluated 612 delivery options across 148 delivery requests.
            </AdminCallout>
            <AdminCallout variant="accent" title="Orchestration insight">
              4.1 average options per delivery in the selected period.
            </AdminCallout>
            <AdminCallout variant="success" title="Booking performance">
              95.3% booking success rate maintained across recent activity.
            </AdminCallout>
            <AdminCallout variant="warning" title="Operational note">
              3 deliveries require attention in the current monitoring window.
            </AdminCallout>
          </div>
        </ShowcaseSection>
      </AdminContainer>
    </AdminShell>
  );
}
