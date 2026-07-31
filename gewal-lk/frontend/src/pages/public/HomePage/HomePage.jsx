import { useState } from "react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Headphones,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { motion } from "motion/react";

import fullLogo from "../../../assets/logos/gewal-full-logo.png";
import "./HomePage.css";

const propertyImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85";

const heroImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90";

const ctaImage =
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85";

const trustItems = [
  [ShieldCheck, "Verified Listings", "Every listing is reviewed for quality and trust."],
  [UsersRound, "Trusted Agents", "Connect with experienced local specialists."],
  [Search, "Easy Property Search", "Find homes faster with smart filters."],
  [Headphones, "24/7 Customer Support", "Helpful guidance whenever you need it."],
];

const properties = [
  {
    image: propertyImage,
    badge: "For Sale",
    price: "Rs. 86,500,000",
    address: "Luxury Villa, Nawala Road, Colombo",
    beds: 5,
    baths: 4,
    area: "4,250 sqft",
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
    badge: "For Rent",
    price: "Rs. 420,000 /mo",
    address: "Skyline Apartment, Rajagiriya",
    beds: 3,
    baths: 2,
    area: "1,850 sqft",
  },
  {
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=85",
    badge: "Featured",
    price: "Rs. 124,000,000",
    address: "Modern Residence, Battaramulla",
    beds: 4,
    baths: 3,
    area: "3,600 sqft",
  },
];

const whyChoose = [
  [Building2, "Expert Real Estate Team", "Market-led advice from professionals who understand premium homes."],
  [Home, "Wide Property Selection", "Curated villas, apartments, lands and investment-ready listings."],
  [ShieldCheck, "Secure Transactions", "A careful process designed to protect buyers, sellers and agents."],
  [Sparkles, "Personalized Support", "Bespoke guidance for your lifestyle, budget and goals."],
];

const testimonials = [
  {
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    name: "Sarah Fernando",
    review: "Gewal.lk helped us find a beautiful family home with complete confidence. The experience felt premium from day one.",
  },
  {
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    name: "Michael Perera",
    review: "Professional agents, verified listings and a very smooth process. I recommend it to anyone buying in Colombo.",
  },
  {
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    name: "Anjali Silva",
    review: "The search tools made shortlisting properties simple. We booked viewings quickly and closed our rental in days.",
  },
];

function Field({ label, value }) {
  return (
    <label className="home-search__field">
      <span>{label}</span>
      <input defaultValue={value} aria-label={label} />
    </label>
  );
}

function HomePage() {
  const [activeTab, setActiveTab] = useState("Buy");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonial = testimonials[activeTestimonial];

  return (
    <main className="landing-page">
      <section className="premium-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="premium-hero__overlay" />
        <div className="container premium-hero__inner">
          <motion.div
            className="premium-hero__content"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="premium-hero__eyebrow"><Sparkles size={18} /> Premium Sri Lankan real estate</span>
            <h1>Find Your Dream Home With Gewal.lk</h1>
            <p>
              Discover verified luxury homes, elegant apartments and investment-ready properties with trusted agents across Sri Lanka.
            </p>
            <div className="premium-hero__actions">
              <a className="btn btn--primary" href="/properties">Explore Properties <ArrowRight size={18} /></a>
              <a className="btn btn--secondary" href="/contact">Book Consultation</a>
            </div>
          </motion.div>

          <motion.form
            className="home-search"
            initial={{ opacity: 0, y: 38 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
          >
            <div className="home-search__tabs">
              {["Buy", "Rent", "Sell"].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? "is-active" : ""}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="home-search__grid">
              <Field label="Location" value="Colombo, Sri Lanka" />
              <Field label="Property Type" value="Luxury House" />
              <Field label="Price Range" value="Any Price" />
              <Field label="Bedrooms" value="Any" />
              <Field label="Bathrooms" value="Any" />
              <button className="home-search__button" type="submit"><Search size={18} /> Search</button>
            </div>
          </motion.form>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container trust-grid">
          {trustItems.map(([Icon, title, text]) => (
            <motion.article className="feature-card" key={title} whileHover={{ y: -8 }}>
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section properties-section" id="properties">
        <div className="container">
          <div className="section-heading">
            <span>Featured Properties</span>
            <h2>Handpicked Homes For You</h2>
            <p>Explore carefully selected properties with premium finishes, ideal locations and verified information.</p>
          </div>
          <div className="property-grid">
            {properties.map((property) => (
              <article className="property-card" key={property.address}>
                <div className="property-card__media">
                  <img src={property.image} alt={property.address} />
                  <span>{property.badge}</span>
                  <button aria-label="Add to favourites"><Heart size={20} /></button>
                </div>
                <div className="property-card__body">
                  <h3>{property.price}</h3>
                  <p><MapPin size={16} /> {property.address}</p>
                  <div className="property-card__meta">
                    <span><BedDouble size={17} /> {property.beds} Beds</span>
                    <span><Bath size={17} /> {property.baths} Baths</span>
                    <span><Home size={17} /> {property.area}</span>
                  </div>
                  <a href="/properties">View Details <ArrowRight size={17} /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section why-section">
        <div className="container">
          <div className="section-heading">
            <span>Why Choose Us</span>
            <h2>Luxury Service, Local Expertise</h2>
          </div>
          <div className="why-grid">
            {whyChoose.map(([Icon, title, text]) => (
              <article className="why-card" key={title}>
                <Icon size={28} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container testimonials-card">
          <div className="section-heading">
            <span>Testimonials</span>
            <h2>Clients Who Found Home</h2>
          </div>
          <motion.div
            key={testimonial.name}
            className="testimonial"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img src={testimonial.photo} alt={testimonial.name} />
            <div className="testimonial__stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</div>
            <p>“{testimonial.review}”</p>
            <h3>{testimonial.name}</h3>
          </motion.div>
          <div className="testimonial-dots">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                aria-label={`Show testimonial ${index + 1}`}
                className={index === activeTestimonial ? "is-active" : ""}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container cta-section" style={{ backgroundImage: `linear-gradient(90deg, rgba(35, 15, 66, .88), rgba(109, 40, 217, .72)), url(${ctaImage})` }}>
        <div>
          <span>Ready to move?</span>
          <h2>Let’s Find Your Dream Home Today</h2>
        </div>
        <a className="btn btn--light" href="/properties">Find Your Dream Home <ArrowRight size={18} /></a>
      </section>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div>
            <img src={fullLogo} alt="Gewal.lk" className="site-footer__logo" />
            <p>Gewal.lk is a premium real estate platform helping Sri Lankans buy, sell and rent with confidence.</p>
            <div className="site-footer__socials">
              <span>f</span><span>ig</span><span>x</span><span>in</span>
            </div>
          </div>
          <div><h3>Quick Links</h3><a href="/">Home</a><a href="/buy">Buy</a><a href="/sell">Sell</a><a href="/contact">Contact</a></div>
          <div><h3>Property Links</h3><a href="/properties">Featured Properties</a><a href="/rent">Rentals</a><a href="/agents">Agents</a><a href="/register">List Property</a></div>
          <div><h3>Contact Information</h3><p><MapPin size={16} /> Colombo, Sri Lanka</p><p><Phone size={16} /> +94 77 123 4567</p><p><Mail size={16} /> hello@gewal.lk</p></div>
        </div>
        <div className="container site-footer__bottom">© 2026 Gewal.lk. All rights reserved.</div>
      </footer>
    </main>
  );
}

export default HomePage;
