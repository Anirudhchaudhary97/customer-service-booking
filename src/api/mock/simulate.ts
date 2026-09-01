import { ApiError } from "../../types/api";
import type { ApiErrorBody } from "../../types/api";

/**
 * Simulates network latency so loading states in the UI are actually
 * exercised during development, instead of resolving instantly and hiding
 * bugs in spinners/skeletons. Range is randomised within bounds to avoid
 * every request feeling artificially uniform.
 */
export function simulateLatency(minMs = 300, maxMs = 900): Promise<void> {
  // Keep automated tests fast and deterministic; real latency only matters
  // for exercising loading states during manual/dev use.
  if (import.meta.env.MODE === "test") {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Small, injectable chance of a transient server error, so error states are
 * reachable during manual testing without needing a special flag. Disabled
 * entirely when NODE_ENV === 'test' so unit tests remain deterministic.
 */
export function maybeThrowRandomServerError(chance = 0.06): void {
  if (import.meta.env.MODE === "test") return;
  if (Math.random() < chance) {
    throwApiError(503, {
      code: "SERVER_ERROR",
      message: "The server had a problem handling this request. Please try again.",
    });
  }
}

export function throwApiError(status: number, body: ApiErrorBody): never {
  throw new ApiError(status, body);
}
