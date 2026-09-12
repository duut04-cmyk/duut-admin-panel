/** Shared shell layout tokens — keep sidebar, top bar, and page content aligned. */

export const ADMIN_SHELL_TOPBAR_HEIGHT = "h-14";

export const ADMIN_SHELL_SIDEBAR_WIDTH = "w-[240px]";

/** Offset main content when desktop sidebar is fixed. */
export const ADMIN_SHELL_MAIN_OFFSET = "lg:pl-[240px]";

export const ADMIN_SHELL_RIGHT_RAIL_WIDTH = "w-[340px]";

export const ADMIN_DASHBOARD_RAIL_GRID = "xl:grid-cols-[minmax(0,1fr)_340px]";

/** Horizontal inset for page headers and main content — must stay in sync. */
export const ADMIN_SHELL_CONTENT_PADDING =
  "px-4 sm:px-6 lg:px-8";

/** Page title block below global top bar (no bottom border — top bar owns divider). */
export const ADMIN_PAGE_HEADER =
  "flex w-full shrink-0 flex-col justify-center py-5 lg:py-6";
