import { ApiError } from "../../types/api";
import type { ApiSuccess } from "../../types/api";
import type { HttpClient } from "./httpClient";

/**
 *  HTTP implementation of the `HttpClient` interface, built against the
 * `fetch` API.
 */
export function createFetchHttpClient(baseUrl: string): HttpClient {
  async function request<T>(
    path: string,
    options: RequestInit,
  ): Promise<ApiSuccess<T>> {
    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
      });
    } catch {
      throw new ApiError(0, {
        code: "NETWORK_ERROR",
        message: "Could not reach the server. Check your connection and try again.",
      });
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(response.status, body?.error ?? {
        code: "SERVER_ERROR",
        message: "Something went wrong on our end.",
      });
    }

    return body as ApiSuccess<T>;
  }

  return {
    get<T>(path: string, params?: Record<string, string | number | undefined>) {
      const query = params
        ? "?" + new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
          ).toString()
        : "";
      return request<T>(`${path}${query}`, { method: "GET" });
    },
    post<T>(path: string, body?: unknown) {
      return request<T>(path, { method: "POST", body: JSON.stringify(body) });
    },
  };
}
