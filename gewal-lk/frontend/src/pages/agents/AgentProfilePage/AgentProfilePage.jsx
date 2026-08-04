import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Globe,
  Languages,
  Mail,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";

import PropertyCard from "../../../components/property/PropertyCard/PropertyCard.jsx";
import { demoProperties } from "../../../data/demoProperties.js";
import "./AgentProfilePage.css";

const reviews = [
  { name: "Sarah Fernando", rating: 5, text: "Professional, responsive and very knowledgeable about Colombo properties." },
  { name: "Michael Perera", rating: 5, text: "Helped us shortlist and negotiate the right apartment quickly." },
  { name: "Anjali Silva", rating: 4, text: "Excellent communication and smooth appointment process." },
];

function AgentProfilePage() {
  const [tab, setTab] = useState("properties");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [appointment, setAppointment] = useState({ date: "", time: "" });

  const averageRating = useMemo(() => (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1), []);

  const submitContact = (event) => {
    event.preventDefault();
    setSent(true);
    setMessage("");
  };

  return (
    <main className="agent-profile-page">
      <section className="agent-cover">
        <div className="container agent-cover__inner">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=85" alt="Agent Danial Doe" />
          <div>
            <nav className="agent-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Agents</span>
            </nav>
            <span className="agent-verified"><CheckCircle2 size={16} /> Verified Pro Agent</span>
            <h1>Danial Doe</h1>
            <p>Senior Real Estate Consultant at Exquisite Properties, LLC</p>
            <div className="agent-cover__meta">
              <strong><Star size={17} fill="currentColor" /> {averageRating}</strong>
              <strong><Award size={17} /> 8 years experience</strong>
              <strong><Languages size={17} /> English, Sinhala, Tamil</strong>
            </div>
          </div>
          <div className="agent-cover__actions">
            <a href="tel:+94123123123"><Phone size={17} /> Call</a>
            <a href="mailto:danial@gewal.lk"><Mail size={17} /> Email</a>
            <button onClick={() => setTab("contact")}><MessageCircle size={17} /> Message</button>
          </div>
        </div>
      </section>

      <section className="container agent-profile-shell">
        <aside className="agent-sidebar">
          <div className="agent-card-box">
            <h3>Agent Information</h3>
            <p>License: #580573</p>
            <p>Specialization: Luxury homes, apartments, investment properties</p>
            <p>Agency: Exquisite Properties, LLC</p>
          </div>
          <div className="agent-card-box">
            <h3>Social Links</h3>
            <a href="https://example.com" target="_blank" rel="noreferrer"><Globe size={17} /> Website</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><Globe size={17} /> LinkedIn</a>
          </div>
          <form className="agent-card-box" onSubmit={(event) => { event.preventDefault(); window.alert("Appointment requested"); }}>
            <h3>Book Appointment</h3>
            <input type="date" value={appointment.date} onChange={(e) => setAppointment((v) => ({ ...v, date: e.target.value }))} required />
            <input type="time" value={appointment.time} onChange={(e) => setAppointment((v) => ({ ...v, time: e.target.value }))} required />
            <button><CalendarDays size={17} /> Request Appointment</button>
          </form>
        </aside>

        <div className="agent-main">
          <div className="agent-tabs">
            {[
              ["properties", "Properties"],
              ["reviews", "Reviews"],
              ["about", "About"],
              ["contact", "Contact"],
            ].map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={tab === key ? "is-active" : ""}>{label}</button>)}
          </div>

          {tab === "properties" && <section className="agent-panel"><h2>Active Properties</h2><div className="agent-property-grid">{demoProperties.slice(0, 4).map((property) => <PropertyCard key={property.id} property={property} />)}</div></section>}

          {tab === "reviews" && <section className="agent-panel"><h2>Client Reviews</h2><div className="agent-review-list">{reviews.map((review) => <article key={review.name}><div>{Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}</div><h3>{review.name}</h3><p>{review.text}</p></article>)}</div></section>}

          {tab === "about" && <section className="agent-panel"><h2>About Danial</h2><p>Danial specializes in premium residential and investment properties across Colombo, Galle and Kandy. He supports buyers, sellers and investors with valuation, negotiation, viewings and transaction guidance.</p><div className="agent-stats"><span><strong>124</strong>Total Properties</span><span><strong>86</strong>Sold</span><span><strong>38</strong>Rentals</span><span><strong>42</strong>Reviews</span></div></section>}

          {tab === "contact" && <section className="agent-panel"><h2>Contact Agent</h2><form className="agent-contact-form" onSubmit={submitContact}><input placeholder="Your name" required /><input type="email" placeholder="Email address" required /><input placeholder="Phone number" /><textarea rows="5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message" required /><button>Send Message</button>{sent && <p><CheckCircle2 size={17} /> Message sent successfully.</p>}</form></section>}
        </div>
      </section>
    </main>
  );
}

export default AgentProfilePage;
