import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Circle,
  Grid2X2,
  Heart,
  List,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth.js";
import { useFavorites } from "../../../hooks/useFavorites.js";
import { getProperties, resolveMediaUrl } from "../../../services/propertyService.js";
import {
  formatPropertyArea as formatArea,
  formatPropertyLocation as formatLocation,
  formatPropertyPrice as formatPrice,
  placeholderPropertyImage as placeholderImage,
} from "../../../utils/propertyFormat.js";
import "./PropertyListPage.css";

const propertyTypes = ["House", "Apartment", "Land", "Commercial"];
const bedroomFilters = ["1+", "2+", "3+", "4+"];

function PropertyListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle: toggleFavorite } = useFavorites();

  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("Newest");
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBeds, setSelectedBeds] = useState(null);

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getProperties({ limit: 48 })
      .then((result) => {
        if (!cancelled) setProperties(result.data.properties);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Failed to load properties.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProperties = useMemo(() => {
    let results = properties.filter((property) => {
      const matchesQuery = `${property.title} ${formatLocation(property)}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = !selectedType || property.propertyType === selectedType || (selectedType === "Commercial" && ["Office", "Shop", "Warehouse"].includes(property.propertyType));
      const matchesBeds = !selectedBeds || Number(property.bedrooms || 0) >= Number(selectedBeds.replace("+", ""));
      return matchesQuery && matchesType && matchesBeds;
    });

    if (sortBy === "Price Low") results = results.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "Price High") results = results.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "Newest") results = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return results;
  }, [properties, query, selectedBeds, selectedType, sortBy]);

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedBeds(null);
    setQuery("");
    setSortBy("Newest");
  };

  const handleSave = (event, property) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    toggleFavorite(property._id).catch(() => {});
  };

  return (
    <main className="minimal-properties-page">
      <section className="minimal-properties-hero">
        <div className="container">
          <nav className="minimal-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Property List</span>
          </nav>
          <h1>Property for sale & rent</h1>
        </div>
      </section>

      <section className="container minimal-properties-shell">
        <aside className="minimal-properties-sidebar">
          <div className="minimal-filter-title"><SlidersHorizontal size={15} /> Filters</div>

          <div className="minimal-filter-block">
            <h3>Property Type</h3>
            <div className="minimal-filter-chips">
              {propertyTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  className={selectedType === type ? "is-active" : ""}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="minimal-filter-block">
            <h3>Bedrooms</h3>
            <div className="minimal-filter-chips">
              {bedroomFilters.map((beds) => (
                <button
                  type="button"
                  key={beds}
                  className={selectedBeds === beds ? "is-active" : ""}
                  onClick={() => setSelectedBeds(selectedBeds === beds ? null : beds)}
                >
                  {beds}
                </button>
              ))}
            </div>
          </div>

          <button className="minimal-clear" type="button" onClick={clearFilters}>Clear all filters</button>
        </aside>

        <div className="minimal-properties-content">
          <form className="minimal-properties-search" onSubmit={(event) => event.preventDefault()}>
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Colombo, Kandy, Bentota..." />
            <button type="submit">Search</button>
          </form>

          {error && <p className="minimal-empty" style={{ padding: "16px 0" }}><AlertCircle size={17} /> {error}</p>}

          {isLoading ? (
            <p className="minimal-empty" style={{ padding: "40px 0" }}><Loader2 size={18} className="minimal-spin" /> Loading properties...</p>
          ) : (
            <>
              <div className="minimal-results-toolbar">
                <p>Showing {filteredProperties.length} of {properties.length}</p>
                <div>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort listings">
                    <option>Newest</option>
                    <option>Price Low</option>
                    <option>Price High</option>
                  </select>
                  <button type="button" className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={17} /></button>
                  <button type="button" className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="List view"><List size={17} /></button>
                </div>
              </div>

              <div className={view === "grid" ? "minimal-property-grid" : "minimal-property-grid is-list"}>
                {filteredProperties.map((property) => (
                  <Link to={`/properties/${property.slug}`} className="minimal-property-card" key={property._id}>
                    <div className="minimal-property-card__image">
                      <img src={resolveMediaUrl(property.coverImage) || placeholderImage} alt={property.title} />
                      <span>For {property.listingType}</span>
                      <button
                        type="button"
                        className={isSaved(property._id) ? "minimal-property-card__save is-active" : "minimal-property-card__save"}
                        aria-label={isSaved(property._id) ? "Remove saved property" : "Save property"}
                        onClick={(event) => handleSave(event, property)}
                      >
                        <Heart size={18} fill={isSaved(property._id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="minimal-property-card__body">
                      <div>
                        <h2>{property.title}</h2>
                        <strong>{formatPrice(property)}</strong>
                      </div>
                      <p>{formatLocation(property)}</p>
                      <small>{property.bedrooms || "—"} beds · {property.bathrooms || "—"} baths · {formatArea(property)}</small>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="minimal-empty">
                  <h2>No listings found</h2>
                  <p>Try another location or clear your filters.</p>
                  <button type="button" onClick={clearFilters}>Clear filters</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="minimal-properties-footer">
        <div className="container minimal-properties-footer__grid">
          <div>
            <h3>Gewal.lk</h3>
            <p>A premium real estate platform helping Sri Lankans buy, sell and rent with confidence.</p>
            <div className="minimal-footer-socials"><Circle size={16} /><Circle size={16} /><Circle size={16} /><Circle size={16} /></div>
          </div>
          <div><h3>Quick Links</h3><a href="/">Home</a><a href="/buy">Buy</a><a href="/sell">Sell</a><a href="/contact">Contact</a></div>
          <div><h3>Property Links</h3><a href="/properties">Featured Properties</a><a href="/rent">Rentals</a><a href="/agents">Agents</a><a href="/post-property">List Property</a></div>
          <div><h3>Contact Information</h3><p><MapPin size={15} /> Colombo, Sri Lanka</p><p><Phone size={15} /> +94 77 123 4567</p><p><Mail size={15} /> hello@gewal.lk</p></div>
        </div>
        <div className="container minimal-properties-footer__bottom">© 2026 Gewal.lk. All rights reserved.</div>
      </footer>
    </main>
  );
}

export default PropertyListPage;
