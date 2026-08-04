import { useMemo, useState } from "react";
import { Bell, CalendarDays, CheckCheck, Home, MessageCircle, Search, Trash2, WalletCards } from "lucide-react";
import "./NotificationsPage.css";

const seedNotifications = [
  { id: 1, type: "Property", title: "Property approved", message: "Your listing Architect Designed Luxury Villa is now published.", read: false, priority: "High", time: "5 min ago", icon: Home },
  { id: 2, type: "Appointment", title: "Appointment accepted", message: "Danial Doe accepted your viewing request for 10:30 AM.", read: false, priority: "Medium", time: "18 min ago", icon: CalendarDays },
  { id: 3, type: "Message", title: "New message", message: "You have a new message from Nimali Perera.", read: false, priority: "High", time: "1 hour ago", icon: MessageCircle },
  { id: 4, type: "Alert", title: "Price drop alert", message: "A saved property dropped price by Rs. 2,000,000.", read: true, priority: "Low", time: "Yesterday", icon: Bell },
  { id: 5, type: "Billing", title: "Subscription reminder", message: "Your premium plan expires in 7 days.", read: true, priority: "Medium", time: "2 days ago", icon: WalletCards },
];

const filters = ["All", "Unread", "Property", "Appointment", "Message", "Alert", "Billing"];

function NotificationsPage() {
  const [notifications, setNotifications] = useState(seedNotifications);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(seedNotifications[0].id);

  const filtered = useMemo(() => notifications.filter((item) => {
    const matchesFilter = filter === "All" || (filter === "Unread" ? !item.read : item.type === filter);
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.message.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }), [filter, notifications, query]);

  const active = notifications.find((item) => item.id === activeId) || filtered[0];
  const unreadCount = notifications.filter((item) => !item.read).length;

  const markRead = (id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  const deleteNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
    if (activeId === id) setActiveId(filtered[0]?.id);
  };

  return (
    <main className="notifications-page">
      <section className="container notifications-hero">
        <span>Notification Center</span>
        <h1>Stay updated on property activity</h1>
        <p>Track approvals, appointment updates, messages, price drops, saved search alerts and subscription reminders.</p>
      </section>

      <section className="container notifications-shell">
        <aside className="notifications-sidebar">
          <div className="notifications-summary"><Bell size={28} /><strong>{unreadCount}</strong><span>Unread notifications</span><button onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))}><CheckCheck size={16} /> Mark all read</button></div>
          <label className="notifications-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notifications" /></label>
          <div className="notifications-filters">{filters.map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
        </aside>

        <div className="notifications-list">
          {filtered.map((item) => {
            const Icon = item.icon;
            return <article key={item.id} className={`${activeId === item.id ? "is-active" : ""} ${!item.read ? "is-unread" : ""}`} onClick={() => setActiveId(item.id)}><Icon size={21} /><div><span>{item.type} · {item.time}</span><h3>{item.title}</h3><p>{item.message}</p></div><em>{item.priority}</em></article>;
          })}
          {filtered.length === 0 && <div className="notifications-empty">No notifications found.</div>}
        </div>

        <aside className="notification-detail">
          {active && <><div><span className={`priority priority--${active.priority.toLowerCase()}`}>{active.priority}</span><h2>{active.title}</h2><p>{active.message}</p><small>{active.time}</small></div><button onClick={() => markRead(active.id)}><CheckCheck size={16} /> Mark as read</button><button onClick={() => deleteNotification(active.id)}><Trash2 size={16} /> Delete</button></>}
        </aside>
      </section>
    </main>
  );
}

export default NotificationsPage;
