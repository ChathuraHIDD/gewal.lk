import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Home, RotateCcw, Search, UserRound, XCircle } from "lucide-react";
import { demoProperties } from "../../../data/demoProperties.js";
import "./AppointmentsPage.css";

const initialAppointments = [
  { id: 1, property: demoProperties[0], agent: "Danial Doe", date: "2026-08-05", time: "10:30", status: "Pending", message: "I would like to inspect this property." },
  { id: 2, property: demoProperties[1], agent: "Nimali Perera", date: "2026-08-08", time: "14:00", status: "Accepted", message: "Please confirm parking availability." },
  { id: 3, property: demoProperties[2], agent: "Michael Silva", date: "2026-08-11", time: "09:00", status: "Completed", message: "Viewing completed." },
];

const statuses = ["All", "Pending", "Accepted", "Rejected", "Completed", "Cancelled"];

function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [reschedule, setReschedule] = useState(null);

  const filteredAppointments = useMemo(() => appointments.filter((item) => {
    const matchesStatus = status === "All" || item.status === status;
    const matchesQuery = item.property.title.toLowerCase().includes(query.toLowerCase()) || item.agent.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  }), [appointments, query, status]);

  const updateStatus = (id, nextStatus) => {
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
  };

  const saveReschedule = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setAppointments((current) => current.map((item) => item.id === reschedule.id ? { ...item, date: form.get("date"), time: form.get("time"), status: "Pending" } : item));
    setReschedule(null);
  };

  return (
    <main className="appointments-page">
      <section className="container appointments-hero">
        <span>Appointments</span>
        <h1>Manage property tours and callbacks</h1>
        <p>Track requests, confirm visits, reschedule meetings and keep communication organized.</p>
      </section>

      <section className="container appointments-shell">
        <aside className="appointments-sidebar">
          <div className="appointments-calendar">
            <CalendarDays size={28} />
            <h3>August 2026</h3>
            <div>{Array.from({ length: 30 }).map((_, index) => <button key={index} className={[5, 8, 11].includes(index + 1) ? "has-event" : ""}>{index + 1}</button>)}</div>
          </div>
          <div className="appointments-summary">
            {statuses.slice(1).map((item) => <button key={item} onClick={() => setStatus(item)}><span>{appointments.filter((a) => a.status === item).length}</span>{item}</button>)}
          </div>
        </aside>

        <div className="appointments-content">
          <div className="appointments-toolbar">
            <label><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search appointments" /></label>
            <div>{statuses.map((item) => <button key={item} className={status === item ? "is-active" : ""} onClick={() => setStatus(item)}>{item}</button>)}</div>
          </div>

          <div className="appointments-list">
            {filteredAppointments.map((item) => (
              <article key={item.id}>
                <img src={item.property.image} alt={item.property.title} />
                <div className="appointment-info">
                  <span className={`appointment-status appointment-status--${item.status.toLowerCase()}`}>{item.status}</span>
                  <h3>{item.property.title}</h3>
                  <p><Home size={15} /> {item.property.location}</p>
                  <p><UserRound size={15} /> {item.agent}</p>
                  <p><CalendarDays size={15} /> {item.date} <Clock3 size={15} /> {item.time}</p>
                  <blockquote>{item.message}</blockquote>
                </div>
                <div className="appointment-actions">
                  {item.status === "Pending" && <button onClick={() => updateStatus(item.id, "Accepted")}><CheckCircle2 size={16} /> Accept</button>}
                  {item.status === "Pending" && <button onClick={() => updateStatus(item.id, "Rejected")}><XCircle size={16} /> Reject</button>}
                  {item.status !== "Completed" && <button onClick={() => setReschedule(item)}><RotateCcw size={16} /> Reschedule</button>}
                  {item.status !== "Cancelled" && <button onClick={() => updateStatus(item.id, "Cancelled")}>Cancel</button>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {reschedule && (
        <div className="appointment-modal" role="dialog" aria-modal="true">
          <form onSubmit={saveReschedule}>
            <h3>Reschedule Appointment</h3>
            <p>{reschedule.property.title}</p>
            <label>Date<input type="date" name="date" defaultValue={reschedule.date} required /></label>
            <label>Time<input type="time" name="time" defaultValue={reschedule.time} required /></label>
            <div><button type="button" onClick={() => setReschedule(null)}>Cancel</button><button type="submit">Save</button></div>
          </form>
        </div>
      )}
    </main>
  );
}

export default AppointmentsPage;
