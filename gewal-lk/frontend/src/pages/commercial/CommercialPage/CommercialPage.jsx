import { useMemo, useState } from "react";
import { BriefcaseBusiness, Building2, Map, MapPin, Search, SlidersHorizontal, Warehouse } from "lucide-react";
import PropertyCard from "../../../components/property/PropertyCard/PropertyCard.jsx";
import { demoProperties } from "../../../data/demoProperties.js";
import "./CommercialPage.css";

const commercialTypes = ["All", "Office", "Shop", "Warehouse", "Factory", "Hotel", "Commercial"];
const locations = ["All", "Colombo", "Gampaha", "Kandy", "Galle"];

function CommercialPage() {
  const [type, setType] = useState("All");
  const [location, setLocation] = useState("All");
  const [query, setQuery] = useState("");
  const [showMap, setShowMap] = useState(false);

  const commercialProperties = useMemo(() => {
    const base = demoProperties.filter((item) => ["Office", "Shop", "Warehouse", "Commercial"].includes(item.propertyType) || item.id.includes("commercial"));
    const fallback = base.length ? base : demoProperties.slice(0, 4).map((item) => ({ ...item, propertyType: "Commercial", listingType: "Lease" }));
    return fallback.filter((item) => {
      const matchesType = type === "All" || item.propertyType === type;
      const matchesLocation = location === "All" || item.location.toLowerCase().includes(location.toLowerCase());
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.location.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesLocation && matchesQuery;
    });
  }, [location, query, type]);

  return (
    <main className="commercial-page">
      <section className="commercial-hero">
        <div className="container commercial-hero__inner">
          <div>
            <span>Commercial Real Estate</span>
            <h1>Find offices, shops, warehouses and investment spaces</h1>
            <p>Discover premium commercial properties for lease, rent and sale across Sri Lanka.</p>
          </div>
          <div className="commercial-hero__cards">
            <article><Building2 size={26} /><strong>Office</strong><small>Modern workspaces</small></article>
            <article><Warehouse size={26} /><strong>Warehouse</strong><small>Logistics-ready</small></article>
            <article><BriefcaseBusiness size={26} /><strong>Retail</strong><small>Prime locations</small></article>
          </div>
        </div>
      </section>

      <section className="container commercial-search-panel">
        <label><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search commercial property" /></label>
        <select value={type} onChange={(e) => setType(e.target.value)}>{commercialTypes.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>{locations.map((item) => <option key={item}>{item}</option>)}</select>
        <button onClick={() => setShowMap((value) => !value)}><Map size={18} /> {showMap ? "Hide Map" : "Show Map"}</button>
      </section>

      <section className="container commercial-layout">
        <aside className="commercial-sidebar">
          <h3><SlidersHorizontal size={18} /> Commercial Filters</h3>
          {["Verified only", "Featured", "Parking available", "Main road access", "Loading bay", "Security"].map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
          <div><h4>Popular areas</h4>{["Colombo 01", "Rajagiriya", "Bambalapitiya", "Nugegoda"].map((item) => <button key={item} onClick={() => setQuery(item)}>{item}</button>)}</div>
        </aside>

        <div className="commercial-results">
          {showMap && <div className="commercial-map"><MapPin size={34} /><span>Commercial map search preview</span><button onClick={() => setLocation("Colombo")}>Search Colombo</button></div>}
          <div className="commercial-results__heading"><strong>{commercialProperties.length} commercial spaces found</strong><span>Sorted by best match</span></div>
          <div className="commercial-grid">{commercialProperties.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
        </div>
      </section>
    </main>
  );
}

export default CommercialPage;
