import "./StaticPage.css";

const pageCopy = {
  agents: ["Top Agents", "Connect with trusted property professionals across Sri Lanka."],
  commercial: ["Commercial Properties", "Discover offices, shops, warehouses and premium investment opportunities."],
  "new-projects": ["New Projects", "Explore upcoming developments, luxury apartments and gated communities."],
  blog: ["Real Estate Blog", "Market insights, buying guides, selling tips and neighborhood stories."],
  about: ["About Gewal.lk", "A premium real estate marketplace built for buyers, owners, agents and agencies."],
  contact: ["Contact Us", "Talk to our team for support, partnerships or property listing assistance."],
  dashboard: ["Dashboard", "Manage saved properties, appointments, messages, subscriptions and listings."],
  admin: ["Admin Panel", "Control users, approvals, reports, payments, advertisements, blog and analytics."],
  "post-property": ["Post Property", "Create a high-quality listing with images, videos, amenities and SEO details."],
};

function StaticPage({ page = "about" }) {
  const [title, description] = pageCopy[page] || pageCopy.about;

  return (
    <main className="static-page">
      <section className="container static-page__hero">
        <span>Gewal.lk</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      <section className="container static-page__grid">
        {["Premium UI", "Production architecture", "Responsive experience"].map((item) => (
          <article key={item}>
            <h3>{item}</h3>
            <p>This module is ready for API integration and full feature development.</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default StaticPage;
