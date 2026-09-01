import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useServiceDetails } from "../../services/hooks/useServiceDetails";
import { useAvailability } from "../hooks/useAvailability";
import { SlotPicker } from "../components/SlotPicker";
import { CustomerForm } from "../components/CustomerForm";
import { BookingSummary } from "../components/BookingSummary";
import { LoadingState } from "../../../components/LoadingState";
import { ErrorState } from "../../../components/ErrorState";
import { Button } from "../../../components/Button";
import type { CustomerDetails, TimeSlot } from "../../../types/domain";
import "./BookingPage.css";
import { useCreateBooking } from "../hooks/useCreateBooking";

const EMPTY_CUSTOMER: CustomerDetails = { fullName: "", email: "", phone: "", address: "" };

type Step = "slot" | "details";

export function BookingPage() {
  const { serviceId = "" } = useParams();
  const navigate = useNavigate();

  const serviceRequest = useServiceDetails(serviceId);
  const availabilityRequest = useAvailability(serviceId);
  const { state: submitState, submit, reset } = useCreateBooking();

  const [step, setStep] = useState<Step>("slot");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [customer, setCustomer] = useState<CustomerDetails>(EMPTY_CUSTOMER);

  const isLoading = serviceRequest.status === "loading" || availabilityRequest.status === "loading";
  const loadError = serviceRequest.status === "error" ? serviceRequest.error : availabilityRequest.status === "error" ? availabilityRequest.error : null;

  if (isLoading) {
    return (
      <div className="page">
        <LoadingState label="Loading availability…" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page">
        <ErrorState message={loadError.message} onRetry={() => { serviceRequest.refetch(); availabilityRequest.refetch(); }} />
      </div>
    );
  }

  if (serviceRequest.status !== "success" || availabilityRequest.status !== "success") {
    return null;
  }

  const service = serviceRequest.data;
  const days = availabilityRequest.data;
  const activeDate = selectedDate || days[0]?.date || "";

  if (submitState.status === "success") {
    return (
      <div className="page">
        <div className="booking-success" role="status">
          <h1>Booking confirmed</h1>
          <p>
            Your booking <strong>{submitState.booking.bookingNumber}</strong> with {submitState.booking.providerName} is confirmed.
          </p>
          <div className="booking-success-actions">
            <Button onClick={() => navigate("/bookings")}>View my bookings</Button>
            <Link to="/services" className="back-link">
              Browse more services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleConfirm() {
    if (!selectedSlot) return;
    await submit({ serviceId: service.id, slotId: selectedSlot.id, customer });
  }

  function handleSlotConflictRetry() {
    reset();
    setSelectedSlot(null);
    setStep("slot");
    availabilityRequest.refetch();
  }

  return (
    <div className="page">
      <Link to={`/services/${service.id}`} className="back-link">
        ← Back to {service.name}
      </Link>

      <h1 className="booking-title">Book {service.name}</h1>

      {submitState.status === "conflict" && (
        <div className="booking-conflict-banner" role="alert">
          <p>{submitState.message}</p>
          <Button variant="secondary" onClick={handleSlotConflictRetry}>
            Choose another time
          </Button>
        </div>
      )}

      {submitState.status === "error" && (
        <div className="booking-conflict-banner" role="alert">
          <p>{submitState.message}</p>
        </div>
      )}

      <div className="booking-layout">
        <div className="booking-main">
          {step === "slot" && (
            <>
              <SlotPicker
                days={days}
                selectedDate={activeDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
              <Button className="booking-continue" disabled={!selectedSlot} onClick={() => setStep("details")}>
                Continue
              </Button>
            </>
          )}

          {step === "details" && selectedSlot && (
            <>
              <button type="button" className="booking-change-time" onClick={() => setStep("slot")}>
                Change time
              </button>
              <CustomerForm
                customer={customer}
                onChange={setCustomer}
                fieldErrors={submitState.status === "validation-error" ? submitState.fieldErrors : []}
                onSubmit={handleConfirm}
                isSubmitting={submitState.status === "submitting"}
                submitLabel="Confirm booking"
              />
            </>
          )}
        </div>

        {selectedSlot && <BookingSummary service={service} slot={selectedSlot} />}
      </div>
    </div>
  );
}
