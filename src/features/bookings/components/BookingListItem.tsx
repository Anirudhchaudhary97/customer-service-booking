import type { Booking } from "../../../types/domain";
import { StatusBadge } from "../../../components/StatusBadge";
import { formatDateTimeLabel, formatPrice } from "../../../utils/format";
import "./BookingListItem.css";

export function BookingListItem({ booking, onSelect }: { booking: Booking; onSelect: (booking: Booking) => void }) {
  return (
    <button type="button" className="booking-list-item" onClick={() => onSelect(booking)}>
      <div className="booking-list-item-main">
        <span className="booking-list-item-number">{booking.bookingNumber}</span>
        <h3>{booking.serviceName}</h3>
        <p className="booking-list-item-provider">{booking.providerName}</p>
      </div>
      <div className="booking-list-item-side">
        <span className="booking-list-item-when">{formatDateTimeLabel(booking.scheduledStart)}</span>
        <span className="booking-list-item-price">{formatPrice(booking.price, booking.currency)}</span>
        <StatusBadge status={booking.status} />
      </div>
    </button>
  );
}
