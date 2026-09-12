import DootWordmark from "./DootWordmark";

const features = [
  {
    title: "Multiple Delivery Partners",
    description: "Access the best rates and services from leading logistics providers.",
    iconBg: "bg-orange-50 text-orange-500",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <path
          d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Real-time Tracking",
    description: "Stay updated with live tracking and proactive notifications.",
    iconBg: "bg-emerald-50 text-emerald-600",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <path
          d="M12 3l7 4v6c0 3.5-2.8 6.5-7 8-4.2-1.5-7-4.5-7-8V7l7-4z"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Flexible Scheduling",
    description: "Book deliveries instantly or schedule for your convenience.",
    iconBg: "bg-sky-50 text-sky-600",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Orchestration",
    description:
      "We find the best option based on price, speed, capacity and your needs.",
    iconBg: "bg-violet-50 text-violet-600",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <path
          d="M8 5a4 4 0 0 1 8 0v1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1"
          strokeLinejoin="round"
        />
        <path d="M9 14h6M10 17h4M12 3v1.5" strokeLinecap="round" />
        <circle cx="9.5" cy="9" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="9" r="0.75" fill="currentColor" stroke="none" />
        <path
          d="M6 11.5h1.5M16.5 11.5H18M7 14h1M16 14h1"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    ),
  },
];

export default function AdminLoginMarketing() {
  return (
    <section className="relative z-10 w-full max-w-[460px]">
      <header>
        <DootWordmark variant="sans" className="text-[2.375rem] leading-none" />
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Smart delivery orchestration
        </p>
      </header>

      <div className="mt-9">
        <h1 className="text-[2.5rem] font-bold leading-[1.12] tracking-tight text-foreground xl:text-[2.75rem]">
          <span className="block whitespace-nowrap">Smarter deliveries.</span>
          <span className="mt-1 block whitespace-nowrap">
            Powered by <span className="text-accent">Doot.</span>
          </span>
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
          One platform. Multiple delivery partners. Intelligent orchestration. Faster,
          safer and more reliable deliveries for your business.
        </p>
      </div>

      <ul className="mt-8 space-y-6">
        {features.map((feature) => (
          <li key={feature.title} className="flex gap-3.5">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${feature.iconBg}`}
            >
              {feature.icon}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[16px] font-semibold leading-tight text-foreground">
                {feature.title}
              </p>
              <p className="mt-1.5 text-[14px] leading-snug text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
