import { ArrowRightIcon } from "@/auth/components/icons";

function IconMessage({ className = "h-5 w-5" }: { className?: string }) {
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
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactSupportCard() {
  return (
    <section
      id="contact"
      className="rounded-card border border-accent/25 bg-gradient-to-br from-accent/10 to-accent/5 p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <IconMessage />
        </span>
        <div>
          <h3 className="text-body font-bold text-foreground">Contact support</h3>
          <p className="mt-2 text-small leading-relaxed text-muted-foreground">
            Our team can help with delivery investigations, provider access, and account
            questions.
          </p>
          <p className="mt-3 text-small text-foreground">
            <span className="font-medium">Email:</span>{" "}
            <a
              href="mailto:support@doot.com"
              className="font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              support@doot.com
            </a>
          </p>
          <p className="mt-1 text-small text-foreground">
            <span className="font-medium">Hours:</span> Mon–Sat, 9 AM – 6 PM IST
          </p>
          <a
            href="mailto:support@doot.com"
            className="mt-4 inline-flex items-center gap-1.5 text-small font-semibold text-accent transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Send us a message
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
