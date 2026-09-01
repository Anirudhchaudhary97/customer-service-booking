import { NavLink } from "react-router-dom";
import "./AppShell.css";

export function AppNav() {
  return (
    <header className="app-nav">
      <div className="app-nav-inner">
        <NavLink to="/services" className="app-nav-brand">
          Customer Service Booking
        </NavLink>
        <nav className="app-nav-links">
          <NavLink to="/services" className={({ isActive }) => (isActive ? "is-active" : "")}>
            Services
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => (isActive ? "is-active" : "")}>
            My bookings
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
