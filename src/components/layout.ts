/** Shared shell layout tokens — keep sidebar, top bar, and page content aligned. */

export const ADMIN_SHELL_TOPBAR_HEIGHT = "h-14";

/** Fixed sidebar width — 220px on tablet landscape, 240px from lg up. */
export const ADMIN_SHELL_SIDEBAR_WIDTH = "w-[220px] lg:w-[240px]";

/** Fixed sidebar visible: tablet landscape (md+) and all desktop (lg+). */
export const ADMIN_SHELL_SIDEBAR_FIXED = "hidden md:landscape:flex lg:flex";

/** Drawer chrome (hamburger, close, overlay) hidden when fixed sidebar is shown. */
export const ADMIN_SHELL_SIDEBAR_DRAWER_CHROME_HIDDEN = "md:landscape:hidden lg:hidden";

/** Offset main content when fixed sidebar is shown — must match sidebar widths. */
export const ADMIN_SHELL_MAIN_OFFSET = "md:landscape:pl-[220px] lg:pl-[240px]";

export const ADMIN_SHELL_RIGHT_RAIL_WIDTH = "w-[340px]";

export const ADMIN_DASHBOARD_RAIL_GRID = "xl:grid-cols-[minmax(0,1fr)_340px]";

/** Horizontal inset for page headers and main content — must stay in sync. */
export const ADMIN_SHELL_CONTENT_PADDING = "px-4 sm:px-6 lg:px-8";

/** Page title block below global top bar (no bottom border — top bar owns divider). */
export const ADMIN_PAGE_HEADER =
  "flex w-full shrink-0 flex-col justify-center py-5 lg:py-6";

/** Match media for when the fixed sidebar is active (used in JS). */
export const ADMIN_SHELL_FIXED_SIDEBAR_MEDIA =
  "(min-width: 1024px), (min-width: 768px) and (orientation: landscape)";
