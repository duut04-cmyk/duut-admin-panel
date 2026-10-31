"use client";

import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import { ADMIN_DASHBOARD_RAIL_GRID } from "@/components/layout";
import ContactSupportCard from "./components/ContactSupportCard";
import QuickLinksCard from "./components/QuickLinksCard";
import SupportFaqSection from "./components/SupportFaqSection";
import SupportGettingStarted from "./components/SupportGettingStarted";
import SupportPageHeader from "./components/SupportPageHeader";

export default function SupportPage() {
  return (
    <AdminShell mainClassName="bg-background" customHeader={<SupportPageHeader />}>
      <AdminContainer flushTop className="space-y-6 pb-10">
        <div
          className={`grid gap-5 lg:items-start lg:gap-x-6 ${ADMIN_DASHBOARD_RAIL_GRID}`}
        >
          <div className="flex min-w-0 flex-col gap-5">
            <SupportGettingStarted />
            <SupportFaqSection />
            <div className="flex items-start gap-3 rounded-card border border-border/60 bg-background px-4 py-3 shadow-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                i
              </span>
              <p className="text-caption leading-relaxed text-muted-foreground md:text-small">
                For an active delivery issue, open the delivery detail and note the ID,
                provider, and status before emailing support. Include screenshots when
                Integrations or credentials look wrong.
              </p>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <ContactSupportCard />
            <QuickLinksCard />
          </aside>
        </div>
      </AdminContainer>
    </AdminShell>
  );
}
