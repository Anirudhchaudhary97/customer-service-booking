import type { Service, TimeSlot } from "../../../types/domain";
import { formatDuration, formatPrice, formatTimeLabel, formatDateLabel } from "../../../utils/format";
import "./BookingSummary.css";

interface BookingSummaryProps {
  service: Service;
  slot: TimeSlot;
}

export function BookingSummary({ service, slot }: BookingSummaryProps) {
  return (
    <aside className="booking-summary" aria-label="Booking summary">
      <h2>Booking summary</h2>
      <dl>
        <div>
          <dt>Service</dt>
          <dd>{service.name}</dd>
        </div>
        <div>
          <dt>Provider</dt>
          <dd>{service.provider.name}</dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>
            {formatDateLabel(slot.startTime.slice(0, 10))}, {formatTimeLabel(slot.startTime)}
          </dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{formatDuration(service.durationMinutes)}</dd>
        </div>
        <div className="booking-summary-total">
          <dt>Total</dt>
          <dd>{formatPrice(service.price, service.currency)}</dd>
        </div>
      </dl>
    </aside>
  );
}
