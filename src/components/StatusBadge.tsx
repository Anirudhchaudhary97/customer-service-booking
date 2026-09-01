import type { BookingStatus } from "../types/domain";
import "./StatusBadge.css";

const LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`status-badge status-${status}`}>{LABELS[status]}</span>;
}
