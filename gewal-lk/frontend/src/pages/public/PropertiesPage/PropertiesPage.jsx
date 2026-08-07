import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
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
  Loader2,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sofa,
  UsersRound,
  Video,
  Waves,
} from "lucide-react";

import PropertyCard from "../../../components/property/PropertyCard/PropertyCard.jsx";
import { getProperties, getPropertyBySlug, resolveMediaUrl } from "../../../services/propertyService.js";
import {
  formatPropertyArea,
  formatPropertyLocation,
  formatPropertyPrice,
  placeholderPropertyImage,
  toPropertyCardShape,
} from "../../../utils/propertyFormat.js";
import "./PropertiesPage.css";

const localCards = [
  ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80", "Schools nearby"],
  ["https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=400&q=80", "Low crime area"],
  ["https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=400&q=80", "Noise: Medium"],
  ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80", "Green environment"],
];

function PropertiesPage() {
  const { slug } = useParams();

  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");
    setProperty(null);

    getPropertyBySlug(slug)
      .then((result) => {
        if (cancelled) return null;
        const item = result.data.property;
        setProperty(item);
        return getProperties({ propertyType: item.propertyType, limit: 6 });
      })
      .then((relatedResult) => {
        if (cancelled || !relatedResult) return;
        setRelated(
          relatedResult.data.properties.filter((item) => item.slug !== slug).slice(0, 2)
        );
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Property not found.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

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

  const gallery = useMemo(() => {
    if (!property) return [placeholderPropertyImage];
    if (property.images?.length) return property.images.map((image) => resolveMediaUrl(image.imageUrl));
    return [placeholderPropertyImage];
  }, [property]);

  const priceNumber = Number(property?.price) || 0;
  const monthlyPayment = useMemo(() => {
    const principal = priceNumber * (1 - downPayment / 100);
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    if (!priceNumber || monthlyRate === 0) return 0;
    return Math.round((principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1));
  }, [downPayment, priceNumber, rate, years]);

  const highlights = property ? [
    [Building2, "Type", property.propertyType],
    [ShieldCheck, "Verified", property.approvalStatus === "Approved" ? "Yes" : "Pending"],
    [CalendarDays, "Built Year", property.yearBuilt || "—"],
    [Eye, "Views", Number(property.viewsCount || 0).toLocaleString()],
    [Sofa, "Furnished", property.furnished || "Not Applicable"],
    [Car, "Parking", `${property.parking || 0} spaces`],
  ] : [];

  const handleShare = async () => {
    if (!property) return;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: property.title, text: formatPropertyLocation(property), url });
      return;
    }
    await navigator.clipboard.writeText(url);
    window.alert("Property link copied to clipboard");
  };

  const submitAppointment = (event) => {
    event.preventDefault();
    setAppointmentSent(true);
  };

  if (isLoading) {
    return (
      <main className="property-detail-page">
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <Loader2 size={22} className="spin" /> Loading property...
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="property-detail-page">
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <AlertCircle size={22} />
          <p>{error || "Property not found."}</p>
          <Link to="/properties">Back to property list</Link>
        </div>
      </main>
    );
  }

  const whatsappNumber = property.contactPhone?.replace(/[^\d]/g, "");

  return (
    <main className="property-detail-page">
      <section className="property-detail container">
        <nav className="property-detail__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/properties">Property List</Link>
          <span>/</span>
          <span>{property.title}</span>
        </nav>

        <div className="property-detail__topbar">
          <div>
            <div className="property-detail__title-row">
              <h1>{property.title}</h1>
              <span>{property.listingType}</span>
            </div>
            <p className="property-detail__address">
              <MapPin size={17} /> {formatPropertyLocation(property)}
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
                {gallery.length > 1 && (
                  <>
                    <button className="gallery-card__arrow gallery-card__arrow--left" type="button" onClick={() => setActiveImage((value) => (value - 1 + gallery.length) % gallery.length)} aria-label="Previous image"><ChevronLeft size={20} /></button>
                    <button className="gallery-card__arrow gallery-card__arrow--right" type="button" onClick={() => setActiveImage((value) => (value + 1) % gallery.length)} aria-label="Next image"><ChevronRight size={20} /></button>
                  </>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="gallery-card__thumbs">
                  {gallery.map((image, index) => (
                    <button className={activeImage === index ? "gallery-card__thumb is-active" : "gallery-card__thumb"} key={image} type="button" onClick={() => setActiveImage(index)}>
                      <img src={image} alt={`Property view ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section className="property-summary">
              <span className="property-summary__status">For {property.listingType.toLowerCase()}</span>
              <h2>{formatPropertyPrice(property)}</h2>
              <p>Estimated down payment <strong>Rs. {Math.round(priceNumber * 0.2).toLocaleString()}</strong></p>
              <div className="property-summary__facts">
                <span><BedDouble size={16} /> {property.bedrooms || "—"} Bed</span>
                <span><Bath size={16} /> {property.bathrooms || "—"} Bath</span>
                <span><Maximize2 size={16} /> {formatPropertyArea(property)}</span>
                <span><Car size={16} /> {property.parking || "—"} Parking</span>
              </div>
            </section>

            <section className="detail-section">
              <h3>Overview</h3>
              <p>{property.description}</p>
            </section>

            <section className="detail-section">
              <h3>Amenities</h3>
              {property.amenities?.length ? (
                <div className="amenity-grid">
                  {property.amenities.map((item) => <span key={item._id}><ShieldCheck size={16} /> {item.name}</span>)}
                </div>
              ) : (
                <p>No amenities listed for this property yet.</p>
              )}
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
              <div className="map-card" role="img" aria-label={`Map preview showing the property location in ${formatPropertyLocation(property)}`}>
                <div className="map-card__grid" />
                <span><MapPin size={22} /></span>
              </div>
            </section>

            <section className="detail-section local-section">
              <h3>Local Information</h3>
              <div className="local-grid">
                {localCards.map(([image, label]) => <article key={label}><img src={image} alt={label} /><h4>{label}</h4></article>)}
              </div>
            </section>

            {related.length > 0 && (
              <section className="detail-section">
                <h3>Related Properties</h3>
                <div className="related-properties-grid">
                  {related.map((item) => <PropertyCard key={item._id} property={toPropertyCardShape(item)} />)}
                </div>
              </section>
            )}
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
              {property.contactEmail && <a className="sidebar-card__secondary" href={`mailto:${property.contactEmail}`}><Mail size={16} /> Email Contact</a>}
              {appointmentSent && <p className="appointment-success">Appointment request sent successfully.</p>}
            </form>

            <div className="sidebar-card agent-card">
              <h3>Listing Contact</h3>
              <p>Reach out directly about this property</p>
              <div className="agent-card__profile">
                <div><h4>{property.contactName || "Not provided"}</h4></div>
              </div>
              <dl>
                {property.contactPhone && <><dt>Phone</dt><dd><Phone size={15} /> {property.contactPhone}</dd></>}
                {property.contactEmail && <><dt>Email</dt><dd><Mail size={15} /> {property.contactEmail}</dd></>}
              </dl>
              {property.contactPhone && <a className="sidebar-card__contact" href={`tel:${property.contactPhone}`}><Phone size={17} /> Contact Now</a>}
              {whatsappNumber && <a className="sidebar-card__whatsapp" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>}
            </div>

            <div className="sidebar-card mini-stats">
              <div><UsersRound size={20} /><strong>{Number(property.viewsCount || 0).toLocaleString()}</strong><span>total views</span></div>
              <div><Waves size={20} /><strong>{property.status}</strong><span>listing status</span></div>
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
