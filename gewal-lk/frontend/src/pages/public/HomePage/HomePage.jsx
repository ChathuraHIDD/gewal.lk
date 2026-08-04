import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CheckCircle2,
  Headphones,
  Heart,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Buildings, SealCheck, UsersThree } from "@phosphor-icons/react";

import PropertySearchFilter from "../../../components/property/PropertySearchFilter.jsx";
import fullLogo from "../../../assets/logos/gewal-full-logo.png";
import "./HomePage.css";

const heroImage =
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90";

const listings = [
  {
    id: "luxury-villa-nawala",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    badge: "For Sale",
    title: "Luxury Villa",
    location: "Nawala Road, Colombo",
    price: "Rs. 86,500,000",
    facts: "5 beds · 4 baths · 4,250 sqft",
  },
  {
    id: "skyline-apartment-rajagiriya",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
    badge: "For Rent",
    title: "Skyline Apartment",
    location: "Rajagiriya",
    price: "Rs. 420,000 / mo",
    facts: "3 beds · 2 baths · 1,950 sqft",
  },
  {
    id: "modern-residence-battaramulla",
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

const stats = [
  { icon: Buildings, value: 10400, suffix: "+", label: "Live listings" },
  { icon: UsersThree, value: 280, suffix: "+", label: "Verified agents" },
  { icon: SealCheck, value: 24, suffix: "/7", label: "Support" },
];

function AnimatedNumber({ value, suffix = "" }) {
  const [count, setCount] = useState(1);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    const duration = 1400;
    const start = performance.now();
    const from = 1;

    const frame = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + (value - from) * eased));

      if (progress < 1) requestAnimationFrame(frame);
    };

    const animation = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animation);
  }, [started, value]);

  return <strong ref={ref}>{count.toLocaleString()}{suffix}</strong>;
}

function HomePage() {
  const [liked, setLiked] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    const particles = 140;
    const positions = new Float32Array(particles * 3);
    const sizes = new Float32Array(particles);

    for (let index = 0; index < particles; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 7;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 4.2;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 2;
      sizes[index] = Math.random() * 0.04 + 0.018;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0xa23cff,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array([
      -2.8, -0.8, 0,
      -1.7, 0.5, 0,
      -0.4, -0.2, 0,
      0.9, 0.7, 0,
      2.5, -0.5, 0,
    ]);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const line = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: 0xa23cff, transparent: true, opacity: 0.16 })
    );
    scene.add(line);

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || 600;
      const height = parent?.clientHeight || 300;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      points.rotation.y += 0.0014;
      points.rotation.x = Math.sin(performance.now() * 0.00035) * 0.08;
      line.rotation.z = Math.sin(performance.now() * 0.0005) * 0.035;
      renderer.render(scene, camera);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      line.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <main className="minimal-home">
      <div className="minimal-three-bg" aria-hidden="true"><canvas ref={canvasRef} /></div>
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

      <section className="minimal-stats-section">
        <div className="container minimal-stats">
          {stats.map(({ icon: Icon, value, suffix, label }) => (
            <div key={label}>
              <span><Icon size={22} weight="duotone" /></span>
              <AnimatedNumber value={value} suffix={suffix} />
              <small>{label}</small>
            </div>
          ))}
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
                <Link to={`/properties/${item.id}`} className="minimal-listing-card__link" aria-label={`View ${item.title} details`}>
                  <div className="minimal-listing-card__media">
                    <img src={item.image} alt={item.title} />
                    <span>{item.badge}</span>
                  </div>
                  <section>
                    <h3>{item.title}</h3>
                    <strong>{item.price}</strong>
                    <p>{item.location}</p>
                    <small>{item.facts}</small>
                  </section>
                </Link>
                <button
                  className="minimal-listing-card__favorite"
                  type="button"
                  onClick={() => setLiked(liked === index ? null : index)}
                  aria-label="Save property"
                >
                  <Heart size={18} fill={liked === index ? "currentColor" : "none"} />
                </button>
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
