import {
  Bath,
  BedDouble,
  Car,
  Heart,
  Home,
  MapPin,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./PropertyCard.css";

function PropertyCard({ property, view = "grid" }) {
  return (
    <article className={`market-property-card market-property-card--${view}`}>
      <div className="market-property-card__media">
        <img src={property.image} alt={property.title} loading="lazy" />
        <div className="market-property-card__badges">
          {property.featured && <span><Star size={13} fill="currentColor" /> Featured</span>}
          {property.verified && <span><ShieldCheck size={13} /> Verified</span>}
        </div>
        <button aria-label="Save property" className="market-property-card__save"><Heart size={19} /></button>
      </div>

      <div className="market-property-card__body">
        <div className="market-property-card__meta-top">
          <span>{property.listingType}</span>
          <span>{property.propertyType}</span>
        </div>
        <h3>{property.price}</h3>
        <h4>{property.title}</h4>
        <p><MapPin size={16} /> {property.location}</p>

        <div className="market-property-card__facts">
          <span><BedDouble size={16} /> {property.beds || "—"} Beds</span>
          <span><Bath size={16} /> {property.baths || "—"} Baths</span>
          <span><Home size={16} /> {property.area}</span>
          <span><Car size={16} /> {property.parking || "—"}</span>
        </div>

        <div className="market-property-card__actions">
          <Link to={`/properties/${property.id}`}>View Details</Link>
          <button type="button" aria-label="Compare property"><SlidersHorizontal size={17} /></button>
          <button type="button" aria-label="Share property"><Share2 size={17} /></button>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
