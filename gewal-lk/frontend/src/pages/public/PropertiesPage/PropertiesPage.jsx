import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  Flag,
  Heart,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Trees,
  UsersRound,
  Video,
  Waves,
} from "lucide-react";

import PropertyCard from "../../../components/property/PropertyCard/PropertyCard.jsx";
import { demoProperties } from "../../../data/demoProperties.js";
import "./PropertiesPage.css";

const fallbackGallery = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=85",
];

const amenities = ["Swimming Pool", "Garden", "Garage", "CCTV", "Security", "Air Conditioning", "Balcony", "Water Supply"];
const nearby = ["School · 850m", "Hospital · 1.2km", "Supermarket · 600m", "Bus Stop · 300m", "Bank · 1km", "Restaurant · 450m"];

const localCards = [
  ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80", "Schools nearby"],
  ["https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=400&q=80", "Low crime area"],
  ["https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=400&q=80", "Noise: Medium"],
  ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80", "Green environment"],
];

const parsePrice = (price) => Number(String(price).replace(/[^0-9]/g, "")) || 85000000;

function PropertiesPage() {
  const { slug } = useParams();
  const property = demoProperties.find((item) => item.id === slug) || demoProperties[0];
  const gallery = property.images?.length ? property.images : [property.image, ...fallbackGallery.filter((image) => image !== property.image)].slice(0, 4);

  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [tourDate, setTourDate] = useState("2026-07-24");
  const [tourTime, setTourTime] = useState("12:30");
  const [appointmentSent, setAppointmentSent] = useState(false);
  const [activeLocationTab, setActiveLocationTab] = useState("Map");
  const [downPayment, setDownPayment] = useState(20);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);

  const priceNumber = parsePrice(property.price);
  const monthlyPayment = useMemo(() => {
    const principal = priceNumber * (1 - downPayment / 100);
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    return Math.round((principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1));
  }, [downPayment, priceNumber, rate, years]);

  const highlights = [
    [Building2, "Type", property.propertyType],
    [ShieldCheck, "Verified", property.verified ? "Yes" : "Pending"],
    [CalendarDays, "Built Year", "2022"],
    [Eye, "Views", "1,240"],
    [Trees, "Garden", "Available"],
    [Car, "Parking", `${property.parking || 0} spaces`],
  ];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: property.title, text: property.location, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    window.alert("Property link copied to clipboard");
  };

  const submitAppointment = (event) => {
    event.preventDefault();
    setAppointmentSent(true);
  };

  return (
    <main className="property-detail-page">
      <section className="property-detail container">
        <Link to="/properties" className="property-detail__back">
          <ChevronLeft size={16} /> Back to Search
        </Link>

        <div className="property-detail__topbar">
          <div>
            <div className="property-detail__title-row">
              <h1>{property.title}</h1>
              <span>{property.listingType}</span>
            </div>
            <p className="property-detail__address">
              <MapPin size={17} /> {property.location}
            </p>
          </div>

          <div className="property-detail__actions">
            <button type="button" onClick={handleShare}><Share2 size={18} /> Share</button>
            <button type="button" className={compared ? "is-active" : ""} onClick={() => setCompared((value) => !value)}><SlidersHorizontal size={18} /> Compare</button>
            <button type="button" className={saved ? "is-active" : ""} onClick={() => setSaved((value) => !value)}><Heart size={18} fill={saved ? "currentColor" : "none"} /> Save</button>
          </div>
        </div>

        <div className="property-detail__layout">
          <div className="property-detail__main">
            <div className="gallery-card">
              <div className="gallery-card__hero">
                <img src={gallery[activeImage]} alt={property.title} />
                <button className="gallery-card__arrow gallery-card__arrow--left" type="button" onClick={() => setActiveImage((value) => (value - 1 + gallery.length) % gallery.length)} aria-label="Previous image"><ChevronLeft size={20} /></button>
                <button className="gallery-card__arrow gallery-card__arrow--right" type="button" onClick={() => setActiveImage((value) => (value + 1) % gallery.length)} aria-label="Next image"><ChevronRight size={20} /></button>
              </div>
              <div className="gallery-card__thumbs">
                {gallery.map((image, index) => (
                  <button className={activeImage === index ? "gallery-card__thumb is-active" : "gallery-card__thumb"} key={image} type="button" onClick={() => setActiveImage(index)}>
                    <img src={image} alt={`Property view ${index + 1}`} />
                    {index === gallery.length - 1 && <span>+24</span>}
                  </button>
                ))}
              </div>
            </div>

            <section className="property-summary">
              <span className="property-summary__status">For {property.listingType.toLowerCase()}</span>
              <h2>{property.price}</h2>
              <p>Estimated down payment <strong>Rs. {Math.round(priceNumber * 0.2).toLocaleString()}</strong></p>
              <div className="property-summary__facts">
                <span><BedDouble size={16} /> {property.beds || "—"} Bed</span>
                <span><Bath size={16} /> {property.baths || "—"} Bath</span>
                <span><Maximize2 size={16} /> {property.area}</span>
                <span><Car size={16} /> {property.parking || "—"} Parking</span>
              </div>
            </section>

            <section className="detail-section">
              <h3>Overview</h3>
              <p>
                This premium {property.propertyType.toLowerCase()} offers elegant interiors, spacious living areas and refined architectural detailing. The property includes private access, modern security and peaceful surroundings close to schools, restaurants and business districts.
              </p>
            </section>

            <section className="detail-section">
              <h3>Amenities</h3>
              <div className="amenity-grid">
                {amenities.map((item) => <span key={item}><ShieldCheck size={16} /> {item}</span>)}
              </div>
            </section>

            <section className="detail-section">
              <h3>Highlights</h3>
              <div className="highlights-grid">
                {highlights.map(([Icon, label, value]) => (
                  <div key={label}><Icon size={22} /><span>{label}</span><strong>{value}</strong></div>
                ))}
              </div>
            </section>

            <section className="detail-section mortgage-card">
              <h3>Mortgage Calculator</h3>
              <div className="mortgage-grid">
                <label>Down payment %<input type="range" min="5" max="60" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} /><strong>{downPayment}%</strong></label>
                <label>Loan years<input type="range" min="5" max="35" value={years} onChange={(e) => setYears(Number(e.target.value))} /><strong>{years} years</strong></label>
                <label>Interest rate<input type="range" min="5" max="25" value={rate} onChange={(e) => setRate(Number(e.target.value))} /><strong>{rate}%</strong></label>
                <div><span>Estimated monthly payment</span><strong>Rs. {monthlyPayment.toLocaleString()}</strong></div>
              </div>
            </section>

            <section className="detail-section location-section">
              <h3>Location Information</h3>
              <div className="location-tabs">
                {["Map", "School", "Shop & Restaurant", "Commute location"].map((tab) => (
                  <button key={tab} type="button" className={activeLocationTab === tab ? "is-active" : ""} onClick={() => setActiveLocationTab(tab)}>{tab}</button>
                ))}
              </div>
              <div className="map-card" role="img" aria-label="Map preview showing property location">
                <div className="map-card__grid" />
                <span><MapPin size={22} /></span>
              </div>
              <div className="nearby-grid">
                {nearby.map((item) => <span key={item}>{item}</span>)}
              </div>
            </section>

            <section className="detail-section local-section">
              <h3>Local Information</h3>
              <div className="local-grid">
                {localCards.map(([image, label]) => <article key={label}><img src={image} alt={label} /><h4>{label}</h4></article>)}
              </div>
            </section>

            <section className="detail-section">
              <h3>Related Properties</h3>
              <div className="related-properties-grid">
                {demoProperties.filter((item) => item.id !== property.id).slice(0, 2).map((item) => <PropertyCard key={item.id} property={item} />)}
              </div>
            </section>
          </div>

          <aside className="property-sidebar">
            <form className="sidebar-card tour-card" onSubmit={submitAppointment}>
              <h3>Book Appointment</h3>
              <p>Choose your preferred date and time.</p>
              <div className="tour-card__fields">
                <label><CalendarDays size={16} /><input type="date" value={tourDate} onChange={(e) => setTourDate(e.target.value)} /></label>
                <label><Clock3 size={16} /><input type="time" value={tourTime} onChange={(e) => setTourTime(e.target.value)} /></label>
              </div>
              <button className="sidebar-card__primary" type="submit">Schedule a Tour</button>
              <a className="sidebar-card__secondary" href="mailto:agent@gewal.lk"><Mail size={16} /> Email Agent</a>
              {appointmentSent && <p className="appointment-success">Appointment request sent successfully.</p>}
            </form>

            <div className="sidebar-card agent-card">
              <h3>Agent Information</h3>
              <p>Get an insight of the house from agent</p>
              <div className="agent-card__profile">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Agent Danial Doe" />
                <div><h4>Danial Doe</h4><p>Exquisite Properties, LLC</p><div><span>Top Rated</span><span>Pro Agent</span></div></div>
              </div>
              <dl><dt>License</dt><dd>Number: #580573</dd><dt>Contact</dt><dd><Phone size={15} /> +94 123 123 123</dd></dl>
              <a className="sidebar-card__contact" href="tel:+94123123123"><Phone size={17} /> Contact Now</a>
              <a className="sidebar-card__whatsapp" href="https://wa.me/94123123123" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>

            <div className="sidebar-card mini-stats">
              <div><UsersRound size={20} /><strong>1,240</strong><span>views this week</span></div>
              <div><Waves size={20} /><strong>Prime</strong><span>location score</span></div>
            </div>

            <button type="button" className="report-button" onClick={() => setReportOpen(true)}><Flag size={17} /> Report Listing</button>
            <button type="button" className="report-button"><Video size={17} /> Request Virtual Tour</button>
          </aside>
        </div>
      </section>

      {reportOpen && (
        <div className="report-modal" role="dialog" aria-modal="true">
          <form className="report-modal__card" onSubmit={(event) => { event.preventDefault(); setReportOpen(false); window.alert("Report submitted"); }}>
            <h3>Report this listing</h3>
            <select required><option value="">Select reason</option><option>Spam</option><option>Fake</option><option>Wrong Price</option><option>Sold Already</option><option>Other</option></select>
            <textarea placeholder="Describe the issue" rows="4" />
            <div><button type="button" onClick={() => setReportOpen(false)}>Cancel</button><button type="submit">Submit Report</button></div>
          </form>
        </div>
      )}
    </main>
  );
}

export default PropertiesPage;
