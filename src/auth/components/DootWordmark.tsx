import { DM_Serif_Display } from "next/font/google";

const dootSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type DootWordmarkProps = {
  className?: string;
  variant?: "sans" | "serif";
  /** Light wordmark for dark navy sidebars. */
  onDark?: boolean;
};

function SansDootLogo({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-baseline font-sans font-bold tracking-tight ${
        onDark ? "text-white" : "text-foreground"
      } ${className}`}
      aria-label="Doot"
    >
      D
      <span className="relative inline-block">
        o
        <span
          className="absolute left-1/2 top-[0.42em] h-[0.28em] w-[0.28em] -translate-x-1/2 rounded-full bg-accent"
          aria-hidden="true"
        />
      </span>
      ot
    </span>
  );
}

export default function DootWordmark({
  className = "",
  variant = "serif",
  onDark = false,
}: DootWordmarkProps) {
  if (variant === "sans") {
    return <SansDootLogo className={className} onDark={onDark} />;
  }

  return (
    <span
      className={`${dootSerif.className} ${onDark ? "text-white" : "text-foreground"} ${className}`}
      aria-label="Doot"
    >
      Doot
    </span>
  );
}
