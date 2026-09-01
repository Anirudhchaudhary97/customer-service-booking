import type { DayAvailability, TimeSlot } from "../../../types/domain";

//Generating availability for a service over the next `days` days.
export function generateAvailability(serviceId: string, days = 7): DayAvailability[] {
  const result: DayAvailability[] = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().slice(0, 10);

    const slots: TimeSlot[] = [];
    const hours = [9, 10, 11, 13, 14, 15, 16];

    hours.forEach((hour, index) => {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 60);

      // Deterministic pseudo-randomness from serviceId/day/hour so results
      // are stable across calls but still vary across services.
      const seed = hashCode(`${serviceId}-${dayOffset}-${hour}`);
      const isAvailable = seed % 4 !== 0 && !(dayOffset === 0 && hour <= new Date().getHours());

      slots.push({
        id: `${serviceId}-${dateStr}-${String(hour).padStart(2, "0")}00`,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        isAvailable,
      });
      void index;
    });

    result.push({ date: dateStr, slots });
  }

  return result;
}

function hashCode(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
