# Setup Guide

This guide explains how to install, run, test, and build the application.

---

## 1. Prerequisites

Before running the project, make sure you have:

* Node.js 20 or later
* npm 10 or later

No database or backend server is required because the project uses an in-browser mock API.

---

## 2. Installation

Clone the repository:

```bash
git clone <your-github-repository-url>
```

Go into the project folder:

```bash
cd customer-service-booking
```

Install the dependencies:

```bash
npm install
```

---

## 3. Environment Configuration

No environment variables are required for local development.

The application uses the mock API by default.

The API client is configured in:

```text
src/api/services/index.ts
```

Currently, it uses:

```ts
const client = mockClient;
```

If a real backend is available later, the client can be changed to a real HTTP client and the API base URL can be provided through `.env.local`.

Example:

```env
VITE_API_BASE_URL=https://api.example.com/api/v1
```

The rest of the application does not need to change.

---

## 4. Run the Application

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

The Service List page is shown when the application starts.

---

## 5. Mock API

No separate backend server is required.

The mock API is located inside:

```text
src/api/mock/
```

It runs inside the browser and behaves like a real API.

It simulates:

* API request delay
* Successful responses
* Empty responses
* Validation errors
* Server errors
* Booking conflicts
* Unavailable time slots

Booking data is stored in memory.

Therefore, bookings will be reset when the page is fully refreshed.

---

## 6. Run Tests

Run the tests once:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm test
```

The tests use:

* Vitest
* React Testing Library

Important functionality covered by the tests includes:

* Service list success
* Service list error
* Empty service list
* Service details
* Availability
* Booking validation
* Successful booking
* Booking conflict
* Loading and error states

---

## 7. Type Checking

Run TypeScript type checking:

```bash
npx tsc -b
```

This helps find TypeScript errors before building the application.

---

## 8. Linting

Run the linter:

```bash
npm run lint
```

This checks the code for common problems and helps maintain consistent coding standards.

---

## 9. Production Build

Create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 10. Quick Start

For a new developer, the basic setup is:

```bash
git clone <your-github-repository-url>

cd customer-service-booking

npm install

npm run dev
```

To verify the project:

```bash
npm run lint
npm run test:run
npm run build
```

The project can be developed and tested without a separate backend or database.
