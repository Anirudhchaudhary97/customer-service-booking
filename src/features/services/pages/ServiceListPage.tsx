import { useServiceList } from "../hooks/useServiceList";
import { ServiceFilters } from "../components/ServiceFilters";
import { ServiceCard } from "../components/ServiceCard";
import { LoadingState } from "../../../components/LoadingState";
import { ErrorState } from "../../../components/ErrorState";
import { EmptyState } from "../../../components/EmptyState";
import "./ServiceListPage.css";

export function ServiceListPage() {
  const request = useServiceList();
  const { search, setSearch, category, setCategory, refetch } = request;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Book a service</h1>
        <p className="page-subtitle">Choose from a range of services and book at your convenient time</p>
      </header>

      <ServiceFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />

      {request.status === "loading" && <LoadingState label="Loading services…" />}

      {request.status === "error" && (
        <ErrorState message={request.error.message} onRetry={refetch} />
      )}

      {request.status === "success" && request.data.length === 0 && (
        <EmptyState
          title="No services match your search"
          message="Try a different keyword or clear the category filter."
        />
      )}

      {request.status === "success" && request.data.length > 0 && (
        <div className="service-grid">
          {request.data.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
