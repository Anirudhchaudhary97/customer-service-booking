import type { Booking, CreateBookingRequest } from "../../../types/domain";
import { mockServices } from "./services";

/**
 * Mutable in-memory store for bookings created during the session.
 * Wrapped in a small class (rather than bare module state) so tests can
 * construct isolated instances instead of sharing global state between
 * test cases.
 */
export class BookingsStore {
  private bookings: Booking[] = [];
  private sequence = 1000;

  list(): Booking[] {
    return [...this.bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  findById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  create(request: CreateBookingRequest, slotStart: string, slotEnd: string): Booking {
    const service = mockServices.find((s) => s.id === request.serviceId);
    if (!service) {
      throw new Error(`Unknown service: ${request.serviceId}`);
    }

    this.sequence += 1;
    const booking: Booking = {
      id: `bkg-${this.sequence}`,
      bookingNumber: `BK-${this.sequence}`,
      serviceId: service.id,
      serviceName: service.name,
      providerName: service.provider.name,
      scheduledStart: slotStart,
      scheduledEnd: slotEnd,
      status: "confirmed",
      customer: request.customer,
      price: service.price,
      currency: service.currency,
      createdAt: new Date().toISOString(),
    };

    this.bookings.push(booking);
    return booking;
  }

  /** Tracks slot ids already booked, so a second request for the same slot is rejected as a conflict. */
  isSlotTaken(slotId: string): boolean {
    return this.bookedSlotIds.has(slotId);
  }

  markSlotTaken(slotId: string): void {
    this.bookedSlotIds.add(slotId);
  }

  /**
   * Clears all in-memory state. Used by tests to isolate cases that share
   * the app's singleton store, without needing to reload modules (which
   * would otherwise split class identities like `ApiError` across two
   * copies of the same module and break `instanceof` checks).
   */
  reset(): void {
    this.bookings = [];
    this.sequence = 1000;
    this.bookedSlotIds = new Set<string>();
  }

  private bookedSlotIds = new Set<string>();
}

/** Singleton used by the app at runtime; tests import the class directly for isolation. */
export const bookingsStore = new BookingsStore();
