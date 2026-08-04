import { useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Eye,
  Heart,
  Home,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  UserRound,
} from "lucide-react";

import PropertyCard from "../../../components/property/PropertyCard/PropertyCard.jsx";
import { demoProperties } from "../../../data/demoProperties.js";
import "./UserDashboardPage.css";

const tabs = [
  ["overview", LayoutDashboard, "Overview"],
  ["saved", Heart, "Saved"],
  ["recent", Eye, "Recently Viewed"],
  ["compare", SlidersHorizontal, "Compare"],
  ["appointments", CalendarDays, "Appointments"],
  ["messages", MessageCircle, "Messages"],
  ["notifications", Bell, "Notifications"],
  ["properties", Home, "My Properties"],
  ["billing", CreditCard, "Billing"],
  ["settings", Settings, "Settings"],
];

const appointments = [
  { id: 1, property: "Luxury Villa, Nawala", date: "2026-08-05", time: "10:30", status: "Pending" },
  { id: 2, property: "Skyline Apartment", date: "2026-08-08", time: "14:00", status: "Accepted" },
];

const notifications = [
  "Your appointment request was accepted",
  "Price dropped on a saved property",
  "New property matched your saved search",
  "Subscription expires in 7 days",
];

const conversations = [
  { name: "Danial Doe", message: "Can we schedule a viewing tomorrow?", unread: 2 },
  { name: "Nimali Perera", message: "I shared the floor plan with you.", unread: 0 },
  { name: "Gewal.lk Support", message: "Your listing is under review.", unread: 1 },
];

function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(demoProperties.slice(0, 3));
  const [query, setQuery] = useState("");
  const [readNotifications, setReadNotifications] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);

  const filteredSaved = useMemo(
    () => saved.filter((property) => property.title.toLowerCase().includes(query.toLowerCase()) || property.location.toLowerCase().includes(query.toLowerCase())),
    [query, saved]
  );

  return (
    <main className="user-dashboard-page">
      <section className="container dashboard-hero">
        <div>
          <span>Welcome back</span>
          <h1>Your property command center</h1>
          <p>Manage saved properties, appointments, messages, notifications, listings and billing from one premium dashboard.</p>
        </div>
        <a href="/post-property"><Plus size={18} /> Post Property</a>
      </section>

      <section className="container dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-profile-card">
            <span><UserRound size={26} /></span>
            <h3>Guest User</h3>
            <p>Buyer account</p>
          </div>
          <nav>
            {tabs.map(([key, Icon, label]) => (
              <button key={key} className={activeTab === key ? "is-active" : ""} onClick={() => setActiveTab(key)}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="dashboard-content">
          {activeTab === "overview" && <Overview setActiveTab={setActiveTab} />}

          {activeTab === "saved" && (
            <Panel title="Saved Properties" description="Your favourite listings in one place.">
              <div className="dashboard-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search saved properties" /></div>
              <div className="dashboard-property-grid">
                {filteredSaved.map((property) => (
                  <div key={property.id} className="dashboard-saved-item">
                    <PropertyCard property={property} />
                    <button onClick={() => setSaved((current) => current.filter((item) => item.id !== property.id))}><Trash2 size={16} /> Remove</button>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {activeTab === "recent" && (
            <Panel title="Recently Viewed" description="Continue browsing properties you recently opened.">
              <div className="dashboard-property-grid">{demoProperties.slice(2, 5).map((property) => <PropertyCard key={property.id} property={property} />)}</div>
            </Panel>
          )}

          {activeTab === "compare" && (
            <Panel title="Compare Properties" description="Compare key facts and pricing side by side.">
              <div className="compare-table">
                <table><thead><tr><th>Property</th><th>Price</th><th>Beds</th><th>Baths</th><th>Area</th></tr></thead><tbody>{demoProperties.slice(0, 3).map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.price}</td><td>{item.beds}</td><td>{item.baths}</td><td>{item.area}</td></tr>)}</tbody></table>
              </div>
            </Panel>
          )}

          {activeTab === "appointments" && (
            <Panel title="Appointments" description="Track tours, callbacks and meetings.">
              <div className="dashboard-list">{appointments.map((item) => <article key={item.id}><CalendarDays size={20} /><div><h3>{item.property}</h3><p>{item.date} at {item.time}</p></div><span>{item.status}</span></article>)}</div>
            </Panel>
          )}

          {activeTab === "messages" && (
            <Panel title="Messages" description="Chat with agents, sellers and support.">
              <div className="dashboard-chat"><div>{conversations.map((item) => <button key={item.name} className={selectedConversation.name === item.name ? "is-active" : ""} onClick={() => setSelectedConversation(item)}><strong>{item.name}</strong><span>{item.message}</span>{item.unread > 0 && <i>{item.unread}</i>}</button>)}</div><section><h3>{selectedConversation.name}</h3><p>{selectedConversation.message}</p><label><input placeholder="Type your message..." /><button>Send</button></label></section></div>
            </Panel>
          )}

          {activeTab === "notifications" && (
            <Panel title="Notifications" description="Important alerts and saved search updates.">
              <div className="dashboard-list">{notifications.map((item, index) => <article key={item} className={readNotifications.includes(index) ? "is-read" : ""}><Bell size={20} /><div><h3>{item}</h3><p>Just now</p></div><button onClick={() => setReadNotifications((current) => [...current, index])}>Mark read</button></article>)}</div>
            </Panel>
          )}

          {activeTab === "properties" && (
            <Panel title="My Properties" description="Manage your published and draft listings.">
              <div className="dashboard-list">{demoProperties.slice(0, 2).map((item) => <article key={item.id}><Home size={20} /><div><h3>{item.title}</h3><p>{item.location}</p></div><span>Published</span></article>)}</div>
            </Panel>
          )}

          {activeTab === "billing" && <BillingPanel />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </section>
    </main>
  );
}

function Overview({ setActiveTab }) {
  const stats = [["Saved", "12", Heart], ["Appointments", "2", CalendarDays], ["Messages", "3", MessageCircle], ["Views", "1.2k", Eye]];
  return (
    <Panel title="Dashboard Overview" description="Quick insights and shortcuts.">
      <div className="dashboard-stats">{stats.map(([label, value, Icon]) => <button key={label} onClick={() => setActiveTab(label.toLowerCase() === "views" ? "recent" : label.toLowerCase())}><Icon size={22} /><strong>{value}</strong><span>{label}</span></button>)}</div>
      <div className="dashboard-chart"><BarChart3 size={30} /><h3>Property activity</h3><div><i style={{ height: "45%" }} /><i style={{ height: "70%" }} /><i style={{ height: "55%" }} /><i style={{ height: "85%" }} /><i style={{ height: "65%" }} /></div></div>
    </Panel>
  );
}

function BillingPanel() {
  return <Panel title="Billing & Subscription" description="Manage plans and payments."><div className="billing-card"><CheckCircle2 size={24} /><h3>Free Plan</h3><p>Upgrade to boost listings and unlock premium analytics.</p><button>Upgrade Plan</button></div></Panel>;
}

function SettingsPanel() {
  return <Panel title="Profile Settings" description="Update personal information and preferences."><div className="settings-form"><label>First name<input defaultValue="Guest" /></label><label>Email<input defaultValue="guest@gewal.lk" /></label><label>Phone<input defaultValue="0771234567" /></label><button>Save Changes</button></div></Panel>;
}

function Panel({ title, description, children }) {
  return <section className="dashboard-panel"><div className="dashboard-panel__heading"><h2>{title}</h2><p>{description}</p></div>{children}</section>;
}

export default UserDashboardPage;
