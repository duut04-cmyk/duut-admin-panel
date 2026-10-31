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

const SIDEBAR_BG = "bg-[#0B1F3A]";
const SIDEBAR_BORDER = "border-white/10";

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
        className={`flex shrink-0 items-center justify-between border-b ${SIDEBAR_BORDER} ${
          variant === "drawer"
            ? "px-4 py-4 pt-[max(16px,env(safe-area-inset-top))] sm:px-5"
            : "px-5 pt-5 pb-6 lg:pt-6 lg:pb-7"
        }`}
      >
        <Link
          href="/overview"
          onClick={handleClose}
          className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50"
        >
          <DootWordmark
            variant="sans"
            onDark
            className={
              variant === "drawer"
                ? "text-2xl leading-none"
                : "text-[1.75rem] leading-none lg:text-[1.85rem]"
            }
          />
        </Link>
        {variant === "drawer" && (
          <AdminIconButton
            icon={<CloseIcon />}
            label="Close navigation menu"
            onClick={handleClose}
            className="text-white hover:bg-white/10 focus-visible:outline-sky-400/50"
          />
        )}
      </div>

      <nav
        className={`flex-1 overflow-y-auto ${variant === "drawer" ? "px-3 pt-4" : "px-3 pt-1"}`}
        aria-label="Admin navigation"
      >
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-1 px-3 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white/35">
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
                      className={`flex min-h-11 items-center gap-2.5 rounded-[6px] px-3 py-2.5 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50 ${
                        active
                          ? "bg-[#2B6CB0] text-white shadow-sm"
                          : "text-white/65 hover:bg-white/5 hover:text-white"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className={`shrink-0 px-3 ${
          variant === "drawer"
            ? "pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            : "pb-4"
        }`}
      >
        <SidebarHelpCard />
      </div>
    </>
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex-col border-r ${SIDEBAR_BORDER} ${SIDEBAR_BG} ${ADMIN_SHELL_SIDEBAR_FIXED} ${ADMIN_SHELL_SIDEBAR_WIDTH}`}
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
            className="absolute inset-0 cursor-pointer bg-black/50 motion-safe:animate-[fade-in_0.2s_ease-out]"
            aria-label="Close navigation menu"
            onClick={handleClose}
          />
          <aside
            ref={drawerPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className={`relative flex h-full w-[min(280px,85vw)] flex-col border-r ${SIDEBAR_BORDER} ${SIDEBAR_BG} shadow-xl motion-safe:animate-[slide-in-left_0.25s_ease-out]`}
          >
            {sidebarContent("drawer")}
          </aside>
        </div>
      )}
    </>
  );
}
