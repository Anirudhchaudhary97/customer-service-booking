import { useApiRequest } from "../../../hooks/useApiRequest";
import { servicesApi } from "../../../api/services";

export function useServiceDetails(serviceId: string) {
  return useApiRequest(() => servicesApi.getService(serviceId), [serviceId]);
}
