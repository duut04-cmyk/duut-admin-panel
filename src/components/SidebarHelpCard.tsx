import Link from "next/link";
import { SUPPORT_PATH } from "@/support/paths";

export default function SidebarHelpCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <p className="text-caption font-semibold text-white">Need help?</p>
      <p className="mt-1 text-caption leading-relaxed text-white/50">
        Questions about deliveries, providers, or account access.
      </p>
      <Link
        href={SUPPORT_PATH}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-caption font-semibold text-accent transition-colors hover:text-accent/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50"
      >
        Contact support
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
