import { Link, useNavigate, useParams } from "react-router-dom";
import { useServiceDetails } from "../hooks/useServiceDetails";
import { LoadingState } from "../../../components/LoadingState";
import { ErrorState } from "../../../components/ErrorState";
import { Button } from "../../../components/Button";
import { formatCategory, formatDuration, formatPrice } from "../../../utils/format";
import type { Service } from "../../../types/domain";
import "./ServiceDetailsPage.css";

export function ServiceDetailsPage() {
  const { serviceId = "" } = useParams();
  const navigate = useNavigate();
  const request = useServiceDetails(serviceId);

  return (
    <div className="page">
      <Link to="/services" className="back-link">
        ← Back to services
      </Link>

      {request.status === "loading" && <LoadingState label="Loading service details…" />}

      {request.status === "error" && (
        <ErrorState message={request.error.message} onRetry={request.refetch} />
      )}

      {request.status === "success" && (
        <ServiceDetailsContent service={request.data} onBook={(id) => navigate(`/services/${id}/book`)} />
      )}
    </div>
  );
}

function ServiceDetailsContent({ service, onBook }: { service: Service; onBook: (serviceId: string) => void }) {
  return (
    <article className="service-details">
      <header className="service-details-header">
        <span className="service-details-category">{formatCategory(service.category)}</span>
        <h1>{service.name}</h1>
        <div className="service-details-meta">
          <span>{service.provider.name}</span>
          <span aria-hidden="true">·</span>
          <span>
            ★ {service.rating.toFixed(1)} ({service.provider.reviewCount} reviews)
          </span>
        </div>
      </header>

      <p className="service-details-description">{service.description}</p>

      <dl className="service-details-facts">
        <div>
          <dt>Price</dt>
          <dd>{formatPrice(service.price, service.currency)}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{formatDuration(service.durationMinutes)}</dd>
        </div>
        <div>
          <dt>Provider</dt>
          <dd>{service.provider.name}</dd>
        </div>
        <div>
          <dt>Availability</dt>
          <dd>{service.isAvailable ? "Accepting bookings" : "Currently unavailable"}</dd>
        </div>
      </dl>

      <Button disabled={!service.isAvailable} onClick={() => onBook(service.id)}>
        {service.isAvailable ? "Choose a time" : "Not currently bookable"}
      </Button>
    </article>
  );
}
