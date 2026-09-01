import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAtRoute } from "../../../test/renderAtRoute";
import { BookingPage } from "./BookingPage";
import { bookingsStore } from "../../../api/mock/data/bookingsStore";
import { bookingsApi } from "../../../api/services";
import { ApiError } from "../../../types/api";

// The mock backend's bookings store is a module-level singleton shared by
// the whole app (and by useCreateBooking under test). Resetting it before
// each test - rather than reloading modules - keeps a single, consistent
// module graph so `err instanceof ApiError` checks stay valid, while still
// giving each test a clean slate of bookings/booked slots.
beforeEach(() => {
  bookingsStore.reset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderBookingPage() {
  return renderAtRoute("/services/:serviceId/book", "/services/svc-001/book", <BookingPage />);
}

async function selectFirstAvailableSlotAndContinue(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => {
    expect(screen.queryByText(/loading availability/i)).not.toBeInTheDocument();
  });

  const dateTabs = screen.getAllByRole("tab");
  const enabledDateTab = dateTabs.find((tab) => !tab.hasAttribute("disabled"));
  if (enabledDateTab && !enabledDateTab.classList.contains("is-active")) {
    await user.click(enabledDateTab);
  }

  const timeButtons = await screen.findAllByRole("button", { name: /(AM|PM)/ });
  const enabledButton = timeButtons.find((btn) => !btn.hasAttribute("disabled"));
  expect(enabledButton).toBeDefined();
  await user.click(enabledButton!);

  await user.click(screen.getByRole("button", { name: /continue/i }));
}

describe("BookingPage", () => {
  it("shows field-level validation errors when submitting an empty customer form", async () => {
    renderBookingPage();
    const user = userEvent.setup();

    await selectFirstAvailableSlotAndContinue(user);

    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("completes a booking successfully with valid details", async () => {
    renderBookingPage();
    const user = userEvent.setup();

    await selectFirstAvailableSlotAndContinue(user);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "555-123-4567");
    await user.type(screen.getByLabelText(/service address/i), "123 Main St");

    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /booking confirmed/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/BK-/)).toBeInTheDocument();
  });

  it("shows a conflict banner and lets the user pick another time when the slot is taken", async () => {
    vi.spyOn(bookingsApi, "createBooking").mockRejectedValueOnce(
      new ApiError(409, { code: "SLOT_UNAVAILABLE", message: "This time slot was just booked by someone else." }),
    );

    renderBookingPage();
    const user = userEvent.setup();

    await selectFirstAvailableSlotAndContinue(user);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "555-123-4567");
    await user.type(screen.getByLabelText(/service address/i), "123 Main St");

    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/just booked by someone else/i)).toBeInTheDocument();
    });
    const chooseAnother = screen.getByRole("button", { name: /choose another time/i });
    expect(chooseAnother).toBeInTheDocument();

    await user.click(chooseAnother);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });
  });
});
