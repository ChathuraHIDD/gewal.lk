import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, LogIn, Plus, Search, X } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth.js";
import {
  MAX_COMPARISON_ITEMS,
  addToComparison,
  clearComparison,
  getComparison,
  removeFromComparison,
} from "../../../services/comparisonService.js";
import { getProperties, resolveMediaUrl } from "../../../services/propertyService.js";
import {
  formatPropertyArea,
  formatPropertyLocation,
  formatPropertyPrice,
  placeholderPropertyImage,
} from "../../../utils/propertyFormat.js";
import "./ComparePage.css";

const propertyTypes = ["House", "Apartment", "Villa", "Land", "Commercial", "Office", "Shop", "Warehouse", "Annexe"];

const criteriaRows = [
  ["Price", (p) => formatPropertyPrice(p)],
  ["Property Type", (p) => p.propertyType],
  ["Listing Type", (p) => p.listingType],
  ["Location", (p) => formatPropertyLocation(p)],
  ["Bedrooms", (p) => p.bedrooms || "—"],
  ["Bathrooms", (p) => p.bathrooms || "—"],
  ["Area", (p) => formatPropertyArea(p)],
  ["Parking", (p) => p.parking || 0],
  ["Furnished", (p) => p.furnished || "Not Applicable"],
  ["Year Built", (p) => p.yearBuilt || "—"],
  ["Ownership", (p) => p.ownershipType || "—"],
  ["Negotiable", (p) => (p.negotiable ? "Yes" : "No")],
];

function ComparePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    getComparison()
      .then((result) => setProperties(result.data.properties))
      .catch((requestError) => setError(requestError.message || "Failed to load comparison list."))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const handleAdd = async (property) => {
    setError("");
    setBusyId(property._id);

    try {
      const result = await addToComparison(property._id);
      setProperties(result.data.properties);
      setPickerOpen(false);
    } catch (requestError) {
      setError(requestError.message || "Failed to add property to comparison.");
      setPickerOpen(false);
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (propertyId) => {
    setError("");
    setBusyId(propertyId);

    try {
      const result = await removeFromComparison(propertyId);
      setProperties(result.data.properties);
    } catch (requestError) {
      setError(requestError.message || "Failed to remove property.");
    } finally {
      setBusyId(null);
    }
  };

  const handleClear = async () => {
    setError("");
    try {
      await clearComparison();
      setProperties([]);
    } catch (requestError) {
      setError(requestError.message || "Failed to clear comparison list.");
    }
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <main className="compare-page">
        <section className="container compare-hero compare-hero--guest">
          <span>Compare</span>
          <h1>Compare properties side by side</h1>
          <p>Sign in to build a comparison list of up to {MAX_COMPARISON_ITEMS} properties, saved to your account.</p>
          <button type="button" onClick={() => navigate("/login", { state: { from: location } })}>
            <LogIn size={18} /> Sign in to compare
          </button>
        </section>
      </main>
    );
  }

  const emptySlotCount = Math.max(0, MAX_COMPARISON_ITEMS - properties.length);
  const slots = [...properties, ...Array(emptySlotCount).fill(null)];

  return (
    <main className="compare-page">
      <section className="container compare-hero">
        <div>
          <span>Compare</span>
          <h1>Compare properties side by side</h1>
          <p>Add up to {MAX_COMPARISON_ITEMS} properties and compare price, size and features at a glance.</p>
        </div>
        {properties.length > 0 && (
          <button type="button" className="compare-clear" onClick={handleClear}>Clear all</button>
        )}
      </section>

      <section className="container compare-shell">
        {error && <p className="compare-state compare-state--error"><AlertCircle size={17} /> {error}</p>}

        {isLoading ? (
          <p className="compare-state"><Loader2 size={18} className="spin" /> Loading your comparison list...</p>
        ) : (
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="compare-table__label-col">Property</th>
                  {slots.map((property, index) => (
                    <th key={property?._id || `empty-${index}`}>
                      {property ? (
                        <div className="compare-column-head">
                          <button
                            type="button"
                            className="compare-column-head__remove"
                            onClick={() => handleRemove(property._id)}
                            disabled={busyId === property._id}
                            aria-label={`Remove ${property.title} from comparison`}
                          >
                            <X size={15} />
                          </button>
                          <img src={resolveMediaUrl(property.coverImage) || placeholderPropertyImage} alt={property.title} />
                          <Link to={`/properties/${property.slug}`}>{property.title}</Link>
                        </div>
                      ) : (
                        <button type="button" className="compare-add-slot" onClick={() => setPickerOpen(true)}>
                          <Plus size={22} />
                          <span>Add Property</span>
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {criteriaRows.map(([label, getValue]) => (
                  <tr key={label}>
                    <td className="compare-table__label-col">{label}</td>
                    {slots.map((property, index) => (
                      <td key={property?._id || `empty-${index}`}>{property ? getValue(property) : "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pickerOpen && (
        <PropertyPickerModal
          excludeIds={properties.map((property) => property._id)}
          busyId={busyId}
          onSelect={handleAdd}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </main>
  );
}

function PropertyPickerModal({ excludeIds, busyId, onSelect, onClose }) {
  const [propertyType, setPropertyType] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getProperties({
      propertyType: propertyType || undefined,
      search: debouncedQuery || undefined,
      limit: 24,
    })
      .then((result) => {
        if (!cancelled) setResults(result.data.properties);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [propertyType, debouncedQuery]);

  return (
    <div className="compare-modal" role="dialog" aria-modal="true">
      <div className="compare-modal__card">
        <header>
          <h3>Add a property to compare</h3>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>

        <div className="compare-modal__search">
          <Search size={18} />
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or location" autoFocus />
        </div>

        <div className="compare-modal__types">
          {propertyTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={propertyType === type ? "is-active" : ""}
              onClick={() => setPropertyType(propertyType === type ? null : type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="compare-modal__results">
          {isLoading ? (
            <p className="compare-state"><Loader2 size={18} className="spin" /> Searching...</p>
          ) : results.length === 0 ? (
            <p className="compare-state">No properties found.</p>
          ) : (
            results.map((property) => {
              const added = excludeIds.includes(property._id);

              return (
                <button
                  key={property._id}
                  type="button"
                  className="compare-modal__result"
                  disabled={added || busyId === property._id}
                  onClick={() => onSelect(property)}
                >
                  <img src={resolveMediaUrl(property.coverImage) || placeholderPropertyImage} alt={property.title} />
                  <div>
                    <strong>{property.title}</strong>
                    <span>{formatPropertyPrice(property)}</span>
                    <small>{formatPropertyLocation(property)}</small>
                  </div>
                  {added ? <span className="compare-modal__added">Added</span> : <Plus size={18} />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ComparePage;
