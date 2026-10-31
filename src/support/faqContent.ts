export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: "deliveries" | "providers" | "integrations" | "account" | "operations";
};

export const SUPPORT_FAQ_ITEMS: FaqItem[] = [
  {
    id: "find-delivery",
    category: "deliveries",
    question: "How do I find a delivery?",
    answer:
      "Open Deliveries and search by delivery ID, customer, or status. Use status filters (for example Cancelled or Failed) from Reports deep links when investigating issues. Open a row for full detail, timeline, and related orchestration.",
  },
  {
    id: "delivery-stuck",
    category: "deliveries",
    question: "A delivery looks stuck — what should I check?",
    answer:
      "Open the delivery detail and review status history, provider assignment, and payment state. Check Reports for matching or cancel-rate spikes, then confirm the linked provider’s credentials and integration health under Providers and Integrations.",
  },
  {
    id: "cancel-failed",
    category: "deliveries",
    question: "Where do cancel and failure reasons show up?",
    answer:
      "Delivery detail and Reports feedback surfaces include outcome reasons and issue tags when the platform recorded them. Use Reports → Needs attention and the feedback section to spot recurring cancel or failure patterns.",
  },
  {
    id: "provider-status",
    category: "providers",
    question: "How do I check if a provider is healthy?",
    answer:
      "Open Providers, select the partner, and review status, credentials, and recent activity. Credential or API issues usually show on the provider detail page and under Integrations when a related service is degraded.",
  },
  {
    id: "edit-provider",
    category: "providers",
    question: "Can I edit provider credentials from admin?",
    answer:
      "Yes. From a provider’s detail page, use the credentials or edit flows to update API keys and configuration. After changes, re-check Integrations and a recent delivery that used that partner.",
  },
  {
    id: "integrations-down",
    category: "integrations",
    question: "What does a red or degraded integration mean?",
    answer:
      "Integrations shows connectivity for email, auth, database, encryption, and related services. A degraded or failed check means that subsystem needs attention—open the card for short guidance, then verify environment config and credentials before retrying affected flows.",
  },
  {
    id: "who-has-access",
    category: "account",
    question: "Who can sign in to the admin panel?",
    answer:
      "Only accounts with admin access configured for this environment. If you cannot sign in, confirm your email with the platform owner and that your session has not expired—expired sessions redirect to login automatically.",
  },
  {
    id: "session-expired",
    category: "account",
    question: "Why was I signed out suddenly?",
    answer:
      "Admin access tokens expire after a short period for security. When the session expires, the panel clears credentials and sends you to login. Sign in again to continue; unfinished form work may need to be re-entered.",
  },
  {
    id: "reports-use",
    category: "operations",
    question: "How should I use Reports day to day?",
    answer:
      "Start with the issue queue and health KPIs for the selected date range. Drill into cancel or failure filters on Deliveries, then review provider and orchestration accountability when rates look off. Feedback and reasons help prioritize what to fix first.",
  },
  {
    id: "settings-vs-integrations",
    category: "operations",
    question: "What’s the difference between Settings and Integrations?",
    answer:
      "Settings covers account, platform config, and runtime policies (mostly read-only snapshots). Integrations covers live service health—email, auth, database, and similar. Use Providers for logistics partner APIs separately from those pages.",
  },
  {
    id: "contact-support",
    category: "account",
    question: "How do I contact Doot support?",
    answer:
      "Email support@doot.com. Support hours are typically Monday–Saturday, 9 AM – 6 PM IST. Include delivery IDs, provider names, and screenshots when reporting ops issues so the team can investigate faster.",
  },
];

export const FAQ_CATEGORIES: { id: FaqItem["category"]; label: string }[] = [
  { id: "deliveries", label: "Deliveries" },
  { id: "providers", label: "Providers" },
  { id: "integrations", label: "Integrations" },
  { id: "operations", label: "Operations" },
  { id: "account", label: "Account" },
];
