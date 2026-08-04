import { useMemo, useState } from "react";
import { CalendarDays, MessageCircle, Search, Tag, UserRound } from "lucide-react";
import "./BlogPage.css";

const posts = [
  { id: "buying-home-colombo", title: "Complete Guide to Buying a Home in Colombo", category: "Buying Guide", author: "Gewal.lk Editorial", date: "2026-07-28", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85", excerpt: "Understand neighborhoods, legal checks, pricing, financing and negotiation before buying in Colombo.", content: "Buying a home in Colombo requires careful planning, valuation, document verification and a clear understanding of neighborhood demand. Always compare recent prices, check access roads, confirm ownership documents and inspect the property with a trusted agent." },
  { id: "renting-apartment-sri-lanka", title: "How to Rent an Apartment Safely in Sri Lanka", category: "Renting", author: "Property Team", date: "2026-07-22", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85", excerpt: "A practical checklist for deposits, agreements, inspections and rental scams.", content: "Before renting, verify the landlord, inspect utilities, document property condition and read the agreement carefully. Avoid paying large deposits before viewing and always request receipts." },
  { id: "property-investment-2026", title: "Sri Lanka Property Investment Trends for 2026", category: "Investment", author: "Market Insights", date: "2026-07-15", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85", excerpt: "Explore high-growth locations, rental demand and commercial opportunities.", content: "Investment demand is growing around Colombo suburbs, coastal tourism zones and mixed-use commercial areas. Investors should consider rental yield, infrastructure and future development plans." },
  { id: "sell-property-fast", title: "How to Sell Your Property Faster", category: "Selling", author: "Agent Desk", date: "2026-07-10", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=85", excerpt: "Improve listing quality, pricing and buyer trust with simple steps.", content: "High-quality photos, accurate pricing, complete descriptions and verified documents can dramatically improve buyer confidence. Highlight amenities, nearby places and unique value." },
];

const categories = ["All", "Buying Guide", "Renting", "Investment", "Selling"];

function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activePost, setActivePost] = useState(posts[0]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(["Very useful guide. Thank you!", "Please publish more market updates."]);

  const filteredPosts = useMemo(() => posts.filter((post) => {
    const matchesCategory = category === "All" || post.category === category;
    const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase()) || post.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);

  const submitComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setComments((current) => [comment.trim(), ...current]);
    setComment("");
  };

  return (
    <main className="blog-page">
      <section className="container blog-hero">
        <span>Real estate insights</span>
        <h1>Guides, market trends and property advice</h1>
        <p>SEO-friendly articles for buyers, renters, sellers, investors, agents and property owners.</p>
      </section>

      <section className="container blog-shell">
        <aside className="blog-sidebar">
          <label className="blog-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles" /></label>
          <div className="blog-category-card"><h3>Categories</h3>{categories.map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="blog-category-card"><h3>Popular Searches</h3>{["Colombo homes", "Rent agreement", "Land investment", "Mortgage"].map((item) => <button key={item} onClick={() => setQuery(item)}>{item}</button>)}</div>
        </aside>

        <div className="blog-content">
          <div className="blog-grid">
            {filteredPosts.map((post) => <article key={post.id} className={activePost.id === post.id ? "is-active" : ""} onClick={() => setActivePost(post)}><img src={post.image} alt={post.title} /><div><span><Tag size={14} /> {post.category}</span><h2>{post.title}</h2><p>{post.excerpt}</p><small><CalendarDays size={14} /> {post.date}</small></div></article>)}
          </div>

          <article className="blog-detail">
            <img src={activePost.image} alt={activePost.title} />
            <div className="blog-detail__meta"><span><Tag size={15} /> {activePost.category}</span><span><UserRound size={15} /> {activePost.author}</span><span><CalendarDays size={15} /> {activePost.date}</span></div>
            <h2>{activePost.title}</h2>
            <p>{activePost.content}</p>
            <div className="blog-seo-box"><strong>SEO Preview</strong><span>{activePost.title} | Gewal.lk</span><p>{activePost.excerpt}</p></div>

            <section className="blog-comments">
              <h3><MessageCircle size={18} /> Comments</h3>
              <form onSubmit={submitComment}><input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment" /><button>Post</button></form>
              {comments.map((item, index) => <div key={`${item}-${index}`}><UserRound size={18} /><p>{item}</p></div>)}
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}

export default BlogPage;
