/**
 * Domain types shared across the API layer and features.
 */

export type Currency = "USD" | "EUR" | "GBP";

export type ServiceCategory =
  | "cleaning"
  | "plumbing"
  | "electrical"
  | "tutoring"
  | "wellness"
  | "photography";

export interface Provider {
  id: string;
  name: string;
  rating: number; // 0-5, one decimal precision
  reviewCount: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  provider: Provider;
  price: number;
  currency: Currency;
  durationMinutes: number;
  rating: number;
  isAvailable: boolean;
  imageId: string;
}

/** Lightweight shape used by the service list - avoids sending full descriptions over the wire. */
export type ServiceSummary = Omit<Service, "description"> & {
  descriptionPreview: string;
};

export interface TimeSlot {
  id: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  isAvailable: boolean;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  serviceId: string;
  serviceName: string;
  providerName: string;
  scheduledStart: string; // ISO 8601
  scheduledEnd: string; // ISO 8601
  status: BookingStatus;
  customer: CustomerDetails;
  price: number;
  currency: Currency;
  createdAt: string; // ISO 8601
}

export interface CreateBookingRequest {
  serviceId: string;
  slotId: string;
  customer: CustomerDetails;
}
