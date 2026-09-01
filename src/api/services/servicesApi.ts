import type { HttpClient } from "../client/httpClient";
import type { DayAvailability, Service, ServiceSummary } from "../../types/domain";

export interface ListServicesParams {
  [key: string]: string | undefined;
  search?: string;
  category?: string;
}

/**
 * Application-facing functions for the "services" resource. Components and
 * hooks call these, never the HTTP client directly
 */
export function createServicesApi(client: HttpClient) {
  return {
    listServices(params: ListServicesParams = {}) {
      return client.get<ServiceSummary[]>("/services", params);
    },
    getService(serviceId: string) {
      return client.get<Service>(`/services/${serviceId}`);
    },
    getAvailability(serviceId: string) {
      return client.get<DayAvailability[]>(`/services/${serviceId}/availability`);
    },
  };
}

export type ServicesApi = ReturnType<typeof createServicesApi>;
