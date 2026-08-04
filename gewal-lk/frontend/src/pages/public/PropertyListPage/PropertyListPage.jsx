import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Circle,
  Grid2X2,
  List,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { demoProperties } from "../../../data/demoProperties.js";
import "./PropertyListPage.css";

const propertyTypes = ["House", "Apartment", "Land", "Commercial"];
const bedroomFilters = ["1+", "2+", "3+", "4+"];
const getNumericPrice = (price) => Number(String(price).replace(/[^0-9]/g, "")) || 0;

function PropertyListPage() {
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("Newest");
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBeds, setSelectedBeds] = useState(null);

  const filteredProperties = useMemo(() => {
    let results = demoProperties.filter((property) => {
      const matchesQuery = `${property.title} ${property.location}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = !selectedType || property.propertyType === selectedType || (selectedType === "Commercial" && ["Office", "Shop", "Warehouse"].includes(property.propertyType));
      const matchesBeds = !selectedBeds || Number(property.beds || 0) >= Number(selectedBeds.replace("+", ""));
      return matchesQuery && matchesType && matchesBeds;
    });

    if (sortBy === "Price Low") results = results.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    if (sortBy === "Price High") results = results.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    if (sortBy === "Newest") results = [...results].reverse();
    return results;
  }, [query, selectedBeds, selectedType, sortBy]);

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedBeds(null);
    setQuery("");
    setSortBy("Newest");
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

          <div className="minimal-results-toolbar">
            <p>Showing {filteredProperties.length} of {demoProperties.length}</p>
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
              <Link to={`/properties/${property.id}`} className="minimal-property-card" key={property.id}>
                <div className="minimal-property-card__image">
                  <img src={property.image} alt={property.title} />
                  <span>For {property.listingType}</span>
                </div>
                <div className="minimal-property-card__body">
                  <div>
                    <h2>{property.title.replace("Architect Designed ", "").replace(" With City Views", "")}</h2>
                    <strong>{property.price}</strong>
                  </div>
                  <p>{property.location}</p>
                  <small>{property.beds || "—"} beds · {property.baths || "—"} baths · {property.area}</small>
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
