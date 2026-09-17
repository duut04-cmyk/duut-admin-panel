import type { InputHTMLAttributes, ReactNode } from "react";
import Input from "@/common/components/Input";

type AuthFieldInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
};

const authInputClass =
  "h-12 rounded-[4px] pl-10 pr-4 border-border/80 bg-background sm:rounded-lg";

export default function AuthFieldInput({
  leadingIcon,
  trailingSlot,
  error = false,
  className = "",
  ...props
}: AuthFieldInputProps) {
  return (
    <div className="relative">
      {leadingIcon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          {leadingIcon}
        </span>
      )}
      <Input
        error={error}
        className={`${authInputClass} ${trailingSlot ? "pr-11" : ""} ${className}`}
        {...props}
      />
      {trailingSlot}
    </div>
  );
}
