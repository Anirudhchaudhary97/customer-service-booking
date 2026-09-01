import type { DayAvailability, TimeSlot } from "../../../types/domain";
import { formatDateLabel, formatTimeLabel } from "../../../utils/format";
import "./SlotPicker.css";

interface SlotPickerProps {
  days: DayAvailability[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export function SlotPicker({ days, selectedDate, onSelectDate, selectedSlot, onSelectSlot }: SlotPickerProps) {
  const activeDay = days.find((d) => d.date === selectedDate) ?? days[0];

  return (
    <div className="slot-picker">
      <div className="slot-picker-dates" role="tablist" aria-label="Select a date">
        {days.map((day) => {
          const hasAvailability = day.slots.some((s) => s.isAvailable);
          return (
            <button
              key={day.date}
              type="button"
              role="tab"
              aria-selected={day.date === activeDay.date}
              className={`slot-picker-date ${day.date === activeDay.date ? "is-active" : ""}`}
              disabled={!hasAvailability}
              onClick={() => onSelectDate(day.date)}
            >
              {formatDateLabel(day.date)}
            </button>
          );
        })}
      </div>

      <div className="slot-picker-times" role="group" aria-label={`Available times for ${formatDateLabel(activeDay.date)}`}>
        {activeDay.slots.every((s) => !s.isAvailable) ? (
          <p className="slot-picker-empty">No available times on this day. Try another date.</p>
        ) : (
          activeDay.slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              disabled={!slot.isAvailable}
              className={`slot-picker-time ${selectedSlot?.id === slot.id ? "is-selected" : ""}`}
              onClick={() => onSelectSlot(slot)}
              aria-pressed={selectedSlot?.id === slot.id}
            >
              {formatTimeLabel(slot.startTime)}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
