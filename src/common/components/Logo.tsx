type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center text-foreground ${className}`}
      aria-label="Doot"
    >
      <svg
        viewBox="0 0 88 28"
        className="h-[1em] w-auto"
        fill="currentColor"
        aria-hidden="true"
      >
        <text
          x="0"
          y="22"
          fontSize="22"
          fontWeight="700"
          fontFamily="inherit"
          letterSpacing="-0.5"
        >
          D
        </text>
        <circle cx="28" cy="14" r="3.5" fill="currentColor" />
        <text
          x="36"
          y="22"
          fontSize="22"
          fontWeight="700"
          fontFamily="inherit"
          letterSpacing="-0.5"
        >
          ot
        </text>
      </svg>
    </span>
  );
}
