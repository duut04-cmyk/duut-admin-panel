export type LiveActivityType =
  | "completed"
  | "created"
  | "assigned"
  | "in_progress"
  | "request_received";

export type LiveActivityEvent = {
  id: string;
  type: LiveActivityType;
  message: string;
  deliveryId: string;
  category: string;
  timestamp: string;
};

/** Figma-aligned live activity feed (5 items). */
export const mockLiveActivity: LiveActivityEvent[] = [
  {
    id: "act-1",
    type: "completed",
    message: "Delivery completed",
    deliveryId: "DOOT-1042",
    category: "Medicine",
    timestamp: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "act-2",
    type: "created",
    message: "New booking",
    deliveryId: "DOOT-1043",
    category: "Food",
    timestamp: new Date(Date.now() - 4 * 60_000).toISOString(),
  },
  {
    id: "act-3",
    type: "assigned",
    message: "Provider assigned",
    deliveryId: "DOOT-1042",
    category: "FlashDrop",
    timestamp: new Date(Date.now() - 7 * 60_000).toISOString(),
  },
  {
    id: "act-4",
    type: "in_progress",
    message: "Delivery in progress",
    deliveryId: "DOOT-1041",
    category: "Documents",
    timestamp: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: "act-5",
    type: "request_received",
    message: "New request received",
    deliveryId: "DOOT-1044",
    category: "Medicine",
    timestamp: new Date(Date.now() - 18 * 60_000).toISOString(),
  },
];

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
