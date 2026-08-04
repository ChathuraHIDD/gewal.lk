import { useState } from "react";
import { Award, Building2, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Target, UsersRound } from "lucide-react";
import "./AboutPage.css";

const milestones = [
  ["2024", "Gewal.lk concept was created to modernize Sri Lankan real estate."],
  ["2025", "Marketplace architecture expanded for owners, agents and agencies."],
  ["2026", "Premium platform experience launched with advanced search and dashboards."],
];

const values = [
  [ShieldCheck, "Trust", "Verified listings and safer property communication."],
  [Sparkles, "Innovation", "Modern tools for search, posting, analytics and discovery."],
  [HeartHandshake, "Service", "Human-first support for buyers, sellers and professionals."],
  [Target, "Clarity", "Transparent information for confident property decisions."],
];

function AboutPage() {
  const [activeMilestone, setActiveMilestone] = useState(0);

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container about-hero__inner">
          <div>
            <span>About Gewal.lk</span>
            <h1>Building Sri Lanka’s premium real estate marketplace</h1>
            <p>Gewal.lk connects buyers, renters, sellers, agents and agencies through a trusted, modern and beautifully designed property platform.</p>
            <div><a href="/properties">Explore Properties</a><a href="/post-property">Post Property</a></div>
          </div>
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85" alt="Modern property" />
        </div>
      </section>

      <section className="container about-stats">
        <article><Building2 size={26} /><strong>10k+</strong><span>Property listings</span></article>
        <article><UsersRound size={26} /><strong>2k+</strong><span>Agents & owners</span></article>
        <article><Award size={26} /><strong>98%</strong><span>Customer satisfaction</span></article>
        <article><CheckCircle2 size={26} /><strong>24/7</strong><span>Support experience</span></article>
      </section>

      <section className="container about-section about-mission">
        <div><span>Our Mission</span><h2>Make property discovery simple, safe and transparent</h2></div>
        <p>We are creating a high-quality marketplace where every listing is easier to search, compare, save, review and contact. Our goal is to reduce friction and help Sri Lankans make better real estate decisions.</p>
      </section>

      <section className="container about-values">
        {values.map(([Icon, title, text]) => <article key={title}><Icon size={28} /><h3>{title}</h3><p>{text}</p></article>)}
      </section>

      <section className="container about-timeline">
        <div><span>Journey</span><h2>Our roadmap</h2><p>Step by step, Gewal.lk is becoming a complete real estate operating system.</p></div>
        <div className="about-timeline__content">
          <div>{milestones.map(([year], index) => <button key={year} onClick={() => setActiveMilestone(index)} className={activeMilestone === index ? "is-active" : ""}>{year}</button>)}</div>
          <article><h3>{milestones[activeMilestone][0]}</h3><p>{milestones[activeMilestone][1]}</p></article>
        </div>
      </section>

      <section className="container about-cta">
        <h2>Ready to find your next property?</h2>
        <p>Search verified homes, lands, rentals and commercial opportunities across Sri Lanka.</p>
        <a href="/properties">Start Searching</a>
      </section>
    </main>
  );
}

export default AboutPage;
