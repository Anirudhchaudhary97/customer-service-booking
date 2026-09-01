import type { Booking } from "../../../types/domain";
import { StatusBadge } from "../../../components/StatusBadge";
import { formatDateTimeLabel, formatPrice } from "../../../utils/format";
import "./BookingDetailsPanel.css";

export function BookingDetailsPanel({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="booking-details-overlay" onClick={onClose}>
      <div
        className="booking-details-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-details-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="booking-details-panel-header">
          <h2 id="booking-details-heading">{booking.bookingNumber}</h2>
          <button type="button" onClick={onClose} aria-label="Close booking details">
            ✕
          </button>
        </div>

        <StatusBadge status={booking.status} />

        <dl className="booking-details-panel-facts">
          <div>
            <dt>Service</dt>
            <dd>{booking.serviceName}</dd>
          </div>
          <div>
            <dt>Provider</dt>
            <dd>{booking.providerName}</dd>
          </div>
          <div>
            <dt>Scheduled</dt>
            <dd>{formatDateTimeLabel(booking.scheduledStart)}</dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>{formatPrice(booking.price, booking.currency)}</dd>
          </div>
          <div>
            <dt>Customer</dt>
            <dd>{booking.customer.fullName}</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>
              {booking.customer.email}
              <br />
              {booking.customer.phone}
            </dd>
          </div>
          <div>
            <dt>Service address</dt>
            <dd>{booking.customer.address}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
