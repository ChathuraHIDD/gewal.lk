import { useState } from "react";
import {
  Grid2X2,
  List,
  Map,
  SlidersHorizontal,
} from "lucide-react";

import PropertySearchFilter from "../../../components/property/PropertySearchFilter.jsx";
import PropertyCard from "../../../components/property/PropertyCard/PropertyCard.jsx";
import { demoProperties } from "../../../data/demoProperties.js";
import "./PropertyListPage.css";

function PropertyListPage() {
  const [view, setView] = useState("grid");
  const [showMap, setShowMap] = useState(false);

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
            {[
              "Verified listings only",
              "Featured properties",
              "Price negotiable",
              "Virtual tour available",
              "Video available",
            ].map((item) => (
              <label key={item}><input type="checkbox" /> {item}</label>
            ))}
          </div>
          <div className="sidebar-filter-card">
            <h3>Popular locations</h3>
            {[
              "Colombo",
              "Rajagiriya",
              "Nawala",
              "Battaramulla",
              "Galle",
              "Kandy",
            ].map((item) => <button key={item}>{item}</button>)}
          </div>
        </aside>

        <div className="property-list-content">
          <div className="property-list-toolbar">
            <div>
              <strong>{demoProperties.length} properties found</strong>
              <span>Showing best matches near Colombo</span>
            </div>
            <div className="property-list-toolbar__actions">
              <select aria-label="Sort properties">
                <option>Best Match</option>
                <option>Newest</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
                <option>Most Viewed</option>
              </select>
              <button className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")}><Grid2X2 size={18} /></button>
              <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")}><List size={18} /></button>
              <button className={showMap ? "is-active" : ""} onClick={() => setShowMap((value) => !value)}><Map size={18} /> Map</button>
            </div>
          </div>

          {showMap && (
            <div className="property-list-map">
              <Map size={34} />
              <span>Map search preview</span>
              <button>Search this area</button>
            </div>
          )}

          <div className={view === "grid" ? "property-result-grid" : "property-result-list"}>
            {demoProperties.map((property) => (
              <PropertyCard key={property.id} property={property} view={view} />
            ))}
          </div>

          <div className="property-pagination">
            <button>Previous</button>
            <button className="is-active">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PropertyListPage;
