type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center text-foreground ${className}`}
      aria-label="Dutt"
    >
      <svg
        viewBox="0 0 96 28"
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
          letterSpacing="0.5"
        >
          D
        </text>
        <path
          d="M24 12c0 7 5 12 12 12s12-5 12-12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <text
          x="52"
          y="22"
          fontSize="22"
          fontWeight="700"
          fontFamily="inherit"
          letterSpacing="2"
        >
          TT
        </text>
      </svg>
    </span>
  );
}
