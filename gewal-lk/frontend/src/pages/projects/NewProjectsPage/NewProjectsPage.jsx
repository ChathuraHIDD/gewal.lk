import { useMemo, useState } from "react";
import { Building2, CalendarDays, Heart, MapPin, Search, ShieldCheck } from "lucide-react";
import "./NewProjectsPage.css";

const projects = [
  { id: 1, name: "The Sapphire Residences", developer: "Prime Developments", city: "Colombo", status: "Launching Soon", price: "From Rs. 48M", units: "120 units", completion: "2027", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=85" },
  { id: 2, name: "Ocean Pearl Villas", developer: "Coastal Living", city: "Galle", status: "Under Construction", price: "From Rs. 95M", units: "36 villas", completion: "2026", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=85" },
  { id: 3, name: "Green Heights Kandy", developer: "Hill Country Homes", city: "Kandy", status: "Ready Soon", price: "From Rs. 32M", units: "88 units", completion: "2026", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85" },
];

function NewProjectsPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");
  const [saved, setSaved] = useState([]);

  const filtered = useMemo(() => projects.filter((project) => {
    const matchesCity = city === "All" || project.city === city;
    const matchesQuery = project.name.toLowerCase().includes(query.toLowerCase()) || project.developer.toLowerCase().includes(query.toLowerCase());
    return matchesCity && matchesQuery;
  }), [city, query]);

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div className="container">
          <span>New Developments</span>
          <h1>Discover upcoming apartments, villas and gated communities</h1>
          <p>Explore premium new projects from trusted developers across Sri Lanka.</p>
          <div className="projects-search"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search project or developer" /><select value={city} onChange={(e) => setCity(e.target.value)}><option>All</option><option>Colombo</option><option>Galle</option><option>Kandy</option></select></div>
        </div>
      </section>

      <section className="container projects-grid">
        {filtered.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-card__media"><img src={project.image} alt={project.name} /><span><ShieldCheck size={14} /> Verified Developer</span><button onClick={() => setSaved((current) => current.includes(project.id) ? current.filter((id) => id !== project.id) : [...current, project.id])}><Heart size={19} fill={saved.includes(project.id) ? "currentColor" : "none"} /></button></div>
            <div className="project-card__body"><strong>{project.status}</strong><h2>{project.name}</h2><p><Building2 size={16} /> {project.developer}</p><p><MapPin size={16} /> {project.city}</p><div><span>{project.price}</span><span>{project.units}</span><span><CalendarDays size={15} /> {project.completion}</span></div><button onClick={() => window.alert(`Brochure requested for ${project.name}`)}>Request Brochure</button></div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default NewProjectsPage;
