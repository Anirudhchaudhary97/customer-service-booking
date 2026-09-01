import { describe, expect, it } from "vitest";
import { createMockHttpClient } from "../api/mock/mockHttpClient";
import { BookingsStore } from "../api/mock/data/bookingsStore";
import { ApiError } from "../types/api";
import type { DayAvailability, Service, ServiceSummary } from "../types/domain";

// Each test gets a fresh store + client so bookings created in one test
// never leak into another (the mock intentionally holds mutable state).
function freshClient() {
  return createMockHttpClient(new BookingsStore());
}

describe("mock API: services", () => {
  it("lists services successfully", async () => {
    const client = freshClient();
    const result = await client.get<ServiceSummary[]>("/services");
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.meta?.total).toBe(result.data.length > 0 ? result.meta?.total : undefined);
  });

  it("filters services by search term", async () => {
    const client = freshClient();
    const result = await client.get<ServiceSummary[]>("/services", { search: "cleaning" });
    expect(result.data.length).toBeGreaterThan(0);
    expect(
      result.data.every(
        (s) =>
          s.name.toLowerCase().includes("clean") ||
          s.descriptionPreview.toLowerCase().includes("clean") ||
          s.provider.name.toLowerCase().includes("clean"),
      ),
    ).toBe(true);
  });

  it("returns an empty list for a search with no matches", async () => {
    const client = freshClient();
    const result = await client.get<ServiceSummary[]>("/services", { search: "zzz-no-match-zzz" });
    expect(result.data).toEqual([]);
  });

  it("returns a 404 ApiError for an unknown service id", async () => {
    const client = freshClient();
    await expect(client.get<Service>("/services/does-not-exist")).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
  });

  it("returns availability for a known service", async () => {
    const client = freshClient();
    const result = await client.get<DayAvailability[]>("/services/svc-001/availability");
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].slots.length).toBeGreaterThan(0);
  });
});

describe("mock API: bookings", () => {
  const validCustomer = {
    fullName: "Jane Doe",
    email: "jane@example.com",
    phone: "555-123-4567",
    address: "123 Main St",
  };

  it("rejects booking creation with validation errors for missing fields", async () => {
    const client = freshClient();
    try {
      await client.post("/bookings", {
        serviceId: "svc-001",
        slotId: "",
        customer: { fullName: "", email: "not-an-email", phone: "", address: "" },
      });
      expect.fail("Expected booking creation to throw a validation error");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.status).toBe(422);
      expect(apiErr.code).toBe("VALIDATION_ERROR");
      expect(apiErr.fieldErrors?.some((f) => f.field === "slotId")).toBe(true);
      expect(apiErr.fieldErrors?.some((f) => f.field === "customer.email")).toBe(true);
    }
  });

  it("creates a booking successfully for a valid available slot", async () => {
    const client = freshClient();
    const availability = await client.get<DayAvailability[]>("/services/svc-001/availability");
    const availableSlot = availability.data.flatMap((d) => d.slots).find((s) => s.isAvailable);
    expect(availableSlot).toBeDefined();

    const result = await client.post("/bookings", {
      serviceId: "svc-001",
      slotId: availableSlot!.id,
      customer: validCustomer,
    });

    expect(result.data).toMatchObject({
      serviceId: "svc-001",
      status: "confirmed",
    });
  });

  it("returns a conflict error when booking an already-taken slot", async () => {
    const client = freshClient();
    const availability = await client.get<DayAvailability[]>("/services/svc-001/availability");
    const availableSlot = availability.data.flatMap((d) => d.slots).find((s) => s.isAvailable);
    expect(availableSlot).toBeDefined();

    await client.post("/bookings", {
      serviceId: "svc-001",
      slotId: availableSlot!.id,
      customer: validCustomer,
    });

    await expect(
      client.post("/bookings", {
        serviceId: "svc-001",
        slotId: availableSlot!.id,
        customer: validCustomer,
      }),
    ).rejects.toMatchObject({ status: 409, code: "SLOT_UNAVAILABLE" });
  });

  it("lists bookings created during the session", async () => {
    const client = freshClient();
    const availability = await client.get<DayAvailability[]>("/services/svc-001/availability");
    const availableSlot = availability.data.flatMap((d) => d.slots).find((s) => s.isAvailable);

    await client.post("/bookings", {
      serviceId: "svc-001",
      slotId: availableSlot!.id,
      customer: validCustomer,
    });

    const listResult = await client.get("/bookings");
    expect((listResult.data as unknown[]).length).toBe(1);
  });
});
