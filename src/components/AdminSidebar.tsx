"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/common/components/Logo";
import AdminIconButton, { CloseIcon } from "./AdminIconButton";
import { ADMIN_SHELL_SIDEBAR_WIDTH } from "./layout";
import { navGroups } from "./navConfig";
import SidebarHelpCard from "./SidebarHelpCard";

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
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <Link
          href="/overview"
          onClick={onClose}
          className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
        >
          <Logo className="text-2xl" />
        </Link>
        <AdminIconButton
          icon={<CloseIcon />}
          label="Close navigation menu"
          className="lg:hidden"
          onClick={onClose}
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-r-[var(--radius-control)] py-2.5 pl-3 pr-3 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        active
                          ? "-ml-3 border-l-[3px] border-accent bg-nav-active-bg text-nav-active-text"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${active ? "text-nav-active-text" : ""}`}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <SidebarHelpCard />
      </div>
    </>
  );

  return (
    <>
      <aside className={`hidden shrink-0 flex-col border-r border-border bg-background lg:flex ${ADMIN_SHELL_SIDEBAR_WIDTH}`}>
        {sidebarContent}
      </aside>

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
