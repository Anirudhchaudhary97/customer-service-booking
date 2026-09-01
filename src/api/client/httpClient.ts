import type { ApiSuccess } from "../../types/api";

/**
 * Transport-agnostic client interface.
 */
export interface HttpClient {
  get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<ApiSuccess<T>>;
  post<T>(path: string, body?: unknown): Promise<ApiSuccess<T>>;
}
