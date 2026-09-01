import { Link } from "react-router-dom";
import type { ServiceSummary } from "../../../types/domain";
import { formatCategory, formatDuration, formatPrice } from "../../../utils/format";
import "./ServiceCard.css";

export function ServiceCard({ service }: { service: ServiceSummary }) {
  return (
    <Link to={`/services/${service.id}`} className="service-card" data-testid="service-card">
      <div className="service-card-top">
        <span className="service-card-category">{formatCategory(service.category)}</span>
        {!service.isAvailable && <span className="service-card-unavailable">Unavailable</span>}
      </div>
      <h3 className="service-card-name">{service.name}</h3>
      <p className="service-card-desc">{service.descriptionPreview}</p>
      <div className="service-card-meta">
        <span>{service.provider.name}</span>
        <span aria-hidden="true">·</span>
        <span>★ {service.rating.toFixed(1)}</span>
      </div>
      <div className="service-card-footer">
        <span className="service-card-price">{formatPrice(service.price, service.currency)}</span>
        <span className="service-card-duration">{formatDuration(service.durationMinutes)}</span>
      </div>
    </Link>
  );
}
