# API Contract

This document defines how the frontend communicates with the booking API.

The frontend is developed based on this contract. The mock API follows the same contract so that it can later be replaced with a real backend without changing the frontend logic.

All API endpoints use the `/api/v1` prefix.

---

## 1. Common Rules

### Successful Response

Successful API responses use:

```json
{
  "data": {}
}
```

Some list APIs may also include `meta` information:

```json
{
  "data": [],
  "meta": {
    "total": 0
  }
}
```

### Error Response

Errors use:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Something went wrong."
  }
}
```

### Common Error Codes

| Code               |  Status | Meaning                                      |
| ------------------ | ------: | -------------------------------------------- |
| `VALIDATION_ERROR` |     422 | User input is invalid                        |
| `NOT_FOUND`        |     404 | Requested item does not exist                |
| `SLOT_UNAVAILABLE` |     409 | Selected booking slot is no longer available |
| `SERVER_ERROR`     | 500/503 | Server-side problem                          |
| `NETWORK_ERROR`    |  Client | Request could not reach the server           |

---

# 2. Services API

## GET `/services`

Returns the list of available services.

### Purpose

Used by the **Service List** page.

### Query Parameters

| Parameter  | Required | Description                                     |
| ---------- | -------- | ----------------------------------------------- |
| `search`   | No       | Searches service name, description, or provider |
| `category` | No       | Filters services by category                    |

Example:

```text
GET /api/v1/services?search=cleaning&category=cleaning
```

### Success Response

**200 OK**

```json
{
  "data": [
    {
      "id": "svc-001",
      "name": "Deep Home Cleaning",
      "descriptionPreview": "A thorough top-to-bottom clean...",
      "category": "cleaning",
      "provider": {
        "id": "prv-001",
        "name": "Clara Nguyen",
        "rating": 4.8,
        "reviewCount": 212
      },
      "price": 89,
      "currency": "USD",
      "durationMinutes": 120,
      "rating": 4.8,
      "isAvailable": true,
      "imageId": "cleaning-1"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### Frontend Behaviour

* Show loading state while requesting data.
* Show services when the request succeeds.
* Show an empty state when no services are found.
* Show an error message with a retry button if the request fails.
* Search and category changes make a new API request.

---

# 3. Service Details API

## GET `/services/{service_id}`

Returns complete information about one service.

### Purpose

Used by the **Service Details** page.

### Path Parameter

```text
service_id
```

Example:

```text
GET /api/v1/services/svc-001
```

### Success Response

**200 OK**

```json
{
  "data": {
    "id": "svc-001",
    "name": "Deep Home Cleaning",
    "description": "A thorough top-to-bottom clean covering kitchens, bathrooms, living areas and bedrooms.",
    "category": "cleaning",
    "provider": {
      "id": "prv-001",
      "name": "Clara Nguyen",
      "rating": 4.8,
      "reviewCount": 212
    },
    "price": 89,
    "currency": "USD",
    "durationMinutes": 120,
    "rating": 4.8,
    "isAvailable": true,
    "imageId": "cleaning-1"
  }
}
```

### Errors

**404 NOT_FOUND**

Returned when the service does not exist.

### Frontend Behaviour

* Show loading state while fetching.
* Show service details when successful.
* Show "Service not found" when the service does not exist.
* Show a retry option for server errors.

---

# 4. Availability API

## GET `/services/{service_id}/availability`

Returns available booking time slots for a service.

### Purpose

Used by the **Date & Time Selection** step.

Example:

```text
GET /api/v1/services/svc-001/availability
```

### Success Response

**200 OK**

```json
{
  "data": [
    {
      "date": "2026-09-02",
      "slots": [
        {
          "id": "slot-001",
          "startTime": "2026-09-02T09:00:00.000Z",
          "endTime": "2026-09-02T10:00:00.000Z",
          "isAvailable": true
        },
        {
          "id": "slot-002",
          "startTime": "2026-09-02T10:00:00.000Z",
          "endTime": "2026-09-02T11:00:00.000Z",
          "isAvailable": false
        }
      ]
    }
  ]
}
```

### Errors

**404 NOT_FOUND**

Returned when the service does not exist.

### Frontend Behaviour

* Show loading while availability is being fetched.
* Disable unavailable slots.
* Show a message when no slots are available.
* Allow the user to select an available slot.
* Provide retry if the request fails.

---

# 5. Create Booking API

## POST `/bookings`

Creates a new booking.

### Purpose

Used when the customer confirms a booking.

### Request Body

```json
{
  "serviceId": "svc-001",
  "slotId": "slot-001",
  "customer": {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "555-123-4567",
    "address": "123 Main St, Springfield"
  }
}
```

### Success Response

**201 Created**

```json
{
  "data": {
    "id": "bkg-1001",
    "bookingNumber": "BK-1001",
    "serviceId": "svc-001",
    "serviceName": "Deep Home Cleaning",
    "providerName": "Clara Nguyen",
    "scheduledStart": "2026-09-02T09:00:00.000Z",
    "scheduledEnd": "2026-09-02T10:00:00.000Z",
    "status": "confirmed",
    "price": 89,
    "currency": "USD"
  }
}
```

### Validation

The following fields are required:

| Field       | Rule                 |
| ----------- | -------------------- |
| `serviceId` | Required             |
| `slotId`    | Required             |
| `fullName`  | Required             |
| `email`     | Valid email required |
| `phone`     | At least 7 digits    |
| `address`   | Required             |

### Validation Error

**422 VALIDATION_ERROR**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fieldErrors": [
      {
        "field": "customer.fullName",
        "message": "Full name is required."
      },
      {
        "field": "customer.email",
        "message": "Enter a valid email address."
      }
    ]
  }
}
```

The frontend will show these errors next to the relevant form fields.

### Booking Conflict

**409 SLOT_UNAVAILABLE**

Returned when another customer has already booked the selected slot.

```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The selected time slot is no longer available."
  }
}
```

The frontend will ask the user to choose another time and refresh the available slots.

### Frontend Behaviour

* Disable the submit button while booking.
* Show validation errors on the relevant fields.
* Show a success screen after successful booking.
* Handle slot conflicts separately from normal errors.
* Allow the user to select another slot after a conflict.

---

# 6. My Bookings API

## GET `/bookings`

Returns all bookings.

### Purpose

Used by the **My Bookings** page.

### Success Response

**200 OK**

```json
{
  "data": [
    {
      "id": "bkg-1001",
      "bookingNumber": "BK-1001",
      "serviceName": "Deep Home Cleaning",
      "providerName": "Clara Nguyen",
      "scheduledStart": "2026-09-02T09:00:00.000Z",
      "scheduledEnd": "2026-09-02T10:00:00.000Z",
      "status": "confirmed",
      "price": 89,
      "currency": "USD"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### Frontend Behaviour

* Show loading state while fetching.
* Show bookings when available.
* Show "No bookings yet" when the list is empty.
* Show an error state with retry if the request fails.

---

# 7. Booking Details API

## GET `/bookings/{booking_id}`

Returns details of a single booking.

### Purpose

Used when opening a specific booking.

Example:

```text
GET /api/v1/bookings/bkg-1001
```

### Success Response

```json
{
  "data": {
    "id": "bkg-1001",
    "bookingNumber": "BK-1001",
    "serviceName": "Deep Home Cleaning",
    "providerName": "Clara Nguyen",
    "scheduledStart": "2026-09-02T09:00:00.000Z",
    "scheduledEnd": "2026-09-02T10:00:00.000Z",
    "status": "confirmed",
    "price": 89,
    "currency": "USD"
  }
}
```

### Errors

**404 NOT_FOUND**

Returned when the booking does not exist.

### Frontend Behaviour

* Show loading while fetching.
* Show booking details when successful.
* Show "Booking not found" when the booking does not exist.
* Show retry for server errors.

---

# 8. API and Frontend Relationship

The frontend should not directly access mock data.

The flow should be:

```text
React Component
      ↓
Feature Hook
      ↓
API Service
      ↓
HTTP Client
      ↓
Mock API
```

Later, the Mock API can be replaced:

```text
React Component
      ↓
Feature Hook
      ↓
API Service
      ↓
HTTP Client
      ↓
Real Backend API
```

This keeps the frontend independent from the mock API implementation.

---

# 9. Mock API Requirements

The mock API will simulate a real backend.

It will:

* Return Promise-based responses.
* Simulate network delay.
* Return successful responses.
* Return empty responses.
* Return validation errors.
* Return server errors.
* Return booking conflict errors.
* Keep mock data separate from React components.
* Update booking data when a booking is created.

The frontend should behave exactly as if it were communicating with a real backend.

---

# 10. API Contract Summary

| Method | Endpoint                              | Purpose             |
| ------ | ------------------------------------- | ------------------- |
| GET    | `/services`                           | Get services        |
| GET    | `/services/{service_id}`              | Get service details |
| GET    | `/services/{service_id}/availability` | Get available slots |
| POST   | `/bookings`                           | Create booking      |
| GET    | `/bookings`                           | Get all bookings    |
| GET    | `/bookings/{booking_id}`              | Get booking details |

This contract will be the reference for implementing the mock API and the frontend.
