"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/common/components/Logo";
import { ADMIN_SHELL_HEADER } from "./layout";
import AdminIconButton, { CloseIcon } from "./AdminIconButton";

const navItems = [
  { label: "Overview", href: "/overview" },
  { label: "Deliveries", href: "/deliveries" },
  { label: "Orchestration", href: "/orchestration" },
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/overview") return pathname === "/overview";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className={`flex justify-between px-5 ${ADMIN_SHELL_HEADER}`}>
        <div>
          <Link
            href="/overview"
            onClick={onClose}
            className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          >
            <Logo className="text-xl" />
          </Link>
          <p className="mt-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Operations
          </p>
        </div>
        <AdminIconButton
          icon={<CloseIcon />}
          label="Close navigation menu"
          className="lg:hidden"
          onClick={onClose}
        />
      </div>

      <nav className="flex-1 px-3 py-4" aria-label="Admin navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block rounded-md px-3 py-2.5 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    active
                      ? "bg-surface-accent text-foreground"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-caption font-bold text-accent-foreground"
            aria-hidden="true"
          >
            AO
          </span>
          <div>
            <p className="text-small font-semibold text-foreground">Admin</p>
            <p className="text-caption text-muted-foreground">Operations</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/30"
            aria-label="Close navigation menu"
            onClick={onClose}
          />
          <aside className="relative flex h-full w-[min(280px,85vw)] flex-col bg-background shadow-md">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
