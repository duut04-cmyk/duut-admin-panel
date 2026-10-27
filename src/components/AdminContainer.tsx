import type { ReactNode } from "react";
import { ADMIN_SHELL_CONTENT_PADDING } from "./layout";

type AdminContainerProps = {
  children: ReactNode;
  className?: string;
  /** List pages: no top padding below page header; slight gap on xl+ only. */
  flushTop?: boolean;
};

export default function AdminContainer({
  children,
  className = "",
  flushTop = false,
}: AdminContainerProps) {
  const topPadding = flushTop ? "pt-0 lg:pt-0 xl:pt-2" : "pt-4 lg:pt-6";

  return (
    <div
      className={`w-full ${topPadding} pb-4 lg:pb-6 ${ADMIN_SHELL_CONTENT_PADDING} ${className}`}
    >
      {children}
    </div>
  );
}
