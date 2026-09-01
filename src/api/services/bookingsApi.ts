import type { HttpClient } from "../client/httpClient";
import type { Booking, CreateBookingRequest } from "../../types/domain";

export function createBookingsApi(client: HttpClient) {
  return {
    listBookings() {
      return client.get<Booking[]>("/bookings");
    },
    getBooking(bookingId: string) {
      return client.get<Booking>(`/bookings/${bookingId}`);
    },
    createBooking(request: CreateBookingRequest) {
      return client.post<Booking>("/bookings", request);
    },
  };
}

export type BookingsApi = ReturnType<typeof createBookingsApi>;
