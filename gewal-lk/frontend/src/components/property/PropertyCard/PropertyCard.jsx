import { useState } from "react";
import {
  Bath,
  BedDouble,
  Car,
  ChevronLeft,
  ChevronRight,
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

function PropertyCard({ property, view = "grid", onCompare }) {
  const images = property.images?.length ? property.images : [property.image];
  const [imageIndex, setImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(false);

  const changeImage = (event, direction) => {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((current) => (current + direction + images.length) % images.length);
  };

  const handleCompare = () => {
    const nextValue = !compared;
    setCompared(nextValue);
    onCompare?.(property, nextValue);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/properties/${property.id}`;

    if (navigator.share) {
      await navigator.share({ title: property.title, text: property.location, url: shareUrl });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    window.alert("Property link copied to clipboard");
  };

  return (
    <article className={`market-property-card market-property-card--${view}`}>
      <Link to={`/properties/${property.id}`} className="market-property-card__media" aria-label={`View ${property.title}`}>
        <img src={images[imageIndex]} alt={property.title} loading="lazy" />
        <div className="market-property-card__badges">
          {property.featured && <span><Star size={13} fill="currentColor" /> Featured</span>}
          {property.verified && <span><ShieldCheck size={13} /> Verified</span>}
        </div>
        <button
          type="button"
          aria-label={saved ? "Remove saved property" : "Save property"}
          className={saved ? "market-property-card__save is-active" : "market-property-card__save"}
          onClick={(event) => {
            event.preventDefault();
            setSaved((value) => !value);
          }}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
        {images.length > 1 && (
          <>
            <button className="market-property-card__arrow market-property-card__arrow--left" onClick={(event) => changeImage(event, -1)} aria-label="Previous image"><ChevronLeft size={18} /></button>
            <button className="market-property-card__arrow market-property-card__arrow--right" onClick={(event) => changeImage(event, 1)} aria-label="Next image"><ChevronRight size={18} /></button>
            <div className="market-property-card__dots">
              {images.map((image, index) => <span key={image} className={index === imageIndex ? "is-active" : ""} />)}
            </div>
          </>
        )}
      </Link>

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
          <button
            type="button"
            className={compared ? "is-active" : ""}
            aria-label={compared ? "Remove from compare" : "Compare property"}
            onClick={handleCompare}
          >
            <SlidersHorizontal size={17} />
          </button>
          <button type="button" aria-label="Share property" onClick={handleShare}><Share2 size={17} /></button>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
