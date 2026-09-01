# Customer Service Booking System

A production-style React + TypeScript application representing a customer service booking flow for the Demo Marketplace platform. Built with an **API-first architecture**, clean layer separation, a robust mock API backend with latency and error simulation, and unit/component tests.

---

## 🎥 Demo Video Link
> **[Insert Jam / Loom Demo Video Link Here]**

---

## 🚀 Key Features & User Flow
- **Service List (`/services`)**: Browse services with keyword search, interactive category pill filters, loading skeletons, empty states, and error retry logic.
- **Service Details (`/services/:serviceId`)**: View full service details, provider rating, pricing, duration, features, and cancellation policies.
- **Booking Flow (`/services/:serviceId/book`)**:
  - Interactive Date & Time Slot Picker (`SlotPicker`).
  - Customer Info Form with field-level validation errors (`CustomerForm`).
  - Booking Summary preview (`BookingSummary`).
  - **Slot Conflict Handling**: Server-side double verification returning `409 SLOT_UNAVAILABLE` with an inline recovery banner and "Choose another time" refetch action.
- **My Bookings (`/bookings`)**: Manage confirmed bookings, view detailed modals, and see live booking statuses.

---

## 🏗️ Architecture & Layering

The application follows a clean 5-layer separation of concerns:

```
[ UI Component (Page/Card) ]
           │
           ▼
  [ Feature Hook (e.g. useCreateBooking) ]
           │
           ▼
     [ Service Layer (servicesApi / bookingsApi) ]
           │
           ▼
    [ Transport Interface (HttpClient) ]
           │
           ▼
[ Mock HTTP Implementation (mockHttpClient) ]
```

- **`src/api/client/`**: Transport-agnostic `HttpClient` interface and `fetchHttpClient` implementation.
- **`src/api/services/`**: Application-facing API functions and single composition point (`index.ts`).
- **`src/api/mock/`**: Mock backend engine with route matching, seeded deterministic availability, latency simulation (`300-900ms`), and validation rule enforcement.
- **`src/features/`**: Domain-grouped UI pages, components, and state-machine hooks.
- **`src/types/`**: Shared API contracts (`ApiError`, `ApiResult`) and domain models (`Service`, `Booking`).

---

## 📖 Documentation
Detailed technical documentation is located in the [`docs/`](./docs) directory:
- 📄 [**Architecture Document** (`docs/architecture.md`)](./docs/architecture.md) — Application design, folder structure, layer responsibilities, state management, and error handling.
- 📑 [**API Contract** (`docs/api-contract.md`)](./docs/api-contract.md) — Complete endpoint specifications, request/response envelopes, validation rules, and error codes.
- 💡 [**Technical Decisions** (`docs/decisions.md`)](./docs/decisions.md) — 7 documented engineering decisions with rationales and rejected alternatives.
- ⚙️ [**Setup Guide** (`docs/setup.md`)](./docs/setup.md) — Step-by-step instructions for installation, dev server, running tests, and environment configuration.

---

## 🛠️ Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Run all tests once
npm run test:run

# 4. Run tests in watch mode
npm test

# 5. Type-check and build for production
npm run build
```

---

## 🧪 Testing Coverage
Tests are built using **Vitest** and **React Testing Library**:
- **Mock API & Routing**: Tests for list endpoints, detail lookups, availability generation, and double-booking conflict rejection.
- **Validation Rules**: Tests for missing slots, email syntax, short phone numbers, and required fields.
- **Booking Flow UI**: End-to-end component tests covering validation errors, successful booking confirmation, and slot conflict recovery.

Run `npm run test:run` to execute the full suite.
