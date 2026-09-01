import { useApiRequest } from "../../../hooks/useApiRequest";
import { bookingsApi } from "../../../api/services";

export function useBookingsList() {
  return useApiRequest(() => bookingsApi.listBookings(), []);
}
