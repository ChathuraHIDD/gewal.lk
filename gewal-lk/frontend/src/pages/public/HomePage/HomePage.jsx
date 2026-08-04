import { useState } from "react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CheckCircle2,
  Headphones,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import PropertySearchFilter from "../../../components/property/PropertySearchFilter.jsx";
import fullLogo from "../../../assets/logos/gewal-full-logo.png";
import "./HomePage.css";

const heroImage =
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90";

const listings = [
  {
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    badge: "For Sale",
    title: "Luxury Villa",
    location: "Nawala Road, Colombo",
    price: "Rs. 86,500,000",
    facts: "5 beds · 4 baths · 4,250 sqft",
  },
  {
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
    badge: "For Rent",
    title: "Skyline Apartment",
    location: "Rajagiriya",
    price: "Rs. 420,000 / mo",
    facts: "3 beds · 2 baths · 1,950 sqft",
  },
  {
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=85",
    badge: "Featured",
    title: "Modern Residence",
    location: "Battaramulla",
    price: "Rs. 124,000,000",
    facts: "4 beds · 3 baths · 3,600 sqft",
  },
];

const trust = [
  [ShieldCheck, "Verified Listings", "Every listing is reviewed for quality and trust."],
  [UsersRound, "Trusted Agents", "Connect with experienced local specialists."],
  [Search, "Easy Property Search", "Find homes faster with smart filters."],
  [Headphones, "24/7 Customer Support", "Helpful guidance whenever you need it."],
];

function HomePage() {
  const [liked, setLiked] = useState(null);

  return (
    <main className="minimal-home">
      <section className="minimal-hero">
        <div className="container minimal-hero__inner">
          <div className="minimal-hero__copy">
            <span>Sri Lanka · Property Marketplace</span>
            <h1>
              A quieter way to find where you <strong>belong.</strong>
            </h1>
            <p>
              Buy, rent, lease or list verified homes, apartments, lands and commercial spaces with trusted agents across Sri Lanka.
            </p>

            <PropertySearchFilter />

            <div className="minimal-stats">
              <div><strong>10,400</strong><span>Live listings</span></div>
              <div><strong>280</strong><span>Verified agents</span></div>
              <div><strong>24/7</strong><span>Support</span></div>
            </div>
          </div>

          <div className="minimal-hero__visual">
            <img src={heroImage} alt="Modern luxury home" />
            <div>
              <span>Palm House, Bentota</span>
              <small>4 beds · 5,200 sqft</small>
              <strong>Rs. 186M</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="minimal-trust">
        <div className="container minimal-trust__grid">
          {trust.map(([Icon, title, text]) => (
            <article key={title}>
              <Icon size={17} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="minimal-section minimal-listings">
        <div className="container">
          <div className="minimal-heading-row">
            <div>
              <span>Selected Listings</span>
              <h2>Handpicked homes</h2>
            </div>
            <a href="/properties">View all</a>
          </div>

          <div className="minimal-listing-grid">
            {listings.map((item, index) => (
              <article key={item.title} className="minimal-listing-card">
                <div>
                  <img src={item.image} alt={item.title} />
                  <span>{item.badge}</span>
                  <button onClick={() => setLiked(liked === index ? null : index)} aria-label="Save property">
                    <Heart size={18} fill={liked === index ? "currentColor" : "none"} />
                  </button>
                </div>
                <section>
                  <h3>{item.title}</h3>
                  <strong>{item.price}</strong>
                  <p>{item.location}</p>
                  <small>{item.facts}</small>
                </section>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="minimal-section minimal-why">
        <div className="container minimal-why__grid">
          <div>
            <span>Why Gewal.lk</span>
            <h2>Less noise. Better decisions.</h2>
          </div>
          <article><span>01</span><h3>Verified before visible</h3><p>Ownership, pricing and photographs are checked before a property goes live.</p></article>
          <article><span>02</span><h3>Local agents, not call centers</h3><p>You speak to someone who has walked the street and knows the neighbours.</p></article>
          <article><span>03</span><h3>One clear process</h3><p>Viewing, offer, paperwork and handover tracked in a single place.</p></article>
        </div>
      </section>

      <section className="minimal-quote">
        <div className="container">
          <blockquote>“We saw four homes and bought the fourth. No chasing, no guesswork — it felt considered from the first call.”</blockquote>
          <span>Sarah Fernando · Colombo 05</span>
        </div>
      </section>

      <section className="container minimal-cta">
        <div>
          <h2>Let's find your dream home today</h2>
          <p>Tell us what you’re looking for and we’ll shortlist it this week.</p>
        </div>
        <a href="/properties">Find your dream home</a>
      </section>

      <footer className="minimal-footer">
        <div className="container minimal-footer__grid">
          <div>
            <img src={fullLogo} alt="Gewal.lk" />
            <p>A premium real estate platform helping Sri Lankans buy, sell and rent with confidence.</p>
            <div className="minimal-socials"><CheckCircle2 size={16} /><UsersRound size={16} /><Heart size={16} /></div>
          </div>
          <div><h3>Quick Links</h3><a href="/">Home</a><a href="/buy">Buy</a><a href="/sell">Sell</a><a href="/contact">Contact</a></div>
          <div><h3>Property Links</h3><a href="/properties">Featured Properties</a><a href="/rent">Rentals</a><a href="/agents">Agents</a><a href="/post-property">List Property</a></div>
          <div><h3>Contact Information</h3><p><MapPin size={15} /> Colombo, Sri Lanka</p><p><Phone size={15} /> +94 77 123 4567</p><p><Mail size={15} /> hello@gewal.lk</p></div>
        </div>
        <div className="container minimal-footer__bottom">© 2026 Gewal.lk. All rights reserved.</div>
      </footer>
    </main>
  );
}

export default HomePage;
