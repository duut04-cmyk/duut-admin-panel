import Link from "next/link";
import { ArrowRightIcon } from "@/auth/components/icons";

const links = [
  {
    href: "/deliveries",
    label: "Deliveries",
    description: "Search status, detail, and timelines.",
  },
  {
    href: "/providers",
    label: "Providers",
    description: "Partner health and credentials.",
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Ops KPIs and needs attention.",
  },
  {
    href: "/integrations",
    label: "Integrations",
    description: "Email, auth, and service status.",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Account, platform, and policies.",
  },
] as const;

export default function QuickLinksCard() {
  return (
    <section className="overflow-hidden rounded-card border border-border/60 bg-background p-5 shadow-sm">
      <h3 className="text-body font-bold text-foreground">Quick links</h3>
      <p className="mt-1 text-caption text-muted-foreground">
        Jump to common admin destinations.
      </p>

      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-3 transition-colors hover:bg-surface/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-small font-semibold text-foreground">
                  {link.label}
                </span>
                <span className="block text-caption text-muted-foreground">
                  {link.description}
                </span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
