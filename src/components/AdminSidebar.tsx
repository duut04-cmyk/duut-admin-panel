"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import DootWordmark from "@/auth/components/DootWordmark";
import AdminIconButton, { CloseIcon } from "./AdminIconButton";
import {
  ADMIN_SHELL_FIXED_SIDEBAR_MEDIA,
  ADMIN_SHELL_SIDEBAR_DRAWER_CHROME_HIDDEN,
  ADMIN_SHELL_SIDEBAR_FIXED,
  ADMIN_SHELL_SIDEBAR_WIDTH,
} from "./layout";
import { navGroups } from "./navConfig";
import SidebarHelpCard from "./SidebarHelpCard";
import { useDrawerA11y } from "./useDrawerA11y";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const drawerPanelRef = useRef<HTMLElement>(null);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useDrawerA11y(open, handleClose, drawerPanelRef);

  useEffect(() => {
    onClose();
    // Close drawer after navigation; onClose is stable enough from AdminShell state setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname only
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia(ADMIN_SHELL_FIXED_SIDEBAR_MEDIA);
    const sync = () => {
      if (media.matches) handleClose();
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [handleClose]);

  const isActive = (href: string) => {
    if (href === "/overview") return pathname === "/overview";
    return pathname.startsWith(href);
  };

  const sidebarContent = (variant: "fixed" | "drawer") => (
    <>
      <div
        className={`flex shrink-0 items-center justify-between pt-6 pb-4 ${
          variant === "drawer" ? "px-4 sm:px-5" : "px-5"
        }`}
      >
        <Link
          href="/overview"
          onClick={handleClose}
          className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
        >
          <DootWordmark variant="sans" className="text-2xl leading-none" />
        </Link>
        {variant === "drawer" && (
          <AdminIconButton
            icon={<CloseIcon />}
            label="Close navigation menu"
            onClick={handleClose}
          />
        )}
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
                      onClick={handleClose}
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

      <div className="shrink-0 border-t border-border px-4 py-4">
        <SidebarHelpCard />
      </div>
    </>
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex-col border-r border-border bg-background ${ADMIN_SHELL_SIDEBAR_FIXED} ${ADMIN_SHELL_SIDEBAR_WIDTH}`}
      >
        {sidebarContent("fixed")}
      </aside>

      {open && (
        <div
          className={`fixed inset-0 z-50 ${ADMIN_SHELL_SIDEBAR_DRAWER_CHROME_HIDDEN}`}
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/30 motion-safe:animate-[fade-in_0.2s_ease-out]"
            aria-label="Close navigation menu"
            onClick={handleClose}
          />
          <aside
            ref={drawerPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="relative flex h-full w-[min(280px,85vw)] flex-col bg-background shadow-md motion-safe:animate-[slide-in-left_0.25s_ease-out]"
          >
            {sidebarContent("drawer")}
          </aside>
        </div>
      )}
    </>
  );
}
