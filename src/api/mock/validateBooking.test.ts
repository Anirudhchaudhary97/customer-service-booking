import { describe, expect, it } from "vitest";
import { validateBookingRequest } from "./validateBooking";
import type { CreateBookingRequest } from "../../types/domain";

const validRequest: CreateBookingRequest = {
  serviceId: "svc-001",
  slotId: "slot-1",
  customer: {
    fullName: "Jane Doe",
    email: "jane@example.com",
    phone: "555-123-4567",
    address: "123 Main St",
  },
};

describe("validateBookingRequest", () => {
  it("returns no errors for a fully valid request", () => {
    expect(validateBookingRequest(validRequest)).toEqual([]);
  });

  it("flags a missing slot id", () => {
    const errors = validateBookingRequest({ ...validRequest, slotId: "" });
    expect(errors.some((e) => e.field === "slotId")).toBe(true);
  });

  it("flags an invalid email format", () => {
    const errors = validateBookingRequest({
      ...validRequest,
      customer: { ...validRequest.customer, email: "not-an-email" },
    });
    expect(errors.some((e) => e.field === "customer.email")).toBe(true);
  });

  it("flags a phone number that is too short", () => {
    const errors = validateBookingRequest({
      ...validRequest,
      customer: { ...validRequest.customer, phone: "123" },
    });
    expect(errors.some((e) => e.field === "customer.phone")).toBe(true);
  });

  it("flags multiple missing fields at once", () => {
    const errors = validateBookingRequest({
      serviceId: "svc-001",
      slotId: "slot-1",
      customer: { fullName: "", email: "", phone: "", address: "" },
    });
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });
});
