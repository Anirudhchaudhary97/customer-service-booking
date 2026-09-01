import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import "./NotFoundPage.css";

export function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-message">
          The page you are looking for doesn't exist, was removed, or had its address changed.
        </p>
        <Link to="/services">
          <Button variant="primary">Browse available services</Button>
        </Link>
      </div>
    </div>
  );
}
