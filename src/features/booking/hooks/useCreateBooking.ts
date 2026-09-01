import { useCallback, useState } from "react";
import { bookingsApi } from "../../../api/services";
import { ApiError } from "../../../types/api";
import type { Booking, CreateBookingRequest } from "../../../types/domain";
import type { FieldError } from "../../../types/api";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; booking: Booking }
  | { status: "validation-error"; fieldErrors: FieldError[]; message: string }
  | { status: "conflict"; message: string }
  | { status: "error"; message: string };

/**
 * Booking submission is modelled as its own state machine, distinct from
 * `useApiRequest`, because a failed submit should not look like a failed
 * *fetch*: validation errors need to map back onto specific form fields,
 * and slot conflicts need a distinct message steering the user back to
 * slot selection rather than a generic "try again".
 */
export function useCreateBooking() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const submit = useCallback(async (request: CreateBookingRequest) => {
    setState({ status: "submitting" });
    try {
      const result = await bookingsApi.createBooking(request);
      setState({ status: "success", booking: result.data });
      return result.data;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "VALIDATION_ERROR") {
          setState({ status: "validation-error", fieldErrors: err.fieldErrors ?? [], message: err.message });
        } else if (err.code === "SLOT_UNAVAILABLE") {
          setState({ status: "conflict", message: err.message });
        } else {
          setState({ status: "error", message: err.message });
        }
      } else {
        setState({ status: "error", message: "Unexpected error. Please try again." });
      }
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, submit, reset };
}
