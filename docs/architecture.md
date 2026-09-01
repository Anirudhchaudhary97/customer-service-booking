# Architecture

## Overview

This project is a **React + TypeScript single-page application** built with Vite.

It provides a customer service booking flow:

```text
Browse Services
      ↓
Service Details
      ↓
Select Date & Time
      ↓
Enter Customer Details
      ↓
Confirm Booking
      ↓
Booking Confirmation
      ↓
My Bookings
```

The main goal of the architecture is to keep the **UI separate from the API and data source**.

The React components never directly access mock data. They communicate through the API layer.

This makes the mock API easy to replace with a real backend later.

---

# Folder Structure

```text
src/
├── api/
│   ├── client/       # Handles API requests
│   ├── services/     # Functions used by the frontend to call APIs
│   └── mock/         # Mock API and mock data
│
├── features/
│   ├── services/     # Service list and service details
│   ├── booking/      # Booking flow
│   └── bookings/     # My Bookings
│
├── components/       # Shared UI components
├── hooks/            # Shared React hooks
├── types/            # TypeScript types
├── utils/            # Formatting and helper functions
└── styles/           # Global styles and design tokens
```

Each feature contains its own pages, components, and hooks.

For example:

```text
features/booking/
├── pages/
├── components/
└── hooks/
```

This keeps related code together and makes the project easier to maintain.

---

# Application Layers

The application follows a simple layered architecture:

```text
Page / Component
       ↓
Feature Hook
       ↓
API Service
       ↓
HTTP Client
       ↓
Mock API
```

### 1. Page / Component

Responsible for:

* Displaying the UI
* Handling user actions
* Showing loading states
* Showing error states
* Showing empty states
* Showing success states

Components do not directly access the mock database.

---

### 2. Feature Hooks

Feature hooks contain the logic required by a particular screen.

For example:

```text
useServices()
useServiceDetails()
useAvailability()
useCreateBooking()
useBookings()
```

They:

* Call API services
* Manage screen-level state
* Handle loading and error states
* Prepare data for components

---

### 3. API Services

The API service provides simple functions for the frontend.

For example:

```ts
servicesApi.listServices()
servicesApi.getService(id)

bookingsApi.createBooking(data)
bookingsApi.getBookings()
```

The components don't need to know how the request is actually implemented.

---

### 4. HTTP Client

The HTTP client provides common methods such as:

```text
GET
POST
```

It handles communication with the API and converts technical errors into a common `ApiError` format.

The HTTP client does not contain booking-specific business logic.

---

### 5. Mock API

The mock API behaves like a real backend.

It:

* Stores mock data
* Simulates network delay
* Validates requests
* Creates bookings
* Checks slot availability
* Returns success responses
* Returns validation errors
* Returns server errors
* Returns booking conflict errors

The mock API is kept separate from React components.

---

# Why Use This Structure?

This structure was chosen because the assignment requires:

* API-first development
* Separation of concerns
* A replaceable mock API
* Error handling
* Testing
* Maintainable code

For a small application, a simpler structure could work, but separating these responsibilities makes the project easier to understand and extend.

---

# Component Responsibilities

### Pages

Pages are responsible for:

* Routing
* Getting URL parameters
* Calling feature hooks
* Showing loading/error/empty/success states
* Combining smaller components

Pages should not contain complex business logic.

### Feature Components

Feature components are responsible for displaying feature-specific UI.

Examples:

```text
ServiceCard
SlotPicker
CustomerForm
BookingSummary
BookingListItem
```

They receive data and functions through props.

### Shared Components

Shared components are used by multiple features.

Examples:

```text
Button
LoadingState
ErrorState
EmptyState
StatusBadge
AppNav
```

---

# State Management

This application does not use a global state management library.

State is kept as close as possible to where it is needed.

### Server Data

Data such as:

```text
Services
Service Details
Availability
Bookings
```

is managed by feature hooks using the shared `useApiRequest` hook.

### Booking State

Booking-specific state stays inside the booking flow.

For example:

```text
Selected date
Selected time slot
Customer information
Booking submission status
```

### UI State

Small UI-only state stays inside the relevant page/component.

This approach avoids adding Redux, Zustand, or another global state library when the application does not need it.

---

# Error Handling

Errors are handled consistently throughout the application.

The API uses a typed `ApiError` containing information such as:

```text
Error code
HTTP status
Error message
Field errors
```

For example:

```text
VALIDATION_ERROR
SLOT_UNAVAILABLE
NOT_FOUND
SERVER_ERROR
```

Different errors have different UI responses.

### Fetch Errors

For service or booking list requests:

```text
Loading
   ↓
Success
   ↓
Error → Retry
```

### Booking Errors

Booking submission has different possible results:

```text
Idle
 ↓
Submitting
 ↓
 ├── Success
 ├── Validation Error
 ├── Slot Conflict
 └── Server Error
```

Validation errors are shown next to the relevant form fields.

If a slot becomes unavailable, the user is asked to choose another time and the availability is refreshed.

---

# How Frontend Communicates With the API

The communication flow is:

```text
1. User opens a page
        ↓
2. Page uses a feature hook
        ↓
3. Feature hook calls an API service
        ↓
4. API service calls the HTTP client
        ↓
5. HTTP client calls the mock API
        ↓
6. Mock API returns a response
        ↓
7. Hook converts the response into UI state
        ↓
8. Page displays the result
```

For example:

```text
ServicePage
     ↓
useServices()
     ↓
servicesApi.listServices()
     ↓
httpClient.get()
     ↓
mockHttpClient
```

---

# Replacing the Mock API

The application is designed so that the mock API can later be replaced with a real backend.

Currently:

```text
API Service
     ↓
Mock HTTP Client
```

Later:

```text
API Service
     ↓
Real HTTP Client
     ↓
Backend API
```

The feature components and pages do not need to know whether the data comes from the mock API or the real backend.

The API client is selected in:

```text
src/api/services/index.ts
```

For a real backend, it can be changed to:

```ts
const client = createFetchHttpClient(
  import.meta.env.VITE_API_BASE_URL
);
```

This keeps the frontend independent from the backend implementation.

---

# Summary

The architecture follows these main principles:

1. **UI and data access are separated.**
2. **Features contain their own business-related logic.**
3. **API services hide API implementation details.**
4. **The mock API behaves like a real backend.**
5. **State is kept at the smallest required scope.**
6. **Errors are handled consistently.**
7. **The mock API can be replaced with a real backend later.**
8. **The structure makes the application easier to test and maintain.**
