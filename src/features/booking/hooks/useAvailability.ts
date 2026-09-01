import { useApiRequest } from "../../../hooks/useApiRequest";
import { servicesApi } from "../../../api/services";

export function useAvailability(serviceId: string) {
  return useApiRequest(() => servicesApi.getAvailability(serviceId), [serviceId]);
}
