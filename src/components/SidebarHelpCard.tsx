import { ChatHelpIcon } from "./icons/navIcons";

export default function SidebarHelpCard() {
  return (
    <div className="rounded-card border border-border bg-surface/40 p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600"
          aria-hidden="true"
        >
          <ChatHelpIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-small font-semibold text-foreground">Need help?</p>
          <button
            type="button"
            className="mt-0.5 cursor-pointer text-caption font-medium text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Contact support
          </button>
        </div>
      </div>
    </div>
  );
}
