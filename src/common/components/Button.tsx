import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  secondary:
    "border border-border bg-background text-foreground hover:bg-surface active:bg-surface/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30",
  ghost:
    "bg-transparent text-foreground hover:bg-surface active:bg-surface/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20",
};

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center h-11 px-5 text-small font-medium rounded-control transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";

export default function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
