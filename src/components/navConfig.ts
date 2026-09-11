import type { ReactNode } from "react";
import {
  CustomersNavIcon,
  DeliveriesNavIcon,
  IntegrationsNavIcon,
  OrchestrationNavIcon,
  OverviewNavIcon,
  ProvidersNavIcon,
  ReportsNavIcon,
  SettingsNavIcon,
} from "./icons/navIcons";

export type NavItem = {
  label: string;
  href: string;
  icon: (props: { className?: string }) => ReactNode;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { label: "Overview", href: "/overview", icon: OverviewNavIcon },
      { label: "Deliveries", href: "/deliveries", icon: DeliveriesNavIcon },
      {
        label: "Orchestration",
        href: "/orchestration",
        icon: OrchestrationNavIcon,
      },
      { label: "Providers", href: "/providers", icon: ProvidersNavIcon },
      { label: "Customers", href: "/customers", icon: CustomersNavIcon },
      { label: "Reports", href: "/reports", icon: ReportsNavIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Integrations",
        href: "/integrations",
        icon: IntegrationsNavIcon,
      },
      { label: "Settings", href: "/settings", icon: SettingsNavIcon },
    ],
  },
];
