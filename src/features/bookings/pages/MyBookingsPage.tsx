import { useState } from "react";
import { Link } from "react-router-dom";
import { BookingListItem } from "../components/BookingListItem";
import { BookingDetailsPanel } from "../components/BookingDetailsPanel";
import { LoadingState } from "../../../components/LoadingState";
import { ErrorState } from "../../../components/ErrorState";
import { EmptyState } from "../../../components/EmptyState";
import { Button } from "../../../components/Button";
import type { Booking } from "../../../types/domain";
import "./MyBookingsPage.css";
import { useBookingsList } from "../hooks/useBookingsList";

export function MyBookingsPage() {
  const request = useBookingsList();
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <div className="page">
      <header className="page-header">
        <h1>My bookings</h1>
        <p className="page-subtitle">Everything you've booked, in one place.</p>
      </header>

      {request.status === "loading" && <LoadingState label="Loading your bookings…" />}

      {request.status === "error" && (
        <ErrorState message={request.error.message} onRetry={request.refetch} />
      )}

      {request.status === "success" && request.data.length === 0 && (
        <EmptyState
          title="No bookings yet"
          message="Once you book a service, it will show up here."
          action={
            <Link to="/services">
              <Button>Browse services</Button>
            </Link>
          }
        />
      )}

      {request.status === "success" && request.data.length > 0 && (
        <div className="booking-list">
          {request.data.map((booking) => (
            <BookingListItem key={booking.id} booking={booking} onSelect={setSelected} />
          ))}
        </div>
      )}

      {selected && <BookingDetailsPanel booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
