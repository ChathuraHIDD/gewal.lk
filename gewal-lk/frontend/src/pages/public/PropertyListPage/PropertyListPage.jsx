import { useMemo, useState } from "react";
import {
  Grid2X2,
  List,
  Map,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import PropertySearchFilter from "../../../components/property/PropertySearchFilter.jsx";
import PropertyCard from "../../../components/property/PropertyCard/PropertyCard.jsx";
import { demoProperties } from "../../../data/demoProperties.js";
import "./PropertyListPage.css";

const quickFilterItems = [
  { key: "verified", label: "Verified listings only" },
  { key: "featured", label: "Featured properties" },
  { key: "negotiable", label: "Price negotiable" },
  { key: "virtualTour", label: "Virtual tour available" },
  { key: "video", label: "Video available" },
];

const locations = ["All", "Colombo", "Rajagiriya", "Nawala", "Battaramulla", "Galle", "Kandy"];
const pageSize = 4;

const getNumericPrice = (price) => Number(String(price).replace(/[^0-9]/g, "")) || 0;

function PropertyListPage() {
  const [view, setView] = useState("grid");
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState("Best Match");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [quickFilters, setQuickFilters] = useState({});
  const [page, setPage] = useState(1);
  const [compareCount, setCompareCount] = useState(0);

  const filteredProperties = useMemo(() => {
    let results = [...demoProperties];

    if (selectedLocation !== "All") {
      results = results.filter((property) =>
        property.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (quickFilters.verified) {
      results = results.filter((property) => property.verified);
    }

    if (quickFilters.featured) {
      results = results.filter((property) => property.featured);
    }

    if (quickFilters.negotiable || quickFilters.virtualTour || quickFilters.video) {
      results = results.filter((property) => property.featured || property.verified);
    }

    if (sortBy === "Price Low to High") {
      results.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    }

    if (sortBy === "Price High to Low") {
      results.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    }

    if (sortBy === "Newest") {
      results.reverse();
    }

    if (sortBy === "Most Viewed") {
      results.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return results;
  }, [quickFilters, selectedLocation, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
  const visibleProperties = filteredProperties.slice((page - 1) * pageSize, page * pageSize);

  const toggleQuickFilter = (key) => {
    setPage(1);
    setQuickFilters((current) => ({ ...current, [key]: !current[key] }));
  };

  const resetFilters = () => {
    setPage(1);
    setSortBy("Best Match");
    setSelectedLocation("All");
    setQuickFilters({});
  };

  const handleCompare = (property, isCompared) => {
    setCompareCount((count) => Math.max(0, count + (isCompared ? 1 : -1)));
  };

  return (
    <main className="property-list-page">
      <section className="property-list-hero">
        <div className="container">
          <span>Premium property search</span>
          <h1>Find properties that match your lifestyle</h1>
          <p>Browse verified houses, apartments, lands, offices and commercial spaces across Sri Lanka.</p>
          <PropertySearchFilter />
        </div>
      </section>

      <section className="container property-list-shell">
        <aside className="property-list-sidebar">
          <div className="sidebar-filter-card">
            <h3><SlidersHorizontal size={18} /> Quick Filters</h3>
            {quickFilterItems.map((item) => (
              <label key={item.key}>
                <input
                  type="checkbox"
                  checked={Boolean(quickFilters[item.key])}
                  onChange={() => toggleQuickFilter(item.key)}
                />
                {item.label}
              </label>
            ))}
            <button className="sidebar-filter-card__reset" type="button" onClick={resetFilters}>
              <RotateCcw size={15} /> Clear filters
            </button>
          </div>
          <div className="sidebar-filter-card">
            <h3>Popular locations</h3>
            {locations.map((item) => (
              <button
                key={item}
                type="button"
                className={selectedLocation === item ? "is-active" : ""}
                onClick={() => {
                  setSelectedLocation(item);
                  setPage(1);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <div className="property-list-content">
          <div className="property-list-toolbar">
            <div>
              <strong>{filteredProperties.length} properties found</strong>
              <span>
                {selectedLocation === "All" ? "Showing best matches across Sri Lanka" : `Showing best matches near ${selectedLocation}`}
                {compareCount > 0 && ` · ${compareCount} in compare`}
              </span>
            </div>
            <div className="property-list-toolbar__actions">
              <select
                aria-label="Sort properties"
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setPage(1);
                }}
              >
                <option>Best Match</option>
                <option>Newest</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
                <option>Most Viewed</option>
              </select>
              <button type="button" aria-label="Grid view" className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")}><Grid2X2 size={18} /></button>
              <button type="button" aria-label="List view" className={view === "list" ? "is-active" : ""} onClick={() => setView("list")}><List size={18} /></button>
              <button type="button" className={showMap ? "is-active" : ""} onClick={() => setShowMap((value) => !value)}><Map size={18} /> Map</button>
            </div>
          </div>

          {showMap && (
            <div className="property-list-map">
              <Map size={34} />
              <span>Interactive map preview</span>
              <button type="button" onClick={() => setSelectedLocation("Colombo")}>Search this area</button>
            </div>
          )}

          {visibleProperties.length > 0 ? (
            <div className={view === "grid" ? "property-result-grid" : "property-result-list"}>
              {visibleProperties.map((property) => (
                <PropertyCard key={property.id} property={property} view={view} onCompare={handleCompare} />
              ))}
            </div>
          ) : (
            <div className="property-empty-state">
              <h3>No properties found</h3>
              <p>Try changing your filters or clearing all selected options.</p>
              <button type="button" onClick={resetFilters}>Clear filters</button>
            </div>
          )}

          <div className="property-pagination">
            <button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                type="button"
                key={index + 1}
                className={page === index + 1 ? "is-active" : ""}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button type="button" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PropertyListPage;
