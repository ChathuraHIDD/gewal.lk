import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  Flag,
  Home,
  Image,
  LayoutDashboard,
  Loader2,
  Megaphone,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth.js";
import {
  approveAdminProperty,
  createAdmin,
  deleteAdmin,
  getAdminProperties,
  getAdmins,
  rejectAdminProperty,
} from "../../../services/adminService.js";
import "./AdminPanelPage.css";

const tabs = [
  ["dashboard", LayoutDashboard, "Dashboard"],
  ["admins", ShieldCheck, "Manage Admins"],
  ["users", UsersRound, "Users"],
  ["agents", BadgeCheck, "Agents"],
  ["agencies", Building2, "Agencies"],
  ["properties", Home, "Properties"],
  ["approval", CheckCircle2, "Approvals"],
  ["featured", Star, "Featured"],
  ["appointments", Activity, "Appointments"],
  ["reviews", FileText, "Reviews"],
  ["reports", Flag, "Reports"],
  ["amenities", Settings, "Amenities"],
  ["ads", Megaphone, "Advertisements"],
  ["payments", CreditCard, "Payments"],
  ["blog", FileText, "Blog"],
  ["notifications", Bell, "Notifications"],
  ["analytics", BarChart3, "Analytics"],
  ["logs", ShieldAlert, "Audit Logs"],
];

const usersSeed = [
  { id: 1, name: "Sarah Fernando", email: "sarah@example.com", role: "buyer", status: "active" },
  { id: 2, name: "Danial Doe", email: "danial@example.com", role: "agent", status: "active" },
  { id: 3, name: "Nimali Perera", email: "nimali@example.com", role: "seller", status: "pending" },
];

const reportsSeed = [
  { id: 1, property: "Skyline Apartment", reason: "Wrong Price", status: "Pending" },
  { id: 2, property: "Residential Land", reason: "Duplicate", status: "Pending" },
];

function useAdminProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const loadProperties = () => {
    setIsLoading(true);
    getAdminProperties()
      .then((result) => setProperties(result.data.properties))
      .catch((requestError) => setError(requestError.message || "Failed to load properties."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const decide = async (propertyId, decisionFn) => {
    setError("");
    setActioningId(propertyId);

    try {
      await decisionFn(propertyId);
      loadProperties();
    } catch (requestError) {
      setError(requestError.message || "Failed to update the property.");
    } finally {
      setActioningId(null);
    }
  };

  return {
    properties,
    isLoading,
    error,
    actioningId,
    approve: (propertyId) => decide(propertyId, approveAdminProperty),
    reject: (propertyId) => decide(propertyId, rejectAdminProperty),
  };
}

function AdminPanelPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState(usersSeed);
  const [reports, setReports] = useState(reportsSeed);
  const [query, setQuery] = useState("");

  const {
    properties,
    isLoading: propertiesLoading,
    error: propertiesError,
    actioningId,
    approve: approveProperty,
    reject: rejectProperty,
  } = useAdminProperties();

  const filteredUsers = useMemo(
    () => users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase())),
    [query, users]
  );

  return (
    <main className="admin-page">
      <section className="container admin-hero">
        <div>
          <span>Admin Control Center</span>
          <h1>Manage Gewal.lk operations</h1>
          <p>Control users, agents, listings, approvals, reports, payments, content, advertisements and analytics.</p>
        </div>
      </section>

      <section className="container admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand-card">
            <ShieldAlert size={28} />
            <h3>{user ? `${user.firstName} ${user.lastName}` : "Admin"}</h3>
            <p>Full platform access</p>
          </div>
          <nav>
            {tabs.map(([key, Icon, label]) => (
              <button key={key} className={activeTab === key ? "is-active" : ""} onClick={() => setActiveTab(key)}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="admin-content">
          {activeTab === "dashboard" && <DashboardPanel />}

          {activeTab === "admins" && <AdminsPanel currentUserId={user?._id} />}

          {activeTab === "users" && (
            <Panel title="Users" description="Search, suspend, activate and manage platform users.">
              <SearchBox query={query} setQuery={setQuery} />
              <DataTable columns={["Name", "Email", "Role", "Status", "Actions"]}>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><Status status={user.status} /></td>
                    <td><button onClick={() => setUsers((current) => current.filter((item) => item.id !== user.id))}><Trash2 size={15} /> Delete</button></td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {activeTab === "properties" && (
            <PropertiesPanel
              properties={properties}
              isLoading={propertiesLoading}
              error={propertiesError}
            />
          )}

          {activeTab === "approval" && (
            <Panel title="Property Approval" description="Approve or reject submitted listings.">
              {propertiesError && <p className="admin-state admin-state--error"><AlertCircle size={17} /> {propertiesError}</p>}
              {propertiesLoading ? (
                <p className="admin-state"><Loader2 size={17} className="admin-spin" /> Loading properties...</p>
              ) : (
                <DataTable columns={["Property", "Type", "Price", "Status", "Actions"]}>
                  {properties.filter((item) => item.approvalStatus === "Pending").map((item) => (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>{item.propertyType}</td>
                      <td>Rs. {Number(item.price).toLocaleString()}</td>
                      <td><Status status={item.approvalStatus} /></td>
                      <td>
                        <button onClick={() => approveProperty(item._id)} disabled={actioningId === item._id}><CheckCircle2 size={15} /> Approve</button>
                        <button onClick={() => rejectProperty(item._id)} disabled={actioningId === item._id}><XCircle size={15} /> Reject</button>
                      </td>
                    </tr>
                  ))}
                  {properties.filter((item) => item.approvalStatus === "Pending").length === 0 && (
                    <tr><td colSpan={5}>No listings waiting for approval.</td></tr>
                  )}
                </DataTable>
              )}
            </Panel>
          )}

          {activeTab === "reports" && (
            <Panel title="Reports" description="Review user-submitted property reports.">
              <DataTable columns={["Property", "Reason", "Status", "Actions"]}>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.property}</td><td>{report.reason}</td><td><Status status={report.status} /></td>
                    <td><button onClick={() => setReports((current) => current.filter((item) => item.id !== report.id))}>Resolve</button></td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {!["dashboard", "admins", "users", "properties", "approval", "reports"].includes(activeTab) && (
            <GenericAdminPanel tab={activeTab} />
          )}
        </div>
      </section>
    </main>
  );
}

function DashboardPanel() {
  const stats = [["Users", "12.4k", UsersRound], ["Properties", "4.8k", Home], ["Revenue", "Rs. 2.1M", CreditCard], ["Reports", "18", Flag]];
  return <Panel title="Dashboard" description="Realtime overview of marketplace health."><div className="admin-stats">{stats.map(([label, value, Icon]) => <article key={label}><Icon size={24} /><strong>{value}</strong><span>{label}</span></article>)}</div><div className="admin-chart"><BarChart3 size={34} /><h3>Monthly platform activity</h3><div><i style={{height:"45%"}}/><i style={{height:"68%"}}/><i style={{height:"54%"}}/><i style={{height:"86%"}}/><i style={{height:"72%"}}/><i style={{height:"92%"}}/></div></div></Panel>;
}

const initialAdminForm = { firstName: "", lastName: "", email: "", password: "" };

function AdminsPanel({ currentUserId }) {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialAdminForm);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadAdmins = () => {
    setIsLoading(true);
    getAdmins()
      .then((result) => setAdmins(result.data.admins))
      .catch((requestError) => setError(requestError.message || "Failed to load admin accounts."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setIsCreating(true);

    try {
      await createAdmin(form);
      setForm(initialAdminForm);
      loadAdmins();
    } catch (requestError) {
      setError(requestError.message || "Failed to create admin account.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (adminId) => {
    setError("");
    setDeletingId(adminId);

    try {
      await deleteAdmin(adminId);
      setAdmins((current) => current.filter((item) => item._id !== adminId));
    } catch (requestError) {
      setError(requestError.message || "Failed to delete admin account.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Panel title="Manage Admins" description="Only admins can create or delete other admin accounts.">
      {error && <p className="admin-state admin-state--error"><AlertCircle size={17} /> {error}</p>}

      <form className="admin-create-form" onSubmit={handleCreate}>
        <input name="firstName" value={form.firstName} onChange={updateField} placeholder="First name" required />
        <input name="lastName" value={form.lastName} onChange={updateField} placeholder="Last name" required />
        <input name="email" type="email" value={form.email} onChange={updateField} placeholder="Email address" required />
        <input name="password" type="password" value={form.password} onChange={updateField} placeholder="Password" required />
        <button type="submit" disabled={isCreating}>{isCreating ? <Loader2 size={16} className="admin-spin" /> : <Plus size={16} />} Add Admin</button>
      </form>

      {isLoading ? (
        <p className="admin-state"><Loader2 size={17} className="admin-spin" /> Loading admin accounts...</p>
      ) : (
        <DataTable columns={["Name", "Email", "Role", "Actions"]}>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.firstName} {admin.lastName}</td>
              <td>{admin.email}</td>
              <td>{admin.roles.join(", ")}</td>
              <td>
                <button
                  onClick={() => handleDelete(admin._id)}
                  disabled={admin._id === currentUserId || deletingId === admin._id}
                  title={admin._id === currentUserId ? "You cannot delete your own account" : "Delete admin"}
                >
                  <Trash2 size={15} /> {deletingId === admin._id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </Panel>
  );
}

function PropertiesPanel({ properties, isLoading, error }) {
  return (
    <Panel title="Properties" description="View and moderate all property listings.">
      {error && <p className="admin-state admin-state--error"><AlertCircle size={17} /> {error}</p>}
      {isLoading ? (
        <p className="admin-state"><Loader2 size={17} className="admin-spin" /> Loading properties...</p>
      ) : (
        <DataTable columns={["Image", "Title", "Type", "Price", "Approval", "Views"]}>
          {properties.map((item) => (
            <tr key={item._id}>
              <td><img src={item.coverImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80"} alt="" className="admin-thumb" /></td>
              <td>{item.title}</td>
              <td>{item.propertyType}</td>
              <td>Rs. {Number(item.price).toLocaleString()}</td>
              <td><Status status={item.approvalStatus} /></td>
              <td><Eye size={15} /> {item.viewsCount ?? 0}</td>
            </tr>
          ))}
          {properties.length === 0 && <tr><td colSpan={6}>No properties yet.</td></tr>}
        </DataTable>
      )}
    </Panel>
  );
}

function GenericAdminPanel({ tab }) {
  const title = tab.replace(/-/g, " ").replace(/^./, (char) => char.toUpperCase());
  return <Panel title={title} description="Management tools for this module."><div className="admin-module-grid"><article><Image size={24} /><h3>Create</h3><p>Add a new record.</p><button>Add New</button></article><article><Search size={24} /><h3>Search</h3><p>Find and filter records.</p><button>Search</button></article><article><Settings size={24} /><h3>Settings</h3><p>Configure module options.</p><button>Configure</button></article></div></Panel>;
}

function SearchBox({ query, setQuery }) {
  return <label className="admin-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" /></label>;
}

function DataTable({ columns, children }) {
  return <div className="admin-table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Status({ status }) {
  return <span className={`admin-status admin-status--${status.toLowerCase()}`}>{status}</span>;
}

function Panel({ title, description, children }) {
  return <section className="admin-panel"><div className="admin-panel__heading"><h2>{title}</h2><p>{description}</p></div>{children}</section>;
}

export default AdminPanelPage;
