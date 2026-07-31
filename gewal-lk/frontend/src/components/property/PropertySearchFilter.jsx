import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  Map,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import "./PropertySearchFilter.css";

const propertyTypes = [
  "House",
  "Apartment",
  "Villa",
  "Land",
  "Commercial",
  "Office",
  "Warehouse",
  "Shop",
  "Annexe",
];

const bedroomOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];
const locations = [
  "Colombo, Western Province",
  "Nawala, Colombo",
  "Rajagiriya, Colombo",
  "Kandy, Central Province",
  "Galle, Southern Province",
  "Negombo, Gampaha",
  "Dehiwala 10350",
];

const amenities = [
  "Swimming Pool",
  "Gym",
  "Balcony",
  "Garden",
  "Garage",
  "Lift",
  "CCTV",
  "Security",
  "Air Conditioning",
  "Solar",
  "Internet",
  "Water Supply",
];

const years = ["Any", "2026", "2025", "2024", "2020+", "2015+", "Before 2010"];
const sortOptions = ["Best Match", "Newest", "Oldest", "Price Low to High", "Price High to Low", "Most Viewed", "Featured"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

function ChoiceChips({ options, value, onChange }) {
  return (
    <div className="filter-chips">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={value === option ? "is-active" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function SelectField({ label, children }) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select>{children}</select>
      <ChevronDown size={16} />
    </label>
  );
}

function Toggle({ label }) {
  const [checked, setChecked] = useState(false);

  return (
    <label className="filter-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <i />
    </label>
  );
}

function RangeFilter({ label, min, max, step = 1000000, suffix = "" }) {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  return (
    <div className="range-filter">
      <div className="range-filter__header">
        <span>{label}</span>
        <strong>
          {suffix ? `${minValue}${suffix} - ${maxValue}${suffix}` : `${formatCurrency(minValue)} - ${formatCurrency(maxValue)}`}
        </strong>
      </div>
      <div className="range-filter__sliders">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(event) => setMinValue(Math.min(Number(event.target.value), maxValue - step))}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(event) => setMaxValue(Math.max(Number(event.target.value), minValue + step))}
        />
      </div>
      <div className="range-filter__inputs">
        <input value={minValue} onChange={(event) => setMinValue(Number(event.target.value) || min)} aria-label={`${label} minimum`} />
        <input value={maxValue} onChange={(event) => setMaxValue(Number(event.target.value) || max)} aria-label={`${label} maximum`} />
      </div>
    </div>
  );
}

