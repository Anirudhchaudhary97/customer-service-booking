import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../types/api";

export type RequestState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };

/**
 * Shared data-fetching hook used by every screen-level feature hook.
 *
 * Centralising loading/error handling here means individual feature hooks
 * (useServiceList, useServiceDetails, ...) only need to describe *what* to
 * fetch, not how to track status - and the loading/error UI contract stays
 * consistent across the app.
 *
 * `deps` re-runs the fetch when any dependency changes (e.g. search term),
 * mirroring useEffect's dependency array.
 */
export function useApiRequest<T>(
  fetcher: () => Promise<{ data: T }>,
  deps: unknown[],
): RequestState<T> & { refetch: () => void } {
  const [state, setState] = useState<RequestState<T>>({ status: "loading" });
  const requestIdRef = useRef(0);

  const run = useCallback(() => {
    const requestId = ++requestIdRef.current;
    setState({ status: "loading" });

    fetcher()
      .then((result) => {
        // Guard against out-of-order responses: only the latest request may
        // update state (e.g. a fast second search response beating a slow first one).
        if (requestIdRef.current === requestId) {
          setState({ status: "success", data: result.data });
        }
      })
      .catch((error: unknown) => {
        if (requestIdRef.current !== requestId) return;
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(0, { code: "NETWORK_ERROR", message: "Unexpected error. Please try again." });
        setState({ status: "error", error: apiError });
      });
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run };
}
