import type { HttpClient } from "../client/httpClient";
import type { ApiSuccess } from "../../types/api";
import type {
  Booking,
  CreateBookingRequest,
  DayAvailability,
  Service,
  ServiceSummary,
} from "../../types/domain";
import { mockServices } from "./data/services";
import { generateAvailability } from "./data/availability";
import { bookingsStore, BookingsStore } from "./data/bookingsStore";
import { simulateLatency, maybeThrowRandomServerError, throwApiError } from "./simulate";
import { validateBookingRequest } from "./validateBooking";

/**
 * Mock implementation of `HttpClient`. It intentionally mirrors what a real
 * REST backend would do: route matching on path/method, request validation,
 * latency, and typed errors - so that `src/api/services` never needs to
 * know it's talking to a mock rather than a real server.
 *
 * Kept as a factory (not a bare singleton export) so tests can create a
 * client bound to a fresh `BookingsStore`, avoiding cross-test state leaks.
 */
export function createMockHttpClient(store: BookingsStore = bookingsStore): HttpClient {
  async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<ApiSuccess<T>> {
    await simulateLatency();
    maybeThrowRandomServerError();

    if (path === "/services") {
      return { data: listServices(params) as T, meta: { total: mockServices.length } };
    }

    const serviceDetailMatch = path.match(/^\/services\/([^/]+)$/);
    if (serviceDetailMatch) {
      return { data: getServiceById(serviceDetailMatch[1]) as T };
    }

    const availabilityMatch = path.match(/^\/services\/([^/]+)\/availability$/);
    if (availabilityMatch) {
      return { data: getAvailability(availabilityMatch[1]) as T };
    }

    if (path === "/bookings") {
      return { data: store.list() as T, meta: { total: store.list().length } };
    }

    const bookingDetailMatch = path.match(/^\/bookings\/([^/]+)$/);
    if (bookingDetailMatch) {
      return { data: getBookingById(bookingDetailMatch[1]) as T };
    }

    throwApiError(404, { code: "NOT_FOUND", message: `No route for GET ${path}` });
  }

  async function post<T>(path: string, body?: unknown): Promise<ApiSuccess<T>> {
    await simulateLatency();
    maybeThrowRandomServerError();

    if (path === "/bookings") {
      return { data: createBooking(body as CreateBookingRequest) as T };
    }

    throwApiError(404, { code: "NOT_FOUND", message: `No route for POST ${path}` });
  }

  function listServices(params?: Record<string, string | number | undefined>): ServiceSummary[] {
    let results = mockServices;

    const search = typeof params?.search === "string" ? params.search.trim().toLowerCase() : "";
    if (search) {
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.description.toLowerCase().includes(search) ||
          s.provider.name.toLowerCase().includes(search),
      );
    }

    const category = params?.category;
    if (category && category !== "all") {
      results = results.filter((s) => s.category === category);
    }

    return results.map(toSummary);
  }

  function toSummary(service: Service): ServiceSummary {
    const { description, ...rest } = service;
    return { ...rest, descriptionPreview: description.slice(0, 90) + (description.length > 90 ? "..." : "") };
  }

  function getServiceById(id: string): Service {
    const service = mockServices.find((s) => s.id === id);
    if (!service) {
      throwApiError(404, { code: "NOT_FOUND", message: `Service "${id}" was not found.` });
    }
    return service;
  }

  function getAvailability(serviceId: string): DayAvailability[] {
    getServiceById(serviceId); // throws NOT_FOUND if the service doesn't exist
    const availability = generateAvailability(serviceId);
    // Slots already booked in this session must not be offered again.
    return availability.map((day) => ({
      ...day,
      slots: day.slots.map((slot) => ({
        ...slot,
        isAvailable: slot.isAvailable && !store.isSlotTaken(slot.id),
      })),
    }));
  }

  function getBookingById(id: string): Booking {
    const booking = store.findById(id);
    if (!booking) {
      throwApiError(404, { code: "NOT_FOUND", message: `Booking "${id}" was not found.` });
    }
    return booking;
  }

  function createBooking(request: CreateBookingRequest): Booking {
    const fieldErrors = validateBookingRequest(request);
    if (fieldErrors.length > 0) {
      throwApiError(422, {
        code: "VALIDATION_ERROR",
        message: "Please correct the highlighted fields.",
        fieldErrors,
      });
    }

    const service = mockServices.find((s) => s.id === request.serviceId);
    if (!service) {
      throwApiError(404, { code: "NOT_FOUND", message: `Service "${request.serviceId}" was not found.` });
    }

    // Business rule: a slot can only be booked once. This is re-checked
    // server-side even though the UI also disables booked slots, because
    // the UI's slot list can go stale between fetch and submit (e.g. two
    // browser tabs, or a slow user) - the mock models that race directly.
    if (store.isSlotTaken(request.slotId)) {
      throwApiError(409, {
        code: "SLOT_UNAVAILABLE",
        message: "This time slot was just booked by someone else. Please choose another.",
      });
    }

    const availability = generateAvailability(request.serviceId);
    const slot = availability.flatMap((d) => d.slots).find((s) => s.id === request.slotId);
    if (!slot || !slot.isAvailable) {
      throwApiError(409, {
        code: "SLOT_UNAVAILABLE",
        message: "This time slot is no longer available. Please choose another.",
      });
    }

    store.markSlotTaken(request.slotId);
    return store.create(request, slot.startTime, slot.endTime);
  }

  return { get, post };
}

/** Singleton mock client used by the running app. */
export const mockHttpClient = createMockHttpClient();
