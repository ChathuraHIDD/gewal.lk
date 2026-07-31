import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Heart,
  MapPin,
  Maximize2,
  Phone,
  Share2,
  ShieldCheck,
  Trees,
  UsersRound,
  Waves,
} from "lucide-react";

import "./PropertiesPage.css";

const gallery = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=85",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=500&q=85",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=500&q=85",
];

const highlights = [
  [Building2, "Type", "Luxury Villa"],
  [ShieldCheck, "HOA", "No HOA Fee"],
  [CalendarDays, "Built Year", "2022"],
  [Eye, "Outside", "City View"],
  [Trees, "Garden", "Available"],
  [Car, "Parking", "Available"],
];

const localCards = [
  ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80", "School"],
  ["https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=400&q=80", "Crime"],
  ["https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=400&q=80", "Noise Level: Medium"],
  ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80", "Environment"],
];

function PropertiesPage() {
  return (
    <main className="property-detail-page">
      <section className="property-detail container">
        <a href="/" className="property-detail__back">
          <ChevronLeft size={16} /> Back to Search
        </a>

        <div className="property-detail__topbar">
          <div>
            <div className="property-detail__title-row">
              <h1>Minimal Looking Apartment, Colombo, Sri Lanka</h1>
              <span>Sale</span>
            </div>
            <p className="property-detail__address">
              <MapPin size={17} /> 1901 Heritage Cir, Colombo 07, Sri Lanka
            </p>
          </div>

          <div className="property-detail__actions">
            <button><Share2 size={18} /> Share</button>
            <button><Heart size={18} /> Save</button>
          </div>
        </div>

        <div className="property-detail__layout">
          <div className="property-detail__main">
            <div className="gallery-card">
              <div className="gallery-card__hero">
                <img src={gallery[0]} alt="Luxury modern house exterior" />
                <button className="gallery-card__arrow gallery-card__arrow--left" aria-label="Previous image"><ChevronLeft size={20} /></button>
                <button className="gallery-card__arrow gallery-card__arrow--right" aria-label="Next image"><ChevronRight size={20} /></button>
              </div>
              <div className="gallery-card__thumbs">
                {gallery.slice(1).map((image, index) => (
                  <div className="gallery-card__thumb" key={image}>
                    <img src={image} alt={`Property view ${index + 2}`} />
                    {index === 2 && <span>+24</span>}
                  </div>
                ))}
              </div>
            </div>

            <section className="property-summary">
              <span className="property-summary__status">For sale</span>
              <h2>Rs. 113,200,000</h2>
              <p>Down payment <strong>Rs. 20,216,000</strong></p>
              <div className="property-summary__facts">
                <span><BedDouble size={16} /> 4 Bed</span>
                <span><Bath size={16} /> 3 Bath</span>
                <span><Maximize2 size={16} /> 4,120 sqft</span>
              </div>
            </section>

            <section className="detail-section">
              <h3>Overview</h3>
              <p>
                This premium residence offers elegant interiors, spacious living areas and refined architectural detailing. The property includes private access, modern security and peaceful surroundings close to schools, restaurants and business districts. <button>Read More</button>
              </p>
            </section>

            <section className="detail-section">
              <h3>Highlights</h3>
              <div className="highlights-grid">
                {highlights.map(([Icon, label, value]) => (
                  <div key={label}>
                    <Icon size={22} />
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-section location-section">
              <h3>Location Information</h3>
              <div className="location-tabs">
                <button className="is-active">Map</button>
                <button>School</button>
                <button>Shop & Restaurant</button>
                <button>Commute location</button>
              </div>
              <div
                className="map-card"
                role="img"
                aria-label="Map preview showing property location in Colombo"
              >
                <div className="map-card__grid" />
                <span><MapPin size={22} /></span>
              </div>
            </section>

            <section className="detail-section local-section">
              <h3>Local Information</h3>
              <div className="local-grid">
                {localCards.map(([image, label]) => (
                  <article key={label}>
                    <img src={image} alt={label} />
                    <h4>{label}</h4>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="property-sidebar">
            <div className="sidebar-card tour-card">
              <h3>Request a tour</h3>
              <p>Get a tour of the house as per your time.</p>
              <div className="tour-card__inputs">
                <span><CalendarDays size={16} /> 24 Jul, 2026</span>
                <span><Clock3 size={16} /> 12:30 pm</span>
              </div>
              <button className="sidebar-card__primary">Schedule a Tour</button>
              <button className="sidebar-card__secondary">Request Info</button>
            </div>

            <div className="sidebar-card agent-card">
              <h3>Agent Information</h3>
              <p>Get an insight of the house from agent</p>
              <div className="agent-card__profile">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Agent Danial Doe" />
                <div>
                  <h4>Danial Doe</h4>
                  <p>Exquisite Properties, LLC</p>
                  <div><span>Top Rated</span><span>Pro Agent</span></div>
                </div>
              </div>
              <dl>
                <dt>License</dt>
                <dd>Number: #580573</dd>
                <dt>Contact</dt>
                <dd><Phone size={15} /> +94 123 123 123</dd>
              </dl>
              <button className="sidebar-card__contact"><Phone size={17} /> Contact Now</button>
            </div>

            <div className="sidebar-card mini-stats">
              <div><UsersRound size={20} /><strong>1,240</strong><span>views this week</span></div>
              <div><Waves size={20} /><strong>Prime</strong><span>location score</span></div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default PropertiesPage;
