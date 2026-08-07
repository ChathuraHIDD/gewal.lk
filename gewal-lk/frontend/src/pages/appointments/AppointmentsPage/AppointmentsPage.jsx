import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  Loader2,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  acceptAppointment,
  cancelAppointment,
  getMyAppointments,
  getReceivedAppointments,
  rejectAppointment,
} from "../../../services/appointmentService.js";
import { resolveMediaUrl } from "../../../services/propertyService.js";
import { slotLabel } from "../../../utils/appointmentSlots.js";
import { formatPropertyLocation, placeholderPropertyImage } from "../../../utils/propertyFormat.js";
import "./AppointmentsPage.css";

const statuses = ["All", "Pending", "Accepted", "Rejected", "Completed", "Cancelled"];

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" });

function AppointmentsPage() {
  const [role, setRole] = useState("mine");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError("");

    const fetcher = role === "mine" ? getMyAppointments : getReceivedAppointments;

    fetcher()
      .then((result) => setAppointments(result.data.appointments))
      .catch((requestError) => setError(requestError.message || "Failed to load appointments."))
      .finally(() => setIsLoading(false));
  }, [role]);

  useEffect(() => {
    load();
  }, [load]);

  const statusCounts = useMemo(() => {
    const counts = {};
    for (const item of statuses.slice(1)) {
      counts[item] = appointments.filter((appointment) => appointment.status === item).length;
    }
    return counts;
  }, [appointments]);

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((item) => {
        const matchesStatus = status === "All" || item.status === status;
        const propertyTitle = item.property?.title || "";
        const counterpart =
          role === "mine"
            ? item.property?.contactName || ""
            : `${item.buyer?.firstName || ""} ${item.buyer?.lastName || ""}`;
        const matchesQuery =
          propertyTitle.toLowerCase().includes(query.toLowerCase()) ||
          counterpart.toLowerCase().includes(query.toLowerCase());
        return matchesStatus && matchesQuery;
      }),
    [appointments, query, status, role]
  );

  const runAction = async (id, action) => {
    setError("");
    setActioningId(id);

    try {
      await action(id);
      load();
    } catch (requestError) {
      setError(requestError.message || "Failed to update the appointment.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <main className="appointments-page">
      <section className="container appointments-hero">
        <span>Appointments</span>
        <h1>Manage property viewing requests</h1>
        <p>Track your own booking requests, or review and respond to requests on properties you've listed.</p>
      </section>

      <section className="container appointments-shell">
        <aside className="appointments-sidebar">
          <div className="appointments-summary">
            {statuses.slice(1).map((item) => (
              <button key={item} className={status === item ? "is-active" : ""} onClick={() => setStatus(item)}>
                <span>{statusCounts[item] || 0}</span>
                {item}
              </button>
            ))}
          </div>
        </aside>

        <div className="appointments-content">
          <div className="appointments-role-tabs">
            <button className={role === "mine" ? "is-active" : ""} onClick={() => { setRole("mine"); setStatus("All"); }}>
              Requests I've Made
            </button>
            <button className={role === "received" ? "is-active" : ""} onClick={() => { setRole("received"); setStatus("All"); }}>
              Requests for My Properties
            </button>
          </div>

          <div className="appointments-toolbar">
            <label><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by property or contact" /></label>
            <div>{statuses.map((item) => <button key={item} className={status === item ? "is-active" : ""} onClick={() => setStatus(item)}>{item}</button>)}</div>
          </div>

          {error && <p className="appointments-state appointments-state--error"><AlertCircle size={17} /> {error}</p>}

          {isLoading ? (
            <p className="appointments-state"><Loader2 size={18} className="spin" /> Loading appointments...</p>
          ) : (
            <div className="appointments-list">
              {filteredAppointments.map((item) => (
                <article key={item._id}>
                  <img
                    src={resolveMediaUrl(item.property?.coverImage) || placeholderPropertyImage}
                    alt={item.property?.title || "Property"}
                  />
                  <div className="appointment-info">
                    <span className={`appointment-status appointment-status--${item.status.toLowerCase()}`}>{item.status}</span>
                    <h3>{item.property?.title || "This property is no longer available"}</h3>
                    {item.property && <p><Home size={15} /> {formatPropertyLocation(item.property)}</p>}
                    {role === "received" && item.buyer && (
                      <p><UserRound size={15} /> {item.buyer.firstName} {item.buyer.lastName} · {item.buyer.phone || item.buyer.email}</p>
                    )}
                    {role === "mine" && item.property?.contactName && (
                      <p><UserRound size={15} /> {item.property.contactName}</p>
                    )}
                    <p><CalendarDays size={15} /> {formatDate(item.appointmentDate)} <Clock3 size={15} /> {slotLabel(item.appointmentTime)}</p>
                    {item.message && <blockquote>{item.message}</blockquote>}
                  </div>
                  <div className="appointment-actions">
                    {role === "received" && item.status === "Pending" && (
                      <>
                        <button onClick={() => runAction(item._id, acceptAppointment)} disabled={actioningId === item._id}>
                          <CheckCircle2 size={16} /> Accept
                        </button>
                        <button onClick={() => runAction(item._id, rejectAppointment)} disabled={actioningId === item._id}>
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                    {role === "mine" && ["Pending", "Accepted"].includes(item.status) && (
                      <button className="appointment-actions__cancel" onClick={() => runAction(item._id, cancelAppointment)} disabled={actioningId === item._id}>
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              ))}

              {filteredAppointments.length === 0 && (
                <p className="appointments-state">
                  {role === "mine"
                    ? "You haven't requested any appointments yet."
                    : "No appointment requests have been made for your properties yet."}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AppointmentsPage;
