export type LiveActivityType =
  "completed" | "created" | "assigned" | "in_progress" | "request_received";

export type LiveActivityEvent = {
  id: string;
  type: LiveActivityType;
  message: string;
  deliveryId: string;
  category: string;
  timestamp: string;
};

const MOCK_ACTIVITY_MODULE_LOADED_AT = Date.now();

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

// #region agent log
if (typeof fetch !== "undefined") {
  fetch("http://127.0.0.1:7573/ingest/c4f73e7b-c72c-4f5f-9daa-652efad20daf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "217f7d",
    },
    body: JSON.stringify({
      sessionId: "217f7d",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "mockLiveActivity.ts:module-init",
      message: "mockLiveActivity module loaded",
      data: {
        env: typeof window === "undefined" ? "server" : "client",
        moduleLoadedAt: MOCK_ACTIVITY_MODULE_LOADED_AT,
        firstEventTimestamp: mockLiveActivity[0]?.timestamp,
        ageOfFirstEventMs:
          Date.now() - new Date(mockLiveActivity[0]?.timestamp ?? 0).getTime(),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const diffMs = now - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  let result: string;
  if (minutes < 1) result = "Just now";
  else if (minutes < 60) result = `${minutes}m ago`;
  else {
    const hours = Math.floor(minutes / 60);
    if (hours < 24) result = `${hours}h ago`;
    else result = `${Math.floor(hours / 24)}d ago`;
  }

  // #region agent log
  if (typeof fetch !== "undefined") {
    fetch("http://127.0.0.1:7573/ingest/c4f73e7b-c72c-4f5f-9daa-652efad20daf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "217f7d",
      },
      body: JSON.stringify({
        sessionId: "217f7d",
        runId: "pre-fix",
        hypothesisId: "B",
        location: "mockLiveActivity.ts:formatRelativeTime",
        message: "formatRelativeTime computed",
        data: {
          env: typeof window === "undefined" ? "server" : "client",
          iso,
          now,
          diffMs,
          result,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion

  return result;
}
