import { Navigate, Route, Routes } from "react-router-dom";
import { ServiceListPage } from "./features/services/pages/ServiceListPage";
import { AppNav } from "./components/AppNav";
import { ServiceDetailsPage } from "./features/services/pages/ServiceDetailsPage";
import { BookingPage } from "./features/booking/pages/BookingPage";
import { MyBookingsPage } from "./features/bookings/pages/MyBookingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <AppNav />
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="/services" element={<ServiceListPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="/services/:serviceId/book" element={<BookingPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
