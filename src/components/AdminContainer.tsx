import type { ReactNode } from "react";
import { ADMIN_SHELL_CONTENT_PADDING } from "./layout";

type AdminContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function AdminContainer({
  children,
  className = "",
}: AdminContainerProps) {
  return (
    <div
      className={`w-full py-4 lg:py-6 ${ADMIN_SHELL_CONTENT_PADDING} ${className}`}
    >
      {children}
    </div>
  );
}
