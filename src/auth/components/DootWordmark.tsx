import { DM_Serif_Display } from "next/font/google";

const dootSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type DootWordmarkProps = {
  className?: string;
  variant?: "sans" | "serif";
};

function SansDootLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-sans font-bold tracking-tight text-foreground ${className}`}
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
}: DootWordmarkProps) {
  if (variant === "sans") {
    return <SansDootLogo className={className} />;
  }

  return (
    <span
      className={`${dootSerif.className} text-foreground ${className}`}
      aria-label="Doot"
    >
      Doot
    </span>
  );
}
