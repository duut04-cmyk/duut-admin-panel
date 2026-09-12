import { FlowArrow } from "./FlowSteps";

function UnderstandIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

function CheckNetworkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScoreOptionsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M12 3l2.4 4.8 5.4.8-3.9 3.8.9 5.3L12 15.8 7.2 17.7l.9-5.3L4.2 8.6l5.4-.8L12 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SelectOptionIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.2 7.5 10.8 16M15.8 7.5 13.2 16" strokeLinecap="round" />
    </svg>
  );
}

function BookTrackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STEPS = [
  {
    key: "understand",
    title: "Understand Request",
    description: "We analyze pickup, drop, package, timing and special requirements.",
    iconBg: "bg-[#fff7ed]",
    iconColor: "text-[#f97316]",
    Icon: UnderstandIcon,
  },
  {
    key: "check",
    title: "Check Network",
    description: "We check multiple delivery services and driver availability.",
    iconBg: "bg-[#f0fdf4]",
    iconColor: "text-[#15803d]",
    Icon: CheckNetworkIcon,
  },
  {
    key: "score",
    title: "Score Options",
    description:
      "Eligible services are scored on availability, price, ETA and quality.",
    iconBg: "bg-[#fefce8]",
    iconColor: "text-[#ca8a04]",
    Icon: ScoreOptionsIcon,
  },
  {
    key: "select",
    title: "Select Best Option",
    description: "The highest value option is selected automatically.",
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-[#2563eb]",
    Icon: SelectOptionIcon,
  },
  {
    key: "book",
    title: "Book & Track",
    description: "We book the service and monitor the delivery till completion.",
    iconBg: "bg-[#faf5ff]",
    iconColor: "text-[#9333ea]",
    Icon: BookTrackIcon,
  },
];

export default function OrchestrationExplanation() {
  return (
    <article
      className="rounded-xl border border-border/80 bg-background p-6 font-sans antialiased"
      aria-labelledby="orchestration-explanation-heading"
    >
      <h2
        id="orchestration-explanation-heading"
        className="text-body font-semibold tracking-tight text-foreground md:text-subheading"
      >
        How Doot Orchestrates Deliveries
      </h2>
      <p className="mt-1 text-small leading-relaxed text-muted-foreground">
        Our 5-step process to deliver the best experience
      </p>

      <ol className="mt-3 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-3">
        {STEPS.map((step, index) => (
          <li key={step.key} className="contents">
            <div className="flex min-w-0 flex-1 flex-col items-center text-center lg:max-w-[200px]">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full ${step.iconBg}`}
              >
                <step.Icon className={`h-5 w-5 ${step.iconColor}`} />
              </span>
              <p className="mt-2 text-small font-medium text-foreground">
                {step.title}
              </p>
              <p className="mt-1 min-h-10 max-w-[200px] text-caption leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
            {index < STEPS.length - 1 && <FlowArrow className="lg:self-center" />}
          </li>
        ))}
      </ol>
    </article>
  );
}
