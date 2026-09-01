import type { Currency } from "../types/domain";

/**
 price/date/duration formatters
 */

export function formatPrice(price: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

export function formatDateLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(date);
}

export function formatTimeLabel(isoDateTime: string): string {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(isoDateTime));
}

export function formatDateTimeLabel(isoDateTime: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDateTime));
}

const CATEGORY_LABELS: Record<string, string> = {
  cleaning: "Cleaning",
  plumbing: "Plumbing",
  electrical: "Electrical",
  tutoring: "Tutoring",
  wellness: "Wellness",
  photography: "Photography",
};

export function formatCategory(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
