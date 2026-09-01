import type { ChangeEvent } from "react";
import "./ServiceFilters.css";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "cleaning", label: "Cleaning" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "tutoring", label: "Tutoring" },
  { value: "wellness", label: "Wellness" },
  { value: "photography", label: "Photography" },
];

interface ServiceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export function ServiceFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: ServiceFiltersProps) {
  return (
    <div className="service-filters">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search services or providers…"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          aria-label="Search services"
        />
      </div>

      <div className="category-chips">
        {CATEGORIES.map((c) => {
          const isActive = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              className={`chip-button ${isActive ? "active" : ""}`}
              onClick={() => onCategoryChange(c.value)}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
