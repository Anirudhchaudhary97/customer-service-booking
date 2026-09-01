import type { FieldError } from "../../types/api";
import type { CreateBookingRequest } from "../../types/domain";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Field-level validation for a booking request. Runs server-side (in the
 * mock, standing in for a real backend) rather than only client-side, so
 * the contract matches what a real API must also enforce - the frontend's
 * own form validation is a UX convenience, not the source of truth.
 */
export function validateBookingRequest(request: CreateBookingRequest): FieldError[] {
  const errors: FieldError[] = [];

  if (!request.serviceId) {
    errors.push({ field: "serviceId", message: "Service is required." });
  }
  if (!request.slotId) {
    errors.push({ field: "slotId", message: "A time slot must be selected." });
  }

  const { customer } = request;
  if (!customer) {
    errors.push({ field: "customer", message: "Customer details are required." });
    return errors;
  }

  if (!customer.fullName?.trim()) {
    errors.push({ field: "customer.fullName", message: "Full name is required." });
  }
  if (!customer.email?.trim()) {
    errors.push({ field: "customer.email", message: "Email is required." });
  } else if (!EMAIL_RE.test(customer.email)) {
    errors.push({ field: "customer.email", message: "Enter a valid email address." });
  }
  if (!customer.phone?.trim()) {
    errors.push({ field: "customer.phone", message: "Phone number is required." });
  } else if (customer.phone.replace(/\D/g, "").length < 7) {
    errors.push({ field: "customer.phone", message: "Enter a valid phone number." });
  }
  if (!customer.address?.trim()) {
    errors.push({ field: "customer.address", message: "Service address is required." });
  }

  return errors;
}
