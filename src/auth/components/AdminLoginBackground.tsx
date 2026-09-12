export default function AdminLoginBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Flat plate-matched base so image halo and page read as one surface */}
      <div className="absolute inset-0 bg-[#E6F2FD]" />

      {/* Soft center bloom (same family as delivery.png glow) */}
      <div
        className="absolute left-[40%] top-[50%] h-[120%] w-[90%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 48%, #E6F2FD 0%, #E6F2FD 45%, #EAF4FB 70%, #F2F8FC 88%, transparent 100%)",
        }}
      />

      {/* Subtle right→left S, low contrast so it doesn't break the plate */}
      <svg
        className="absolute inset-0 z-[1] h-full w-full opacity-40"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <g transform="scale(-1 1) translate(-1440 0)">
          <path
            d="M380 0C480 80 560 160 620 280C680 400 640 520 700 640C760 760 820 840 900 900H380C300 780 280 660 320 520C360 380 300 220 280 100C270 40 320 0 380 0Z"
            fill="url(#auth-s-center)"
          />
          <path
            d="M0 0H520C460 140 540 280 480 420C420 560 500 700 460 900H0V0Z"
            fill="url(#auth-s-side)"
            opacity="0.7"
          />
        </g>
        <defs>
          <linearGradient
            id="auth-s-center"
            x1="1060"
            y1="0"
            x2="540"
            y2="900"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D7EAF8" />
            <stop offset="0.5" stopColor="#E0EFF9" />
            <stop offset="1" stopColor="#E6F2FD" />
          </linearGradient>
          <linearGradient
            id="auth-s-side"
            x1="1440"
            y1="0"
            x2="920"
            y2="900"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DCECF8" />
            <stop offset="1" stopColor="#E6F2FD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
