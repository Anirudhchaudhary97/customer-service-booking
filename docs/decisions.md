# Technical Decisions

This document explains the main technical decisions made while building the project.

---

## 1. Layered API Architecture

### What was chosen?

The application uses three API layers:

```text
React
  ↓
API Services
  ↓
HttpClient
  ↓
Mock API
```

### Why?

This keeps the UI separate from the API implementation.

The application can use the mock API now and a real backend later without changing the React components.

### Alternatives considered

* Calling mock data directly from components.
* Putting all API logic into one file.

### Why were they rejected?

Directly using mock data would tightly connect the UI to the mock implementation.

A single API file would become difficult to maintain as the application grows.

---

## 2. No Global State Management Library

### What was chosen?

The project uses normal React state with `useState` and a small `useApiRequest` hook.

### Why?

This application is relatively small and does not have much state that needs to be shared between different screens.

Using Redux, Zustand, or React Query would add additional setup and complexity that is not necessary for this project.

### Alternatives considered

* Redux Toolkit
* Zustand
* TanStack Query

### Why were they rejected?

These are useful for larger applications, but this project can be handled cleanly with local React state.

Keeping the state local also makes it easier to understand where each piece of state is being used.

---

## 3. Separate Booking Submission State

### What was chosen?

Booking submission has its own states:

```text
idle
submitting
success
validation-error
conflict
error
```

### Why?

Different booking errors require different actions.

For example:

* Validation errors should be shown beside form fields.
* Slot conflicts should send the user back to select another time.
* Server errors should provide a retry option.

Having separate states makes these cases easier to handle.

### Alternatives considered

Using one generic error state such as:

```ts
error: string | null
```

### Why was it rejected?

A single error state would make it harder to determine what the user should do next.

---

## 4. Check Slot Availability During Booking

### What was chosen?

The mock API checks the slot again when creating a booking.

```text
User selects slot
      ↓
User submits booking
      ↓
API checks slot again
      ↓
Available → Create booking
Unavailable → Return 409 error
```

### Why?

A slot can become unavailable after the user initially sees it as available.

For example, another customer could book the same slot before the current user submits the booking.

This allows the application to demonstrate real booking conflict handling.

### Alternatives considered

Only checking availability in the frontend.

### Why was it rejected?

Frontend validation alone cannot prevent two users from trying to book the same slot.

---

## 5. Deterministic Mock Availability

### What was chosen?

The mock availability is predictable instead of completely random.

### Why?

The same service and date should normally return the same availability.

This makes the application easier to test and manually verify.

For example, if a slot is available, it should not randomly become unavailable just because the page was refreshed.

### Alternatives considered

Using `Math.random()` to generate availability.

### Why was it rejected?

Random data could make testing unreliable and could make the application look inconsistent during development.

---

## 6. System Fonts Instead of External Fonts

### What was chosen?

The application uses system fonts instead of loading fonts from an external CDN.

### Why?

The project should work even when there is no internet connection.

It also avoids adding an unnecessary external dependency for a small assignment.

### Alternatives considered

* Google Fonts
* Downloading and storing font files in the project

### Why were they rejected?

Google Fonts requires an external network request.

Bundling font files would add extra assets that are not necessary for this assignment.

---

## 7. Vitest and React Testing Library

### What was chosen?

The project uses:

```text
Vitest
React Testing Library
```

### Why?

The application uses Vite, and Vitest works directly with the Vite environment.

React Testing Library allows us to test the application from a user's point of view instead of testing internal implementation details.

### Alternatives considered

Jest with React Testing Library.

### Why was it rejected?

Jest is also a good option, but Vitest requires less additional configuration in a Vite project.

It keeps the testing setup simple and fast.

---

# Summary

The main goal of these decisions is to keep the project:

* Simple
* Maintainable
* Easy to test
* Easy to understand
* Separate from the mock API
* Ready to connect to a real backend later

The architecture and technical choices were made based on the size of the application and the requirements of the assignment rather than adding unnecessary complexity.
