/** Shared shell layout tokens — keep sidebar, top bar, and page content aligned. */

export const ADMIN_SHELL_TOPBAR_HEIGHT = "h-14";

/** Fixed sidebar width — shown from xl up only. */
export const ADMIN_SHELL_SIDEBAR_WIDTH = "w-[240px]";

/** Fixed sidebar visible from xl up; below xl (portrait + landscape) uses drawer. */
export const ADMIN_SHELL_SIDEBAR_FIXED = "hidden xl:flex";

/** Drawer chrome (hamburger, close, overlay) hidden when fixed sidebar is shown. */
export const ADMIN_SHELL_SIDEBAR_DRAWER_CHROME_HIDDEN = "xl:hidden";

/** Offset main content when fixed sidebar is shown — must match sidebar width. */
export const ADMIN_SHELL_MAIN_OFFSET = "xl:pl-[240px]";

export const ADMIN_SHELL_RIGHT_RAIL_WIDTH = "w-[340px]";

export const ADMIN_DASHBOARD_RAIL_GRID = "xl:grid-cols-[minmax(0,1fr)_340px]";

/** Orchestration detail: main content + sticky reference sidebar. */
export const ADMIN_DETAIL_RAIL_GRID = "xl:grid-cols-[minmax(0,1fr)_380px]";

/** Horizontal inset for page headers and main content — must stay in sync. */
export const ADMIN_SHELL_CONTENT_PADDING = "px-4 sm:px-6 lg:px-8";

/** Page title block below global top bar (no bottom border — top bar owns divider). */
export const ADMIN_PAGE_HEADER =
  "flex w-full shrink-0 flex-col justify-center pt-3 pb-3 xl:pt-2 xl:pb-2 2xl:pt-3 2xl:pb-3";

/** Shared spacing for Deliveries / Orchestration list pages. */
export const ADMIN_LIST_PAGE_CONTAINER = "space-y-8 pb-10";

/** Gap between filter toolbar and list section below. */
export const ADMIN_LIST_PAGE_FILTERS_SECTION = "space-y-3";

/** Match media for when the fixed sidebar is active (used in JS) — Tailwind xl. */
export const ADMIN_SHELL_FIXED_SIDEBAR_MEDIA = "(min-width: 1280px)";