function PropertySearchFilter() {
  const [listingType, setListingType] = useState("Buy");
  const [location, setLocation] = useState("Colombo, Western Province");
  const [selectedTypes, setSelectedTypes] = useState(["House"]);
  const [bedrooms, setBedrooms] = useState("Any");
  const [bathrooms, setBathrooms] = useState("Any");
  const [moreOpen, setMoreOpen] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);

  const filteredLocations = useMemo(
    () => locations.filter((item) => item.toLowerCase().includes(location.toLowerCase().trim())),
    [location]
  );

  const toggleType = (type) => {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    );
  };

  return (
    <form className="property-filter" onSubmit={(event) => event.preventDefault()}>
      <div className="property-filter__default">
        <div className="filter-segment" aria-label="Listing type">
          {["Buy", "Rent", "Lease"].map((type) => (
            <button
              type="button"
              key={type}
              className={listingType === type ? "is-active" : ""}
              onClick={() => setListingType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <label className="filter-autocomplete">
          <span>Location</span>
          <MapPin size={18} />
          <input
            value={location}
            onFocus={() => setLocationFocused(true)}
            onBlur={() => window.setTimeout(() => setLocationFocused(false), 120)}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Country, province, district, city, area or postal code"
          />
          {locationFocused && location && filteredLocations.length > 0 && (
            <div className="filter-autocomplete__menu">
              {filteredLocations.slice(0, 4).map((item) => (
                <button type="button" key={item} onMouseDown={() => setLocation(item)}>
                  <MapPin size={14} /> {item}
                </button>
              ))}
            </div>
          )}
        </label>

        <div className="filter-multiselect">
          <span>Property Type</span>
          <button type="button">
            {selectedTypes.length ? selectedTypes.join(", ") : "Select types"}
            <ChevronDown size={16} />
          </button>
          <div className="filter-multiselect__menu">
            {propertyTypes.map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <RangeFilter label="Price Range" min={0} max={250000000} step={5000000} />

        <div className="filter-chip-field">
          <span>Bedrooms</span>
          <ChoiceChips options={bedroomOptions} value={bedrooms} onChange={setBedrooms} />
        </div>

        <button className="property-filter__search" type="submit">
          <Search size={19} /> Search
        </button>

        <button
          className="property-filter__more"
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
        >
          {moreOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
          More Filters
        </button>
      </div>

      {moreOpen && (
        <section className="advanced-filter" aria-label="Advanced filters">
          <div className="advanced-filter__header">
            <div>
              <span><Filter size={17} /> Advanced Filters</span>
              <h3>Refine your property search</h3>
            </div>
            <button type="button" onClick={() => setMoreOpen(false)}><X size={19} /></button>
          </div>

          <div className="advanced-filter__grid">
            <div className="filter-chip-field">
              <span>Bathrooms</span>
              <ChoiceChips options={bedroomOptions} value={bathrooms} onChange={setBathrooms} />
            </div>

            <RangeFilter label="Land Size" min={0} max={100} step={1} suffix=" perches" />
            <RangeFilter label="Building Size" min={0} max={10000} step={250} suffix=" sqft" />

            <SelectField label="Year Built">
              {years.map((year) => <option key={year}>{year}</option>)}
            </SelectField>
            <SelectField label="Parking Spaces">
              {["Any", "1+", "2+", "3+", "4+"].map((item) => <option key={item}>{item}</option>)}
            </SelectField>
            <SelectField label="Floors">
              {["Any", "Single", "2", "3", "4+"].map((item) => <option key={item}>{item}</option>)}
            </SelectField>
            <SelectField label="Availability">
              {["Available Now", "Available Soon", "Future"].map((item) => <option key={item}>{item}</option>)}
            </SelectField>
            <SelectField label="Posted Within">
              {["Today", "Last 3 Days", "Last Week", "Last Month"].map((item) => <option key={item}>{item}</option>)}
            </SelectField>
            <SelectField label="Sort By">
              {sortOptions.map((item) => <option key={item}>{item}</option>)}
            </SelectField>

            <div className="filter-checkbox-card">
              <h4>Furnished Status</h4>
              {["Furnished", "Semi Furnished", "Unfurnished"].map((item) => (
                <label key={item}><input type="checkbox" /> {item}</label>
              ))}
            </div>

            <div className="filter-checkbox-card">
              <h4>Property Condition</h4>
              {["New", "Used", "Under Construction"].map((item) => (
                <label key={item}><input name="condition" type="radio" /> {item}</label>
              ))}
            </div>

            <div className="filter-checkbox-card">
              <h4>Listed By</h4>
              {["Owner", "Agent", "Agency"].map((item) => (
                <label key={item}><input type="checkbox" /> {item}</label>
              ))}
            </div>
          </div>

          <div className="amenities-card">
            <h4>Amenities</h4>
            <div>
              {amenities.map((item) => (
                <label key={item}><input type="checkbox" /> {item}</label>
              ))}
            </div>
          </div>

          <div className="advanced-filter__bottom">
            <div className="toggles-grid">
              {["Verified Listing", "Featured Listing", "Negotiable Price", "Virtual Tour Available", "Video Available"].map((item) => (
                <Toggle key={item} label={item} />
              ))}
            </div>

            <label className="keyword-field">
              <span>Keyword Search</span>
              <input placeholder="Search by title or description" />
            </label>

            <div className="radius-card">
              <label>
                <span>Radius Search</span>
                <input placeholder="Enter location" />
              </label>
              <div>
                {["5km", "10km", "20km", "50km"].map((item) => <button type="button" key={item}>{item}</button>)}
              </div>
            </div>

            <div className="map-search-card">
              <div className="map-search-card__map"><Map size={28} /><span>OpenStreetMap preview</span></div>
              <button type="button">Search this Area</button>
            </div>
          </div>
        </section>
      )}
    </form>
  );
}

export default PropertySearchFilter;
