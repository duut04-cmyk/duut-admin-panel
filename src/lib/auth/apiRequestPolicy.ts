import { CSRF_REJECTION_MESSAGE, isSameOriginMutation } from "./csrf";
import { isPublicApiPath } from "./routes";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export type ApiRequestContext = {
  pathname: string;
  method: string;
  headers: { get(name: string): string | null };
  hasSession: boolean;
};

export type ApiRequestDecision =
  { action: "next" } | { action: "reject"; status: 401 | 403; error: string };

export function evaluateProtectedApiRequest(
  ctx: ApiRequestContext,
): ApiRequestDecision {
  if (!ctx.pathname.startsWith("/api/")) {
    return { action: "next" };
  }

  if (MUTATION_METHODS.has(ctx.method) && !isSameOriginMutation(ctx.headers)) {
    return { action: "reject", status: 403, error: CSRF_REJECTION_MESSAGE };
  }

  if (isPublicApiPath(ctx.pathname)) {
    return { action: "next" };
  }

  if (!ctx.hasSession) {
    return { action: "reject", status: 401, error: "Authentication required." };
  }

  return { action: "next" };
}
