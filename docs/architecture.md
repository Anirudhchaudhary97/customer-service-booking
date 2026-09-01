# Architecture

## Overview

This is a React + TypeScript single-page app built with Vite. It implements
a customer-facing booking flow: browse services, view details, pick a
time, enter contact details, confirm, and review past bookings.

The core architectural goal is that **the UI never talks to a data source
directly** — every screen goes through a layered API stack, so swapping the
mock backend for a real one touches exactly one file
(`src/api/services/index.ts`).

## Folder structure

```
src/
├── api/
│   ├── client/       # HttpClient interface + a real fetch-based implementation
│   ├── services/      # App-facing API functions (servicesApi, bookingsApi)
│   └── mock/          # Mock backend: data, validation, routing, latency
├── features/
│   ├── services/      # Service List + Service Details screens
│   ├── booking/        # Date/time → customer details → confirm flow
│   └── bookings/       # My Bookings screen
├── components/         # Cross-feature UI primitives (Button, states, nav)
├── hooks/               # Cross-feature hooks (useApiRequest)
├── types/               # Domain types + API envelope/error types
├── utils/                # Formatting helpers (currency, dates, durations)
└── styles/                # Design tokens (CSS custom properties)
```

Each feature folder mirrors the same internal shape:

```
features/booking/
├── pages/        # Route-level components composed from components + hooks
├── components/   # Feature-specific presentational components
└── hooks/        # Feature-specific screen/state logic
```

## Layering and responsibilities

```
┌─────────────────────┐
│  Page components      │  Render UI, handle user events, show
│  (features/*/pages)   │  loading/success/empty/error branches
└─────────┬────────────┘
          │ calls
┌─────────▼────────────┐
│  Feature hooks         │  Own screen-level state, call the API layer,
│  (features/*/hooks)    │  translate results into UI-friendly state
└─────────┬────────────┘
          │ calls
┌─────────▼────────────┐
│  API services           │  Typed, app-facing functions (servicesApi,
│  (api/services)          │  bookingsApi). Map request/response shapes.
└─────────┬────────────┘
          │ calls
┌─────────▼────────────┐
│  HttpClient              │  Transport-agnostic interface: get/post,
│  (api/client)             │  returns ApiSuccess<T> or throws ApiError
└─────────┬────────────┘
          │ implemented by
┌─────────▼────────────┐
│  mockHttpClient            │  Simulates a real backend: routing,
│  (api/mock)                 │  latency, validation, business rules
└──────────────────────┘
```

Nothing above the `HttpClient` line knows whether it's talking to the mock
or a real server. `src/api/services/index.ts` is the single composition
point that decides which `HttpClient` implementation to use.

### Why this many layers?

Fewer layers would work for a toy app, but this structure directly answers
the assignment's evaluation criteria:

- **API-first development** — screens are built against `servicesApi` /
  `bookingsApi` function signatures, which were designed before any UI
  existed to match `docs/api-contract.md`.
- **Swappable backend** — a real backend requires no changes to
  `features/`, `hooks/`, or `components/`.
- **Testability** — the mock backend can be tested in isolation
  (`src/test/mockApi.test.ts`) without React at all, and components can be
  tested against the same mock without any additional mocking for the
  happy path.

## Component responsibilities

- **Pages** (`features/*/pages`) own routing concerns (`useParams`,
  `useNavigate`) and the loading/success/error/empty branching. They
  compose smaller components; they don't contain business logic.
- **Feature components** (`features/*/components`) are presentational:
  they receive data and callbacks as props and render markup. `SlotPicker`,
  `CustomerForm`, `BookingSummary`, `ServiceCard`, `BookingListItem`, etc.
- **Shared components** (`src/components`) are generic UI used by more than
  one feature: `Button`, `LoadingState`, `ErrorState`, `EmptyState`,
  `StatusBadge`, `AppNav`.

## State management

No global state library is used. State is kept at the smallest scope that
needs it:

- **Server data** (services, availability, bookings) lives in feature hooks
  built on `useApiRequest`, a small shared hook that standardizes
  loading/success/error handling and guards against out-of-order responses
  (e.g. a fast second search response arriving before a slow first one).
- **Form/selection state** (selected date, selected slot, customer form
  fields, booking submission status) lives in `BookingPage` and
  `useCreateBooking`, scoped to the booking flow only.
- **UI-only state** (which booking's details panel is open) lives directly
  in the page component (`MyBookingsPage`).

This was a deliberate choice over Redux/Zustand/React Query for an app this
size — see `docs/decisions.md` for the trade-offs considered.

## Error handling

Errors are modeled as data, not just try/catch noise:

- `ApiError` (in `src/types/api.ts`) is a typed `Error` subclass carrying a
  machine-readable `code`, HTTP `status`, and optional `fieldErrors`.
- `useApiRequest` catches thrown errors from the API layer and exposes them
  as `{ status: "error", error: ApiError }` — components branch on `status`
  rather than using try/catch directly.
- Booking submission (`useCreateBooking`) is modeled as its own state
  machine (`idle` / `submitting` / `success` / `validation-error` /
  `conflict` / `error`) rather than reusing `useApiRequest`, because a
  failed *submit* needs different handling than a failed *fetch*:
  validation errors map onto specific form fields, and slot conflicts need
  a distinct recovery path (return to slot picker) rather than a generic
  retry button.

## How the frontend communicates with the API

1. A page renders and calls a feature hook.
2. The feature hook calls a function from `src/api/services` (e.g.
   `servicesApi.listServices(params)`).
3. That function calls `client.get(...)`/`client.post(...)` on the
   `HttpClient` currently wired up in `src/api/services/index.ts` (today,
   `mockHttpClient`).
4. The mock client simulates latency, runs validation/business rules where
   applicable, and resolves with `{ data, meta? }` or throws `ApiError`.
5. The feature hook turns that into UI state; the page renders based on
   that state.

Swapping to a real backend means changing one line in
`src/api/services/index.ts`:

```ts
const client = createFetchHttpClient(import.meta.env.VITE_API_BASE_URL);
```
